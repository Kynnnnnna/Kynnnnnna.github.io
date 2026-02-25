import { defineConfig } from "vite";
import { resolve } from "path";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
  base: "/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about/index.html'),
        artbook: resolve(__dirname, 'artbook/index.html'),
        blog: resolve(__dirname, 'blog/index.html'),
        projects: resolve(__dirname, 'projects/index.html'),
        projectDetail: resolve(__dirname, 'project/index.html'),
        notFound: resolve(__dirname, '404.html') // Let Vite build the 404 page
      }
    }
  },
  plugins: [
    ViteImageOptimizer({
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      png: { quality: 85 },
      webp: { lossless: true },
    }),
  ],
});