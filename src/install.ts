import path from 'path'
import chalk from 'chalk'
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
  verbose?: boolean
}

export const defaultInstallOptions = {
  destDir: '.',
  fileName: 'hasura',
  dest(): string {
    return path.resolve(this.destDir, this.fileName)
  },
}

export async function install({
  version = versionFromPacakgeJson(),
  destDir = defaultInstallOptions.destDir,
  fileName = defaultInstallOptions.fileName,
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
{blue Installing} {bold Hasura CLI binary} {green ${tag}} from {bold ${url}}
`,
  )
  const dest = await download({
    url,
    destDir,
    fileName,
  })
  log(
    chalk`
{bold.bgGreen.black hasura-cli}@{green ${versionFromPacakgeJson()}} 
{green Success!} {bold Hasura CLI binary} {green ${tag}} is installed to {bold ${dest}}
`,
  )
  return dest
}
