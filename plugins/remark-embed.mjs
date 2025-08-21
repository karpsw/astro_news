import { visit } from 'unist-util-visit';

export default function remarkEmbed() {
  return (tree) => {
    visit(tree, 'paragraph', (node, index, parent) => {
      if (!node.children || node.children.length !== 1) return;

      const child = node.children[0];
      if (child.type !== 'link') return;

      const url = child.url;
      let html = null;

      // YouTube
      const ytMatch = url.match(/youtube\.com\/watch\?v=([\w-]+)/);
      if (ytMatch) {
        const videoId = ytMatch[1];
        html = `<div class="widget-youtube">
  <iframe class="youtube-embed"
    src="https://www.youtube.com/embed/${videoId}"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
    loading="lazy"></iframe>
</div>`;
      }

      if (html) {
        // Заменяем весь параграф на HTML
        parent.children[index] = {
          type: 'html',
          value: html,
        };
      }
    });
  };
}
