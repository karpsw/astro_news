import { toHtml } from 'hast-util-to-html';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { toHast } from 'mdast-util-to-hast';
import { toString } from 'mdast-util-to-string';
import { gfm } from 'micromark-extension-gfm';

function parseGalleryBlock(paragraphs) {
  const rawText = toString({ type: 'paragraph', children: paragraphs.flatMap((n) => n.children) });
  const content = rawText
    .slice(rawText.indexOf('[gallery]') + 9, rawText.indexOf('[/gallery]'))
    .trim();

  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const images = [];
  let current = {};

  for (const line of lines) {
    if (line.startsWith('url:')) {
      if (current.url) images.push(current);
      current = { url: line.slice(5).trim(), alt: '' };
    } else if (line.startsWith('alt:')) {
      current.alt = line.slice(line.indexOf(':') + 1).trim();
    }
  }
  if (current.url) images.push(current);

  return {
    type: 'html',
    value: `<div class="wpgallery bg-red-400 w-full p-5">
${images
  .map(
    (img) => `<figure>
  <img src="${img.url}" alt="${img.alt ?? ''}" />
  ${img.alt ? `<figcaption>${img.alt}</figcaption>` : ''}
</figure>`
  )
  .join('\n')}
</div>`,
  };
}

function parseInfBlock(paragraphs, blockName) {
  const children = paragraphs.flatMap((n) => n.children);
  const rawText = toString({ type: 'paragraph', children });
  const content = rawText
    .slice(
      rawText.indexOf(`[${blockName}]`) + blockName.length + 2,
      rawText.indexOf(`[/${blockName}]`)
    )
    .trim();

  return {
    type: 'html',
    value: `<div class="${blockName}">${content}</div>`,
  };
}

function parseInfBlock2(paragraphs, blockName) {
  const children = paragraphs.flatMap((n) => n.children);
  const rawText = toString({ type: 'paragraph', children });

  const startTag = `[${blockName}]`;
  const endTag = `[/${blockName}]`;

  const startIndex = rawText.indexOf(startTag);
  const endIndex = rawText.indexOf(endTag);

  if (startIndex === -1 || endIndex === -1) return null;

  const content = rawText.slice(startIndex + startTag.length, endIndex).trim();

  const parsed = fromMarkdown(content, {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()],
  });

  return {
    type: 'containerDirective',
    name: blockName,
    children: parsed.children,
  };
}

function parseInfBlockWithAttrs(paragraphs, blockName) {
  const children = paragraphs.flatMap((n) => n.children);
  const rawText = toString({ type: 'paragraph', children });

  const openTagMatch = rawText.match(new RegExp(`\\[${blockName}(.*?)\\]`));
  const closeTag = `[/${blockName}]`;

  if (!openTagMatch || !rawText.includes(closeTag)) return null;

  const attrString = openTagMatch[1] ?? '';
  const content = rawText
    .slice(rawText.indexOf(openTagMatch[0]) + openTagMatch[0].length, rawText.indexOf(closeTag))
    .trim();

  const attrs = {};
  attrString.replace(/(\w+)="(.*?)"/g, (_, key, value) => {
    attrs[key] = value;
    return '';
  });

  const mdast = fromMarkdown(content, {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()],
  });

  const hast = toHast(mdast, { allowDangerousHtml: true });
  const innerHtml = toHtml(hast, { allowDangerousHtml: true });

  const attrHtml = Object.entries(attrs)
    .map(([key, value]) => `data-${key}="${value}"`)
    .join(' ');

  return {
    type: 'html',
    value: `<div class="${blockName}" ${attrHtml}>${innerHtml}</div>`,
  };
}

function parseScrytBlock(paragraphs, blockName) {
  const children = paragraphs.flatMap((n) => n.children);
  const rawText = toString({ type: 'paragraph', children });

  const openTagMatch = rawText.match(new RegExp(`\\[${blockName}(.*?)\\]`));
  const closeTag = `[/${blockName}]`;

  const attrString = openTagMatch?.[1] ?? '';
  const content = rawText
    .slice(rawText.indexOf(openTagMatch[0]) + openTagMatch[0].length, rawText.indexOf(closeTag))
    .trim();

  const attrs = {};
  attrString.replace(/(\w+)="(.*?)"/g, (_, key, value) => {
    attrs[key] = value;
    return '';
  });

  const attrHtml = Object.entries(attrs)
    .map(([key, value]) => `data-${key}="${value}"`)
    .join(' ');

  return {
    type: 'html',
    value: `<div class="${blockName}" ${attrHtml}>${content}</div>`,
  };
}

export default function remarkWpShortCodes() {
  return function transformer(tree) {
    const newChildren = [];
    let buffer = [];
    let insideBlock = false;

    const wpBlockTypes = [
      {
        name: 'gallery',
        parser: parseGalleryBlock,
      },
      {
        name: 'infb',
        parser: parseInfBlockWithAttrs,
      },
      {
        name: 'infg',
        parser: parseInfBlock,
      },
      {
        name: 'infp',
        parser: parseInfBlock,
      },
      {
        name: 'inf',
        parser: parseInfBlock,
      },
      {
        name: 'scryt_b',
        parser: parseScrytBlock,
      },

      // можно добавить другие блоки:
      // { name: 'scryt_b', open: '[scryt_b]', close: '[/scryt_b]', parser: parseScrytBlock }
    ];

    for (const node of tree.children) {
      if (node.type !== 'paragraph') {
        if (insideBlock) buffer.push(node);
        else newChildren.push(node);
        continue;
      }

      const text = toString(node).trim();

      // 🔍 Проверка на однострочный завершённый блок
      const matchedFullBlock = wpBlockTypes.find(
        (b) => text.startsWith(`[${b.name}]`) && text.includes(`[/${b.name}]`)
      );
      if (matchedFullBlock) {
        newChildren.push(matchedFullBlock.parser([node], matchedFullBlock.name));
        continue;
      }

      // 🔍 Проверка на начало многострочного блока
      const matchedStart = wpBlockTypes.find((b) => text.startsWith(`[${b.name}]`));
      if (matchedStart) {
        buffer.push(node);
        insideBlock = matchedStart;
        continue;
      }

      // 🔄 Продолжение многострочного блока
      if (insideBlock) {
        buffer.push(node);
        const joined = toString({
          type: 'paragraph',
          children: buffer.flatMap((n) => n.children),
        }).trim();

        if (joined.includes(`[/${insideBlock.name}]`)) {
          newChildren.push(insideBlock.parser(buffer, insideBlock.name));
          buffer = [];
          insideBlock = false;
          continue;
        }

        continue;
      }

      // 🔧 Однострочный Vidget
      const fullText = toString(node).replace(/[“”]/g, '"').trim();
      if (fullText.startsWith('[Vidget ') && fullText.endsWith(']')) {
        const attrMatch = fullText.match(/url="([^"]+?)"/);
        const url = attrMatch?.[1];
        if (url) {
          newChildren.push({
            type: 'html',
            value: `<blockquote class="twitter-tweet"><a href="${url}"></a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`,
          });
          continue;
        }
      }

      newChildren.push(node);
    }

    tree.children = newChildren;
  };
}
