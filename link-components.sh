#!/usr/bin/env bash

# makes script stop if any line returns an error code
set -x

# makes script echo out what command it's running + output
set -e

# changes directory to the directory in which this shell script is saved / lives
cd "$(dirname "$0")"

# git clean -fX forces deletion only of gitignored files, to ensure all compilation is re-run from scratch
(cd ../components && git clean -fX angular dist loader hydrate && npm install && npm run build && npm link)

# Need to do npm update to make sure we don't have an outdated package-lock file refering to old version of components
(cd ../components/angular && npm update && npm run build && npm link)

npm link @biggive/components-angular
npm link @biggive/components
