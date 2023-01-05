#!/usr/bin/env bash
set -x
set -e
cd "$(dirname "$0")"

(cd ../components && git clean -fX angular dist loader hydrate && npm install && npm run build && npm link)
(cd ../components/angular && npm install && npm run build && npm link)

npm link @biggive/components-angular @biggive/components
