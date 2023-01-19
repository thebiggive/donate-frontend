#!/usr/bin/env bash

# Bash strict mode // http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail
IFS=$'\n\t'
cd "$(dirname "$0")"/..

set -x

VERSION_NUMBER=`date +%Y.%m.%d.%H.%M.%S`

echo $VERSION_NUMBER

npm version $VERSION_NUMBER
cd angular
npm version $VERSION_NUMBER

git diff
