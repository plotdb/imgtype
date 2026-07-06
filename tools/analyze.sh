#!/usr/bin/env bash
set -euo pipefail

# input file name, output color space based on sips, imagemagick, exiftool
# ( you may need to have these preinstalled )


file="${1:?Usage: $0 <image.jpg>}"

echo "== sips =="
sips -g space -g profile "$file"

echo
echo "== ImageMagick =="
identify -format 'Colorspace: %[colorspace]\n' "$file"

echo
echo "== ExifTool / JPEG structure =="
exiftool -s -G1 \
  -ColorComponents \
  -YCbCrSubSampling \
  -Adobe \
  -AdobeTransform \
  "$file"

echo
echo "== ExifTool / ICC profile =="
exiftool -s -G1 \
  -icc_profile:ProfileDescription \
  -icc_profile:ColorSpaceData \
  "$file"
