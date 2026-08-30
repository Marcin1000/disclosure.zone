import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://disclosure.zone',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  markdown: { shikiConfig: { theme: 'github-dark' } },
  integrations: [
    sitemap({ filter: page => !page.includes('/og/') }),
  ],
});
