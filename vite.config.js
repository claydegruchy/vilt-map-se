import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.geojson'],

  plugins: [svelte()],
  base: "/vilt-map-se/",
  resolve: {
    alias: {
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@base': path.resolve(__dirname, 'src'),
    },
  },
})
