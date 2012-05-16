#!/bin/bash
#
# Re-size / re-quality all jpgs in the current directory.
#
# USAGE: mogrify_all_jpg.sh <geometry> <quality> 
# where geo is a string like '1024x768' and quality is a number between 0 and 100 (e.g., 75)

GEO=$1
QUALITY=$2

find . -maxdepth 0 -name "*.jpg" | xargs -0 mogrify -resize $GEO -quality $QUALITY


