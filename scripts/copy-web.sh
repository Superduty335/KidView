#!/bin/sh
# Copies the KidView web app into www/ (the folder Capacitor packages).
# Usage: scripts/copy-web.sh [path-to-kidview-web-folder]
set -e
SRC="${1:-../kidview}"
rm -rf www && mkdir www
cp -r "$SRC"/index.html "$SRC"/app.css "$SRC"/js "$SRC"/icons "$SRC"/manifest.webmanifest "$SRC"/sw.js www/
echo "Copied $SRC into www/. Run: npx cap sync"
