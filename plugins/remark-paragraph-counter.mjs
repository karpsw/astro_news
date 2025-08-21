import { visitParents } from 'unist-util-visit-parents';

export default function remarkParagraphCounter() {
  return (tree) => {
    let counter = 0;

    visitParents(tree, 'paragraph', (node, ancestors) => {
      // Игнорируем параграфы, у которых есть "блокирующие" родители
      // В данном случае считаем только параграфы, у которых parent = root
      if (ancestors.length > 1) return;

      counter++;

      if (!node.data) node.data = {};
      if (!node.data.hProperties) node.data.hProperties = {};

      node.data.hProperties.id = `p-${counter}`;
    });
  };
}
