import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";

function resolve(dir = "") {
  return path.resolve(__dirname, ".", dir);
}
// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/chatroom/" : "/",
  css: {
    // css模块化，文件以.module.[css|less|scss]结尾，否则不生效的
    modules: {
      /**
       * 配置 CSS modules 的行为。选项将被传递给 postcss-modules。
       * 默认：'camelCaseOnly'。
       * 'camelCase' | 'camelCaseOnly' | 'dashes' | 'dashesOnly'
       * */
      localsConvention: "camelCase",
    },
  },
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve("./src"),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".vue", ".json"],
  },
  build: {
    outDir: resolve("../service/chatroom"),
  },
  server: {
    open: true,
    port: 5173,
    host: "0.0.0.0",
  },
});
