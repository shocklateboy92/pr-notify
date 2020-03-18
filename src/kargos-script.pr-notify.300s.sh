#!/bin/bash

echo "$(node --unhandled-rejections=strict "/usr/local/lib/js/pr-notify.js" 2>/dev/null) " \
     "| imageURL=/usr/local/share/icons/git-pull-request-icon.svg"
