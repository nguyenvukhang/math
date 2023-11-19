import { resolve } from 'path'
import { lstatSync, readdirSync } from 'fs'

export const POSTS_DIR = resolve('src/content/posts')

/**
 * @returns {string[]}
 */
export const getAllFiles = (root) => {
  const [a, dir] = [[], (f) => lstatSync(f).isDirectory()]
  const ls = (c) =>
    readdirSync(c)
      .map((f) => resolve(c, f))
      .forEach((f) => (dir(f) ? ls(f) : a.push(f)))
  ls(root)
  return a.filter((f) => f !== root)
}

export const getPosts = () =>
  getAllFiles(POSTS_DIR).filter((v) => v.endsWith('.md'))
