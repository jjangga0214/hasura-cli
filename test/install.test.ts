/* eslint-disable jest/no-conditional-in-test */
import util from 'node:util'
import path from 'node:path'
import { createRequire } from 'node:module'
import fs from 'node:fs'
import { dirname } from 'dirname-filename-esm'
import { install } from '../src/install.js'

const require = createRequire(import.meta.url)
const exec = util.promisify(require('child_process').exec)

const { version } = require('../package.json')

describe('install', () => {
  it(
    'install, execute, and check version of cli',
    async () => {
      expect.hasAssertions()

      const askVersion = async (dest: string): Promise<string> => {
        try {
          const { stdout, stderr } = await exec(
            `${dest} version --skip-update-check`,
          )
          // Why stderr? REF: https://github.com/hasura/graphql-engine/issues/6998

          if (version === '2.0.0-alpha.11') {
            return stderr
          }
          return stdout
        } catch {
          const { stdout } = await exec(`${dest} version`)
          return stdout
        }
      }
      const destDir = path.resolve(dirname(import.meta), 'tmp')

      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir)
      }

      if (process.platform === 'win32') {
        fs.closeSync(fs.openSync(path.resolve(destDir, 'hasura'), 'w'))
      }
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
      } catch {
        // When tag and printed version are different
        // e.g. '1.0.0-beta.1' -> '1.0.0-beta.01'
        const adjustedVersion = `${version.slice(0, -1)}0${version.slice(-1)}`
        // eslint-disable-next-line jest/no-conditional-expect
        expect(stdout).toContain(adjustedVersion)
      }
      fs.unlinkSync(dest)
      try {
        fs.rmdirSync(destDir)
        // This error handling repects other parallel tests
      } catch (error) {
        console.error(error)
      }
    },
    180 * 1000,
  )
})
