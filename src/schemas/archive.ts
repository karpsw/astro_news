import { z } from 'astro:content';

export const newsSchema = z.object({
  id: z.number(),
  title: z.string(),
  date: z.coerce.date().optional(),
  featured_img_url: z.string().optional(),
  featured_img_caption: z.string().optional(),
  category: z.string().optional(),
  category_slug: z.string().optional(),
  lid: z.string().optional(),
  tags: z
    .array(
      z.object({
        name: z.string(),
        slug: z.string(),
      })
    )
    .optional(),
});
// schema and collection are separate
