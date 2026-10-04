import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: 'Nexgn | The Modern Agreement Platform',
    meta: {
      description: 'Create, sign, automate, and trust agreements securely.',
    },
  },
  output: {
    assetPrefix: '/', // Change to '/nexgn/' if not using a custom domain on GH Pages
  },
});