import { defineCollection, z } from 'astro:content'

const posts = defineCollection({
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    sorter: z.string().optional(),
    open: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
})

export const collections = { posts }
