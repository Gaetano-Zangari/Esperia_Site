#!/bin/bash
# Converte un originale di sorgenti/ in WebP alle larghezze standard (vedi PROGETTO.md §5).
# uso: strumenti/ottimizza.sh <sorgente> <cartella-dest> <nome-base>
src=$1; out=$2; base=$3; mkdir -p "$out"
w=$(magick identify -format %w "$src")
for size in 480 800 1200; do
  [ "$size" -gt "$w" ] && size=$w
  magick "$src" -resize "${size}x>" -strip -quality 72 -define webp:method=6 "$out/${base}-${size}.webp"
  [ "$size" -eq "$w" ] && break
done
exit 0
