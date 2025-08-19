import remarkHtml from 'remark-html';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

// Основная функция обработки шорткодов
function baseShortcodeProcessor() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      const shortcodeRegex = /\[(\w+)(?:\s+([^\]]+))?\](.*?)\[\/\1\]|\[(\w+)(?:\s+([^\]]+))?\]/gs;
      let match;
      let newNodes = [];
      let lastIndex = 0;
      let text = node.value;

      // Пропускаем пустые текстовые узлы
      if (!text.trim()) return;

      while ((match = shortcodeRegex.exec(text)) !== null) {
        const [fullMatch, tag1, attrs1, content1, tag2, attrs2] = match;
        const tag = tag1 || tag2;
        const attrs = attrs1 || attrs2;
        const content = content1;

        // Текст до шорткода (только если не пустой)
        if (match.index > lastIndex) {
          const beforeText = text.slice(lastIndex, match.index);
          if (beforeText.trim()) {
            newNodes.push({
              type: 'text',
              value: beforeText,
            });
          }
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

      // Текст после последнего шорткода (только если не пустой)
      if (lastIndex < text.length) {
        const afterText = text.slice(lastIndex);
        if (afterText.trim()) {
          newNodes.push({
            type: 'text',
            value: afterText,
          });
        }
      }

      // Заменяем оригинальный узел новыми узлами только если есть изменения
      if (newNodes.length > 0) {
        parent.children.splice(index, 1, ...newNodes);
      }
    });
  };
}

// Упрощенная обработка галереи
function handleGalleryContent() {
  return (tree) => {
    visit(tree, 'html', (node, index, parent) => {
      if (node.value === '<!-- GALLERY_PLACEHOLDER -->') {
        // Ищем следующий узел с содержимым галереи
        let galleryItems = [];
        let nextIndex = index + 1;

        while (nextIndex < parent.children.length) {
          const nextNode = parent.children[nextIndex];
          if (nextNode.type === 'text' && nextNode.value.includes('- url:')) {
            const items = parseGalleryContent(nextNode.value);
            galleryItems = galleryItems.concat(items);
            // Удаляем обработанный узел
            parent.children.splice(nextIndex, 1);
          } else {
            break;
          }
        }

        if (galleryItems.length > 0) {
          const galleryHtml = galleryItems
            .map(
              (item) =>
                `<div class="gallery-item"><img src="${item.url}" alt="${item.caption}"><div class="gallery-caption">${item.caption}</div></div>`
            )
            .join('');

          parent.children[index] = {
            type: 'html',
            value: `<div class="gallery">${galleryHtml}</div>`,
          };
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

    // Удаляем пустые paragraph узлы
    visit(tree, 'paragraph', (node, index, parent) => {
      const hasContent = node.children.some((child) => {
        if (child.type === 'text') return child.value.trim().length > 0;
        if (child.type === 'html') return child.value.trim().length > 0;
        return true;
      });

      if (!hasContent) {
        parent.children.splice(index, 1);
      }
    });
  };
}

// Функции-обработчики
function handleInfp(content, attrs) {
  if (!content?.trim()) return null;

  const htmlContent = unified().use(remarkParse).use(remarkHtml).processSync(content).toString();

  return {
    type: 'html',
    value: `<div class="infp">${htmlContent}</div>`,
  };
}

function handleInfb(content, attrs) {
  if (!content?.trim()) return null;

  const htmlContent = unified().use(remarkParse).use(remarkHtml).processSync(content).toString();

  return {
    type: 'html',
    value: `<div class="alert--info">${htmlContent}</div>`,
  };
}

function handleInfg(content, attrs) {
  if (!content?.trim()) return null;

  const htmlContent = unified().use(remarkParse).use(remarkHtml).processSync(content).toString();

  return {
    type: 'html',
    value: `<div class="infg">${htmlContent}</div>`,
  };
}

function handleInf(content, attrs) {
  if (!content?.trim()) return null;

  const htmlContent = unified().use(remarkParse).use(remarkHtml).processSync(content).toString();

  return {
    type: 'html',
    value: `<div class="inf">${htmlContent}</div>`,
  };
}

function handleScrytB(content, attrs) {
  if (!content?.trim()) return null;

  const params = parseAttributes(attrs);
  const title = params.title ? params.title.trim() : 'Скрытый блок';
  const htmlContent = unified().use(remarkParse).use(remarkHtml).processSync(content).toString();

  return {
    type: 'html',
    value: `<div class="scryt-b"><div class="scryt-title">${title}</div><div class="scryt-content">${htmlContent}</div></div>`,
  };
}

function handleObnovlenoB(content, attrs) {
  if (!content?.trim()) return null;

  const htmlContent = unified().use(remarkParse).use(remarkHtml).processSync(content).toString();

  return {
    type: 'html',
    value: `<div class="alert--warning">${htmlContent}</div>`,
  };
}

function handlePostimage(attrs) {
  const params = parseAttributes(attrs);
  const id = params.id || '';
  if (!id) return null;

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
  if (!url) return null;

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
  } else if (url.includes('threads.com')) {
    return {
      type: 'html',
      value: `<div class="vidget-threads"><iframe src="${getThreadsEmbedUrl(url)}" loading="lazy" allowfullscreen></iframe></div>`,
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
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('- url:')) {
      const urlMatch = trimmedLine.match(/url:\s*([^\s]+)/);
      const captionMatch = trimmedLine.match(/caption:\s*([^"]+)/);

      if (urlMatch && urlMatch[1]) {
        items.push({
          url: urlMatch[1].trim(),
          caption: captionMatch ? captionMatch[1].trim() : '',
        });
      }
    }
  }

  return items;
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
  const videoId = url.split('/video/')[1]?.split('?')[0];
  return videoId ? `https://www.tiktok.com/embed/v2/${videoId}` : url;
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
  const postId = url.split('/').pop();
  return postId ? `https://t.me/${postId}` : url;
}

function getThreadsEmbedUrl(url) {
  return `https://www.threads.com/embed/post/${url.split('/post/')[1]?.split('?')[0]}`;
}
