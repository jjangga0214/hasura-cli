import helpers from '@jjangga0214/eslint-config/helpers'
import javascript from '@jjangga0214/eslint-config/javascript'
import typescript from '@jjangga0214/eslint-config/typescript'
import jest from '@jjangga0214/eslint-config/jest'

export default [
  {
    ignores: [...helpers.ignores, 'reports/**', 'verdaccio/**'],
  },
  {
    languageOptions: {
      ecmaVersion: 2021,
    },
  },
  ...javascript, // You must include this even for typescript.
  ...typescript, // Include this only if you use typescript
  ...jest, // Include this only if you use jest
  {
    files: ['eslint.config.js'],
    rules: {
      // due to a bug
      'import/no-unresolved': 'off',
    },
  },
]
