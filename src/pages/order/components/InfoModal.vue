<script setup>
import { ref, defineAsyncComponent } from "vue";
import { useDateFormat } from "@vueuse/core";
// import { toast } from "@/composables/util";
// import FormDrawer from "@/components/FormDrawer.vue";
import { toNumber } from "lodash";
// import { getExpressCompanyList, getShipInfoList } from "@/api/order";
// import ShipInfoModal from "./ShipInfoModal.vue";
const ShipInfoModal = defineAsyncComponent(() => {
  return import("./ShipInfoModal.vue");
});

const emit = defineEmits(["reloadData"]);

const shipInfoModalRef = ref(null);
const loading = ref(false);

function openShipInfoModal() {
  let orderId = toNumber(form.orderInfo.id);
  loading.value = true;
  shipInfoModalRef.value.open(orderId).finally(() => {
    loading.value = false;
  });
}

const drawer = ref(null);
const form = {
  orderInfo: {
    id: "",
    no: "",
    payment_method: "",
    paid_time: null,
    create_time: null,
  },
  ship_data: {
    express_company: "-",
    express_no: "-",
    express_time: "-",
  },
  address: {
    name: "",
    phone: "",
    address: "",
  },
  goodsInfo: {
    totalPrice: 0,
    goods: [],
  },
  refund: {
    refund_status: "",
    refund_reason: "",
  },
};

function open(row) {
  // console.log(row);
  form.goodsInfo = {
    totalPrice: 0,
    goods: [],
  };
  for (const key in form.orderInfo) {
    form.orderInfo[key] = row[key];
  }
  form.orderInfo.paid_time = useDateFormat(
    form.orderInfo.paid_time * 1000,
    "YYYY-MM-DD HH:mm:ss"
  ).value;

  if (row.ship_data) {
    form.ship_data = { ...row.ship_data };
    form.ship_data.express_time = useDateFormat(
      form.ship_data.express_time * 1000,
      "YYYY-MM-DD HH:mm:ss"
    ).value;
  }

  if (row.address) {
    for (const key in form.address) {
      form.address[key] = row.address[key];
    }
    form.address[
      "address"
    ] = `${row.address.province}${row.address.city}${row.address.district}${row.address.address}`;
  }
  if (row.order_items && row.order_items.length > 0) {
    row.order_items.forEach((e) => {
      form.goodsInfo.totalPrice += e.num * toNumber(e.price);
      let temp = {
        title: e.goods_item?.title ? e.goods_item.title : "商品已被删除",
        price: e.price,
        num: e.num,
        cover: e.goods_item?.cover,
        showTag: e.skus_type == 1 && e.goods_skus,
        tagText: "",
      };
      if (e.goods_skus?.skus) {
        let str = "";
        for (const key in e.goods_skus.skus) {
          str += e.goods_skus.skus[key].value + ",";
        }
        str = str.slice(0, -1);
        temp.tagText = str;
      }
      form.goodsInfo.goods.push(temp);
    });
    form.goodsInfo.totalPrice = form.goodsInfo.totalPrice?.toFixed(2);
  }

  if (row.refund_status) {
    const opt = {
      pending: "未退款",
      applied: "已申请, 等待审核",
      processing: "退款中",
      success: "退款成功",
      failed: "退款失败",
    };
    form.refund.refund_status = opt[row.refund_status];
  }
  if (row.extra) {
    form.refund.refund_reason = row.extra.refund_reason;
  }

  drawer.value = true;
}
defineExpose({
  open,
});
</script>

<template>
  <el-drawer
    v-model="drawer"
    title="订单详情"
    size="50%"
    :destroy-on-close="true"
  >
    <div class="mx-auto w-[95%] space-y-2">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>订单详情</span>
          </div>
        </template>
        <!-- card body -->
        <el-form label-width="80px" :inline="false">
          <el-form-item label="订单号">
            {{ form.orderInfo.no }}
          </el-form-item>
          <el-form-item label="支付方式">
            {{ form.orderInfo.payment_method }}
          </el-form-item>
          <el-form-item label="支付时间">
            {{ form.orderInfo.paid_time }}
          </el-form-item>
          <el-form-item label="创建时间">
            {{ form.orderInfo.create_time }}
          </el-form-item>
        </el-form>
      </el-card>
      <el-card v-if="form.ship_data.express_no != '-'" shadow="never">
        <template #header>
          <div class="card-header">
            <span>发货信息</span>
          </div>
        </template>
        <!-- card body -->
        <el-form label-width="80px" :inline="false">
          <el-form-item label="物流公司">
            {{ form.ship_data.express_company }}
          </el-form-item>
          <el-form-item label="运单号">
            {{ form.ship_data.express_no }}
            <el-button
              :loading="loading"
              text
              type="primary"
              size="small"
              @click="openShipInfoModal"
            >
              查看物流
            </el-button>
          </el-form-item>
          <el-form-item label="发货时间">
            {{ form.ship_data.express_time }}
          </el-form-item>
        </el-form>
      </el-card>
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>商品信息</span>
          </div>
        </template>
        <!-- card body -->
        <div
          class="flex my-1"
          v-for="(item, index) in form.goodsInfo.goods"
          :key="index"
        >
          <el-image
            style="width: 70px; height: 70px"
            :src="item.cover"
            fit="fill"
            :lazy="true"
          ></el-image>
          <div class="ml-2 flex flex-col justify-between">
            <p>{{ item.title }}</p>
            <p>
              <el-tag v-if="item.showTag" type="info" size="small">
                {{ item.tagText }}
              </el-tag>
            </p>
            <p>
              <span class="text-red-500 font-bold">￥{{ item.price }}</span>
              <span class="ml-2 text-gray-500 text-xs">x{{ item.num }}</span>
            </p>
          </div>
        </div>
        <p class="mt-2">
          <span class="text-gray-500">成交价：</span>
          <span class="text-red-500 font-bold">
            ￥{{ form.goodsInfo.totalPrice }}
          </span>
        </p>
      </el-card>
      <el-card v-if="form.address.address" shadow="never">
        <template #header>
          <div class="card-header">
            <span>收货信息</span>
          </div>
        </template>
        <!-- card body -->
        <el-form label-width="80px" :inline="false">
          <el-form-item label="收货人">
            {{ form.address.name }}
          </el-form-item>
          <el-form-item label="联系方式">
            {{ form.address.phone }}
          </el-form-item>
          <el-form-item label="收货地址">
            {{ form.address.address }}
          </el-form-item>
        </el-form>
      </el-card>
      <el-card v-if="form.refund.refund_status != '未退款'" shadow="never">
        <template #header>
          <div class="card-header">
            <span>退款信息</span>
            <el-button text type="info" disabled>
              {{ form.refund.refund_status }}
            </el-button>
          </div>
        </template>
        <!-- card body -->
        <el-form label-width="80px" :inline="false">
          <el-form-item label="退款理由">
            {{ form.refund.refund_reason }}
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <ShipInfoModal ref="shipInfoModalRef"></ShipInfoModal>
  </el-drawer>
  <!-- </FormDrawer> -->
  <!--  -->
</template>
<style scoped>
.card-header {
  @apply font-bold text-sm mx-1 flex items-center justify-between;
}
:deep(.el-card__header) {
  @apply py-2 px-1 bg-gray-50;
}
</style>
