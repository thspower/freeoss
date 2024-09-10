#!/bin/bash
# There are a set of images which are required for PWAs and PWA to App Store apps
# This script will, given image (transparency respected) and a color
# make 192x192px, 512x512px, 512x512 with background color

image=$1
color=${2:-'#ffffff'}

magick $image -resize 192x192 "192-${image}"
magick $image -resize 512x512 "512-${image}"
magick $image -resize 512x512 -background $color -flatten "appicon-${image}"
