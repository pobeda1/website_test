import { z, defineCollection } from 'astro:content';

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().default('🔧'),
    features: z.array(z.string()).optional(),
    order: z.number().default(0)
  })
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string().optional(),
    image: z.string().optional()
  })
});

export const collections = { services, blog };
