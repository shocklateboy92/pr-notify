#!/bin/bash

set -e
set -x

LOCAL_PREFIX=$HOME
LIB_DIR=$LOCAL_PREFIX/lib/pr-notify

# Ensure directories exist
mkdir -p $LIB_DIR

# Install the JS bundle
cp dist/main.js $LIB_DIR/pr-notify.js

