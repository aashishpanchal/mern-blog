import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "../server/public",
  },
  server: {
    proxy: {
      "/api/v1": {
        target: "http://127.0.0.1:3000", // node backend app
        changeOrigin: true,
      },
    },
  },
});
