import { getEntry, z } from 'astro:content';

import matter from 'gray-matter';

import { zNewsPostSchema } from '@/schemas/archive';

export async function getMarkdown(
  slug: string
): Promise<{ content: string; data: z.infer<typeof zNewsPostSchema> }> {
  try {
    const entry = await getEntry('archive', slug);
    if (entry && 'body' in entry) {
      return { content: entry.body!, data: entry.data };
    }
  } catch {
    // fallback
  }

  const res = await fetch(`https://telegraf.news/api/v1/test.php?slug=${slug}`);
  if (!res.ok) throw new Error('Markdown not found');
  const raw = await res.text();

  const parsed = matter(raw);

  const result = zNewsPostSchema.safeParse(parsed.data);
  if (!result.success) {
    console.error(result.error);
    throw new Error('Frontmatter does not match archiveScheme');
  }

  return {
    content: parsed.content!,
    data: result.data,
  };
}
