#!/usr/bin/env bash
set -x
set -e
cd "$(dirname "$0")"

# git clean -fX forces deletion only of gitignored files, to ensure all compilation is re-run from scratch

(cd ../components && git clean -fX angular dist loader hydrate && npm install && npm run build && npm link)

# Need to do npm update to make sure we don't have an outdated package-lock file refering to old version of components
(cd ../components/angular && npm update && npm run build && npm link)

npm link @biggive/components-angular @biggive/components
