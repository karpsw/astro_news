import { createMarkdownProcessor } from '@astrojs/markdown-remark';

import remarkWpShortCodes from '../../plugins/remark-wpShortCodes.mjs';

import type { MarkdownProcessorRenderResult } from '@astrojs/markdown-remark';

export const renderMarkdown = async (content: string): Promise<MarkdownProcessorRenderResult> => {
  const { render } = await createMarkdownProcessor({
    //remarkPlugins: [remarkWpShortCodes, remarkEmbed],
    remarkPlugins: [remarkWpShortCodes],
  });
  const renderedResult = await render(content);
  return renderedResult;
};
