import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://disclosure.zone',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  markdown: {
    shikiConfig: { theme: 'github-dark' },
    // Proste cudzysłowy zamieniamy na typograficzne, ale „--” i „...” zostają tak, jak stoją
    // w cytowanym dokumencie. Te same cytaty we frontmatterze i w src/data nie przechodzą
    // przez Markdown, więc zamiana w treści pokazywałaby jedną frazę na dwa sposoby
    processor: satteri({ features: { smartPunctuation: { dashes: false, ellipses: false } } }),
  },
  integrations: [
    sitemap({ filter: page => !page.includes('/og/') }),
  ],
});
