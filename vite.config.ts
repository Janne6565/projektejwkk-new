import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ["gsap", "gsap/ScrollTrigger", "@gsap/react"],
          "radix-ui": ["radix-ui"],
          i18n: ["i18next", "react-i18next", "i18next-browser-languagedetector"],
          query: ["@tanstack/react-query"],
        },
      },
    },
  },
})
