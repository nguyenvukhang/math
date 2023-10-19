import { lstatSync, readFileSync, readdirSync, existsSync } from 'fs'
import { resolve, join, relative } from 'path'
import { fromMarkdown } from 'mdast-util-from-markdown'
import chalk from 'chalk'

const ROOT_DIR = resolve('src/content/posts')

// UTILITIES {{{

const getAllFiles = (root) => {
  const [a, dir] = [[], (f) => lstatSync(f).isDirectory()]
  const ls = (c) =>
    readdirSync(c)
      .map((f) => resolve(c, f))
      .forEach((f) => (dir(f) ? ls(f) : a.push(f)))
  ls(root)
  return a.filter((f) => f !== root)
}

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

getAllFiles(ROOT_DIR).forEach((filepath) => {
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
      }
    })
})

if (!hasError) {
  console.log(chalk.green('All checks passed!'))
}
