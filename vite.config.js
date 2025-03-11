import { fileURLToPath, URL } from "node:url";
import WindiCSS from "vite-plugin-windicss";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// 打包优化
import { visualizer } from "rollup-plugin-visualizer";
import externalGlobals from "rollup-plugin-external-globals";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    WindiCSS(),
    visualizer({
      gzipSize: true,
      brotliSize: true,
      emitFile: false,
      filename: "test.html", //分析图生成的文件名
      open: true, //如果存在本地服务端口，将在打包后自动展示
    }),
    // 构建压缩文件
    viteCompression({
      // 记录压缩文件及其压缩率。默认true
      verbose: true,
      // 是否禁用压缩，默认false
      disable: false,
      // 需要使用压缩前的最小文件大小，单位字节（byte） b，1b(字节)=8bit(比特), 1KB=1024B
      threshold: 10240, // 即10kb以上即会压缩
      // 压缩算法 可选 'gzip' | 'brotliCompress' | 'deflate' | 'deflateRaw'
      algorithm: "gzip",
      // 压缩后的文件格式
      ext: ".gz",
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "~": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      // 字符串简写写法：http://localhost:5173/foo -> http://localhost:4567/foo
      // "/foo": "http://localhost:4567",
      // 带选项写法：http://localhost:5173/api/bar -> http://jsonplaceholder.typicode.com/bar
      "/api": {
        target: "http://ceshi13.dishait.cn",
        // target: "http://api1.zhanq.love",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [
        "element-plus",
        "vue",
        "vue-demi",
        "echarts",
        "lodash",
        "@element-plus/icons-vue",
        "gsap",
      ],
      plugins: [
        // vue: 'Vue' --- vue为依赖包名  Vue为项目构建后的全局变量
        // 同上，给外部化的依赖提供一个全局变量，即配置在external得值
        externalGlobals({
          "element-plus": "ElementPlus",
          vue: "Vue",
          // VueDemi这个是pinia用来判断是vue2还是vue3所需要的，要额外引入一下
          "vue-demi": "VueDemi",
          echarts: "echarts",
          lodash: "_",
          "@element-plus/icons-vue": "ElementPlusIconsVue",
          gsap: "gsap",
        }),
      ],
      // 静态资源分类打包
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {},
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
        assetFileNames: "static/[ext]/[name]-[hash].[ext]",
        manualChunks(id) {
          // 静态资源分拆打包
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
});
