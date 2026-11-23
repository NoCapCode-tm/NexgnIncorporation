import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginImageCompress } from '@rsbuild/plugin-image-compress';

export default defineConfig({
  plugins: [
    pluginReact(),
    // Auto-converts PNG/JPEG → compressed WebP at build time (60-80% smaller)
    pluginImageCompress([
      { use: 'jpeg', quality: 85 },
      { use: 'png',  quality: 85 },
      { use: 'webp', quality: 82 },
    ]),
  ],
  html: {
    title: 'Nexgn | The Modern Agreement Platform',
  },
  output: {
    assetPrefix: '/',
  },
  performance: {
    chunkSplit: {
      strategy: 'split-by-experience',
      forceSplitting: {
        'vendor-gsap':       /node_modules\/gsap/,
        'vendor-motion':     /node_modules\/motion/,
        'vendor-lucide':     /node_modules\/lucide-react/,
        'vendor-react-icons':/node_modules\/react-icons/,
        'vendor-i18n':       /node_modules\/(i18next|react-i18next)/,
      },
    },
    removeConsole: process.env.NODE_ENV === 'production' ? ['log', 'warn'] : false,
  },
});