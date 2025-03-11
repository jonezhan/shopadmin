<script setup>
import { ref, reactive } from "vue";
import { getSysconfig, setSysconfig } from "@/api/sysconfig";
import { toast } from "@/composables/util";

const loading = ref(false);
const activeName = ref("first");

const form = reactive({
  open_reg: 1,
  reg_method: "username",
  password_min: 7,
  password_encrypt: [],
  upload_method: "oss",
  upload_config: {
    Bucket: "",
    ACCESS_KEY: "",
    SECRET_KEY: "",
    http: "",
  },
  api_safe: 1,
  api_secret: "",
});

function getData() {
  loading.value = true;
  getSysconfig()
    .then((res) => {
      for (const key in form) {
        form[key] = res[key];
      }
      form.password_encrypt = form.password_encrypt.split(",");
    })
    .finally(() => {
      loading.value = false;
    });
}
getData();
function onSubmit() {
  loading.value = true;
  setSysconfig({ ...form, password_encrypt: form.password_encrypt.join(",") })
    .then((res) => {
      // console.log(res);
      toast("保存成功");
    })
    .catch((err) => {})
    .finally(() => {
      loading.value = false;
    });
}
</script>

<template>
  <el-card shadow="never" :style="{ border: 'none' }">
    <!-- card body -->
    <el-form :model="form" label-width="auto" :inline="false">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="注册与访问" name="first">
          <el-form-item label="是否允许注册会员">
            <el-radio-group v-model="form.open_reg">
              <el-radio label="关闭" :value="0" />
              <el-radio label="开启" :value="1" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="注册类型">
            <el-radio-group v-model="form.reg_method">
              <el-radio label="普通注册" value="username" />
              <el-radio label="手机注册" value="phone" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="密码最小长度">
            <el-input
              style="width: 100px"
              v-model="form.password_min"
              type="number"
            />
          </el-form-item>
          <el-form-item label="强制密码复杂度">
            <el-checkbox-group v-model="form.password_encrypt">
              <el-checkbox label="数字" value="0" border />
              <el-checkbox label="小写字母" value="1" border />
              <el-checkbox label="大写字母" value="2" border />
              <el-checkbox label="符号" value="3" border />
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="上传设置" name="second">
          <el-form-item label="默认上传方式">
            <el-radio-group v-model="form.upload_method">
              <el-radio label="对象存储" value="oss" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Bucket">
            <el-input
              style="width: 300px"
              v-model="form.upload_config.Bucket"
              placeholder="Bucket"
            />
          </el-form-item>
          <el-form-item label="ACCESS_KEY">
            <el-input
              style="width: 300px"
              v-model="form.upload_config.ACCESS_KEY"
              placeholder="ACCESS_KEY"
            />
          </el-form-item>
          <el-form-item label="SECRET_KEY">
            <el-input
              style="width: 300px"
              v-model="form.upload_config.SECRET_KEY"
              placeholder="SECRET_KEY"
            />
          </el-form-item>
          <el-form-item label="空间域名">
            <div class="flex flex-col">
              <el-input
                style="width: 300px"
                v-model="form.upload_config.http"
                placeholder="空间域名"
              />
              <small class="text-gray-500">*请补全 http:// 或 https://</small>
            </div>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="Api安全" name="third">
          <el-form-item label="是否开启API安全">
            <div class="flex flex-col">
              <el-radio-group v-model="form.api_safe">
                <el-radio label="关闭" :value="0" />
                <el-radio label="开启" :value="1" />
              </el-radio-group>
              <small class="text-gray-500">
                *api安全功能开启之后调用前端api需要传输签名串
              </small>
            </div>
          </el-form-item>
          <el-form-item label="秘钥">
            <div class="flex flex-col">
              <el-input
                style="width: 300px"
                v-model="form.api_secret"
                placeholder="秘钥"
              />
              <small class="text-gray-500">
                *秘钥设置关系系统中api调用传输签名串的编码规则，以及会员token解析，请慎重设置，注意设置之后对应会员要求重新登录获取token
              </small>
            </div>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <el-form-item label="">
        <el-button :loading="loading" type="primary" @click="onSubmit">
          保存
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
