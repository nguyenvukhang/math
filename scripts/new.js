import inquirer from 'inquirer'
import chalk from 'chalk'
import { resolve } from 'path'
import { existsSync, writeFileSync } from 'fs'
import child from 'child_process'

const TEMPLATE_FILE = resolve(process.cwd(), 'src/content/posts/template.md')

const template = (title) => `\
---
title: "${title}"
open: true
draft: true
---
`

const title = (kind, id, name) => {
  let t = ''
  if (kind) t += ' ' + kind
  if (id) t += ' ' + id
  if (name) t += ' (' + name + ')'
  return t.slice(1)
}

const KINDS = [
  'Definition',
  'Lemma',
  'Proposition',
  'Corollary',
  'Theorem',
  'Example',
]

function create(cwd) {
  inquirer
    .prompt([
      { name: 'kind', type: 'list', choices: KINDS, message: 'Kind:' },
      { name: 'id', type: 'input', message: 'Number:' },
      { name: 'name', type: 'input', message: 'Name:' },
      { name: 'filename', type: 'input', message: 'Filename:' },
    ])
    .then((answers) => {
      let { kind, id, name, filename: f } = answers
      f = `${kind.toLowerCase()}-${id}${f ? '-' + f : ''}.md`
      const path = resolve(cwd, f)
      writeFileSync(path, template(title(kind, id, name)))
      child.spawn('nvim', [path], { stdio: 'inherit' })
    })
}

function main() {
  const print = console.log // lmao I'm probably gonna regret this
  const cwd = process.argv[2]
  print('\nSending new file to', chalk.green(cwd), '\n')
  if (!existsSync(TEMPLATE_FILE)) return print("Template file doesn't exist.")
  create(cwd)
}

main()
