#!/bin/bash

# Not sure if this is the best idea, but I want the prefix
source ~/.zshrc.local

node --unhandled-rejections=strict "$LOCAL_PREFIX/lib/pr-notify/pr-notify.js" 
#2>/dev/null
