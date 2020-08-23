# Note

## Yarn

Only yarn is officially considered on development environment.

### Scripts

Some scripts in package.json explicitly call yarn as well.

### Lock file

Therefore, this project only maintains _yarn.lock_, which yarn generates. Do not commit _package-lock.json_, which npm generates.

### Version

The version of yarn should satisfy the condition specified on package.json's `engines.yarn` field.

## Module alias

Module alias is only used for tests to load source modules. Every source modules under **src** directory do only use relative paths each other. So, compiled js files doesn't depend on module alias resolution.

Thus, module aliases should be consistent between configurations of typescript, jest, and eslint.

### Typescript

For typescript, corresponding configuration is done by `baseUrl` and `paths` fields in tsconfig.json.

### Jest

See `moduleNameMapper` field for corresponding configuration on jest.config.js.

For example,

```js
{
  // A map from regular expressions to module names that allow to stub out resources with a single module
  moduleNameMapper: {
    "^#/(.*)$": "<rootDir>/src/$1",
  }
}
```

means **#/** will be matched to **src/**.

### Eslint

`eslint-plugin-import` and `eslint-import-resolver-typescript` respect tsconfig.json by the configuration below in .eslintrc.js.

```js
{
  settings: {
    "import/resolver": {
      typescript: {} // this loads <rootdir>/tsconfig.json to eslint
    },
  },
}
```

This makes it not complaining about module aliases.

### Unconventional symbol

Note that `#` is used instead of more conventional `@` due to [an issue](https://github.com/Rush/link-module-alias/issues/3) of `link-module-alias`.

## Test

[**jest**](https://jestjs.io/) is used as test runner.

## Dev

`yarn dev` and `yarn dev:build` are only for development iteration.

## Git hooks

There are git hooks, you can see them in package.json under `husky` field. To ignore hooks registered by husky, run `HUSKY_SKIP_HOOKS=1 <command-you-want>` or `yarn husky-skip <command-you-want>`. Note that shell specific configuration (e.g. aliases) might be only avaliable with the former one, as `yarn` could use a different shell (e.g. `/bin/sh`) from your default one.

### Lint-staged

[lint-staged](https://github.com/okonet/lint-staged) is used to format staged files, and stage them again (as obviously they become 'changed' after formatted).

### Commitizen

This repo is [**"commitizen-friendly"**](https://github.com/commitizen/cz-cli#if-your-repo-is-commitizen-friendly). Commitizen is executed when `git commit`(`prepare-commit-msg` hook).

### Commitlint

[Commitlint](https://github.com/conventional-changelog/commitlint) lints commit message. [commitlint.config.js](../commitlint.config.js) is its configuration file.
