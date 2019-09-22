import path from 'path'
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
    `hasura-cli@${versionFromPacakgeJson()}: Downloading Hasura CLI binary (version=${tag}) from "${url}"...`,
  )
  const dest = await download({
    url,
    destDir,
    fileName,
  })
  log(
    `hasura-cli@${versionFromPacakgeJson()}: Hasura CLI binary (version=${tag}) is downloaded to ${dest}`,
  )
  return dest
}
