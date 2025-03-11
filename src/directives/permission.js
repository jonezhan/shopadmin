import store from "@/store";

// 自定义指令实现按钮级权限控制
function hasPermission(value, el = false) {
  // console.log(el);
  if (!Array.isArray(value)) {
    throw new Error(`需要配置权限，例如v-permission=['getStatistics3,GET']`);
  }
  // console.log(store.state.ruleNames);
  const hasAuth =
    value.findIndex((v) => store.state.ruleNames.includes(v)) != -1;
  if (el && !hasAuth) {
    el.parentNode && el.parentNode.removeChild(el);
  }
  return hasAuth;
}

export default {
  install(app) {
    // console.log(app);
    app.directive("permission", {
      mounted(el, binding) {
        hasPermission(binding.value, el); // => "white"
      },
    });
  },
};
