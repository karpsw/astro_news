// remark-rek-internal.js
import { visit } from 'unist-util-visit';

export default function remarkRekInternal() {
  return (tree) => {
    visit(tree, 'paragraph', (node) => {
      if (node.children.length !== 1) return;

      const only = node.children[0];
      if (only.type !== 'link') return;

      const href = only.url;
      if (
        typeof href === 'string' &&
        (href === 'https://telegraf.news' || href.startsWith('https://telegraf.news/'))
      ) {
        if (!only.data) only.data = {};
        if (!only.data.hProperties) only.data.hProperties = {};

        const props = only.data.hProperties;
        if (!props.className) {
          props.className = ['rek_internal'];
        } else if (Array.isArray(props.className)) {
          if (!props.className.includes('rek_internal')) {
            props.className.push('rek_internal');
          }
        } else if (typeof props.className === 'string') {
          const parts = props.className.split(/\s+/);
          if (!parts.includes('rek_internal')) {
            parts.push('rek_internal');
            props.className = parts;
          }
        }
      }
    });
  };
}
