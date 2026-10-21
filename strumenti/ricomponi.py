"""Ricompone sull'originale solo le zone ritoccate dall'AI.

uso: ricomponi.py <originale> <ritocco-ai> <uscita> <x1,y1,x2,y2> [...]
Le coordinate sono in pixel dell'originale.
"""
import sys
import cv2
import numpy as np

orig_path, ai_path, out_path, *rects = sys.argv[1:]
orig = cv2.imread(orig_path)
h, w = orig.shape[:2]
ai = cv2.resize(cv2.imread(ai_path), (w, h), interpolation=cv2.INTER_AREA)

# Allinea il ritocco all'originale (l'AI può spostare o zoomare leggermente)
sift = cv2.SIFT_create(4000)
g1, g2 = (cv2.cvtColor(i, cv2.COLOR_BGR2GRAY) for i in (orig, ai))
k1, d1 = sift.detectAndCompute(g1, None)
k2, d2 = sift.detectAndCompute(g2, None)
matches = cv2.BFMatcher().knnMatch(d2, d1, k=2)
good = [m for m, n in matches if m.distance < 0.7 * n.distance]
src = np.float32([k2[m.queryIdx].pt for m in good])
dst = np.float32([k1[m.trainIdx].pt for m in good])
H, inl = cv2.findHomography(src, dst, cv2.RANSAC, 2.0)
ai = cv2.warpPerspective(ai, H, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
print(f"{out_path}: {len(good)} corrispondenze, {int(inl.sum())} inlier, H=\n{np.round(H, 3)}")

# Maschera delle sole zone da sistemare, con bordi sfumati
mask = np.zeros((h, w), np.float32)
for r in rects:
    x1, y1, x2, y2 = map(int, r.split(","))
    mask[y1:y2, x1:x2] = 1.0
mask = cv2.GaussianBlur(mask, (0, 0), 6)[..., None]

out = (ai * mask + orig * (1 - mask)).astype(np.uint8)
cv2.imwrite(out_path, out)
