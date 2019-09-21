import util from 'util'
/* eslint-disable import/no-unresolved */
import { download, getUrl } from '#/asset'

const exec = util.promisify(require('child_process').exec)

describe('asset', () => {
  const urlById = (id: number): string =>
    `https://api.github.com/repos/hasura/graphql-engine/releases/assets/${id}`

  it('getUrl by platforms', async () => {
    expect.hasAssertions()
    const tag = 'v1.0.0-beta.6'

    expect(await getUrl(tag, 'linux')).toStrictEqual(urlById(14633753))
    expect(await getUrl(tag, 'darwin')).toStrictEqual(urlById(14633754))
    expect(await getUrl(tag, 'windows')).toStrictEqual(urlById(14633756))
  })

  it('getUrl by tags', async () => {
    expect.hasAssertions()

    expect(await getUrl('v1.0.0-beta.6', 'linux')).toStrictEqual(
      urlById(14633753),
    )
    expect(await getUrl('v1.0.0-beta.1', 'darwin')).toStrictEqual(
      urlById(12667542),
    )
    expect(await getUrl('v1.0.0-alpha45', 'windows')).toStrictEqual(
      urlById(12407497),
    )
    expect(await getUrl('v1.0.0-alpha29', 'linux')).toStrictEqual(
      urlById(9724596),
    )
  })

  it('download', async () => {
    expect.hasAssertions()
    const url =
      'https://github.com/hasura/graphql-engine/releases/download/v1.0.0-beta.6/cli-hasura-linux-amd64'
    const dest = './dist/hasura'
    await download(url, dest)
    const { stdout } = await exec(`${dest} version --skip-update-check`)
    expect(stdout).toContain('v1.0.0-beta.6')
  }, 240000)
})
