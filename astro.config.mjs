import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://disclosure.zone',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  markdown: { shikiConfig: { theme: 'github-dark' } },
});
