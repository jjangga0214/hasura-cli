import axios from 'axios'
import fs from 'fs'

export async function download(url: string, dest: string): Promise<void> {
  const writer = fs.createWriteStream(dest)

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
  tag: string, // e.g. "v1.0.0-beta.6" or "v1.0.0-alpha29"
  platform: string = process.platform,
): Promise<string> {
  const res = await axios.get<Release>(
    `https://api.github.com/repos/hasura/graphql-engine/releases/tags/${tag}`,
  )
  const { assets } = res.data
  const asset = assets.find(a =>
    a.name.includes(platform === 'win32' ? 'windows' : platform),
  )
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
