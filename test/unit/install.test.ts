import util from 'util'
import path from 'path'
import fs from 'fs'
import { install } from '#/install'

const exec = util.promisify(require('child_process').exec)

describe('install', () => {
  it('install, exec, and check versions of every cli', async () => {
    expect.hasAssertions()

    const betas = [...Array(6).keys()]
      .map(i => i + 1)
      .map(i => `1.0.0-beta.${i}`)
    const alphas = [...Array(45).keys()]
      .map(i => i + 1)
      .map(i => `1.0.0-alpha${i < 10 ? `0${i}` : i}`)
    for (const version of [
      // '1.0.0-beta.6',
      // '1.0.0-beta.1',
      // '1.0.0-alpha45',
      // '1.0.0-alpha29',
      // '1.0.0-alpha01',
      ...betas,
      ...alphas,
    ]) {
      const dest = await install({
        version,
        destDir: path.resolve(__dirname, 'tmp'),
        fileName: `${Date.now()}-${version}`,
        verbose: true,
      })
      const { stdout } = await exec(`${dest} version`)
      console.log(stdout)

      try {
        // When tag and printed version is same
        expect(stdout).toContain(version)
      } catch (err) {
        // When tag and printed version is different
        // e.g. '1.0.0-beta.1' -> '1.0.0-beta.01'
        const adjustedVersion = version.slice(0, -1) + 0 + version.slice(-1)
        // eslint-disable-next-line jest/no-try-expect
        expect(stdout).toContain(adjustedVersion)
      }
      await fs.unlinkSync(dest)
    }
  }, 24000000)
})
