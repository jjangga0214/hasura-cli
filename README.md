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

**Hasura CLI**(not this package) is a compiled binary originally written in go. But just installing it on your system would cause some problems.

1. Difficult to fix hasura version differently on multiple projects.
2. Inconvenient to ensure every colleagues having same version installed.
3. Manual installation.

**hasura-cli** solves them. It automatically downloads the CLI and exposes the command `hasura`. Downloaded CLI would be isolated, making it only dedicated to the "project" that installed it.

## Installation

This package follows version of the original **Hasura CLI**, written in go. You can just simply download it through npm or yarn.

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
    "hasura:console": "dotenv -e .env.dev -- npm hasura:_ console",
    "hasura:pull": "dotenv -e .env.dev -- npm hasura:_ migrate create --from-server",
    "hasura:push:prod": "dotenv -e .env.prod -- npm hasura:migrate:_ apply"
  }
}
```

## Development (Contribution)

### Note

Please read [NOTE.md](./docs/NOTE.md), before getting started.

### Getting started

Install dependencies.

```bash
yarn install
```

On development, run

```bash
yarn dev # watches source code and restarts a process when file changes.
```

On productions, run

```bash
yarn build # compiles ts to js
yarn start # runs compiled js
```

### Yarn scripts

```bash
yarn test # runs all tests (against "*.test.ts")
yarn test:coverage # runs all tests and measures coverage
yarn lint # lint
yarn format # format(fix)
```

## License

[MIT License](license). Copyright &copy; 2019, @jjangga0214 <[bnbcmindnpass@gmail.com](mailto:bnbcmindnpass@gmail.com)>
