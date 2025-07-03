import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    target: "esnext", // 面向现代浏览器
    minify: "terser", // 使用 Terser 高级压缩
    sourcemap: false, // 生产环境关闭 sourcemap
    cssCodeSplit: true, // CSS 代码分割
    reportCompressedSize: false, // 关闭压缩大小报告提升速度

    terserOptions: {
      compress: {
        drop_console: true, // 移除 console
        drop_debugger: true, // 移除 debugger
      },
    },

    rollupOptions: {
      output: {
        manualChunks(id) {
          // 拆包策略
          if (id.includes("node_modules")) {
            const lib = id.match(/node_modules\/(.+?)[/]/)?.[1];
            return lib || "vendor";
          }
        },
        chunkFileNames: "assets/[hash].js",
        assetFileNames: "assets/[hash][extname]",
      },
    },
  },
});
