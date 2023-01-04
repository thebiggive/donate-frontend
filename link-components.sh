#!/usr/bin/env bash
set -x
set -e
cd "$(dirname "$0")"

(cd ../components && npm install &&  npm link)
(cd ../components/angular && npm install && npm link)

npm link @biggive/components-angular @biggive/components
