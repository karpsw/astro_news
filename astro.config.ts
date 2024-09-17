import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';

// must use relative imports, and their entire import subtrees
import { remarkReadingTime } from './plugins/remark-reading-time.mjs';
//
// all relative imports in subtree
// any of these files must not import CONFIG with env vars
import { envSchema, PROCESS_ENV } from './src/config/process-env';
import { expressiveCodeIntegration } from './src/libs/integrations/expressive-code';
import { sitemapIntegration } from './src/libs/integrations/sitemap';

import node from '@astrojs/node';

const { SITE_URL } = PROCESS_ENV;
const remarkPlugins = [remarkReadingTime];

export default defineConfig({
  output: 'hybrid',
  site: SITE_URL,
  experimental: { env: envSchema },
  trailingSlash: 'ignore',

  // default
  compressHTML: true,

  server: { port: 4000, host:true },
  devToolbar: { enabled: false },

  integrations: [
    expressiveCodeIntegration(),
    sitemapIntegration(),
    react(),
    mdx(),
    // applyBaseStyles: false prevents double loading of tailwind
    tailwind({ applyBaseStyles: false }),
    icon({ iconDir: 'src/assets/icons' }),
    partytown({
      config: { forward: ['dataLayer.push'] },
    }),
  ],

  markdown: { remarkPlugins },

  vite: {
    build: {
      sourcemap: false,
    },
  },

  adapter: node({
    mode: 'standalone',
  }),

  prefetch: {
    prefetchAll: false
  }
});