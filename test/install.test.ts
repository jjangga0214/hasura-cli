import util from 'util'
import path from 'path'
import fs from 'fs'
import { install } from '#/install'

const exec = util.promisify(require('child_process').exec)

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../package.json')

describe('install', () => {
  it('install, execute, and check version of cli', async () => {
    expect.hasAssertions()

    const askVersion = async (dest: string): Promise<string> => {
      try {
        const { stdout } = await exec(`${dest} version --skip-update-check`)
        return stdout
      } catch (err) {
        const { stdout } = await exec(`${dest} version`)
        return stdout
      }
    }
    const destDir = path.resolve(__dirname, 'tmp')
    const dest = await install({
      destDir,
      fileName: `${Date.now()}-${version}`,
      verbose: true,
    })

    const stdout = await askVersion(dest)
    console.log(stdout)

    try {
      // When tag and printed version are same
      expect(stdout).toContain(version)
    } catch (err) {
      // When tag and printed version are different
      // e.g. '1.0.0-beta.1' -> '1.0.0-beta.01'
      const adjustedVersion = `${version.slice(0, -1)}0${version.slice(-1)}`
      // eslint-disable-next-line jest/no-try-expect
      expect(stdout).toContain(adjustedVersion)
    }
    fs.unlinkSync(dest)
    try {
      fs.rmdirSync(destDir)
      // This error handling repects other parallel tests
    } catch (err) {
      console.error(err)
    }
  }, 45000)
})
