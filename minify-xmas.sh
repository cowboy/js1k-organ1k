#!/bin/bash

SRC_SCRIPT=organ1k-xmas.js
MIN_SCRIPT=$(echo "$SRC_SCRIPT" | perl -pe 's/\.js$/.min.js/')

echo "Creating $MIN_SCRIPT from $SRC_SCRIPT..."

# yui.sh just runs: java -jar yuicompressor-2.4.2.jar $*
yui.sh -v "$SRC_SCRIPT" > "$MIN_SCRIPT"

# Fix these YUI compressor "issues"
#  * change 1000 -> 1e3
#  * change 0.5 -> .5 (etc)
#  * change {} -> ; (while loop)
perl -p -0777 -i -e '

s#(?<![\d\w])1000(?!=[\d\w])#1e3#g;
s#(?<![\d\w])0\.(?=\d)#.#g;
s#\{\}#;#g;
s#;$##sm;

' "$MIN_SCRIPT"

echo -e "\nMinified size $(stat -c %s "$MIN_SCRIPT") bytes. Source:\n"

cat "$MIN_SCRIPT"

echo ""
