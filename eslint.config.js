import { ignores } from '@jjangga0214/eslint-config/helpers'
import javascript from '@jjangga0214/eslint-config/javascript'
import typescript from '@jjangga0214/eslint-config/typescript'
import jest from '@jjangga0214/eslint-config/jest'

export default [
  ...javascript, // You must include this even for typescript.
  ...typescript, // Include this only if you use typescript
  ...jest, // Include this only if you use jest
  {
    ignores: [...ignores, 'reports/**', 'verdaccio/**'],
  },
  {
    languageOptions: {
      ecmaVersion: 2021,
    },
  },
  {
    // TODO: remove this patch
    // BUG: false-positive rules
    files: ['eslint.config.js', 'jest.config.js'],
    rules: {
      'import/no-unresolved': 'off',
    },
  },
]
