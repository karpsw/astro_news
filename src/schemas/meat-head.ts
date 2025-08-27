import { z } from 'astro:content';

//export type MetaHead = z.infer<typeof zMetaHead>;
export const zMetaHead = z.object({
  head_title: z.string().optional(),
  head_description: z.string().optional(),
  head_robots: z.string().optional(),
  head_twitter_card: z.string().optional(),
  head_twitter_title: z.string().optional(),
  head_twitter_description: z.string().optional(),
  head_twitter_image: z.string().optional(),
  head_og_locale: z.string().optional(),
  head_og_type: z.string().optional(),
  head_og_title: z.string().optional(),
  head_og_description: z.string().optional(),
  head_og_url: z.string().optional(),
  head_og_site_name: z.string().optional(),
  head_og_updated_time: z.coerce.date().optional(),
  head_canonical: z.string().optional(),
});
