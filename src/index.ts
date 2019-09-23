import chalk from 'chalk'
import { install, versionFromPacakgeJson } from './install'

const {
  name,
  bugs: { url: issueUrl },
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('../package.json')

const HASURA_CLI_INSTALL =
  process.env.HASURA_CLI_INSTALL === undefined
    ? true
    : process.env.HASURA_CLI_INSTALL === 'true'

if (HASURA_CLI_INSTALL) {
  ;(async (): Promise<void> => {
    try {
      await install({
        verbose: true,
      })
    } catch (err) {
      console.log(chalk`
{bold.bgRed.white hasura-cli}@{red ${versionFromPacakgeJson()}}
{red Error!} Failed to install {bold Hasura CLI binary}.
Try {bold.bgWhite.black npm uninstall ${name}} or {bold.bgWhite.black yarn remove ${name}} and then reinstall it.
If the issue occurs repeatedly, check if your network can access {bold https://github.com} as the the {bold Hasura CLI binary} file is hosted on Github.
You can report the issue on {bold ${issueUrl}} with error message.
      `)
      throw err
    }
  })()
} else {
  console.log(chalk`
{bold.bgGreen.black hasura-cli}@{green ${versionFromPacakgeJson()}}
{blue process}.{magentaBright env}.{bold.cyan HASURA_CLI_INSTALL} is {bold ${`${HASURA_CLI_INSTALL}`}}, therefore {bold hasura-cli} doesn't do anything. 
  `)
}
