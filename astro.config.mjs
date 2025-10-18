import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://alyonka-teatr-stavropol.ru',
  output: 'static',
  integrations: [
    tailwind({
      applyBaseStyles: true
    }),
    sitemap()
  ]
});
