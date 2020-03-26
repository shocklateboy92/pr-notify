#!/bin/bash

node --unhandled-rejections=strict \
     /usr/local/lib/js/pr-notify.js \
          --self=$0 \
          "$@"
