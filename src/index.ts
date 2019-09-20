import axios from 'axios'
import path from 'path'
import fs from 'fs'

async function downloadAsset(url: string, path: string): Promise<void> {
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

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

async function getAssetUrl(
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

;(async (): Promise<void> => {
  const TAG = 'v1.0.0-beta.6'
  try {
    const url = await getAssetUrl(TAG)
    await downloadAsset(url, path.resolve(__dirname, '.', 'hasura'))
  } catch (err) {
    console.error(err)
  }
})()

interface Release {
  tag_name: string
  assets: Asset[]
}

interface Asset {
  name: string
  url: string
}
