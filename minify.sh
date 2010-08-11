#!/bin/bash

SRC_SCRIPT=organ1k.js
MIN_SCRIPT=$(echo "$SRC_SCRIPT" | perl -pe 's/\.js$/.min.js/')

echo "Creating $MIN_SCRIPT from $SRC_SCRIPT..."

# yui.sh just runs: java -jar yuicompressor-2.4.2.jar $*
yui.sh -v "$SRC_SCRIPT" > "$MIN_SCRIPT"

# Fix these YUI compressor "issues"
#  * strip surrounding closure and space-consuming var declarations
#  * change 0.5 -> .5 (etc)
#  * change {} -> ; (while loop)
perl -p -0777 -i -e '

s#^.*/\*<<STRIP\*/\s*,(.*)/\*STRIP>>\*/.*$#$1#sm;
s#(?<!\d|\w)0\.(?=\d)#.#g;
s#\{\}#;#g;

' "$MIN_SCRIPT"

echo -e "\nMinified size $(stat -c %s "$MIN_SCRIPT") bytes. Source:\n"

cat "$MIN_SCRIPT"

echo ""
