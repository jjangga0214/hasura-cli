import { getUrl, download } from './asset'

export function versionFromPacakgeJson(): string {
  return `1.0.0-beta.6`
}

export function tagFromVersion(version: string): string {
  return `v${version}`
}

interface InstallOptions {
  version?: string
  destDir?: string
  fileName?: string
}

export async function install({
  version = versionFromPacakgeJson(),
  destDir = '.',
  fileName = 'hasura',
}: InstallOptions = {}): Promise<string> {
  const tag = tagFromVersion(version)
  const url = await getUrl(tag)
  return download({
    url,
    destDir,
    fileName,
  })
}
