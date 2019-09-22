import { install } from './install'
// eslint-disable-next-line prettier/prettier

// eslint-disable-next-line import/newline-after-import
;(async (): Promise<void> => {
  await install({
    verbose: true,
  })
})()
