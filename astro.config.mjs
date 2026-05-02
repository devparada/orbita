// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://orbita.devparada.dev",
  output: "server",
  integrations: [react(), sitemap()],
  adapter: vercel(),
  vite: {
    build: {
      chunkSizeWarningLimit: 1000,
    },
  },
});
