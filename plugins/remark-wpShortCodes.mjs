import { toString } from 'mdast-util-to-string';

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

function parseInfbBlock(paragraphs) {
  const children = paragraphs.flatMap((n) => n.children);
  const rawText = toString({ type: 'paragraph', children });
  const content = rawText.slice(rawText.indexOf('[infb]') + 6, rawText.indexOf('[/infb]')).trim();

  return {
    type: 'html',
    value: `<div class="infb bg-yellow-100 p-4 border-l-4 border-yellow-400">${content}</div>`,
  };
}

export default function remarkWpShortCodes() {
  return function transformer(tree) {
    const newChildren = [];
    let buffer = [];
    let insideBlock = false;

    for (const node of tree.children) {
      if (node.type !== 'paragraph') {
        if (insideBlock) buffer.push(node);
        else newChildren.push(node);
        continue;
      }

      const text = toString(node).trim();

      // Начало многострочного блока
      if (text.startsWith('[gallery]') || text.startsWith('[infb]')) {
        buffer.push(node);
        insideBlock = true;
        continue;
      }

      // Продолжение блока
      if (insideBlock) {
        buffer.push(node);
        const joined = toString({
          type: 'paragraph',
          children: buffer.flatMap((n) => n.children),
        }).trim();

        if (joined.includes('[/gallery]')) {
          newChildren.push(parseGalleryBlock(buffer));
          buffer = [];
          insideBlock = false;
          continue;
        }

        if (joined.includes('[/infb]')) {
          newChildren.push(parseInfbBlock(buffer));
          buffer = [];
          insideBlock = false;
          continue;
        }

        continue;
      }

      // Однострочный Vidget
      const fullText = toString(node).replace(/[“”]/g, '"').trim();
      if (fullText.startsWith('[Vidget ') && fullText.endsWith(']')) {
        const attrMatch = fullText.match(/url="([^"]+?)"/);
        const url = attrMatch?.[1];
        if (url) {
          newChildren.push({
            type: 'html',
            //value: `<div class="vidget"><iframe src="${url}" loading="lazy" allow="fullscreen" style="width:100%; height:400px; border:none;"></iframe></div>`,
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
