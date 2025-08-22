import { z } from 'astro:content';

import { zMetaHead } from './meat-head';

export const zNewsPostSchema = zMetaHead.extend({
  id: z.number(),
  title: z.string(),
  date: z.coerce.date().optional(),
  featured_img_url: z.string().optional(),
  featured_img_caption: z.string().optional(),
  category: z.string().optional(),
  category_slug: z.string().optional(),
  lid: z.string().optional(),
  permalink: z.string().optional(),

  // настройки новости
  label: z.string().optional(),
  showpost: z.number().optional(),
  vyklreklama: z.number().optional(),
  showphoto: z.number().optional(),
  avtor_show: z.number().optional(),
  avtor_name: z.string().optional(),
  avtor_bio: z.string().optional(),
  avtor_avatar: z.string().optional(),
  tocontent: z.number().optional(),

  // дополнительные SEO
  head_article_tag: z.string().optional(),
  head_article_section: z.string().optional(),
  head_og_image: z.string().optional(),
  head_og_image_secure_url: z.string().optional(),
  head_og_image_width: z.number().optional(),
  head_og_image_height: z.number().optional(),
  head_og_image_alt: z.string().optional(),
  head_og_image_type: z.string().optional(),

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
