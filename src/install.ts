import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import chalk from 'chalk-template'
import { getUrl, download } from './asset.js'

const require = createRequire(import.meta.url)

export const { version: versionFromPackageJson } = require('../package.json')

export function tagFromVersion(version: string): string {
  return `v${version}`
}

interface InstallOptions {
  version?: string
  destDir?: string
  fileName?: string
  platform?: string
  verbose?: boolean
}

export async function install({
  version = versionFromPackageJson,
  destDir = process.env.HASURA_CLI_DEST_DIR || '.', // default to project root,
  fileName = process.env.HASURA_CLI_DEST_FILENAME || 'hasura',
  platform = process.platform,
  verbose = false,
}: InstallOptions = {}): Promise<string> {
  const tag = tagFromVersion(version)
  const url = await getUrl(tag)
  const log = (msg: string): void => {
    if (verbose) {
      console.log(msg)
    }
  }

  log(
    chalk`
{bold.bgGreen.black hasura-cli}@{green ${versionFromPackageJson}}
{blue Downloading} {bold Hasura CLI binary} {green ${tag}} from {bold ${url}}
`,
  )
  const adjustedFileName =
    platform === 'win32' && !fileName.endsWith('.exe')
      ? `${fileName}.exe`
      : fileName

  const dest = await download({
    url,
    destDir,
    fileName: adjustedFileName,
  })
  if (platform === 'win32') {
    fs.unlinkSync(path.resolve(destDir, 'hasura'))
  }
  log(
    chalk`
{bold.bgGreen.black hasura-cli}@{green ${versionFromPackageJson}}
{green Installed!} {bold Hasura CLI binary} {green ${tag}} is installed to {bold ${dest}}
`,
  )
  return dest
}
