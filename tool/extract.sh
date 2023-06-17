#!/bin/bash
WORK_DIR=$(cd "$(dirname "$0")" && pwd)
VERSION=$(sed -n -e  '/github.com\/hasura\/graphql-engine\/cli/p' "${WORK_DIR}"/go.mod | cut -d ' ' -f3)

npm version ${VERSION#v} --git-tag-version false
