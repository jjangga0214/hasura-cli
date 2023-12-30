/* eslint-disable jest/no-conditional-in-test */
import path from 'node:path'
import { createRequire } from 'node:module'
import fs from 'node:fs'
import { dirname } from 'dirname-filename-esm'
import { $ as $$ } from 'execa'
import { install } from '../src/install.js'

const require = createRequire(import.meta.url)
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { version }: { version: string } = require('../package.json')

const root = path.join(dirname(import.meta), '..')
const $ = $$({ cwd: root, stdio: 'pipe' })

describe('install', () => {
  it(
    'installs, executes, and checks the version of the cli',
    async () => {
      expect.hasAssertions()
      const destDir = path.join(dirname(import.meta), 'tmp')

      const askVersion = async (dest: string): Promise<string> => {
        try {
          const { stdout, stderr } =
            await $`${dest} version --skip-update-check`

          // Why stderr? REF: https://github.com/hasura/graphql-engine/issues/6998
          if (version === '2.0.0-alpha.11') {
            return stderr
          }
          return stdout
        } catch {
          const { stdout } = await $`${dest} version`
          return stdout
        }
      }
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
