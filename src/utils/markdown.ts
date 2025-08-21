import { createMarkdownProcessor } from '@astrojs/markdown-remark';

import remarkEmbed from '../../plugins/remark-embed.mjs';
import remarkParagraphCounter from '../../plugins/remark-paragraph-counter.mjs';
import remarkTableWrapper from '../../plugins/remark-responsive-table.mjs';
import { remarkShortcodeBlocks } from '../../plugins/remark-shortcode-blocks.mjs';
//import { rehypeExternalLinks } from '../../plugins/rehype-external-links.ts';
import remarkRekInternal from '../../plugins/remark-telegraf-links.ts';

import type { MarkdownProcessorRenderResult } from '@astrojs/markdown-remark';

export const renderMarkdown = async (content: string): Promise<MarkdownProcessorRenderResult> => {
  const { render } = await createMarkdownProcessor({
    //remarkPlugins: [remarkWpShortCodes, remarkEmbed],
    remarkPlugins: [
      remarkTableWrapper,
      remarkShortcodeBlocks,
      remarkEmbed,
      remarkParagraphCounter,
      remarkRekInternal,
    ],
  });
  const renderedResult = await render(content);
  return renderedResult;
};
