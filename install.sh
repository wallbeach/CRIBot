#!/bin/sh

# Get the base directory and switch into it
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')");
cd "$basedir";

# Install package dependencies
echo "[SETUP] Installing package dependencies ...";
npm install;

# Compile source code
echo "[SETUP] Compiling source code ...";
./node_modules/.bin/tsc;

echo "[SETUP] Done!";