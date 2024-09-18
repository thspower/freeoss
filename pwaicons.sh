#!/bin/bash
# There are a set of images which are required for PWAs and PWA to App Store apps
# This script will, given image (transparency respected) and a color
# make 192x192px, 512x512px, 512x512 with background color
#
# Usage: pwaicons.sh image.png "#123456"

image=$1
color=${2:-'#000000'}

width=$(identify -format "%w" $image)
height=$(identify -format "%h" $image)

if [ $width -eq $height ]; then
magick $image -resize 192x192 "192-${image}"
magick $image -resize 512x512 "512-${image}"
magick $image -resize 512x512 -background $color -flatten "appicon-${image}"
else
magick $image -thumbnail '192x192>' -background transparent -gravity center -extent 192x192 "192-${image}"
magick $image -thumbnail '512x512>' -background transparent -gravity center -extent 512x512 "512-${image}"
magick $image -thumbnail '512x512>' -background $color -gravity center -extent 512x512 "appicon-${image}"
fi
