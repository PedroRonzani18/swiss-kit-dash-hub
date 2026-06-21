import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean,
  ),
  preview: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 4173,
    allowedHosts: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return undefined;
          }

          if (/[\\/]node_modules[\\/]@radix-ui[\\/]/.test(id)) {
            return "vendor-radix";
          }

          if (/[\\/]node_modules[\\/]@tanstack[\\/]react-query[\\/]/.test(id)) {
            return "vendor-query";
          }

          if (
            /[\\/]node_modules[\\/](react-router|react-router-dom|@remix-run[\\/]router)[\\/]/.test(
              id,
            )
          ) {
            return "vendor-router";
          }

          if (/[\\/]node_modules[\\/](recharts|d3-[^\\/]+)[\\/]/.test(id)) {
            return "vendor-charts";
          }

          if (/[\\/]node_modules[\\/]lucide-react[\\/]/.test(id)) {
            return "vendor-icons";
          }

          if (/[\\/]node_modules[\\/]date-fns[\\/]/.test(id)) {
            return "vendor-date";
          }

          if (/[\\/]node_modules[\\/]zod[\\/]/.test(id)) {
            return "vendor-zod";
          }

          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) {
            return "vendor-react";
          }

          return undefined;
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@swisskit/contracts/core": path.resolve(__dirname, "../../packages/contracts/src/core.ts"),
      "@swisskit/contracts": path.resolve(__dirname, "../../packages/contracts/src/index.ts"),
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
    ],
  },
}));
