import { visit } from 'unist-util-visit';

export default function remarkTableWrapper() {
  return (tree) => {
    visit(tree, 'table', (node, index, parent) => {
      // Создаем div обертку
      const wrapper = {
        type: 'div',
        data: {
          hName: 'div',
          hProperties: {
            className: ['responsive-table'],
          },
        },
        children: [node],
      };

      // Заменяем таблицу на обертку с таблицей внутри
      parent.children[index] = wrapper;
    });
  };
}
