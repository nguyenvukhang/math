import { readFileSync, writeFileSync } from 'fs'
import { getPosts } from './utils.js'

getPosts()
  .filter((v) => !v.includes('template'))
  .forEach((filepath) => {
    const text = readFileSync(filepath, 'utf-8')
    const lines = text.split('\n')
    let output = lines
    output = output.filter((v) => v.replace(/\s/g, '') !== 'open:true')
    output = output.filter((v) => v.replace(/\s/g, '') !== 'draft:true')
    writeFileSync(filepath, output.join('\n'))
  })
