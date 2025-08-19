import remarkHtml from 'remark-html';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

// Основная функция обработки шорткодов
function baseShortcodeProcessor() {
  return (tree) => {
    // Обрабатываем все шорткоды в текстовых узлах
    visit(tree, 'text', (node, index, parent) => {
      const shortcodeRegex = /\[(\w+)(?:\s+([^\]]+))?\](.*?)\[\/\1\]|\[(\w+)(?:\s+([^\]]+))?\]/gs;
      let match;
      let newNodes = [];
      let lastIndex = 0;
      let text = node.value;

      while ((match = shortcodeRegex.exec(text)) !== null) {
        const [fullMatch, tag1, attrs1, content1, tag2, attrs2] = match;
        const tag = tag1 || tag2;
        const attrs = attrs1 || attrs2;
        const content = content1;

        // Текст до шорткода
        if (match.index > lastIndex) {
          newNodes.push({
            type: 'text',
            value: text.slice(lastIndex, match.index),
          });
        }

        // Обрабатываем разные типы шорткодов
        let processedContent = null;

        switch (tag) {
          case 'infp':
            processedContent = handleInfp(content, attrs);
            break;
          case 'infb':
            processedContent = handleInfb(content, attrs);
            break;
          case 'infg':
            processedContent = handleInfg(content, attrs);
            break;
          case 'inf':
            processedContent = handleInf(content, attrs);
            break;
          case 'scryt_b':
            processedContent = handleScrytB(content, attrs);
            break;
          case 'obnovleno_b':
            processedContent = handleObnovlenoB(content, attrs);
            break;
          case 'postimage':
            processedContent = handlePostimage(attrs);
            break;
          case 'gallery':
            processedContent = handleGallery(attrs);
            break;
          case 'Vidget':
            processedContent = handleVidget(attrs);
            break;
          default:
            // Для неизвестных шорткодов оставляем как есть
            processedContent = {
              type: 'html',
              value: fullMatch,
            };
        }

        if (processedContent) {
          newNodes.push(processedContent);
        }

        lastIndex = match.index + fullMatch.length;
      }

      // Текст после последнего шорткода
      if (lastIndex < text.length) {
        newNodes.push({
          type: 'text',
          value: text.slice(lastIndex),
        });
      }

      // Заменяем оригинальный узел новыми узлами
      if (newNodes.length > 0) {
        parent.children.splice(index, 1, ...newNodes);
      }
    });
  };
}

// Функция для обработки содержимого галереи
function handleGalleryContent() {
  return (tree) => {
    visit(tree, 'html', (node, index, parent) => {
      if (node.value === '<!-- GALLERY_PLACEHOLDER -->') {
        // Ищем следующий узел с содержимым галереи
        const nextNode = parent.children[index + 1];
        if (nextNode && nextNode.type === 'text') {
          const galleryContent = parseGalleryContent(nextNode.value);
          parent.children[index] = {
            type: 'html',
            value: galleryContent,
          };
          // Удаляем узел с содержимым галереи
          parent.children.splice(index + 1, 1);
        }
      }
    });
  };
}

// Основная экспортируемая функция
export default function remarkShortcodes() {
  return (tree) => {
    // Сначала обрабатываем основные шорткоды
    baseShortcodeProcessor()(tree);
    // Затем обрабатываем содержимое галереи
    handleGalleryContent()(tree);
  };
}

// Функции-обработчики для разных типов шорткодов
function handleInfp(content, attrs) {
  const htmlContent = unified().use(remarkParse).use(remarkHtml).processSync(content).toString();

  return {
    type: 'html',
    value: `<div class="infp">${htmlContent}</div>`,
  };
}

function handleInfb(content, attrs) {
  const htmlContent = unified().use(remarkParse).use(remarkHtml).processSync(content).toString();

  return {
    type: 'html',
    value: `<div class="infb">${htmlContent}</div>`,
  };
}

function handleInfg(content, attrs) {
  const htmlContent = unified().use(remarkParse).use(remarkHtml).processSync(content).toString();

  return {
    type: 'html',
    value: `<div class="infg">${htmlContent}</div>`,
  };
}

function handleInf(content, attrs) {
  const htmlContent = unified().use(remarkParse).use(remarkHtml).processSync(content).toString();

  return {
    type: 'html',
    value: `<div class="inf">${htmlContent}</div>`,
  };
}

function handleScrytB(content, attrs) {
  const params = parseAttributes(attrs);
  const title = params.title ? params.title.trim() : 'Скрытый блок';
  const htmlContent = unified().use(remarkParse).use(remarkHtml).processSync(content).toString();

  return {
    type: 'html',
    value: `<div class="scryt-b"><div class="scryt-title">${title}</div><div class="scryt-content">${htmlContent}</div></div>`,
  };
}

function handleObnovlenoB(content, attrs) {
  const htmlContent = unified().use(remarkParse).use(remarkHtml).processSync(content).toString();

  return {
    type: 'html',
    value: `<div class="obnovleno-b">${htmlContent}</div>`,
  };
}

function handlePostimage(attrs) {
  const params = parseAttributes(attrs);
  const id = params.id || '';
  const caption = params.caption ? `<div class="postimage-caption">${params.caption}</div>` : '';
  const align = params.align ? ` style="text-align: ${params.align}"` : '';

  return {
    type: 'html',
    value: `<div class="postimage"${align}><img src="/api/images/${id}" alt="${params.caption || ''}"/>${caption}</div>`,
  };
}

function handleGallery(attrs) {
  return {
    type: 'html',
    value: '<!-- GALLERY_PLACEHOLDER -->',
  };
}

function handleVidget(attrs) {
  const params = parseAttributes(attrs);
  const url = params.url || '';

  if (url.includes('tiktok.com')) {
    return {
      type: 'html',
      value: `<div class="vidget-tiktok"><iframe src="${getTikTokEmbedUrl(url)}" loading="lazy" allowfullscreen></iframe></div>`,
    };
  } else if (url.includes('x.com') || url.includes('twitter.com')) {
    return {
      type: 'html',
      value: `<div class="vidget-twitter"><iframe src="${getTwitterEmbedUrl(url)}" loading="lazy" allowfullscreen></iframe></div>`,
    };
  } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return {
      type: 'html',
      value: `<div class="vidget-youtube"><iframe src="${getYouTubeEmbedUrl(url)}" loading="lazy" allowfullscreen></iframe></div>`,
    };
  } else if (url.includes('t.me')) {
    return {
      type: 'html',
      value: `<div class="vidget-telegram"><iframe src="${getTelegramEmbedUrl(url)}" loading="lazy" allowfullscreen></iframe></div>`,
    };
  } else {
    return {
      type: 'html',
      value: `<div class="vidget-generic"><iframe src="${url}" loading="lazy" allowfullscreen></iframe></div>`,
    };
  }
}

function parseGalleryContent(content) {
  const items = [];
  const lines = content.split('\n');

  for (const line of lines) {
    if (line.trim().startsWith('- url:')) {
      const urlMatch = line.match(/url:\s*([^\s]+)/);
      const captionMatch = line.match(/caption:\s*([^"]+)/);

      if (urlMatch) {
        items.push({
          url: urlMatch[1],
          caption: captionMatch ? captionMatch[1] : '',
        });
      }
    }
  }

  const galleryHtml = items
    .map(
      (item) =>
        `<div class="gallery-item"><img src="${item.url}" alt="${item.caption}"><div class="gallery-caption">${item.caption}</div></div>`
    )
    .join('');

  return `<div class="gallery">${galleryHtml}</div>`;
}

// Вспомогательная функция для парсинга атрибутов
function parseAttributes(attrsString) {
  if (!attrsString) return {};

  const params = {};
  const regex = /(\w+)=["']([^"']+)["']/g;
  let match;

  while ((match = regex.exec(attrsString)) !== null) {
    params[match[1]] = match[2];
  }

  return params;
}

// Функции для получения embed URL
function getTikTokEmbedUrl(url) {
  return `https://www.tiktok.com/embed/v2/${url.split('/video/')[1]?.split('?')[0]}`;
}

function getTwitterEmbedUrl(url) {
  return `https://platform.twitter.com/embed/Tweet.html?url=${encodeURIComponent(url)}`;
}

function getYouTubeEmbedUrl(url) {
  const videoId = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
}

function getTelegramEmbedUrl(url) {
  return `https://t.me/${url.split('/').pop()}`;
}
