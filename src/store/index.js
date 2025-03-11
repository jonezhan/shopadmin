import { getInfo, login, logout } from "@/api/manager";
import { setToken, removeToken } from "@/composables/auth";
import { removeTabToken } from "@/composables/useTabList";
import { createStore } from "vuex";
import { toast } from "@/composables/util";

// 创建一个新的 store 实例
const store = createStore({
  state() {
    return {
      // 用户信息
      user: {},

      // 侧边宽度
      asideWidth: "250px",

      // 菜单数据
      menus: [],
      ruleNames: [],
    };
  },
  mutations: {
    // 记录用户信息
    SET_USERINFO(state, user) {
      state.user = user;
    },
    // 展开或者收起侧边
    handleAsideWidth(state) {
      state.asideWidth = state.asideWidth === "250px" ? "64px" : "250px";
    },
    // 设置菜单数据
    SET_MENUS(state, menus) {
      state.menus = menus;
      // sessionStorage.setItem("UserMenus", JSON.stringify(menus));
    },
    SET_QULENAMES(state, ruleNames) {
      state.ruleNames = ruleNames;
      // sessionStorage.setItem("RuleMenus", JSON.stringify(ruleNames));
    },
  },
  actions: {
    // 登录方法
    login({ commit }, { username, password }) {
      return new Promise((resolve, reject) => {
        login(username, password)
          .then((res) => {
            setToken(res.token);
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    // 退出登录
    logout({ commit }) {
      // return new Promise((resolve, reject) => {
      logout().finally(() => {
        console.log("退出登录");
        // 移除token
        removeToken();
        removeTabToken();
        sessionStorage.removeItem("UserInfo");
        // 清除用户当前状态 vuex
        commit("SET_USERINFO", {});
        // resolve("ok");
        // 跳转回登录页
        // router.router.push()({ path: "/login" });
        // router.push("/login");
        // location.replace();
        location.reload();
        // 提示退出登录成功
        toast("退出登录成功");
      });
      // });
    },

    // 获取当前登录的用户信息
    getUserInfo({ commit }) {
      return new Promise(async (resolve, reject) => {
        let data = await new Promise((resolve, reject) => {
          resolve(JSON.parse(sessionStorage.getItem("UserInfo")));
        });
        // console.log(data);
        if (data == null) {
          let res = await getInfo();
          data = res;
          sessionStorage.setItem("UserInfo", JSON.stringify(data));
        }
        // console.log(data);
        commit("SET_USERINFO", data);
        commit("SET_MENUS", data.menus);
        commit("SET_QULENAMES", data.ruleNames);
        resolve(data);
        // getInfo()
        //   .then((res) => {
        //     // console.log(res);
        //     commit("SET_USERINFO", res);
        //     commit("SET_MENUS", res.menus);
        //     commit("SET_QULENAMES", res.ruleNames);
        //     resolve(res);
        //   })
        //   .catch((err) => {
        //     reject(err);
        //   });
      });
    },
  },
});

export default store;
