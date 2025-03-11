<script setup>
import { nextTick, onMounted } from "vue";
import { onBeforeRouteUpdate } from "vue-router";
import { useTabList } from "@/composables/useTabList";
const {
  activeTab, // 当前激活的标签页
  tabList, // 标签列表
  changeTab, // 切换标签逻辑
  initTabList, // 获取cookie缓存中的标签列表逻辑
  addTab, // 添加路径到标签列表逻辑
  removeTab, // 移除标签的逻辑
  handleClose, // 标签栏右侧的下拉方法
} = useTabList();

// 针对页面刷新时，重新获取缓存中的tabList标签列表
onMounted(() => {
  // nextTick(() => console.log(tabList.value));
  initTabList();
});

// 点击左侧菜单栏 路由跳转前 添加路径到标签列表
onBeforeRouteUpdate((to, from) => {
  addTab({ path: to.path, title: to.meta.title });
  activeTab.value = to.path;
});
</script>

<template>
  <div class="f-tag-list" :style="{ left: $store.state.asideWidth }">
    <el-tabs
      v-model="activeTab"
      type="card"
      class="demo-tabs"
      @tab-remove="removeTab"
      @tab-change="changeTab"
    >
      <el-tab-pane
        v-for="item in tabList"
        :key="item.path"
        :label="item.title"
        :name="item.path"
        :closable="item.path !== '/'"
      >
        <!-- {{ item.content }} -->
      </el-tab-pane>
    </el-tabs>

    <span class="tag-btn">
      <el-dropdown @command="handleClose">
        <span class="el-dropdown-link">
          <el-icon class="el-icon--center">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="closeOther">关闭其它</el-dropdown-item>
            <el-dropdown-item command="closeAll">全部关闭</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </span>
  </div>
</template>
<style scoped>
.f-tag-list {
  transition: all 0.2s;
  @apply px-2 fixed bg-gray-100 flex items-center;
  top: 64px;
  right: 0;
  height: 44px;
  z-index: 100;
}

.tag-btn {
  @apply bg-white rounded ml-auto flex justify-center items-center;
  width: 28px;
  height: 28px;
  box-shadow: 0 2px 5px 0px rgba(0, 0, 0, 0.1);
}

.demo-tabs {
  /* @apply flex items-center; */
  /* background-color: red; */
  min-width: 300px;
}
/* 在scoped里面不生效，加上:deep才生效 */
:deep(.el-tabs__header) {
  margin-bottom: 0px;
  height: 32px;
  display: flex;
  align-items: center;
  border: none !important;
}
:deep(.el-tabs__nav) {
  border: none !important;
  /* height: 32px;
  line-height: 32px; */
}
:deep(.el-tabs__item) {
  border: none !important;
  height: 32px;
  box-shadow: 0 2px 5px 0px rgba(0, 0, 0, 0.1);

  /* line-height: 32px; */
  @apply rounded bg-white mx-1;
}

:deep(.el-tabs__nav-prev),
:deep(.el-tabs__nav-next) {
  height: 32px;
  line-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* :deep(.is-disabled){

} */
</style>
