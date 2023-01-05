#!/usr/bin/env bash
set -x
set -e
cd "$(dirname "$0")"

# git clean -fX forces deletion only of gitignored files, to ensure all compilation is re-run from scratch

(cd ../components && git clean -fX angular dist loader hydrate && npm install && npm run build && npm link)
(cd ../components/angular && npm install && npm run build && npm link)

npm link @biggive/components-angular @biggive/components
