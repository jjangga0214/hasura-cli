# hasura-cli

Npm package wrapping **Hasura CLI**.

[![license](https://img.shields.io/badge/license-MIT-ff4081.svg?style=flat-square&labelColor=black)](./LICENSE)
[![test](https://img.shields.io/badge/test-jest-7c4dff.svg?style=flat-square&labelColor=black)](./jest.config.js)
[![code style:airbnb](https://img.shields.io/badge/code_style-airbnb-448aff.svg?style=flat-square&labelColor=black)](https://github.com/airbnb/javascript)
[![code style:prettier](https://img.shields.io/badge/code_style-prettier-18ffff.svg?style=flat-square&labelColor=black)](https://prettier.io/)
[![.nvmrc](https://img.shields.io/badge/.nvmrc-10-00e676.svg?style=flat-square&labelColor=black)](./.nvmrc)
[![yarn:required](https://img.shields.io/badge/yarn-required-aeea00.svg?style=flat-square&labelColor=black)](https://yarnpkg.com/en/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-ffab00.svg?style=flat-square&labelColor=black)](https://conventionalcommits.org)
[![Commitizen friendly](https://img.shields.io/badge/Commitizen-cz_conventional_changelog-dd2c00.svg?style=flat-square&labelColor=black)](http://commitizen.github.io/cz-cli/)
![pr welcome](https://img.shields.io/badge/PRs-welcome-09FF33.svg?style=flat-square&labelColor=black)

## Why?

The [**Original Hasura CLI**](https://github.com/hasura/graphql-engine/tree/master/cli), which is not this package, is a compiled binary originally written in go. But just installing it on your system would cause some problems.

1. Difficult to use different hasura versions on multiple projects.
2. Inconvenient to ensure every colleagues having same version installed.
3. Manual installation.

**hasura-cli** solves them. It automatically downloads the CLI and exposes the command `hasura`. Downloaded CLI would be isolated, making it only dedicated to the "project" that installed it. Of course, you can install it as global package as well.

## Installation

You can just simply download it through npm or yarn. Note that this package follows version of the [**Original Hasura CLI**](https://github.com/hasura/graphql-engine/tree/master/cli). If you want to check its releases, go [here](https://github.com/hasura/graphql-engine/releases).

```bash
# latest version
npm install --save-dev hasura-cli

# or specific version
npm install --save-dev hasura-cli@1.0.0-beta.6
```

```bash
# latest version
yarn add -D hasura-cli

# or specific version
yarn add -D hasura-cli@1.0.0-beta.6
```

```bash
# global installation
npm install -g hasura-cli
# or
yarn global add hasura-cli
```

Then you will be able to run hasura command.

For example,

```bash
# print hasura version
npx hasura version
```

Or configure npm scripts on package.json in the way you want.

```json
{
  "scripts": {
    "hasura:_": "hasura --project hasura --endpoint $HASURA_ENDPOINT",
    "hasura:console": "npm hasura:_ console",
    "hasura:pull": "npm hasura:_ migrate create --from-server",
    "hasura:push": "npm hasura:_ migrate apply"
  }
}
```

## Tests

This package is tested on Ubuntu LTS (latest), macOS (latest), and Windows (latest and 2016) with node version 8, 9, 10, 11, 12. So there're total `4(os) * 5(node) = 20` tests. Each of latest OS are ubuntu-18.04, macOS-10.14, and windows-2019 as of writing, but will be automatically updated to new ones if available. Generally, it would work on 64 bits architecture of any Linux, macOS, and Windows.

## Development (Contribution)

### Note

Please read [NOTE.md](./docs/NOTE.md), before getting started.

### `HASURA_CLI_NOT_INSTALL`

`src/index.ts` checks `process.env.HASURA_CLI_NOT_INSTALL`. If it's `"true"` (string), then `src/index.ts` would not install the cli. Otherwise (when `HASURA_CLI_NOT_INSTALL` is not set, or its value is not `"true"`), it automatically downloads Hasura CLI. So you can set the environment variable to prevent unwanted download on development environment.

### Getting started

Install dependencies. Lifecycle script `postinstall` is only for clients, installing Hasura CLI. So, ignore it with `--ignore-scripts` option. It should also be used on CI.

```bash
yarn install --ignore-scripts
```

On development, run

```bash
yarn dev # watches source code and restarts a process when file changes.
```

To manually test compiled js, run

```bash
yarn build # compiles ts to js
yarn start # runs dist/index.js
```

### Other scripts

```bash
yarn test # runs all tests (against "*.test.ts")
yarn test:coverage # runs all tests and measures coverage
yarn lint # lint
yarn format # format(fix)
```

## License

[MIT License](license). Copyright &copy; 2019, @jjangga0214 <[bnbcmindnpass@gmail.com](mailto:bnbcmindnpass@gmail.com)>
