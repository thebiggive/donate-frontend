#!/usr/bin/env bash

# Bash strict mode // http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail
IFS=$'\n\t'
cd "$(dirname "$0")"/..

set -x

# Generate a version number such as v202301201056.0.0
# Publishing will fail and have to be manually retried if this script is used twice in the same minute.
# Making the major part of the version number change every minute means we technically comply with semver, but we never formally guarantee the absence of BC breaks.
VERSION_NUMBER=`date +%Y%m%d%H%M.0.0`

echo $VERSION_NUMBER

npm version --no-git-tag-version $VERSION_NUMBER
cd angular/projects/components
npm version --no-git-tag-version $VERSION_NUMBER

echo "New version number is $VERSION_NUMBER. Packages will be published to:"
echo
echo "https://www.npmjs.com/package/@biggive/components-angular/v/$VERSION_NUMBER"
echo "https://www.npmjs.com/package/@biggive/components/v/$VERSION_NUMBER"
