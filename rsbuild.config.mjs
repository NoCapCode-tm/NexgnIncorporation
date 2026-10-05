import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: 'Nexgn | The Modern Agreement Platform',
  },
  output: {
    assetPrefix: '/', 
  },
  performance: {
    // Splits React, Router, and large libraries into a separate cached chunk
    chunkSplit: {
      strategy: 'split-by-experience',
    },
    // Automatically removes unused CSS and JS
    removeConsole: process.env.NODE_ENV === 'production' ? ['log', 'warn'] : false,
  },
});