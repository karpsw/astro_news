import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

function remarkShortcodesTransform() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      const shortcodeRegex = /\[(\w+)(?:\s+([^\]]+))?\](.*?)\[\/\1\]|\[(\w+)(?:\s+([^\]]+))?\]/gs;
      let match;
      let nodesToAdd = [];
      let lastIndex = 0;
      let text = node.value;
      let hasMatch = false;

      while ((match = shortcodeRegex.exec(text)) !== null) {
        hasMatch = true;
        const [fullMatch, tag1, attrs1, content1, tag2, attrs2] = match;
        const tag = tag1 || tag2;
        const attrs = attrs1 || attrs2;
        const content = content1;

        const beforeText = text.slice(lastIndex, match.index);
        if (beforeText.trim()) {
          nodesToAdd.push({ type: 'text', value: beforeText });
        }

        let processedContent = null;
        switch (tag) {
          case 'infp':
            processedContent = handleShortcode(
              content,
              attrs,
              (c) => `<div class="infp">${c}</div>`
            );
            break;
          case 'infb':
            processedContent = handleShortcode(
              content,
              attrs,
              (c) => `<div class="alert--info">${c}</div>`
            );
            break;
          case 'infg':
            processedContent = handleShortcode(
              content,
              attrs,
              (c) => `<div class="infg">${c}</div>`
            );
            break;
          case 'inf':
            processedContent = handleShortcode(
              content,
              attrs,
              (c) => `<div class="inf">${c}</div>`
            );
            break;
          case 'scryt_b':
            const title = parseAttributes(attrs).title || 'Скрытый блок';
            processedContent = handleShortcode(
              content,
              attrs,
              (c) =>
                `<div class="scryt-b"><div class="scryt-title">${title}</div><div class="scryt-content">${c}</div></div>`
            );
            break;
          case 'obnovleno_b':
            processedContent = handleShortcode(
              content,
              attrs,
              (c) => `<div class="alert--warning">${c}</div>`
            );
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
            processedContent = { type: 'html', value: fullMatch };
        }

        if (processedContent) {
          nodesToAdd.push(processedContent);
        }

        lastIndex = match.index + fullMatch.length;
      }

      const afterText = text.slice(lastIndex);
      if (afterText.trim()) {
        nodesToAdd.push({ type: 'text', value: afterText });
      }

      if (hasMatch) {
        if (nodesToAdd.length > 0) {
          parent.children.splice(index, 1, ...nodesToAdd);
        } else {
          parent.children.splice(index, 1);
        }
      }
    });
  };
}

function handleShortcode(content, attrs, template) {
  if (!content?.trim()) return null;
  const htmlContent = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .processSync(content)
    .toString();
  return { type: 'html', value: template(htmlContent) };
}

// ... (остальные функции-обработчики handleInfb, handlePostimage и т.д. остаются без изменений) ...

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
  return { type: 'html', value: '' };
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

export default function remarkShortcodes() {
  return (tree, file) => {
    // Выполняем преобразование шорткодов
    remarkShortcodesTransform()(tree, file);

    // Удаляем пустые узлы параграфов в самом конце
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

    // Добавляем ID к оставшимся параграфам
    let counter = 0;
    visit(tree, 'paragraph', (node) => {
      counter++;
      if (!node.data) {
        node.data = {};
      }
      if (!node.data.hProperties) {
        node.data.hProperties = {};
      }
      node.data.hProperties.id = `p-${counter}`;
    });
  };
}
