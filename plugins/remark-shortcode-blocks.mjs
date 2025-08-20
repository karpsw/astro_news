import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { gfm } from 'micromark-extension-gfm';

function parseVidgetBlock(newChildren, shortcode, attrs) {
  if (attrs.url) {
    if (attrs.url.startsWith('https://t.me/')) {
      newChildren.push({
        type: 'html',
        value: `<div class="widget-telegram flex justify-center">
				<script async src="https://telegram.org/js/telegram-widget.js?7"
						data-telegram-post="${attrs.url.replace('https://t.me/', '')}"
						data-width="100%"></script>
		</div>`,
      });
    } else if (attrs.url.includes('tiktok.com')) {
      const filnaltweeturl = attrs.url.replace('x.com', 'twitter.com');
      newChildren.push({
        type: 'html',
        value: `<div class="widget-tiktok flex justify-center"><iframe class="w-100 tiktok-embed mb-4" loading="lazy" src="https://www.tiktok.com/player/v1/${attrs.url}" allow="fullscreen"></iframe></div>`,
      });
    } else if (attrs.url.includes('x.com') || attrs.url.includes('twitter.com')) {
      const filnaltweeturl = attrs.url.replace('x.com', 'twitter.com');
      newChildren.push({
        type: 'html',
        value: `<div class="widget-twitter flex justify-center"><blockquote class="twitter-tweet"><a href="${filnaltweeturl}">Загрузка Твиттера</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></div>`,
      });
    } else if (attrs.url.includes('threads.com')) {
      const cleanUrl = attrs.url.replace(/\?.*/, '');
      newChildren.push({
        type: 'html',
        value: `<div class="widget-threads"><blockquote class="text-post-media threads-embed" data-text-post-permalink="${cleanUrl}" data-text-post-version="0"></blockquote> <script async src="//www.threads.com/embed.js"></script></div>`,
      });
    } else if (attrs.url.includes('youtube.com') || attrs.url.includes('youtu.be')) {
      const videoId = attrs.url.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      );
      newChildren.push({
        type: 'html',
        value: `<div class="widget-youtube"><iframe src="${videoId}" loading="lazy" allowfullscreen></iframe></div>`,
      });
    }
  }
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

function parsePostImageBlock(newChildren, shortcode, attrs) {
  if (attrs?.url) {
    newChildren.push({
      type: 'html',
      value: `<img class="post-img" src="${attrs.url}" alt="${attrs.caption ?? ''}"/>`,
    });
  }
}

function parseOblovlenoBlock(newChildren, content, shortcode, attrs) {
  const parsed = fromMarkdown(content, {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()],
  });

  newChildren.push({
    type: 'containerDirective',
    name: shortcode,
    children: [
      {
        type: 'html',
        value: `<div class="${shortcode}-head">
			 
  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="currentColor" viewBox="0 0 512 512">
    <path d="M290.74 93.24L418.76 221.26L176.37 463.65L48.35 335.63L290.74 93.24ZM497.94 74.17C511.81 88.04 511.81 110.96 497.94 124.83L459.31 163.46L348.54 52.69L387.17 14.06C401.04 0.19 423.96 0.19 437.83 14.06L497.94 74.17ZM0 512L144.52 467.48L44.52 367.48L0 512Z"/>
  </svg>
  Обновлено
</div>`,
      },
      {
        type: 'containerDirective',
        name: shortcode,
        children: parsed.children,
        data: {
          hName: 'div',
          hProperties: {
            className: [shortcode],
          },
        },
      },
    ],
    data: {
      hName: 'div',
      hProperties: {
        className: [shortcode + `-wrapper`],
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
        name: 'obnovleno_b',
        parser: parseOblovlenoBlock,
      },
      {
        name: 'inf',
        parser: parseInfBlock,
      },
      {
        name: 'infb',
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
      {
        name: 'postimage',
        parser: parsePostImageBlock,
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
      } else if (wpBlockTypes.find((b) => raw.startsWith(`[${b.name} `))) {
        const matchedFullBlockSingle = wpBlockTypes.find((b) => raw.startsWith(`[${b.name}`));

        const openTagRegex = new RegExp(`^\\[(${matchedFullBlockSingle.name})([^\\]]*)\\]`);
        const match = raw.match(openTagRegex);

        if (match) {
          const attrString = match[2]; // ' title=" тест скрытого блока" icon="🔒"'

          const attrs = {};
          attrString.replace(/(\w+)="(.*?)"/g, (_, key, value) => {
            attrs[key] = value;
            return '';
          });

          matchedFullBlockSingle.parser(newChildren, matchedFullBlockSingle.name, attrs);
        }

        continue;
      }

      newChildren.push(node);
    }

    tree.children = newChildren;
  };
}
