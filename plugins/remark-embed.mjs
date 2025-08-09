import { visit } from 'unist-util-visit';

export default function remarkEmbed() {
  return (tree) => {
    visit(tree, 'link', (node, index, parent) => {
      const label = node.title || node.children?.[0]?.value;
      if (label === 'Embedded content') {
        parent.children[index] = {
          type: 'html',
          value: `<iframe src="${node.url}" loading="lazy" allow="fullscreen" style="width:100%; height:400px; border:none;"></iframe>`,
        };
      }
    });
  };
}
