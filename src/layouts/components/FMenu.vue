<script setup>
import store from "@/store";
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// 获取菜单列表数据
const asideMenus = computed(() => store.state.menus);

// 点击相应的菜单跳转页面
const handleSelect = (e) => {
  console.log(e, document.cookie);
  router.push(e);
};

// 折叠和展开图标的切换
const isCollapse = computed(() => !(store.state.asideWidth == "250px"));

// 当前聚焦的菜单路径
// const defaultActive = ref(route.path);
const defaultActive = computed(() => {
  // console.log(route.path);
  return route.path;
});
</script>

<template>
  <div class="f-menu" :style="{ width: $store.state.asideWidth }">
    <el-menu :unique-opened="true" :collapse-transition="false" :collapse="isCollapse" :default-active="defaultActive"
      class="borderNone" @select="handleSelect">
      <template v-for="(item, index) in asideMenus" :key="index">
        <!-- 有二级的菜单 -->
        <el-sub-menu v-if="item.child && item.child.length > 0" :index="item.name">
          <template #title>
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.name }}</span>
          </template>

          <el-menu-item v-for="(itemChild, index) in item.child" :key="index" :index="itemChild.frontpath">
            <el-icon>
              <component :is="itemChild.icon"></component>
            </el-icon>
            <span>{{ itemChild.name }}</span>
          </el-menu-item>
        </el-sub-menu>
        <!-- 只有一级的菜单 -->
        <el-menu-item v-else :index="item.frontpath">
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<style scoped>
.f-menu {
  background-color: var(--el-menu-bg-color);
  transition: all 0.2s;
  /* width: 250px; */
  top: 64px;
  bottom: 0;
  left: 0;
  overflow-y: auto;
  overflow-x: hidden;
  @apply shadow-md fixed;

  & .borderNone {
    border: none;
  }

  /* 设置滚动条宽度为0 */
  &::-webkit-scrollbar {
    width: 0px;
  }
}
</style>
