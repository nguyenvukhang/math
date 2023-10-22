import type { CollectionEntry } from 'astro:content'

type Post = CollectionEntry<'posts'>

const NUM3_REGEX = new RegExp('\\d+\\.\\d+\\.\\d+')

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
      const folder = p.slug.slice(0, p.slug.indexOf('/'))
      if (!a[folder]) a[folder] = []
      a[folder].push(p)
      if (p.slug.includes('propo')) {
        console.log(p)
      }
      return a
    },
    {} as Record<string, Post[]>,
  )
  Object.keys(dict).forEach((k) => dict[k].sort(sorter))
  const sorted = Object.entries(dict)
  sorted.sort((a, b) => a[0].localeCompare(b[0]))
  return sorted
}

const semver = (v: string, index: number) => {
  const p = v.split(' ')
  return p.length <= index || !NUM3_REGEX.test(p[index]) ? null : p[index]
}

/**
 * Sorts posts for displaying.
 *
 * If a semver is found in the second word, use that to sort.
 * If no semver found, send it to the back
 */
export const sorter = (a: Post, b: Post) => {
  const sa = semver(a.data.title, 1)
  const sb = semver(b.data.title, 1)
  if (!sa && !sb) return a.data.title.localeCompare(b.data.title)
  if (!sa) return 1 // sort B first
  if (!sb) return -1 // sort A first
  return sa.localeCompare(sb)
}
