import { readFileSync, writeFileSync } from 'fs'
import { getPosts } from './utils.js'

getPosts()
  .filter((v) => !v.includes('template'))
  .forEach((filepath) => {
    const text = readFileSync(filepath, 'utf-8')
    const lines = text.split('\n')
    const output = lines.filter((v) => v.replace(/\s/g, '') !== 'open:true')
    writeFileSync(filepath, output.join('\n'))
  })
