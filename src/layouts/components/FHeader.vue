<script setup>
import store from "@/store";
import { onBeforeMount, ref, computed, defineAsyncComponent } from "vue";
import { useFullscreen } from "@vueuse/core";
// import FormDrawer from "@/components/FormDrawer.vue";
import { useRepassword, useLogout } from "@/composables/useManager";

const FormDrawer = defineAsyncComponent(() => {
  return import("@/components/FormDrawer.vue");
});

// 引入修改密码逻辑
const { formRef, formDrawerRef, form, rules, onSubmit, openRepasswordForm } =
  useRepassword();

// 引入退出登录逻辑
const { confirmlogout } = useLogout();

// 定义全屏逻辑
const { isFullscreen, enter, exit, toggle } = useFullscreen();

// 加载组件前，先获取用户信息
const user = ref(null);
onBeforeMount(() => {
  user.value = store.state.user;
});

// onMounted(() => {
//   // console.log(formDrawerRef.value);
// });

// 下拉框内的组件方法响应
function handleCommand(command) {
  switch (command) {
    case "logout":
      confirmlogout();
      break;
    case "rePaddword":
      // router.push({ path: "/rePaddword" });
      openRepasswordForm();
      break;
    default:
      break;
  }
}

// 刷新事件
function handleRefresh() {
  location.reload();
}

// 切换箭头方向
const arrowDerction = ref(false);
function arrowChange(e) {
  arrowDerction.value = e;
}

// 折叠和展开图标的切换
const isCollapse = computed(() => !(store.state.asideWidth == "250px"));
</script>

<template>
  <!-- <div>头部</div> -->
  <div class="f-header">
    <div>
      <span class="logo">
        <el-icon class="mr-2">
          <ElemeFilled />
        </el-icon>

        <span>Shopadmin</span>
      </span>
      <el-icon class="icon-btn" @click="$store.commit('handleAsideWidth')">
        <Fold v-if="isCollapse" />
        <Expand v-else />
      </el-icon>
      <!-- <el-icon><Expand /></el-icon> -->
      <el-tooltip effect="dark" content="刷新" placement="bottom">
        <el-icon @click="handleRefresh" class="icon-btn">
          <Refresh />
        </el-icon>
      </el-tooltip>
    </div>

    <div>
      <el-tooltip v-if="!isFullscreen" effect="dark" content="全屏" placement="bottom">
        <el-icon @click="toggle" class="icon-btn">
          <FullScreen />
        </el-icon>
      </el-tooltip>
      <el-tooltip v-else effect="dark" content="退出全屏" placement="bottom">
        <el-icon @click="toggle" class="icon-btn">
          <Aim />
        </el-icon>
      </el-tooltip>

      <el-dropdown class="dropdown" @command="handleCommand" @visible-change="arrowChange">
        <span class="dropItem">
          <el-avatar class="mr-2" :size="25" :src="user.avatar" />
          {{ user.username }}
          <el-icon class="el-icon--right">
            <arrow-down v-if="!arrowDerction"></arrow-down>
            <ArrowUp v-else></ArrowUp>
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="rePaddword">修改密码</el-dropdown-item>
            <!-- <el-dropdown-item @click="confirmlogout"> -->
            <el-dropdown-item command="logout"> 退出登录 </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

  <!-- 修改密码的弹出框 -->
  <FormDrawer @submit="onSubmit" title="修改密码" size="30%" ref="formDrawerRef" destoryOnClose="true">
    <el-form ref="formRef" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="旧密码" prop="oldpassword">
        <el-input v-model="form.oldpassword" placeholder="请输入旧密码">
        </el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input type="password" show-password v-model="form.password" placeholder="请输入新密码">
          <template #prefix>
            <el-icon>
              <Lock />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="repassword">
        <el-input type="password" show-password v-model="form.repassword" placeholder="请输入确认密码">
          <template #prefix>
            <el-icon>
              <Lock />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
  </FormDrawer>

  <!-- <el-drawer
    v-model="showDrawer"
    title="修改密码"
    :close-on-click-modal="false"
    size="30%"
  >
    <el-form ref="formRef" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="旧密码" prop="oldpassword">
        <el-input v-model="form.oldpassword" placeholder="请输入旧密码">
        </el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input
          type="password"
          show-password
          v-model="form.password"
          placeholder="请输入新密码"
        >
          <template #prefix>
            <el-icon><Lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="repassword">
        <el-input
          type="password"
          show-password
          v-model="form.repassword"
          placeholder="请输入确认密码"
        >
          <template #prefix>
            <el-icon><Lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item>
        <div class="rbottom">
          <el-button
            class="w-[40%]"
            type="primary"
            :loading="loading"
            @click="onSubmit"
            >提交</el-button
          >
          <el-button round class="w-[40%]">注册</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-drawer> -->
</template>
<style scoped>
.logo {
  width: 176px;
  @apply flex justify-center items-center text-xl font-thin;
}

.f-header {
  z-index: 1000;
  @apply flex items-center bg-yellow-500 text-light-50 fixed top-0 left-0 right-0 h-16 justify-between;

  & div {
    @apply flex items-center;

    & .dropdown {
      height: 64px;
      cursor: pointer;
      @apply flex justify-center items-center mx-6;

      & .dropItem {
        @apply flex items-center text-light-50;

        &:focus-visible {
          outline: unset;
        }
      }
    }
  }
}

.icon-btn {
  @apply flex justify-center items-center;
  width: 42px;
  height: 64px;
  cursor: pointer;

  &:hover {
    @apply bg-yellow-400;
  }
}
</style>
