import store from "@/store";
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { updatePassword } from "@/api/manager";
import { showModal, toast } from "@/composables/util";

// 修改密码
export function useRepassword() {
  const router = useRouter();

  const formRef = ref(null);
  const formDrawerRef = ref(null);

  const form = reactive({
    oldpassword: "admin",
    password: "admin",
    repassword: "admin",
  });

  const rules = {
    oldpassword: [
      { required: true, message: "旧密码不能为空", trigger: "blur" },
      // { min: 3, max: 5, message: "用户名长度应在3~5个字符", trigger: "blur" },
    ],
    password: [{ required: true, message: "新密码不能为空", trigger: "blur" }],
    repassword: [
      { required: true, message: "确认密码不能为空", trigger: "blur" },
    ],
  };

  const onSubmit = () => {
    // console.log(form);

    formRef.value.validate((valid) => {
      if (!valid) {
        toast("请先输入！", "warning");
        return false;
      }
      // console.log(formDrawerRef.value);
      formDrawerRef.value.loading = true;
      // loading.value = true;
      updatePassword(form)
        .then((res) => {
          // console.log(res);
          // if (res.code === 200) {
          //   toast("修改密码成功", "success");
          //   showDrawer.value = false;
          // } else {
          //   toast(res.message, "error");
          // }
          store.dispatch("logout").finally(() => {
            // 跳转回登录页
            router.replace({ path: "/login" });
            // 提示修改密码成功
            toast("修改密码成功，请重新登录~", "success");
          });

          throw new Error(err);
        })
        .catch((err) => {
          toast("修改密码失败", "error");
          // console.log(err);
        })
        .finally(() => {
          // store.dispatch("logout").finally(() => {
          //   // 跳转回登录页
          //   router.replace({ path: "/login" });
          //   // 提示修改密码成功
          //   toast("修改密码成功，请重新登录~", "success");
          // });
          // loading.value = false;
          formDrawerRef.value.loading = false;
        });
    });
  };
  const openRepasswordForm = () => {
    // console.log("修改密码");
    // showDrawer.value = true;
    formDrawerRef.value.openDrawer();
  };
  return {
    formRef,
    formDrawerRef,
    form,
    rules,
    onSubmit,
    openRepasswordForm,
  };
}

// 退出登录逻辑
export function useLogout() {
  const router = useRouter();
  function confirmlogout() {
    showModal("确认退出登录吗?", "warning", "提示")
      .then((res) => {
        store.dispatch("logout");
        // .finally(() => {
        //   // 跳转回登录页
        //   router.replace({ path: "/login" });
        //   // 提示退出登录成功
        //   toast("退出登录成功");
        // });
      })
      .catch(() => {
        // toast("取消退出登录");
      });
  }

  return {
    confirmlogout,
  };
}
