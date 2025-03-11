<script setup>
import { defineAsyncComponent, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import ListHeader from "@/components/ListHeader.vue";
import SearchFather from "@/components/SearchFather.vue";
import SearchItem from "@/components/SearchItem.vue";
import { showModal, showPrompt, toast } from "@/composables/util";
// import ExportExcel from "./components/exportExcel.vue";
// import InfoModal from "./components/InfoModal.vue";

const ExportExcel = defineAsyncComponent(() => {
  return import("./components/exportExcel.vue");
});
const InfoModal = defineAsyncComponent(() => {
  return import("./components/InfoModal.vue");
});

import {
  getOrderList,
  deleteOrder,
  shipOrder,
  refundOrder,
  exportOrder,
  getExpressCompanyList,
  getShipInfoList,
} from "@/api/order";

import {
  useInitTable,
  useInitForm,
  useInitForm2,
} from "@/composables/useCommon";

// const titleType = computed(() => (subId.value ? "修改管理员" : "新增管理员"));

const {
  tableData,
  totalCount,
  currentPage,
  loading,
  searchForm,
  resetSearchForm,
  getData,
  pageChange,
} = useInitTable({
  getList: getOrderList,
  TempSearchForm: {
    tab: "all",
    no: null,
    starttime: null,
    endtime: null,
    name: null,
    phone: null,
  },
  onGetListSuccess: (res) => {
    // console.log(res);
    totalCount.value = res.totalCount;
    tableData.value = res.list.map((item) => {
      return item;
    });
  },
});
// const {
//   formDrawerRef,
//   handleEdit,
//   handleCreate,
//   ruleFormRef,
//   ruleForm,
//   rules,
//   subId,
//   handleSubmit,
// } = useInitForm({
//   TempRuleForm: {
//     title: null,
//     category_id: null,
//     cover: null,
//     desc: null,
//     unit: "件",
//     stock: 100,
//     min_stock: 10,
//     status: 1, // 1, 是否上架 0仓库 1上架
//     stock_display: 1, // 库存显示 0隐藏 1显示
//     min_price: 0, // 最低售价
//     min_oprice: 0, // 最低原价
//   },
//   getData,
//   update: updateGoods,
//   create: createGoods,
// });

const { multipleTableRef, handleSelectionChange, handleMultiDelete } =
  useInitForm2({
    getData,
    delete: deleteOrder,
  });

// 导出订单
const exportExcelRef = ref(null);
function openExportExcel() {
  exportExcelRef.value.open();
}

// 订单详情
const infoModalRef = ref(null);
function openInfoModal(row) {
  infoModalRef.value.open(row);
}

// 同意、拒绝退款
function handleRefund(id, agree) {
  (agree
    ? showModal("是否同意退款?")
    : showPrompt("请填写拒绝退款的理由")
  ).then(({ value }) => {
    // console.log(value);
    refundOrder(id, { agree, disagree_reason: value })
      .then((res) => {
        toast("操作成功");
        getData();
      })
      .catch((err) => {
        // console.log(err);
      });
  });
}
</script>
<template>
  <div>
    <!-- tabs标签栏 -->
    <el-tabs v-model="searchForm.tab" class="" @tab-change="getData">
      <el-tab-pane label="全部" name="all" />
      <el-tab-pane label="待支付" name="nopay" />
      <el-tab-pane label="待发货" name="noship" />
      <el-tab-pane label="待收货" name="shiped" />
      <el-tab-pane label="已收货" name="received" />
      <el-tab-pane label="已完成" name="finish" />
      <el-tab-pane label="已关闭" name="closed" />
      <el-tab-pane label="退款中" name="refunding" />
    </el-tabs>
    <!-- 主体区域 -->
    <el-card shadow="never" class="border-0">
      <!-- 主体头部区域 -->
      <div class="flex flex-wrap justify-between items-center mb-5">
        <!-- 新增|刷新 按钮 -->
        <ListHeader
          layout="refresh,download"
          @refresh="getData"
          @download="openExportExcel"
        >
          <el-button
            type="danger"
            v-if="searchForm.tab != 'delete'"
            size="small"
            @click="handleMultiDelete"
          >
            批量删除
          </el-button>
        </ListHeader>

        <!-- 搜索模块 -->
        <SearchFather
          :searchForm="searchForm"
          @search="getData"
          @reset="resetSearchForm"
        >
          <template #default>
            <SearchItem>
              <el-input
                v-model="searchForm.no"
                style="width: 160px; margin-right: 10px"
                clearable
                :prefix-icon="Search"
                @keyup.enter="getData"
                size="small"
                placeholder="订单编号"
              />
            </SearchItem>
          </template>
          <template #selectItem>
            <SearchItem>
              <el-input
                v-model="searchForm.name"
                style="width: 160px; margin-right: 10px"
                clearable
                @keyup.enter="getData"
                size="small"
                placeholder="收货人"
              />
            </SearchItem>
            <SearchItem>
              <el-input
                v-model="searchForm.phone"
                style="width: 160px; margin-right: 10px"
                clearable
                @keyup.enter="getData"
                size="small"
                placeholder="手机号"
              />
            </SearchItem>
            <SearchItem>
              <el-date-picker
                v-model="searchForm.starttime"
                style="width: 160px; margin-right: 10px"
                type="date"
                placeholder="开始日期"
                size="small"
                value-format="yyyy-MM-dd"
              />
            </SearchItem>
            <SearchItem>
              <el-date-picker
                v-model="searchForm.endtime"
                style="width: 160px; margin-right: 10px"
                type="date"
                placeholder="结束日期"
                size="small"
                value-format="yyyy-MM-dd"
              />
            </SearchItem>
          </template>
        </SearchFather>
      </div>
      <!-- 表格区域 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        style="width: 100%"
        class="flex justify-center"
        ref="multipleTableRef"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column width="300" label="商品">
          <template #default="{ row }">
            <div>
              <p>
                订单号: <span>{{ row.no }}</span>
              </p>
              <p class="my-2 text-xs text-gray-400">
                下单时间: <span>{{ row.create_time }}</span>
              </p>
            </div>
            <!-- <div class="flex items-center"> -->
            <div
              class="my-2 flex items-center text-blue-400"
              v-for="(item, index) in row.order_items"
              :key="index"
            >
              <el-image
                style="width: 30px; height: 30px"
                :lazy="true"
                fit="cover"
                class="mr-3 rounded"
                :src="item.goods_item?.cover"
              />
              {{ item.goods_item ? item.goods_item.title : "商品已被删除" }}
            </div>
            <!-- </div> -->
          </template>
        </el-table-column>
        <!-- prop="role.name" 等价于  prop="scope.row.role.name" -->
        <el-table-column align="center" prop="total_price" label="实际付款" />
        <el-table-column align="center" label="买家">
          <template #default="{ row }">
            <p>{{ row.user.nickname }}</p>
            <p>(用户ID: {{ row.user.id }})</p>
          </template>
        </el-table-column>
        <el-table-column width="200" align="center" label="交易状态">
          <template #default="{ row }">
            <div>
              <p class="my-1">
                <span class="mr-2">付款状态:</span>
                <el-tag size="small" v-if="!row.payment_method" type="info">
                  未支付
                </el-tag>
                <el-tag
                  size="small"
                  v-else-if="row.payment_method == 'alipay'"
                  type="primary"
                >
                  支付宝支付
                </el-tag>
                <el-tag v-else size="small" type="success">微信支付</el-tag>
              </p>
              <p class="my-1">
                <span class="mr-2">发货状态:</span>
                <el-tag size="small" :type="row.ship_data ? 'success' : 'info'">
                  {{ row.ship_data ? "已发货" : "未发货" }}
                </el-tag>
              </p>
              <p class="my-1">
                <span class="mr-2">收货状态:</span>
                <el-tag
                  size="small"
                  :type="row.ship_status == 'received' ? 'success' : 'info'"
                >
                  {{ row.ship_status == "received" ? "已收货" : "未收货" }}
                </el-tag>
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="340" align="center" label="操作">
          <template #default="{ row }">
            <el-button
              text
              type="primary"
              size="small"
              @click="openInfoModal(row)"
            >
              订单详情
            </el-button>
            <el-button
              v-if="searchForm.tab == 'noship'"
              text
              type="primary"
              size="small"
              @click=""
            >
              订单发货
            </el-button>
            <el-button
              v-if="searchForm.tab == 'refunding'"
              text
              type="primary"
              size="small"
              @click="handleRefund(row.id, 1)"
            >
              同意退款
            </el-button>
            <el-button
              v-if="searchForm.tab == 'refunding'"
              text
              type="primary"
              size="small"
              @click="handleRefund(row.id, 0)"
            >
              拒绝退款
            </el-button>

            <!-- <el-popconfirm
              title="是否删除该管理员?"
              confirm-button-text="确定"
              confirm-button
              :hide-after="0"
              cancel-button-text="取消"
              @confirm="handleDelete(scope.row)"
            >
              <template #reference>
                <el-button size="small" text type="primary">删除</el-button>
              </template>
            </el-popconfirm> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <div class="flex justify-center items-center mt-5">
        <el-pagination
          background
          layout="prev, pager,next"
          :total="totalCount"
          :current-page="currentPage"
          :page-size="10"
          @current-change="pageChange"
        />
      </div>
      <!-- 弹框区域 -->
      <!-- <FormDrawer
        @submit="handleSubmit"
        :title="titleType"
        size="30%"
        ref="formDrawerRef"
        destoryOnClose="true"
      >
      </FormDrawer> -->
      <ExportExcel ref="exportExcelRef"></ExportExcel>
      <InfoModal ref="infoModalRef"></InfoModal>
    </el-card>
  </div>
</template>
<style scoped>
.elStyle .el-form-item {
  margin-bottom: 0;
}
.cell button {
  margin-left: 0;
}
</style>
