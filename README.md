# ![hasura-cli](./docs/assets/hasura-cli.svg)

An npm package that automatically installs and wraps **Hasura CLI** binary in isolated manner

[![npm version](https://img.shields.io/npm/v/hasura-cli?style=flat-square&labelColor=black&label=version)](https://www.npmjs.com/package/hasura-cli)
[![npm beta version](https://img.shields.io/npm/v/hasura-cli/beta?style=flat-square&labelColor=black&color=ffd900&label=beta)](https://www.npmjs.com/package/hasura-cli)
[![npm alpha version](https://img.shields.io/npm/v/hasura-cli/alpha?style=flat-square&labelColor=black&color=fedcba&&label=alpha)](https://www.npmjs.com/package/hasura-cli)
[![npm download](https://img.shields.io/npm/dm/hasura-cli?style=flat-square&labelColor=black&label=npm%20download)](https://www.npmjs.com/package/hasura-cli)

[![license](https://img.shields.io/badge/license-MIT-ff4081.svg?style=flat-square&labelColor=black)](./LICENSE)
[![test](https://img.shields.io/badge/test-jest-7c4dff.svg?style=flat-square&labelColor=black)](./jest.config.js)
[![code style:airbnb](https://img.shields.io/badge/code_style-airbnb-448aff.svg?style=flat-square&labelColor=black)](https://github.com/airbnb/javascript)
[![code style:prettier](https://img.shields.io/badge/code_style-prettier-18ffff.svg?style=flat-square&labelColor=black)](https://prettier.io/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-ffab00.svg?style=flat-square&labelColor=black)](https://conventionalcommits.org)
[![Commitizen friendly](https://img.shields.io/badge/Commitizen-cz_conventional_changelog-dd2c00.svg?style=flat-square&labelColor=black)](http://commitizen.github.io/cz-cli/)
![pr welcome](https://img.shields.io/badge/PRs-welcome-09FF33.svg?style=flat-square&labelColor=black)

## Why?

The [**Original Hasura CLI**](https://github.com/hasura/graphql-engine/tree/master/cli), which is not this package, is a compiled binary originally written in go. But just installing it on your system could cause some problems.

1. Difficult to use different hasura versions on multiple projects.
2. Inconvenient to ensure every colleagues having same version installed.
3. Manual installation not specified as npm devDependency.

**hasura-cli** solves them. It automatically downloads the CLI and exposes the command `hasura`. Downloaded CLI would be isolated, making it only dedicated to the "project" that installed it. Of course, you can install it as global package as well.

## Installation

You can just simply install hasura-cli through npm or yarn. Note that this package follows version of the [**Original Hasura CLI**](https://github.com/hasura/graphql-engine/tree/master/cli). If you want to check its releases, go [here](https://github.com/hasura/graphql-engine/releases).

Currently there are 3 npm tags (npm tags are different from versions), `latest`, `beta` and `alpha`. `latest` tag refers to Hasura's latest stable version(e.g. [![npm version](https://img.shields.io/npm/v/hasura-cli?style=flat-square&labelColor=black&label=version)](https://www.npmjs.com/package/hasura-cli)), while `beta` and `alpha`, respectively beta version(e.g. [![npm beta version](https://img.shields.io/npm/v/hasura-cli/beta?style=flat-square&labelColor=black&color=ffd900&label=beta)](https://www.npmjs.com/package/hasura-cli)) and alpha version(e.g. [![npm alpha version](https://img.shields.io/npm/v/hasura-cli/alpha?style=flat-square&labelColor=black&color=fedcba&&label=alpha)](https://www.npmjs.com/package/hasura-cli)).

Of course, you can install it globally,

```bash
npm install --global hasura-cli[@tag|@version]
```

or in a project.

```bash
# latest version from latest tag (Same as hasura-cli@latest)
npm install --save-dev hasura-cli

# specific version
npm install --save-dev hasura-cli@1.0.0

# latest version from beta tag
npm install --save-dev hasura-cli@beta

# latest version from alpha tag
npm install --save-dev hasura-cli@alpha
```

Then you will be able to run hasura command.

For example,

```bash
# print hasura version
npx hasura version
```

Or configure npm scripts on package.json in the way you want.
(tip. provide env vars like `$HASURA_GRAPHQL_ENDPOINT` or `$HASURA_GRAPHQL_ADMIN_SECRET`)

```json
{
  "scripts": {
    "hasura": "hasura --project hasura --skip-update-check",
    "hasura:console": "npm run hasura console",
    "hasura:apply": "npm run hasura migrate apply"
  }
}
```

## Support

Generally, it works on 64 bits architecture of any Linux, macOS, and Windows with node@>=8.

## Development (Contribution)

### Quick PR for new version

It's simple. Just update the `version` in [package.json](./package.json), then make a Pull Request. That's it!

```jsonc
{
  "name": "hasura-cli",
  "version": "1.3.0", // Patch this to "1.3.1-beta.1", for example.
  "license": "MIT"
  // ...
}
```

### Note

Please read [NOTE.md](./docs/NOTE.md), before getting started.

### Environment variables

Environment variables are intended to be only used on development environment.

First, create `.env` file, and configure it as you want.

```bash
cp .env.example .env
```

You can simply populate the variables by executing `yarn dev` or `yarn dev:no-respawn`. Otherwise, you have to manually feed them (e.g. `dotenv -- <your command>`). That's because this project doesn't use [`dotenv`](https://github.com/motdotla/dotenv), but [`dotenv-cli`](https://github.com/entropitor/dotenv-cli). So, the application does not read `.env` by itself.

#### `HASURA_CLI_INSTALL` (boolean)

Whether `src/index.ts` would install the cli. You can set it `false` to prevent unwanted downloads.

#### `HASURA_CLI_DEST_DIR` (string)

A directory where Hasura CLI should be installed.

#### `HASURA_CLI_DEST_FILENAME` (string)

A file name of Hasura CLI.

### Getting started

Install dependencies. Lifecycle script `postinstall` is only for clients who want to install the binary. So, ignore it with `--ignore-scripts` option. It should also be used on CI.

```bash
yarn install --ignore-scripts
```

On development, you can run

```bash
yarn dev
# or
yarn dev:no-respawn
# or
yarn dev:build
```

`yarn dev` watches source code and restarts a process when file changes. It does not write compiled js to the file system. [ts-node-dev](https://github.com/whitecolor/ts-node-dev) does watching, compiling and restarting.

`yarn dev:no-respawn` does the same thing except it does not restart.

`yarn dev:build` logically does the identical job at the high viewpoint. But it compiles (`tsc -w`) ts, writes js on file system, and run (`nodemon`) js. [concurrently](https://github.com/kimmobrunfeldt/concurrently) runs `tsc` and `nodemon` simualtaneously.

To manually test compiled js, you can run

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

### How does this work?

Here is a brief file system tree.

```
hasura-cli
├── dist // to be generated by build process (e.g. `yarn build`), and ignored by git
├── hasura
├── package.json
└── src
    ├── asset.ts
    ├── index.ts
    └── install.ts
```

package.json exposes the command `hasura` as a symlink to the flie `hasura`. Only the directory `dist` and file `hasura` are packed as a package.

```json
{
  "bin": {
    "hasura": "./hasura"
  },
  "files": ["dist", "hasura"]
}
```

However, when publishing (`npm publish` on development environment) the package, the file `hasura` is just a dummy 'text' file, not a binary flie. The file will be replaced to a binary only when a client installs the package on Linux or macOS. On Windows, unlike Linux or macOS, the file `hasura` is to be removed, and a new file `hasura.exe` will be created. `postinstall` lifecycle hook executes `dist/index.js`, which would install the platform-specfic binary.

[The binaries](https://github.com/hasura/graphql-engine/releases) are hosted on GitHub as release assets. `src/asset.ts` exposes functions of _"getting GitHub asset url"_ and _"downloading the asset from the url"_. `src/install.ts` exposes a function of _"composing them and handling how installation should be processed"_. `src/index.ts` uses the function to actually install the asset with some additional control.

## License

[MIT License](LICENSE). Copyright &copy; 2019, GIL B. Chan <[bnbcmindnpass@gmail.com](mailto:bnbcmindnpass@gmail.com)>
