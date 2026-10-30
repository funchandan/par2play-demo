import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.VITE_BASE || "/",
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(fileURLToPath(new URL(".", import.meta.url)), "index.html"),
        membership: resolve(fileURLToPath(new URL(".", import.meta.url)), "membership/index.html"),
        coaching: resolve(fileURLToPath(new URL(".", import.meta.url)), "coaching/index.html"),
        juniors: resolve(fileURLToPath(new URL(".", import.meta.url)), "juniors/index.html"),
        events: resolve(fileURLToPath(new URL(".", import.meta.url)), "events/index.html"),
        tournament: resolve(fileURLToPath(new URL(".", import.meta.url)), "tournament/index.html"),
        privacy: resolve(fileURLToPath(new URL(".", import.meta.url)), "privacy-policy/index.html"),
        notfound: resolve(fileURLToPath(new URL(".", import.meta.url)), "404.html"),
      },
    },
  },
});
