import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";

// 定义默认加载的路由
const defaultRoutes = [
  {
    path: "/",
    name: "admin",
    component: () => import("~/layouts/admin.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("~/pages/login.vue"),
    meta: {
      title: "登录页",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("~/pages/404.vue"),
  },
];

// 定义动态路由，用于匹配菜单动态添加路由
const asyncRoutes = [
  {
    path: "/",
    component: () => import("~/pages/index.vue"),
    meta: {
      title: "后台首页",
    },
  },
  {
    path: "/goods/list",
    component: () => import("~/pages/goods/list.vue"),
    meta: {
      title: "商品管理",
    },
  },
  {
    path: "/category/list",
    component: () => import("~/pages/category/list.vue"),
    meta: {
      title: "分类列表",
    },
  },
  {
    path: "/user/list",
    name: "/user/list",
    component: () => import("~/pages/user/list.vue"),
    meta: {
      title: "用户列表",
    },
  },
  {
    path: "/order/list",
    name: "/order/list",
    component: () => import("~/pages/order/list.vue"),

    meta: {
      title: "订单列表",
    },
  },
  {
    path: "/comment/list",
    name: "/comment/list",
    component: () => import("~/pages/comment/list.vue"),
    meta: {
      title: "评价列表",
    },
  },
  {
    path: "/image/list",
    name: "/image/list",
    component: () => import("~/pages/image/list.vue"),

    meta: {
      title: "图库列表",
    },
  },
  {
    path: "/notice/list",
    name: "/notice/list",
    component: () => import("~/pages/notice/list.vue"),

    meta: {
      title: "公告列表",
    },
  },
  {
    path: "/setting/base",
    name: "/setting/base",
    component: () => import("~/pages/setting/base.vue"),
    meta: {
      title: "配置",
    },
  },
  {
    path: "/setting/buy",
    name: "/setting/buy",
    component: () => import("~/pages/setting/buy.vue"),
    meta: {
      title: "支付设置",
    },
  },
  {
    path: "/setting/ship",
    name: "/setting/ship",
    component: () => import("~/pages/setting/ship.vue"),
    meta: {
      title: "物流设置",
    },
  },
  {
    path: "/coupon/list",
    name: "/coupon/list",
    component: () => import("~/pages/coupon/list.vue"),

    meta: {
      title: "优惠券列表",
    },
  },
  {
    path: "/manager/list",
    name: "/manager/list",
    component: () => import("~/pages/manager/list.vue"),

    meta: {
      title: "管理员管理",
    },
  },
  {
    path: "/access/list",
    name: "/access/list",
    component: () => import("~/pages/access/list.vue"),
    meta: {
      title: "菜单权限管理",
    },
  },
  {
    path: "/role/list",
    name: "/role/list",
    component: () => import("~/pages/role/list.vue"),
    meta: {
      title: "角色管理",
    },
  },
  {
    path: "/skus/list",
    name: "/skus/list",
    component: () => import("~/pages/skus/list.vue"),
    meta: {
      title: "规格管理",
    },
  },
  {
    path: "/level/list",
    name: "/level/list",
    component: () => import("~/pages/level/list.vue"),
    meta: {
      title: "会员等级",
    },
  },
  {
    path: "/distribution/index",
    name: "/distribution/index",
    component: () => import("~/pages/distribution/index.vue"),
    meta: {
      title: "分销员管理",
    },
  },
  {
    path: "/distribution/setting",
    name: "/distribution/setting",
    component: () => import("~/pages/distribution/setting.vue"),
    meta: {
      title: "分销设置",
    },
  },
];

const routerMode = import.meta.env.MODE;
const url = import.meta.env.BASE_URL;
// console.log(routerMode, url);

export const router = createRouter({
  history:
    routerMode === "development"
      ? createWebHashHistory(url)
      : createWebHistory(url),
  routes: defaultRoutes,
});

// 定义动态添加路由的方法
// 方式一
export function addRoutes(menus) {
  // 是否有新路由被动态添加
  let hasNewRoute = false;
  const ak = (arr) => {
    arr.forEach((e) => {
      let king = asyncRoutes.find((item) => item.path == e.frontpath);
      if (king && !router.hasRoute(king.path)) {
        router.addRoute("admin", king);
        hasNewRoute = true;
      }
      if (e.child && e.child.length > 0) {
        ak(e.child);
      }
    });
  };
  ak(menus);
  // console.log(router.getRoutes());
  return hasNewRoute;
}

// 方式二
// export async function addRoutes(menus) {
//   // 是否有新路由被动态添加
//   let hasNewRoute = false;
//   const ak = (arr) => {
//     arr.forEach((e) => {
//       let king = asyncRoutes.find((item) => item.path == e.frontpath);
//       if (king && !router.hasRoute(king.path)) {
//         router.addRoute("admin", king);
//         hasNewRoute = true;
//       }
//       if (e.child && e.child.length > 0) {
//         ak(e.child);
//       }
//     });
//   };
//   ak(menus);
//   // console.log(router.getRoutes());
//   return hasNewRoute;
// }
