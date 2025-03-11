<script setup>
import FHeader from "./components/FHeader.vue";
import FMenu from "./components/FMenu.vue";
import FTagList from "./components/FTagList.vue";
</script>

<template>
  <el-container>
    <el-header>
      <!-- 头部区域 -->
      <FHeader />
    </el-header>
    <!-- 头部下面的区域 -->
    <el-container>
      <el-aside class="scow" :width="$store.state.asideWidth">
        <!-- 侧边 -->
        <FMenu />
      </el-aside>
      <el-main>
        <!-- 标签导航 -->
        <FTagList />
        <!-- 主内容区域 -->
        <!-- RotuerView 组件暴露了一个插槽，可以用来渲染路由组件： -->
        <!-- <component style="min-width: 1100px" :is="Component" /> -->

        <el-scrollbar>
          <router-view v-slot="{ Component }" class="mt-8">
            <transition name="fade">
              <keep-alive :max="10">
                <component :is="Component" />
              </keep-alive>
            </transition>
          </router-view>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>
<style scoped>
.scow {
  transition: all 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}

.fade-enter-active {
  transition-delay: 0.3s;
}
</style>
