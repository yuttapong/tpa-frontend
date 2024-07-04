// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { resolve } from "path";
import { defineConfig } from "file:///G:/project/tpa-frontend/node_modules/.pnpm/vite@5.2.12_sass@1.77.2/node_modules/vite/dist/node/index.js";
import vue from "file:///G:/project/tpa-frontend/node_modules/.pnpm/@vitejs+plugin-vue@5.0.4_vite@5.2.12_sass@1.77.2__vue@3.4.27/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import VueDevTools from "file:///G:/project/tpa-frontend/node_modules/.pnpm/vite-plugin-vue-devtools@7.2.1_rollup@4.18.0_vite@5.2.12_sass@1.77.2__vue@3.4.27/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import dotenv from "file:///G:/project/tpa-frontend/node_modules/.pnpm/dotenv@16.4.5/node_modules/dotenv/lib/main.js";
import dv from "file:///G:/project/tpa-frontend/node_modules/.pnpm/dotenv-expand@11.0.6/node_modules/dotenv-expand/lib/main.js";
var __vite_injected_original_dirname = "G:\\project\\tpa-frontend";
var __vite_injected_original_import_meta_url = "file:///G:/project/tpa-frontend/vite.config.js";
dv.expand(dotenv.config());
console.log("ENV", process.env.VITE_ENV);
var baseUrl = process.env.VITE_ENV === "development" ? process.env.VITE_DEV_BASE_URL : process.env.VITE_BASE_URL;
console.log("URL", baseUrl);
var vite_config_default = defineConfig({
  plugins: [vue(), VueDevTools()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)),
      "~bootstrap": resolve(__vite_injected_original_dirname, "node_modules/bootstrap")
    }
  },
  base: baseUrl
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJHOlxcXFxwcm9qZWN0XFxcXHRwYS1mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRzpcXFxccHJvamVjdFxcXFx0cGEtZnJvbnRlbmRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0c6L3Byb2plY3QvdHBhLWZyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IFZ1ZURldlRvb2xzIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1kZXZ0b29scydcclxuaW1wb3J0IGRvdGVudiBmcm9tICdkb3RlbnYnXHJcbmltcG9ydCBkdiBmcm9tICdkb3RlbnYtZXhwYW5kJ1xyXG5kdi5leHBhbmQoZG90ZW52LmNvbmZpZygpKVxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5cclxuY29uc29sZS5sb2coJ0VOVicsIHByb2Nlc3MuZW52LlZJVEVfRU5WKVxyXG5cclxuY29uc3QgYmFzZVVybCA9XHJcbiAgcHJvY2Vzcy5lbnYuVklURV9FTlYgPT09ICdkZXZlbG9wbWVudCcgPyBwcm9jZXNzLmVudi5WSVRFX0RFVl9CQVNFX1VSTCA6IHByb2Nlc3MuZW52LlZJVEVfQkFTRV9VUkxcclxuY29uc29sZS5sb2coJ1VSTCcsIGJhc2VVcmwpXHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFt2dWUoKSwgVnVlRGV2VG9vbHMoKV0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSksXHJcbiAgICAgICd+Ym9vdHN0cmFwJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdub2RlX21vZHVsZXMvYm9vdHN0cmFwJyksXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgYmFzZTogYmFzZVVybCxcclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2UCxTQUFTLGVBQWUsV0FBVztBQUNoUyxTQUFTLGVBQWU7QUFDeEIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sWUFBWTtBQUNuQixPQUFPLFFBQVE7QUFOZixJQUFNLG1DQUFtQztBQUFrSCxJQUFNLDJDQUEyQztBQU81TSxHQUFHLE9BQU8sT0FBTyxPQUFPLENBQUM7QUFHekIsUUFBUSxJQUFJLE9BQU8sUUFBUSxJQUFJLFFBQVE7QUFFdkMsSUFBTSxVQUNKLFFBQVEsSUFBSSxhQUFhLGdCQUFnQixRQUFRLElBQUksb0JBQW9CLFFBQVEsSUFBSTtBQUN2RixRQUFRLElBQUksT0FBTyxPQUFPO0FBRTFCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDO0FBQUEsRUFDOUIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxNQUNwRCxjQUFjLFFBQVEsa0NBQVcsd0JBQXdCO0FBQUEsSUFDM0Q7QUFBQSxFQUNGO0FBQUEsRUFDQSxNQUFNO0FBQ1IsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
