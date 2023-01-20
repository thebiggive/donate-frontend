#!/usr/bin/env bash

# Bash strict mode // http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail
IFS=$'\n\t'
cd "$(dirname "$0")"/..

set -x

# Generate a version number such as v202301201056.0.0
# Publishing will fail and have to be manually retried if this script is used twice in the same minute.
VERSION_NUMBER=`date +%Y%m%d%H%M.0.0`

echo $VERSION_NUMBER

npm version --no-git-tag-version $VERSION_NUMBER
cd angular/projects/components
npm version --no-git-tag-version $VERSION_NUMBER
