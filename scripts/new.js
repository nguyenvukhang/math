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

function create(cwd) {
  inquirer
    .prompt([
      {
        name: 'kind',
        type: 'list',
        choices: ['Definition', 'Proposition', 'Lemma', 'Theorem', 'Example'],
        message: 'Kind:',
      },
      {
        name: 'id',
        type: 'input',
        message: 'Number:',
      },
      {
        name: 'name',
        type: 'input',
        message: 'Name:',
      },
      {
        name: 'filename',
        type: 'input',
        message: 'Filename:',
      },
    ])
    .then((answers) => {
      const { kind, id, name, filename } = answers
      const path = resolve(
        cwd,
        `${kind.toLowerCase()}-${id}${filename ? '-' + filename : ''}.md`,
      )
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

// ? Kind: Theorem
// ? Number: 2.2.2
// ? Name: Holomorphic by existence of derivative
// ? Filename: holomorphic-by-existence-of-derivative
