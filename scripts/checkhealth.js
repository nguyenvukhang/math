import { readFileSync, existsSync } from 'fs'
import { join, relative } from 'path'
import { fromMarkdown } from 'mdast-util-from-markdown'
import chalk from 'chalk'
import { POSTS_DIR, getPosts } from './utils.js'

// UTILITIES {{{

/**
 * @typedef {Object} Node
 * @property {string} type
 * @property {Node[]} children
 */

/**
 * @param {Node} node
 * @returns {Node[]}
 */
function flatten({ children, ...rest }, acc = []) {
  acc.push(rest)
  if (children) children.forEach((c) => flatten(c, acc))
  return acc
}

// }}}

/**
 * #nonlinear-optimization/step-size-rule ->
 * nonlinear-optimization/step-size-rule.md
 */
function internalUrlToFilename(url) {
  return url.slice(1) + '.md'
}

let hasError = false

getPosts().forEach((filepath) => {
  const relpath = relative(POSTS_DIR, filepath)
  const contents = readFileSync(filepath)
  /** @type {Node} */
  const tree = fromMarkdown(contents)
  flatten(tree)
    .filter((v) => v.type === 'link')
    .filter((v) => v.url && v.url.startsWith('#'))
    .forEach((v) => {
      const targetFile = internalUrlToFilename(v.url)
      const exists = existsSync(join(POSTS_DIR, targetFile))
      if (!exists) {
        hasError = true
        console.warn(chalk.yellow('[Warning: broken link]'))
        console.log(`'${relpath}' has broken link:\n${v.url}`)
      }
    })
})

if (!hasError) console.log(chalk.green('All checks passed!'))
else throw new Error('checkhealth failed.')
