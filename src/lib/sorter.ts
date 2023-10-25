import type { CollectionEntry } from 'astro:content'

type Post = CollectionEntry<'posts'>

const NUM3_REGEX = new RegExp('\\d+\\.\\d+\\.\\d+')
const NUM2_REGEX = new RegExp('\\d+\\.\\d+')

export const renderAll = (posts: Post[]) =>
  Promise.all(posts.map((v) => v.render())).then((renders) =>
    posts.map(({ render, id, ...v }, i) => ({
      Content: renders[i].Content,
      ...v,
      id,
      href: id.replace(/\.md$/, ''),
    })),
  )

export const groupByFolder = (posts: Post[]): [string, Post[]][] => {
  const dict = posts.reduce(
    (a, p) => {
      if (p.id.includes('template.md')) return a
      const i = p.slug.indexOf('/')
      const folder = i < 0 ? 'unsorted' : p.slug.slice(0, i)
      if (!a[folder]) a[folder] = []
      a[folder].push(p)
      return a
    },
    {} as Record<string, Post[]>,
  )
  Object.keys(dict).forEach((k) => dict[k].sort(sorter))
  const sorted = Object.entries(dict)
  sorted.sort((a, b) => a[0].localeCompare(b[0]))
  return sorted
}

class Semver {
  maj: number
  min: number
  patch: number

  constructor(maj: number, min: number, patch: number) {
    this.maj = maj
    this.min = min
    this.patch = patch
  }

  static from_str(v: string) {
    if (NUM3_REGEX.test(v)) {
      const a = v.split('.').map((v) => parseInt(v))
      return new Semver(a[0], a[1], a[2])
    } else if (NUM2_REGEX.test(v)) {
      const a = v.split('.').map((v) => parseInt(v))
      return new Semver(a[0], a[1], 0)
    }
    return null
  }

  compare(rhs: Semver) {
    let c = this.maj - rhs.maj
    if (c !== 0) return c
    c = this.min - rhs.min
    if (c !== 0) return c
    return this.patch - rhs.patch
  }
}

const semver = (v: string, index: number) => {
  const p = v.split(' ')
  if (p.length <= index) return null
  return Semver.from_str(p[index])
}

/**
 * Sorts posts for displaying.
 *
 * If a semver is found in the second word, use that to sort.
 * If no semver found, send it to the back
 */
export const sorter = (a: Post, b: Post) => {
  const keyA = a.data.sorter || a.data.title
  const keyB = b.data.sorter || b.data.title
  const sa = semver(keyA, a.data.sorter ? 0 : 1)
  const sb = semver(keyB, b.data.sorter ? 0 : 1)
  if (!sa && !sb) return keyA.localeCompare(keyB)
  if (!sa) return 1 // sort B first
  if (!sb) return -1 // sort A first
  return sa.compare(sb)
}
