<script setup>
import { ref, reactive } from "vue";
import { getSysconfig, setSysconfig, uploadAction } from "@/api/sysconfig";
import { toast } from "@/composables/util";
import FormDrawer from "@/components/FormDrawer.vue";
import { getToken } from "@/composables/auth";
const token = getToken();

const loading = ref(false);
const activeName = ref("first");
const tableData = [
  {
    name: "支付宝支付",
    desc: "该系统支持即时到账接口",
    src: "/alipay.png",
    key: "alipay",
  },
  {
    name: "微信支付",
    desc: "该系统支持微信网页支付和扫码支付",
    src: "/wepay.png",
    key: "wxpay",
  },
];

const form = reactive({
  close_order_minute: 0,
  auto_received_day: 0,
  after_sale_day: 0,
  alipay: {
    app_id: "",
    ali_public_key: "",
    private_key: "",
  },
  wxpay: {
    app_id: "", // 公众号 APPID
    miniapp_id: "", // 小程序 APPID
    secret: "", // 小程序secret
    appid: "", // appid
    mch_id: "", // 商户号
    key: "", // API 密钥
    cert_client: "",
    cert_key: "",
  },
});

function getData() {
  form.wxpay.cert_client = "";
  form.wxpay.cert_key = "";
  loading.value = true;
  getSysconfig()
    .then((res) => {
      for (const key in form) {
        form[key] = res[key];
      }
    })
    .finally(() => {
      loading.value = false;
    });
}
getData();
function onSubmit(temp = 1) {
  if (temp == 2) {
    loading.value = true;
  } else {
    drawerRef.value.loading = true;
  }
  setSysconfig(form)
    .then((res) => {
      // console.log(res);
      getData();
      toast("保存成功");
    })
    .catch((err) => {})
    .finally(() => {
      //   getData();
      loading.value = false;
      drawerRef.value.loading = false;
    });
}

const drawerRef = ref(null);
const subKey = ref(null);
function openDrawer(type) {
  subKey.value = type;
  drawerRef.value.openDrawer();
}

function uploadClientSuccess(response, uploadFile, uploadFiles) {
  form[subKey.value].cert_client = response.data;
}
</script>

<template>
  <el-card shadow="never" :style="{ border: 'none' }">
    <!-- card body -->
    <el-form :model="form" label-width="auto" :inline="false">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="支付设置" name="first">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column label="支付方式">
              <template #default="{ row }">
                <div class="flex items-center">
                  <el-image
                    :src="row.src"
                    class="w-10 h-10 mr-2"
                    fit="fill"
                    :lazy="true"
                  />
                  <div>
                    <p>{{ row.name }}</p>
                    <small>{{ row.desc }}</small>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="140">
              <template #default="{ row }">
                <el-button
                  type="primary"
                  text
                  size="small"
                  @click="openDrawer(row.key)"
                >
                  配置
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="购物设置" name="second">
          <el-form-item label="未支付订单">
            <div class="flex flex-col">
              <el-input
                style="width: 300px"
                v-model="form.close_order_minute"
                type="number"
              >
                <template #append>分钟</template>
              </el-input>
              <small class="text-gray-500">
                *订单下单未付款，n分钟后自动关闭，设置0不自动关闭
              </small>
            </div>
          </el-form-item>
          <el-form-item label="已发货订单">
            <div class="flex flex-col">
              <el-input
                style="width: 300px"
                v-model="form.auto_received_day"
                type="number"
              >
                <template #append>天</template>
              </el-input>
              <small class="text-gray-500">
                *如果在期间未确认收货，系统按照设置的天数自动完成收货，设置0不自动收货
              </small>
            </div>
          </el-form-item>
          <el-form-item label="已完成订单">
            <div class="flex flex-col">
              <el-input
                style="width: 300px"
                v-model="form.after_sale_day"
                type="number"
              >
                <template #append>天</template>
              </el-input>
              <small class="text-gray-500">
                *订单完成后，用户在设置的天数内可以发起售后申请，设置0不允许申请售后
              </small>
            </div>
          </el-form-item>

          <el-form-item label="">
            <el-button :loading="loading" type="primary" @click="onSubmit(2)">
              保存
            </el-button>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <FormDrawer
      @submit="onSubmit"
      title="配置"
      :destroyOnClose="true"
      ref="drawerRef"
    >
      <el-form
        style="width: 95%"
        v-if="subKey == 'alipay'"
        :model="form.alipay"
        label-width="auto"
      >
        <el-form-item label="app_id">
          <el-input v-model="form.alipay.app_id"></el-input>
        </el-form-item>
        <el-form-item label="ali_public_key">
          <el-input
            type="textarea"
            v-model="form.alipay.ali_public_key"
          ></el-input>
        </el-form-item>
        <el-form-item label="private_key">
          <el-input
            type="textarea"
            v-model="form.alipay.private_key"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form style="width: 95%" v-else :model="form.wxpay" label-width="auto">
        <el-form-item label="公众号APPID">
          <el-input v-model="form.wxpay.app_id"></el-input>
        </el-form-item>
        <el-form-item label="小程序APPID">
          <el-input v-model="form.wxpay.miniapp_id"></el-input>
        </el-form-item>
        <el-form-item label="小程序Secret">
          <el-input v-model="form.wxpay.secret"></el-input>
        </el-form-item>
        <el-form-item label="appid">
          <el-input v-model="form.wxpay.appid"></el-input>
        </el-form-item>
        <el-form-item label="商户号">
          <el-input v-model="form.wxpay.mch_id"></el-input>
        </el-form-item>
        <el-form-item label="API密钥">
          <el-input v-model="form.wxpay.key"></el-input>
        </el-form-item>
        <el-form-item label="cert_client">
          <el-upload
            :action="uploadAction"
            :headers="{ token }"
            :limit="1"
            accept=".pem"
            :on-success="uploadClientSuccess"
          >
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <p class="text-red-500">
                {{ form.wxpay.cert_client ? form.wxpay.cert_client : "未配置" }}
              </p>
              <div class="el-upload__tip">
                <small class="text-gray-500"> *例如：apiclient_cert.pem </small>
              </div>
            </template>
          </el-upload>
          <!-- <div class="flex flex-col">
            <el-button type="primary" @click="">点击上传</el-button>
            <p class="text-red-500">{{ form.cert_client }}</p>
            <small class="text-gray-500"> *例如：apiclient_cert.pem </small>
          </div> -->
        </el-form-item>
        <el-form-item label="cert_key">
          <el-upload
            :action="uploadAction"
            :headers="{ token }"
            :limit="1"
            accept=".pem"
            :on-success="uploadClientSuccess"
          >
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <p class="text-red-500">
                {{ form.wxpay.cert_key ? form.wxpay.cert_key : "未配置" }}
              </p>
              <div class="el-upload__tip">
                <small class="text-gray-500"> *例如：apiclient_key.pem </small>
              </div>
            </template>
          </el-upload>
          <!-- <div class="flex flex-col">
            <el-button type="primary" @click="">点击上传</el-button>
            <p class="text-red-500">{{ form.cert_key }}</p>
            <small class="text-gray-500"> *例如：apiclient_key.pem </small>
          </div> -->
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>
