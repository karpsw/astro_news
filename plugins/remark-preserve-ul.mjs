import { visit } from 'unist-util-visit';

export default function remarkPreserveLists() {
  return (tree) => {
    visit(tree, 'list', (node) => {
      // Явно помечаем списки, чтобы они не преобразовывались в pre
      if (!node.data) node.data = {};
      node.data._preserve = true;
    });

    visit(tree, 'listItem', (node) => {
      if (!node.data) node.data = {};
      node.data._preserve = true;
    });
  };
}
