import path from 'path'
import { getUrl, download } from './asset'

// eslint-disable-next-line import/newline-after-import
;(async (): Promise<void> => {
  const TAG = 'v1.0.0-beta.6'
  try {
    const url = await getUrl(TAG)
    await download(url, path.resolve(__dirname, '.', 'hasura'))
  } catch (err) {
    console.error(err)
  }
})()
