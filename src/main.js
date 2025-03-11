// import "./assets/main.css";
// 引入windicss样式
import "virtual:windi.css";

// 引入全局loading进度条样式
import "nprogress/nprogress.css";

import { createApp } from "vue";
// import { createPinia } from "pinia";
import store from "./store";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

// 全局引入所有element-plus图标
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import App from "./App.vue";
import { router } from "./router";

// 引入路由守卫
import "./permission";

// 自定义指令
import permission from "@/directives/permission.js";

const app = createApp(App);

// app.use(createPinia());
app.use(store);
app.use(router);

app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(permission);
app.mount("#app");
