import { remark } from 'remark';
import remarkHtml from 'remark-html';

import remarkEmbed from '../../plugins/remark-embed.mjs';

export async function renderMarkdown(content: string): Promise<string> {
  const processed = await remark().use(remarkEmbed).use(remarkHtml).process(content);

  return String(processed);
}
