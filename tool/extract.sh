#!/bin/bash
WORK_DIR=$(cd "$(dirname "$0")" && pwd)
VERSION_TEXT=$(sed -n -e  '/github.com\/hasura\/graphql-engine\/cli/p' "${WORK_DIR}"/go.mod | cut -d ' ' -f3)
VERSION="${VERSION_TEXT#v}"
CURRENT_VERSION=$(cat package.json | jq -r '.version')
if [ "$VERSION" = "$CURRENT_VERSION" ]; then
  echo "version not changed, so skip bumping version"
  exit 0
fi
npm version $VERSION --git-tag-version false
