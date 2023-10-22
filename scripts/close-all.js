import { readFileSync, existsSync } from 'fs'
import { join, relative } from 'path'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { getPosts } from './utils.js'
import chalk from 'chalk'

getPosts().forEach((filepath) => {
  const relpath = relative(ROOT_DIR, filepath)
  // console.log(filepath)
  const contents = readFileSync(filepath)
  /** @type {Node} */
  const tree = fromMarkdown(contents)
  flatten(tree)
    .filter((v) => v.type === 'link')
    .filter((v) => v.url && v.url.startsWith('#'))
    .forEach((v) => {
      const targetFile = internalUrlToFilename(v.url)
      const exists = existsSync(join(ROOT_DIR, targetFile))
      if (!exists) {
        hasError = true
        console.warn(chalk.yellow('[Warning: broken link]'))
        console.log(`'${relpath}' has broken link:\n${v.url}`)
        failCheck()
      }
    })
})

if (!hasError) {
  console.log(chalk.green('All checks passed!'))
}
