import { ref } from "vue";
import { useRoute } from "vue-router";
// import { useCookies } from "@vueuse/integrations/useCookies";
import { router } from "@/router";
const TabKey = "tabList";

export function useTabList() {
  // const cookies = useCookies();
  const route = useRoute();
  // console.log(route);

  // 当前活跃标签
  const activeTab = ref(route.path);
  // const activeTab = computed(() => {
  //   // console.log(route.path);
  //   return route.path;
  // });
  // 标签列表
  const tabList = ref([
    {
      title: "后台首页",
      path: "/",
    },
  ]);

  // 切换标签逻辑
  function changeTab(e) {
    // console.log(e);
    activeTab.value = e;
    router.push(e);
    // router.replace(e);
  }

  // 获取缓存中的标签列表逻辑
  async function initTabList() {
    // let tempTabList = cookies.get("tabList");
    const res = await new Promise((resolve, reject) => {
      let tempTabList = localStorage.getItem(TabKey);
      resolve(tempTabList);
    });
    if (res) tabList.value = JSON.parse(res);
  }

  // 添加路径到标签列表逻辑
  function addTab(tab) {
    let noTab = tabList.value.findIndex((item) => item.path == tab.path) == -1;
    if (noTab) {
      tabList.value.push(tab);
    }
    // cookies.set("tabList", tabList.value);
    // localStorage.setItem(TabKey, JSON.stringify(tabList.value));
    setTabToken();
  }

  // 移除标签的逻辑
  const removeTab = (targetName) => {
    // console.log(targetName);
    const tabs = tabList.value;
    let activeName = activeTab.value;
    // 如果移除的标签是当前标签
    if (activeName === targetName) {
      tabs.forEach((tab, index) => {
        if (tab.path === targetName) {
          const nextTab = tabs[index + 1] || tabs[index - 1];
          if (nextTab) {
            activeName = nextTab.path;
            router.push(activeName);
          }
        }
      });
    }
    activeTab.value = activeName;
    tabList.value = tabs.filter((e) => e.path !== targetName);
    // cookies.set("tabList", tabList.value);
    // localStorage.setItem(TabKey, JSON.stringify(tabList.value));
    setTabToken();
  };

  // 标签栏右侧的下拉方法
  const handleClose = (command) => {
    if (command == "closeOther") {
      tabList.value = tabList.value.filter(
        (item) => item.path == "/" || item.path == activeTab.value
      );
    } else if (command == "closeAll") {
      tabList.value.splice(1);
      router.push("/");
    }
    // cookies.set("tabList", tabList.value);
    // localStorage.setItem(TabKey, JSON.stringify(tabList.value));
    setTabToken();
  };

  // 设置token
  function setTabToken() {
    localStorage.setItem(TabKey, JSON.stringify(tabList.value));
  }

  return {
    activeTab,
    tabList,
    changeTab,
    initTabList,
    addTab,
    removeTab,
    handleClose,
  };
}

// 移除token
export function removeTabToken() {
  localStorage.removeItem(TabKey);
}
