import { readFileSync, existsSync } from 'fs'
import { join, relative } from 'path'
import { fromMarkdown } from 'mdast-util-from-markdown'
import chalk from 'chalk'
import { POSTS_DIR, getPosts } from './utils.js'

function flatten({ children, ...rest }, acc = []) {
  acc.push(rest)
  if (children) children.forEach((c) => flatten(c, acc))
  return acc
}

/**
 * #nonlinear-optimization/step-size-rule ->
 * nonlinear-optimization/step-size-rule.md
 */
function internalUrlToFilename(url) {
  return url.slice(1) + '.md'
}

let hasError = false

function criteria(v) {
  if (!v.url || !v.url.startsWith('#')) return false
  if (['link', 'definition'].includes(v.type)) return true
  return false
}

getPosts().forEach((filepath) => {
  const relpath = relative(POSTS_DIR, filepath)
  const contents = readFileSync(filepath)
  flatten(fromMarkdown(contents))
    .filter(criteria)
    .forEach((v) => {
      const targetFile = internalUrlToFilename(v.url)
      const exists = existsSync(join(POSTS_DIR, targetFile))
      if (!exists) {
        hasError = true
        console.warn(chalk.yellow('[Warning: broken link]'))
        console.log(`FILE:\t${relpath}\nLINK:\t${v.url}\n`)
      }
    })
})

if (!hasError) console.log(chalk.green('All checks passed!'))
else throw new Error('checkhealth failed.')
