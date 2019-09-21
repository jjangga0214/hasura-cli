/* eslint-disable import/no-unresolved */
import { getUrl } from '#/asset'

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
})
