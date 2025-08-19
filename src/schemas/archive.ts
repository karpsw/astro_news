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
  permalink: z.string().optional(),
  meta_description: z.string().optional(),
  meta_title: z.string().optional(),
  schema_type: z.string().optional(),
  label: z.string().optional(),
  showpost: z.number().optional(),
  vyklreklama: z.number().optional(),
  showphoto: z.number().optional(),
  avtor_show: z.number().optional(),
  avtor_name: z.string().optional(),
  avtor_bio: z.string().optional(),
  avtor_avatar: z.string().optional(),
  tocontent: z.number().optional(),
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
