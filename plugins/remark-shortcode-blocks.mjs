import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { gfm } from 'micromark-extension-gfm';

function parseVidgetBlock(newChildren, content, shortcode, attrs) {
  const parsed = fromMarkdown(content, {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()],
  });

  newChildren.push({
    type: 'containerDirective',
    name: shortcode,
    children: parsed.children,
    data: {
      hName: 'div',
      hProperties: {
        className: [shortcode],
      },
    },
  });
}

function parseInfBlock(newChildren, content, shortcode, attrs) {
  const parsed = fromMarkdown(content, {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()],
  });

  newChildren.push({
    type: 'containerDirective',
    name: shortcode,
    children: parsed.children,
    data: {
      hName: 'div',
      hProperties: {
        className: [shortcode],
      },
    },
  });
}

function parseScrytBlock(newChildren, content, shortcode, attrs) {
  const parsed = fromMarkdown(content, {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()],
  });

  const tagTitle = {
    type: 'containerDirective',
    name: 'title',
    children: [
      {
        type: 'text',
        value: attrs.title,
      },
    ],
    data: {
      hName: 'div',
      hProperties: {
        className: [shortcode + `-title`],
      },
    },
  };

  const tagContent = {
    type: 'containerDirective',
    name: shortcode,
    children: parsed.children,
    data: {
      hName: 'div',
      hProperties: {
        className: [shortcode + `-content`],
      },
    },
  };

  newChildren.push({
    type: 'containerDirective',
    name: shortcode,
    children: [tagTitle, tagContent],
    data: {
      hName: 'div',
      hProperties: {
        className: [shortcode + `-wrapper`],
      },
    },
  });
}

function parseGalleryBlock(newChildren, content, shortcode, attrs) {
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

  newChildren.push({
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
  });
}

export function remarkShortcodeBlocks() {
  return (tree, file) => {
    const wpBlockTypes = [
      {
        name: 'scryt_b',
        parser: parseScrytBlock,
      },
      {
        name: 'inf',
        parser: parseInfBlock,
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
        name: 'gallery',
        parser: parseGalleryBlock,
      },
      {
        name: 'Vidget',
        parser: parseVidgetBlock,
      },

      // можно добавить другие блоки:
      // { name: 'scryt_b', open: '[scryt_b]', close: '[/scryt_b]', parser: parseScrytBlock }
    ];
    // const openTag = `[${shortcode}]`;
    // const closeTag = `[/${shortcode}]`;

    const newChildren = [];

    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i];

      if (node.type !== 'paragraph') {
        newChildren.push(node);
        continue;
      }

      const raw = file.value.slice(node.position.start.offset, node.position.end.offset).trim();
      const matchedFullBlock = wpBlockTypes.find(
        (b) => raw.startsWith(`[${b.name}`) && raw.includes(`[/${b.name}]`)
      );
      if (matchedFullBlock) {
        const openTagRegex = new RegExp(`^\\[(${matchedFullBlock.name})([^\\]]*)\\]`);
        const match = raw.match(openTagRegex);

        if (match) {
          const attrString = match[2]; // ' title=" тест скрытого блока" icon="🔒"'
          const tagLength = match[0].length;

          const attrs = {};
          attrString.replace(/(\w+)="(.*?)"/g, (_, key, value) => {
            attrs[key] = value;
            return '';
          });

          const closeTag = `[/${matchedFullBlock.name}]`;
          const content = raw
            .slice(tagLength, raw.indexOf(closeTag))
            .trim()
            .replace(/([^\n])\s*-\s+/g, '$1\n- '); // фикс для списков

          matchedFullBlock.parser(newChildren, content, matchedFullBlock.name, attrs);
        }

        // const openTag = `[${matchedFullBlock.name}]`;

        continue; // не добавляем исходный paragraph
      }
      newChildren.push(node);
    }

    tree.children = newChildren;
  };
}
