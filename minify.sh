#!/bin/bash

SRC_SCRIPT=organ1k.js
MIN_SCRIPT=$(echo "$SRC_SCRIPT" | perl -pe 's/\.js$/.min.js/')

echo "Creating $MIN_SCRIPT from $SRC_SCRIPT..."

# yui.sh just runs: java -jar yuicompressor-2.4.2.jar $*
yui.sh -v "$SRC_SCRIPT" > "$MIN_SCRIPT"

echo -e "\nMinification done: $(stat -c %s "$MIN_SCRIPT") bytes"
