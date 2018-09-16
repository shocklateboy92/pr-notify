#!/bin/bash

set -e
set -x

LOCAL_PREFIX=$HOME/.local

# Ensure directories exist
mkdir -p $LOCAL_PREFIX/{lib,var/pr-notify}

# Install the JS bundle
cp dist/main.js $LOCAL_PREFIX/lib/pr-notify.js

# Install the systemd units
cp systemd/* $HOME/.config/systemd/user

# Tell systemd to look for new units
systemctl --user daemon-reload