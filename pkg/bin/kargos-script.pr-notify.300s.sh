#!/bin/bash

# Not sure if this is the best idea, but I want the prefix
source ~/.zshrc.local

echo "$(node --unhandled-rejections=strict "$LOCAL_PREFIX/lib/pr-notify/pr-notify.js" 2>/dev/null) | imageURL=${LOCAL_PREFIX}/lib/resources/git-pull-request-icon.svg"
