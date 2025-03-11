import { router, addRoutes } from "@/router";
import { getToken } from "@/composables/auth";
import { hideFullLoading, showFullLoading, toast } from "./composables/util";
import store from "./store";
import { nextTick } from "vue";
import { useTabList } from "@/composables/useTabList";

// 全局前置路由守卫
const token = getToken();

// 防止重复请求用户信息的标识
let hasGetInfo = false;
let hasAddTab = true;

router.beforeEach(async (to, from) => {
  const { addTab, initTabList } = useTabList();

  //   显示loading
  showFullLoading();

  // if (to.path !== "/login") {
  //   if (token) next();
  //   else next({ path: "/login" });
  // } else {
  //   if (token) next({ path: "/" });
  //   else next();
  // }
  // 检查用户是否已登录  ❗️ 避免无限重定向
  if (!token && to.path !== "/login") {
    toast("请先登录", "error");
    // 将用户重定向到登录页面
    return { name: "login", replace: true };
    // next({ path: "/login" });
  }

  // 防止重复登录
  if (token && to.path === "/login") {
    toast("请勿重复登录", "warning");
    // 将用户重定向到首页
    return { path: from.path ? from.path : "/" };
    // next(false);
  }

  // 是否有新路由被动态添加
  let hasNewRoute = false;
  // 如果用户已经登录并且没有获取用户信息，则自动获取用户信息，并且存储到vuex中
  if (token && !hasGetInfo) {
    // let menus = await new Promise((resolve, reject) => {
    //   resolve(JSON.parse(sessionStorage.getItem("UserMenus")));
    // });
    // console.log(menus);
    // if (menus == null) {
    //   let res = await store.dispatch("getUserInfo");
    //   menus = res.menus;
    // } else store.commit("SET_MENUS", menus);
    // let { menus } = await store.dispatch("getUserInfo");
    // console.log(menus);
    let { menus } = await store.dispatch("getUserInfo");
    // console.log(menus);
    // console.log(233);
    hasGetInfo = true;

    // 方式一
    hasNewRoute = addRoutes(menus);

    // 方式二
    // hasNewRoute = await addRoutes(menus);
    // // addRoutes(menus);
    // if (hasNewRoute) {
    //   nextTick(() => {
    //     router.replace(to.fullPath);
    //   });
    // }
  }
  // 处理刷新页面标签列表丢失
  if (!hasAddTab) {
    await initTabList();
    addTab({ path: to.path, title: to.meta.title });
    hasAddTab = true;
  }
  // 设置页面标题
  let title = (to.meta.title ? to.meta.title : "") + " | shopadmin";
  document.title = title;
  // console.log(to);
  // 不return也会自动放行，但是会出现刷新404问题
  if (hasNewRoute) {
    hasAddTab = false;
    return { path: to.fullPath };
    // next();
  }

  // console.log(to.fullPath, hasNewRoute);
  // console.log(2333);

  // hasNewRoute ? next(to.fullPath) : next();
  // 这里可以不用next()写法，因为next()会执行到下一个路由，导致页面不刷新
  // 方式一
  // if (hasNewRoute) {
  //   return { path: to.fullPath };
  //   // next()
  // }
  // next();
  // return { path: to.fullPath };
  // console.log(to.fullPath, hasNewRoute);
  // return { path: to.fullPath };
  // router.replace(to.fullPath);
});

// 全局后置守卫
router.afterEach((to, from) => {
  // console.log(to);
  hideFullLoading();
});
