<script setup>
import { ref, watch } from "vue";
import { getAgentList, getAgentOrderList } from "@/api/distribution";
import { useInitTable } from "@/composables/useCommon";
const props = defineProps({
  openType: {
    type: String,
  },
});

const getFn = props.openType == "推广人" ? getAgentList : getAgentOrderList;

const {
  tableData,
  totalCount,
  currentPage,
  loading,
  searchForm,

  getData,
  pageChange,
} = useInitTable({
  getList: getFn,
  TempSearchForm: {
    type: "all",
    starttime: null,
    endtime: null,
    user_id: null,
    level: 0,
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

watch([() => searchForm.type, () => searchForm.level], () => {
  // console.log(val);
  getData();
});

const emit = defineEmits(["reloadData"]);

const drawer = ref(null);

function open(id) {
  // console.log(props.openType);
  // console.log(id, key);
  searchForm.user_id = id;
  drawer.value = true;
  getData();
}

function resetSearchForm() {
  (searchForm.type = "all"),
    (searchForm.starttime = null),
    (searchForm.endtime = null),
    (searchForm.level = 0);
}
defineExpose({
  open,
});
</script>

<template>
  <el-drawer
    v-model="drawer"
    :title="openType + '列表'"
    size="60%"
    :destroy-on-close="true"
  >
    <div class="flex justify-between items-center mb-5">
      <el-form class="space-y-2" :model="searchForm" label-width="auto">
        <el-form-item label="选择时间">
          <!-- 时间段：all全部，today今天，yesterday昨天，last7days最近7天 -->
          <el-radio-group v-model="searchForm.type" size="small">
            <el-radio-button label="全部" value="all" />
            <el-radio-button label="今天" value="today" />
            <el-radio-button label="昨天" value="yesterday" />
            <el-radio-button label="最近7天" value="last7days" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker
            v-model="searchForm.starttime"
            style="width: 160px; margin-right: 10px"
            type="date"
            placeholder="开始日期"
            size="small"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker
            v-model="searchForm.endtime"
            style="width: 160px; margin-right: 10px"
            type="date"
            placeholder="结束日期"
            size="small"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="用户类型">
          <!-- 用户类型：0全部，1一级推广，2二级推广 -->
          <el-radio-group v-model="searchForm.level" size="small">
            <el-radio-button label="全部" :value="0" />
            <el-radio-button label="一级推广" :value="1" />
            <el-radio-button label="二级推广" :value="2" />
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button size="small" type="primary" @click="getData"
            >搜索</el-button
          >
          <el-button @click="resetSearchForm" size="small">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格区域 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      style="width: 100%"
      class="flex justify-center"
    >
      <template v-if="openType == '推广人'">
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
        <el-table-column width="200" prop="username" label="用户信息" />
        <el-table-column align="center" prop="share_num" label="推广量" />
        <el-table-column align="center" prop="share_order_num" label="订单量" />
        <el-table-column
          width="200"
          align="center"
          prop="create_time"
          label="绑定时间"
        />
      </template>
      <template v-else>
        <el-table-column label="订单号">
          <template #default="{ row }">
            <span>
              {{ row.order?.no }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="用户名 | 昵称 | 手机">
          <template #default="{ row }">
            <span>
              {{ row.order?.user?.username }} |
              {{ row.order?.user?.nickname }} |
              {{ row.order?.user?.phone }}
            </span>
          </template>
        </el-table-column>
        <!-- prop="role.name" 等价于  prop="scope.row.role.name" -->
        <el-table-column width="200" prop="create_time" label="时间" />
        <el-table-column align="center" prop="commission" label="返佣金额" />
      </template>
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
  </el-drawer>
  <!--  -->
</template>
<style scoped>
/* .card-header {
  @apply font-bold text-sm mx-1 flex items-center justify-between;
}
:deep(.el-card__header) {
  @apply py-2 px-1 bg-gray-50;
} */
</style>
