<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { addRoutes } from "@/router";

import { toast } from "@/composables/util";

const router = useRouter();
const store = useStore();

// do not use same name with ref
const form = reactive({
  username: "admin",
  password: "admin",
});
const formRef = ref(null);
const loading = ref(false);

const rules = {
  username: [
    { required: true, message: "用户名不能为空", trigger: "blur" },
    // { min: 3, max: 5, message: "用户名长度应在3~5个字符", trigger: "blur" },
  ],
  password: [{ required: true, message: "密码不能为空", trigger: "blur" }],
};

const onSubmit = () => {
  // console.log(form.password, formRef.value);
  formRef.value.validate((valid) => {
    if (!valid) {
      toast("请先登录", "warning");
      return false;
    }
    loading.value = true;
    store
      .dispatch("login", form)
      .then(async (res) => {
        // 获取用户信息
        // let { menus } = await store.dispatch("getUserInfo");
        // addRoutes(menus);
        // console.log(res);
        // 此处要判断响应码 稍后修改，还有响应拦截器里面的响应处理逻辑
        // console.log(res);
        toast("登录成功");
        // router.push("/");
        location.replace("/");
      })
      .finally(() => {
        loading.value = false;
      });
  });
};

// 监听回车事件 实现回车登录逻辑
function onEnter(e) {
  // enter键的keyCode等于13
  if (e.keyCode === 13) {
    onSubmit();
  }
}
// 添加键盘监听
onMounted(() => {
  document.addEventListener("keydown", onEnter);
});
// 移除键盘监听
onBeforeUnmount(() => {
  document.removeEventListener("keydown", onEnter);
});
</script>
<template>
  <el-row class="login">
    <el-col :lg="16" :sm="12" class="login-left">
      <!-- <el-image
        style="margin-bottom: 0; height: 100%"
        src="/2.png"
        fit="fill"
      /> -->
      <div>
        <!-- <div>欢迎光临</div> -->
        <div>此站点正在建设中...</div>
      </div>
    </el-col>
    <el-col :lg="8" :sm="12" class="login-right">
      <h2>欢迎回来</h2>
      <div class="rtop">
        <span class="line"></span>
        <span>账号密码登录</span>
        <span class="line"></span>
      </div>
      <el-form ref="formRef" :rules="rules" :model="form" class="w-[250px]">
        <el-form-item label="" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名">
            <template #prefix>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input type="password" show-password v-model="form.password" placeholder="请输入密码">
            <template #prefix>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <div class="rbottom">
            <el-button round color="#f59e0b" class="w-[40%]" type="primary" :loading="loading"
              @click="onSubmit">登录</el-button>
            <el-button round class="w-[40%]">注册</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style scoped>
.login {
  @apply min-h-screen bg-yellow-500;
  /* min-height: 100vh; */
}

.login-left {
  @apply flex items-center justify-center flex-col;

  & div {
    &:first-child {
      @apply font-bold text-5xl text-light-50 mb-4;
    }

    &:last-child {
      @apply text-gray-200 text-sm;
    }
  }
}

.login-right {
  @apply bg-light-50 flex items-center justify-center flex-col;

  & h2 {
    @apply text-3xl font-bold text-gray-800;
  }

  & .rtop {
    @apply flex items-center justify-center my-5 text-gray-300 space-x-2;

    & .line {
      @apply h-[1px] w-16 bg-gray-200;
    }
  }

  & .rbottom {
    display: flex;
    justify-content: center;
    width: 100%;
  }
}
</style>
