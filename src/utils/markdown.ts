import { createMarkdownProcessor } from '@astrojs/markdown-remark';

import remarkEmbed from '../../plugins/remark-embed.mjs';
import remarkParagraphCounter from '../../plugins/remark-paragraph-counter.mjs';
import { remarkShortcodeBlocks } from '../../plugins/remark-shortcode-blocks.mjs';

import type { MarkdownProcessorRenderResult } from '@astrojs/markdown-remark';

export const renderMarkdown = async (content: string): Promise<MarkdownProcessorRenderResult> => {
  const { render } = await createMarkdownProcessor({
    //remarkPlugins: [remarkWpShortCodes, remarkEmbed],
    remarkPlugins: [remarkShortcodeBlocks, remarkEmbed, remarkParagraphCounter],
  });
  const renderedResult = await render(content);
  return renderedResult;
};
