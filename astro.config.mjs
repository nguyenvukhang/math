import { defineConfig } from 'astro/config'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'

const macros = {
  '\\norm': '\\lVert{#1}\\rVert',
  '\\R': '\\mathbb{R}',
  '\\C': '\\mathbb{C}',
}

export default defineConfig({
  server: { port: 3000 },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [() => rehypeKatex({ output: 'html', macros })],
  },
})
