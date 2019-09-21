import axios from 'axios'
import fs from 'fs'

export async function download(url: string, path: string): Promise<void> {
  const writer = fs.createWriteStream(path)

  const res = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
    headers: {
      Accept: 'application/octet-stream',
      'User-Agent': 'hasura-cli',
    },
  })

  res.data.pipe(writer)

  return new Promise((resolve, reject): void => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

export async function getUrl(
  tag: string,
  platform: string = process.platform,
): Promise<string> {
  const res = await axios.get<Release>(
    `https://api.github.com/repos/hasura/graphql-engine/releases/tags/${tag}`,
  )
  const { assets } = res.data
  const asset = assets.find(e => e.name.includes(platform))
  return asset.url
}

interface Release {
  tag_name: string
  assets: Asset[]
}

interface Asset {
  name: string
  url: string
}
