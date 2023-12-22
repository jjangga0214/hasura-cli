# Note

## Git hooks

There are git hooks, you can see them in package.json under `husky` field. To ignore hooks registered by husky, run `HUSKY_SKIP_HOOKS=1 <command-you-want>` or `pnpm husky-skip <command-you-want>`. Note that shell-specific configuration (e.g. aliases) might be only available with the former one, as `pnpm` could use a different shell (e.g. `/bin/sh`) from your default one.

### Lint-staged

[lint-staged](https://github.com/okonet/lint-staged) is used to format staged files before committed.

### Commitizen

This repo is [**"commitizen-friendly"**](https://github.com/commitizen/cz-cli#if-your-repo-is-commitizen-friendly). Commitizen is executed when `git commit`(`prepare-commit-msg` hook).

### Commitlint

[Commitlint](https://github.com/conventional-changelog/commitlint) lints commit message. [commitlint.config.js](../commitlint.config.js) is its configuration file.

## .npmignore vs `files`

`files` is configured like this.

**`package.json`**:

```json
{
  "files": ["dist", "hasura"]
}
```

But at the same time, `.npmignore` is also configured in a duplicated manner.

**`.npmignore`**:

```bash
**/*
!dist
!hasura
```

That's because, with only `files`, `"dist"` is ignored by `.gitignore`.
I think this behavior is strange, and some people (randomly?) experience the issue as well ([Read some comments](https://stackoverflow.com/questions/31642477/how-can-i-publish-an-npm-package-with-distribution-files)).
