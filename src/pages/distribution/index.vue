<template>
  <div>
    <Panel></Panel>
    <el-card shadow="never" class="border-0">
      <!-- 头部区域 -->
      <div class="flex justify-between items-center mb-5">
        <!-- <div class="flex items-center"> -->
        <el-form class="flex items-center" label-width="auto">
          <el-form-item label="选择时间">
            <!-- 时间段：all全部，today今天，yesterday昨天，last7days最近7天 -->
            <el-radio-group v-model="searchForm.type" size="small">
              <el-radio-button label="全部" value="all" />
              <el-radio-button label="今天" value="today" />
              <el-radio-button label="昨天" value="yesterday" />
              <el-radio-button label="最近7天" value="last7days" />
            </el-radio-group>
          </el-form-item>
        </el-form>
        <!-- </div> -->
        <!-- 搜索模块 -->
        <SearchFather
          :searchForm="searchForm"
          @search="getData"
          @reset="resetSearchForm"
        >
          <!-- <template #default> </template> -->
          <template #selectItem>
            <SearchItem>
              <el-input
                style="width: 160px; margin-right: 10px"
                v-model="searchForm.keyword"
                clearable
                :prefix-icon="Search"
                @keyup.enter="getData"
                size="small"
                placeholder="筛选关键词..."
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
      >
        <el-table-column align="center" prop="id" label="ID" />
        <el-table-column align="center" label="头像">
          <template #default="{ row }">
            <el-avatar :size="40" :src="row.avatar">
              <img
                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
              />
            </el-avatar>
          </template>
        </el-table-column>
        <!-- prop="role.name" 等价于  prop="scope.row.role.name" -->
        <el-table-column width="200" label="用户信息">
          <template #default="{ row }">
            <div>
              <p>用户: {{ row.username ? row.username : "-" }}</p>
              <p>昵称: {{ row.nickname ? row.nickname : "-" }}</p>
              <p>姓名: {{ row.user_info?.name ? row.user_info?.name : "-" }}</p>
              <p>电话: {{ row.phone ? row.phone : "-" }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="share_num" label="推广量" />
        <el-table-column align="center" prop="share_order_num" label="订单量" />
        <el-table-column align="center" prop="order_price" label="订单金额" />
        <el-table-column align="center" prop="commission" label="账户佣金" />
        <el-table-column
          align="center"
          prop="cash_out_price"
          label="已提现(元)"
        />
        <el-table-column align="center" prop="cash_out_time" label="提现次数" />
        <el-table-column
          align="center"
          prop="no_cash_out_price"
          label="未提现(元)"
        />

        <el-table-column width="180" align="center" label="操作">
          <template #default="{ row }">
            <el-button
              type="primary"
              text
              size="small"
              @click="openDrawer(row.id, '推广人')"
            >
              推广人
            </el-button>
            <el-button
              type="primary"
              text
              size="small"
              @click="openDrawer(row.id, '推广订单')"
            >
              推广订单
            </el-button>
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
    </el-card>
    <DataDrawer openType="推广人" ref="dataDrawerRef" />
    <DataDrawer openType="推广订单" ref="dataOrderDrawerRef" />
  </div>
</template>

<script setup>
import Panel from "./components/panel.vue";
import { getAgentList } from "@/api/distribution";
import { ref, watch } from "vue";
import { Search } from "@element-plus/icons-vue";
import SearchFather from "@/components/SearchFather.vue";
import SearchItem from "@/components/SearchItem.vue";
import DataDrawer from "./components/dataDrawer.vue";

import { useInitTable } from "@/composables/useCommon";

const dataDrawerRef = ref(null);
const dataOrderDrawerRef = ref(null);
function openDrawer(id, type) {
  (type == "推广人" ? dataDrawerRef.value : dataOrderDrawerRef.value).open(id);
}

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
  getList: getAgentList,
  TempSearchForm: {
    keyword: "",
    type: "all",
    starttime: null,
    endtime: null,
  },
  onGetListSuccess: (res) => {
    // console.log(res);
    totalCount.value = res.totalCount;
    tableData.value = res.list.map((item) => {
      item.btnLoadingF = false;
      item.btnLoadingS = false;
      return item;
    });
  },
});

watch(
  () => searchForm.type,
  () => {
    // console.log(val);
    getData();
  }
);
</script>

<style scoped>
.elStyle .el-form-item {
  margin-bottom: 0;
}
:deep(.el-form-item) {
  margin-bottom: 0 !important;
}
</style>
