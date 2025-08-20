import { createMarkdownProcessor } from '@astrojs/markdown-remark';

import { remarkShortcodeBlocks } from '../../plugins/remark-shortcode-blocks.mjs';

import type { MarkdownProcessorRenderResult } from '@astrojs/markdown-remark';

export const renderMarkdown = async (content: string): Promise<MarkdownProcessorRenderResult> => {
  const { render } = await createMarkdownProcessor({
    //remarkPlugins: [remarkWpShortCodes, remarkEmbed],
    remarkPlugins: [remarkShortcodeBlocks],
  });
  const renderedResult = await render(content);
  return renderedResult;
};
