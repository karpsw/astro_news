import { visit } from 'unist-util-visit';

export default function remarkEmbed() {
  return (tree) => {
    visit(tree, 'link', (node, index, parent) => {
      const url = node.url;

      let html = null;

      // YouTube
      const ytMatch = url.match(/youtube\.com\/watch\?v=([\w-]+)/);
      if (ytMatch) {
        const videoId = ytMatch[1];
        html = `<iframe width="100%" height="400"
          src="https://www.youtube.com/embed/${videoId}"
          frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen loading="lazy"></iframe>`;
      }

      if (html) {
        parent.children[index] = {
          type: 'html',
          value: html,
        };
      }
    });
  };
}
