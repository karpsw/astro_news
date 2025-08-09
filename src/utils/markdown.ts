import { createMarkdownProcessor } from '@astrojs/markdown-remark';

import remarkEmbed from '../../plugins/remark-embed.mjs';

import type { MarkdownProcessorRenderResult } from '@astrojs/markdown-remark';

export const renderMarkdown = async (content: string): Promise<MarkdownProcessorRenderResult> => {
  const { render } = await createMarkdownProcessor({
    remarkPlugins: [remarkEmbed],
  });
  const renderedResult = await render(content);
  return renderedResult;
};
