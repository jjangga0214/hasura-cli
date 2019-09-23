import path from 'path'
import chalk from 'chalk'
import fs from 'fs'
import { getUrl, download } from './asset'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../package.json')

export function versionFromPacakgeJson(): string {
  return version
}

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

export const defaultInstallOptions = {
  destDir: process.env.HASURA_CLI_DEST_DIR || '.',
  fileName: process.env.HASURA_CLI_DEST_FILENAME || 'hasura',
  dest(): string {
    return path.resolve(this.destDir, this.fileName)
  },
}

export async function install({
  version = versionFromPacakgeJson(),
  destDir = defaultInstallOptions.destDir,
  fileName = defaultInstallOptions.fileName,
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
{bold.bgGreen.black hasura-cli}@{green ${versionFromPacakgeJson()}}
{blue Downloading} {bold Hasura CLI binary} {green ${tag}} from {bold ${url}}
`,
  )
  const dest = await download({
    url,
    destDir,
    fileName,
  })

  const adjustedDest =
    platform === 'win32' && !fileName.endsWith('.exe') ? `${dest}.exe` : dest
  if (dest !== adjustedDest) {
    fs.renameSync(dest, adjustedDest)
  }

  log(
    chalk`
{bold.bgGreen.black hasura-cli}@{green ${versionFromPacakgeJson()}} 
{green Installed!} {bold Hasura CLI binary} {green ${tag}} is installed to {bold ${adjustedDest}}
`,
  )
  return adjustedDest
}
