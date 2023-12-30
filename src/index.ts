import { createRequire } from 'node:module'
import chalk from 'chalk-template'
import { install, versionFromPackageJson } from './install.js'

const require = createRequire(import.meta.url)

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const {
  name,
  bugs: { url: issueUrl },
} = require('../package.json')

const HASURA_CLI_INSTALL =
  !process.env.HASURA_CLI_INSTALL || process.env.HASURA_CLI_INSTALL === 'true'

async function main(): Promise<void> {
  if (HASURA_CLI_INSTALL) {
    try {
      await install({
        verbose: true,
      })
    } catch (error) {
      console.log(chalk`
  {bold.bgRed.white hasura-cli}@{red ${versionFromPackageJson}}
  {red Error!} Failed to install {bold Hasura CLI binary}.
  Try {bold.bgWhite.black npm uninstall ${name}} or {bold.bgWhite.black yarn remove ${name}} and then reinstall it.
  If the issue occurs repeatedly, check if your network can access {bold https://github.com} as the the {bold Hasura CLI binary} file is hosted on Github.
  You can report the issue on {bold ${issueUrl}} with error message.
        `)
      throw error
    }
  } else {
    console.log(chalk`
  {bold.bgGreen.black hasura-cli}@{green ${versionFromPackageJson}}
  {blue process}.{magentaBright env}.{bold.cyan HASURA_CLI_INSTALL} is {bold ${`${HASURA_CLI_INSTALL}`}}, therefore {bold hasura-cli} doesn't do anything.
    `)
  }
}

// eslint-disable-next-line unicorn/prefer-top-level-await, @typescript-eslint/no-floating-promises
main()
