<script setup>
import { computed, defineAsyncComponent } from "vue";
import ListHeader from "@/components/ListHeader.vue";
import Coupon from "@/components/Coupon.vue";
// import FormDrawer from "@/components/FormDrawer.vue";

const FormDrawer = defineAsyncComponent(() => {
  return import("@/components/FormDrawer.vue");
});

import {
  getCouponList,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  updateCouponStatus,
} from "@/api/coupon";

import {
  useInitTable,
  useInitForm,
  useInitForm2,
} from "@/composables/useCommon";

const titleType = "新增优惠券";

const { tableData, totalCount, currentPage, loading, getData, pageChange } =
  useInitTable({
    getList: getCouponList,
    onGetListSuccess: (res) => {
      totalCount.value = res.totalCount;
      tableData.value = res.list.map((item) => {
        item.statusText = formatStatus(item);
        return item;
      });
    },
  });
const {
  formDrawerRef,
  handleEdit,
  handleCreate,
  ruleFormRef,
  ruleForm,
  rules,
  subId,
  handleSubmit,
} = useInitForm({
  TempRuleForm: {
    name: "",
    type: 0,
    value: null,
    total: 100,
    min_price: null,
    start_time: "",
    end_time: "",
    order: 50,
    desc: "",
  },
  TempRules: {},
  getData,
  update: updateCoupon,
  create: createCoupon,
  beforeSubmit: (res) => {
    if (typeof res.start_time != "number") {
      res.start_time = new Date(res.start_time).getTime();
    }
    if (typeof res.end_time != "number") {
      res.end_time = new Date(res.end_time).getTime();
    }
    return res;
  },
});

const { handleDelete, handleStatusChange } = useInitForm2({
  getData,
  delete: deleteCoupon,
  updateStatus: updateCouponStatus,
});

function formatStatus(e) {
  let tempStatusType = "领取中";
  let currentTime = new Date().getTime();
  let startTime = new Date(e.start_time).getTime();
  let endTime = new Date(e.end_time).getTime();
  if (currentTime < startTime) {
    tempStatusType = "未开始";
  } else if (currentTime > endTime) {
    tempStatusType = "已结束";
  } else if (e.status == 0) {
    tempStatusType = "已失效";
  }
  return tempStatusType;
}

const timerange = computed({
  get() {
    if (ruleForm.start_time && ruleForm.end_time) {
      return [ruleForm.start_time, ruleForm.end_time];
    } else {
      return [];
    }
  },
  set(val) {
    if (val) {
      // api接口设置的接收时间戳
      ruleForm.start_time = val[0];
      ruleForm.end_time = val[1];
    }
  },
});
</script>
<template>
  <el-card shadow="never" class="border-0">
    <!-- 新增|刷新 按钮 -->
    <ListHeader
      class="justify-between mb-4"
      @create="handleCreate"
      @refresh="getData"
    ></ListHeader>

    <!-- 表格区域 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      class="flex justify-center"
    >
      <el-table-column width="400" label="优惠券名称">
        <template #default="scope">
          <Coupon
            :statusText="scope.row.statusText"
            :name="scope.row.name"
            :start_time="scope.row.start_time"
            :end_time="scope.row.end_time"
            :type="scope.row.type"
            :value="scope.row.value"
            :min_price="scope.row.min_price"
          ></Coupon>
          <!-- <div
            :class="scope.row.statusText == '领取中' ? 'active' : 'inactive'"
            class="border border-dashed rounded py-2 px-4"
          >
            <h5 class="font-bold text-md">{{ scope.row.name }}</h5>
            <small>{{ scope.row.start_time }} ~ {{ scope.row.end_time }}</small>
          </div> -->
        </template>
      </el-table-column>
      <el-table-column prop="statusText" align="center" label="状态" />
      <el-table-column label="优惠">
        <template #default="scope">
          <span v-if="scope.row.type == 0">
            满 {{ scope.row.min_price }}元<br />
            减 {{ scope.row.value }}元
          </span>
          <span v-else>
            满 {{ scope.row.min_price }}元<br />
            打 {{ scope.row.value }}折
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="total" align="center" label="发放数量" />
      <el-table-column prop="used" align="center" label="已使用" />

      <el-table-column width="180" align="center" label="操作">
        <template #default="scope">
          <el-button
            v-if="scope.row.statusText == '未开始'"
            type="primary"
            size="small"
            @click="handleEdit(scope.row)"
            >修改</el-button
          >
          <el-popconfirm
            v-if="scope.row.statusText != '领取中'"
            title="是否删除该优惠券?"
            confirm-button-text="确定"
            confirm-button
            :hide-after="0"
            cancel-button-text="取消"
            @confirm="handleDelete(scope.row)"
          >
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm
            v-if="scope.row.statusText == '领取中'"
            title="是否让该优惠券失效?"
            confirm-button-text="确定"
            confirm-button
            :hide-after="0"
            cancel-button-text="取消"
            @confirm="
              async () => {
                await handleStatusChange(0, scope.row);
                getData();
              }
            "
          >
            <template #reference>
              <el-button size="small" type="danger">设置失效</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
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
    <FormDrawer
      @submit="handleSubmit"
      :title="titleType"
      size="30%"
      ref="formDrawerRef"
      destoryOnClose="true"
    >
      <el-form
        ref="ruleFormRef"
        style="max-width: 600px"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="优惠券名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="..." />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="ruleForm.type">
            <el-radio :value="0">满减</el-radio>
            <el-radio :value="1">折扣</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="面值" prop="value">
          <el-input
            style="max-width: 180px"
            v-model="ruleForm.value"
            placeholder="优惠金额/折扣"
          >
            <template #append>{{ ruleForm.type == 0 ? "元" : "折" }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="发放数量" prop="total">
          <el-input-number v-model="ruleForm.total" :min="0" :max="1000" />
        </el-form-item>
        <el-form-item label="使用门槛" prop="min_price">
          <el-input
            style="max-width: 180px"
            v-model="ruleForm.min_price"
            placeholder="最低使用价格"
          >
            <template #append> 元 </template>
          </el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="ruleForm.order" :min="0" :max="1000" />
        </el-form-item>
        <el-form-item label="有效期" prop="start_time">
          <!-- {{ timerange }} -->
          <el-date-picker
            :editable="false"
            v-model="timerange"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="datetimerange"
            range-separator="To"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            size="default"
          />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input
            v-model="ruleForm.desc"
            placeholder="..."
            type="textarea"
            :rows="5"
          />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>
<style scoped>
.active {
  @apply border-rose-200 bg-rose-50 text-red-400;
}
.inactive {
  @apply border-gray-200 bg-gray-50 text-gray-400;
}
</style>
