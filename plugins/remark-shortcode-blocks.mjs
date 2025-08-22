import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { gfm } from 'micromark-extension-gfm';

function parseVidgetBlock(newChildren, shortcode, attrs) {
  if (attrs.url) {
    //telegram
    if (attrs.url.startsWith('https://t.me/')) {
      newChildren.push({
        type: 'html',
        value: `<div class="widget-telegram flex justify-center">
				<script async src="https://telegram.org/js/telegram-widget.js?7"
						data-telegram-post="${attrs.url.replace('https://t.me/', '')}"
						data-width="100%"></script>
		</div>`,
      });

      //tiktok
    } else if (attrs.url.includes('tiktok.com')) {
      const processTikTok = async () => {
        let finalUrl = attrs.url;

        // Обработка коротких ссылок vm.tiktok.com
        if (finalUrl.includes('vm.tiktok') || finalUrl.includes('vt.tiktok')) {
          try {
            const response = await fetch(finalUrl, { redirect: 'manual' });
            const location = response.headers.get('Location');
            if (location) {
              finalUrl = location;
            }
          } catch (error) {
            console.error('Error processing short TikTok link:', error);
          }
        }

        // Убираем параметры
        finalUrl = finalUrl.replace(/\?.*/, '');

        // Извлекаем ID
        const idMatch = finalUrl.match(/\/(\d+)(?:\/|$)/);
        const id_tiktok = idMatch ? idMatch[1] : null;

        if (id_tiktok) {
          newChildren.push({
            type: 'html',
            value: `<div class="widget-tiktok flex justify-center"><iframe class="w-full tiktok-embed h-[400]" loading="lazy" src="https://www.tiktok.com/player/v1/${id_tiktok}" allow="fullscreen"></iframe></div>`,
          });
        }
      };

      processTikTok();
      // x - Twitter
    } else if (attrs.url.includes('x.com') || attrs.url.includes('twitter.com')) {
      const filnaltweeturl = attrs.url.replace('x.com', 'twitter.com');
      newChildren.push({
        type: 'html',
        value: `<div class="widget-twitter flex justify-center"><blockquote class="twitter-tweet"><a href="${filnaltweeturl}">Загрузка Твиттера</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></div>`,
      });
      // threads
    } else if (attrs.url.includes('threads.com')) {
      const cleanUrl = attrs.url.replace(/\?.*/, '');
      newChildren.push({
        type: 'html',
        value: `<div class="widget-threads"><blockquote class="text-post-media threads-embed" data-text-post-permalink="${cleanUrl}" data-text-post-version="0"></blockquote> <script async src="//www.threads.com/embed.js"></script></div>`,
      });
      // instagram
    } else if (attrs.url.includes('instagram.com')) {
      const cleanUrl = attrs.url.replace(/\?.*/, '');
      newChildren.push({
        type: 'html',
        value: `<div class="widget-instagram"><blockquote class="instagram-media instagram-embed" data-instgrm-permalink="${cleanUrl}" data-instgrm-version="14"></blockquote> <script async src="//www.instagram.com/embed.js"></script></div>`,
      });
      // youtube
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
        className: [shortcode + ` shortcode`],
      },
    },
  });
}

function parsePostImageBlock(newChildren, shortcode, attrs) {
  if (attrs?.url) {
    const originalUrl = attrs.url.split('?')[0];
    const paramsString = attrs.url.split('?')[1] || '';
    const params = new URLSearchParams(paramsString);

    const originalWidth = parseInt(params.get('w')) || 891;
    const originalHeight = parseInt(params.get('h')) || 501;
    const aspectRatio = originalHeight / originalWidth;

    const getSizedUrl = (width) => {
      const height = Math.round(width * aspectRatio);
      const urlWithParams = new URL(originalUrl);
      urlWithParams.searchParams.set('w', width);
      urlWithParams.searchParams.set('h', height);
      urlWithParams.searchParams.set('crop', 1);
      return urlWithParams.toString();
    };

    // Генерируем URL только если ширина достаточна
    const mobileImgUrl = originalWidth >= 382 ? getSizedUrl(382) : null;
    const mediumImgUrl = originalWidth >= 690 ? getSizedUrl(690) : null;
    const desktopImgUrl = getSizedUrl(originalWidth);

    const finalAlt = attrs.caption || 'Изображение';
    const alignClass = attrs.align ? ` post-img ${attrs.align}` : '';
    const widthClass = originalWidth >= 891 ? ' w-full' : '';

    // Формируем теги <source> только для подходящих размеров
    const mobileSource = mobileImgUrl
      ? `<source media="(max-width: 799px)" srcset="${mobileImgUrl}">`
      : '';
    const mediumSource = mediumImgUrl
      ? `<source media="(min-width: 800px) and (max-width: 1200px)" srcset="${mediumImgUrl}">`
      : '';

    const pictureHtml = `
      <picture>
        ${mobileSource}
        ${mediumSource}
        <source media="(min-width: 1201px)" srcset="${desktopImgUrl}">
        <img
          src="${desktopImgUrl}"
          alt="${finalAlt}"
          loading="lazy"
          decoding="async"
          fetchpriority="auto"
          class="${alignClass}${widthClass}"
         data-lightbox="${desktopImgUrl.split('?')[0]}"
        >
      </picture>
    `;

    let finalHtml;
    if (attrs.caption) {
      finalHtml = `
        <figure class="post-img-container ${alignClass}">
          ${pictureHtml}
          <figcaption class="post-img-caption">${attrs.caption}</figcaption>
        </figure>
      `;
    } else {
      finalHtml = pictureHtml;
    }

    newChildren.push({
      type: 'html',
      value: finalHtml,
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
        className: [shortcode + `-wrapper shortcode`],
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
      hName: 'summary',
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
      hName: 'details',
      hProperties: {
        className: [shortcode + `-wrapper shortcode`],
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

  // Разбор контента на изображения и подписи
  for (const line of lines) {
    if (line.startsWith('url:')) {
      if (current.url) images.push(current);
      current = { url: line.slice(4).trim(), alt: '' };
    } else if (line.startsWith('alt:')) {
      current.alt = line.slice(4).trim();
    }
  }
  if (current.url) images.push(current);

  // Подготовка картинок с ресайзом и srcset
  function prepareImage(img) {
    try {
      const urlObj = new URL(img.url);

      let w = parseInt(urlObj.searchParams.get('w'), 10);
      let h = parseInt(urlObj.searchParams.get('h'), 10);

      if (!w || !h) {
        return { src: img.url, alt: img.alt ?? '', srcset: '' };
      }

      // Если ширина больше 891, ограничиваем
      if (w > 891) {
        const ratio = h / w;
        w = 891;
        h = Math.round(w * ratio);
      }

      // Основной src
      urlObj.searchParams.set('w', w);
      urlObj.searchParams.set('h', h);
      urlObj.searchParams.set('crop', 1);
      const src = urlObj.toString();

      // Srcset варианты: 382, 690, 891
      const srcsetWidths = [382, 690, 891];
      const srcset = srcsetWidths
        .map((sw) => {
          const sh = Math.round(sw * (h / w));
          const u = new URL(img.url);
          u.searchParams.set('w', sw);
          u.searchParams.set('h', sh);
          u.searchParams.set('crop', 1);
          return `${u.toString()} ${sw}w`;
        })
        .join(', ');

      return { src, alt: img.alt ?? '', srcset };
    } catch (e) {
      return { src: img.url, alt: img.alt ?? '', srcset: '' };
    }
  }

  const mainSlides = images
    .map((img) => {
      const { src, alt, srcset } = prepareImage(img);
      return `<li class="splide__slide not-prose relative">
  <img data-lightbox="${src.split('?')[0]}" src="${src}" ${srcset ? `srcset="${srcset}" sizes="(max-width: 891px) 100vw, 891px"` : ''} alt="${alt}" />
  ${alt ? `<div class="caption not-prose">${alt}</div>` : ''}
</li>`;
    })
    .join('\n');

  // Миниатюры
  const thumbSlides = images
    .map((img) => {
      const u = new URL(img.url);
      u.searchParams.set('w', 120);
      u.searchParams.set('h', 80);
      u.searchParams.set('crop', 1);
      return `<li class="splide__slide not-prose">
  <img src="${u.toString()}" alt="${img.alt ?? ''}" />
</li>`;
    })
    .join('\n');

  newChildren.push({
    type: 'html',
    value: `
<div id="main-slider" class="splide not-prose" aria-label="Фотогалерея"
     data-splide='{"type":"fade","rewind":true,"pagination":false,"arrows":true}'>
  <div class="splide__track not-prose">
    <ul class="splide__list not-prose">
      ${mainSlides}
    </ul>
  </div>
</div>

<div id="thumbs" class="splide is-nav not-prose" aria-label="Миниатюры"
     data-splide='{"fixedWidth":100,"fixedHeight":70,"gap":8,"rewind":true,"pagination":false,"arrows":false,"isNavigation":true,"focus":"center"}'>
  <div class="splide__track not-prose">
    <ul class="splide__list not-prose">
      ${thumbSlides}
    </ul>
  </div>
</div>
`,
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
