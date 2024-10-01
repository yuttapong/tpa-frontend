// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { resolve } from "path";
import { defineConfig } from "file:///E:/project/_work/tpa-frontend/tpa-frontend-starter/node_modules/.pnpm/vite@5.4.7_sass@1.79.3/node_modules/vite/dist/node/index.js";
import vue from "file:///E:/project/_work/tpa-frontend/tpa-frontend-starter/node_modules/.pnpm/@vitejs+plugin-vue@5.1.4_vite@5.4.7_vue@3.5.8/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import VueDevTools from "file:///E:/project/_work/tpa-frontend/tpa-frontend-starter/node_modules/.pnpm/vite-plugin-vue-devtools@7.4.6_vite@5.4.7_vue@3.5.8/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import dotenv from "file:///E:/project/_work/tpa-frontend/tpa-frontend-starter/node_modules/.pnpm/dotenv@16.4.5/node_modules/dotenv/lib/main.js";
import dv from "file:///E:/project/_work/tpa-frontend/tpa-frontend-starter/node_modules/.pnpm/dotenv-expand@11.0.6/node_modules/dotenv-expand/lib/main.js";
import { BootstrapVueNextResolver } from "file:///E:/project/_work/tpa-frontend/tpa-frontend-starter/node_modules/.pnpm/bootstrap-vue-next@0.24.21_vue@3.5.8/node_modules/bootstrap-vue-next/dist/bootstrap-vue-next.mjs";
import Components from "file:///E:/project/_work/tpa-frontend/tpa-frontend-starter/node_modules/.pnpm/unplugin-vue-components@0.27.4_vue@3.5.8/node_modules/unplugin-vue-components/dist/vite.js";
var __vite_injected_original_dirname = "E:\\project\\_work\\tpa-frontend\\tpa-frontend-starter";
var __vite_injected_original_import_meta_url = "file:///E:/project/_work/tpa-frontend/tpa-frontend-starter/vite.config.js";
dv.expand(dotenv.config());
console.log("ENV", process.env.VITE_ENV);
var baseUrl = process.env.VITE_ENV === "development" ? process.env.VITE_DEV_BASE_URL : process.env.VITE_BASE_URL;
console.log("URL", baseUrl);
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    VueDevTools(),
    Components({
      resolvers: [BootstrapVueNextResolver()]
    })
  ],
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxwcm9qZWN0XFxcXF93b3JrXFxcXHRwYS1mcm9udGVuZFxcXFx0cGEtZnJvbnRlbmQtc3RhcnRlclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxccHJvamVjdFxcXFxfd29ya1xcXFx0cGEtZnJvbnRlbmRcXFxcdHBhLWZyb250ZW5kLXN0YXJ0ZXJcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L3Byb2plY3QvX3dvcmsvdHBhLWZyb250ZW5kL3RwYS1mcm9udGVuZC1zdGFydGVyL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IFZ1ZURldlRvb2xzIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1kZXZ0b29scydcclxuaW1wb3J0IGRvdGVudiBmcm9tICdkb3RlbnYnXHJcbmltcG9ydCBkdiBmcm9tICdkb3RlbnYtZXhwYW5kJ1xyXG5pbXBvcnQgeyBCb290c3RyYXBWdWVOZXh0UmVzb2x2ZXIgfSBmcm9tICdib290c3RyYXAtdnVlLW5leHQnXHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXHJcblxyXG5kdi5leHBhbmQoZG90ZW52LmNvbmZpZygpKVxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5cclxuY29uc29sZS5sb2coJ0VOVicsIHByb2Nlc3MuZW52LlZJVEVfRU5WKVxyXG5cclxuY29uc3QgYmFzZVVybCA9XHJcbiAgcHJvY2Vzcy5lbnYuVklURV9FTlYgPT09ICdkZXZlbG9wbWVudCcgPyBwcm9jZXNzLmVudi5WSVRFX0RFVl9CQVNFX1VSTCA6IHByb2Nlc3MuZW52LlZJVEVfQkFTRV9VUkxcclxuY29uc29sZS5sb2coJ1VSTCcsIGJhc2VVcmwpXHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHZ1ZSgpLFxyXG4gICAgVnVlRGV2VG9vbHMoKSxcclxuICAgIENvbXBvbmVudHMoe1xyXG4gICAgICByZXNvbHZlcnM6IFtCb290c3RyYXBWdWVOZXh0UmVzb2x2ZXIoKV0sXHJcbiAgICB9KSxcclxuICBdLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxyXG4gICAgICAnfmJvb3RzdHJhcCc6IHJlc29sdmUoX19kaXJuYW1lLCAnbm9kZV9tb2R1bGVzL2Jvb3RzdHJhcCcpLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIGJhc2U6IGJhc2VVcmwsXHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBa1YsU0FBUyxlQUFlLFdBQVc7QUFDclgsU0FBUyxlQUFlO0FBQ3hCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLFlBQVk7QUFDbkIsT0FBTyxRQUFRO0FBQ2YsU0FBUyxnQ0FBZ0M7QUFDekMsT0FBTyxnQkFBZ0I7QUFSdkIsSUFBTSxtQ0FBbUM7QUFBNEssSUFBTSwyQ0FBMkM7QUFVdFEsR0FBRyxPQUFPLE9BQU8sT0FBTyxDQUFDO0FBR3pCLFFBQVEsSUFBSSxPQUFPLFFBQVEsSUFBSSxRQUFRO0FBRXZDLElBQU0sVUFDSixRQUFRLElBQUksYUFBYSxnQkFBZ0IsUUFBUSxJQUFJLG9CQUFvQixRQUFRLElBQUk7QUFDdkYsUUFBUSxJQUFJLE9BQU8sT0FBTztBQUUxQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixZQUFZO0FBQUEsSUFDWixXQUFXO0FBQUEsTUFDVCxXQUFXLENBQUMseUJBQXlCLENBQUM7QUFBQSxJQUN4QyxDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxNQUNwRCxjQUFjLFFBQVEsa0NBQVcsd0JBQXdCO0FBQUEsSUFDM0Q7QUFBQSxFQUNGO0FBQUEsRUFDQSxNQUFNO0FBQ1IsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
