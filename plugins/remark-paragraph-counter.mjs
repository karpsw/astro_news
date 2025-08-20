import { visit } from 'unist-util-visit';

export default function remarkParagraphCounter() {
  return (tree) => {
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
