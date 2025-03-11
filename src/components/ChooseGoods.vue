<template>
  <el-dialog
    destroy-on-close
    v-model="dialogVisible"
    :title="dialogTitle"
    width="80%"
    style="height: 600px"
    align-center
  >
    <!-- 主体区域 -->

    <!-- <el-card hadow="never" class="border-0"> -->
    <!-- 主体头部区域 -->
    <div class="flex justify-end items-center my-2">
      <!-- 搜索模块 -->
      <SearchFather
        :searchForm="searchForm"
        @search="getData"
        @reset="resetSearchForm"
      >
        <template #default>
          <SearchItem>
            <el-input
              v-model="searchForm.title"
              style="width: 160px; margin-right: 10px"
              clearable
              :prefix-icon="Search"
              @keyup.enter="getData"
              size="small"
              placeholder="筛选关键词..."
            />
          </SearchItem>
        </template>
        <template #selectItem>
          <SearchItem>
            <el-select
              v-model="searchForm.category_id"
              style="width: 140px; margin-right: 10px"
              size="small"
              placeholder="请选择商品分类"
              clearable
              filterable
            >
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </SearchItem>
        </template>
      </SearchFather>
    </div>
    <!-- 表格区域 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      style="width: 100%; height: 380px"
      class="flex justify-center m-2"
      ref="multipleTableRef"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40" />
      <el-table-column label="商品">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-image
              style="width: 70px; height: 70px"
              :lazy="true"
              fit="cover"
              class="mr-3 rounded"
              :src="row.cover"
            />
            <div class="flex-1">
              <p>{{ row.title }}</p>

              <p class="text-gray-400 text-xs mb-1">
                分类：{{ row.category ? row.category.name : "未分类" }}
              </p>
              <p class="text-gray-400 text-xs">
                创建时间：{{ row.create_time }}
              </p>
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- prop="role.name" 等价于  prop="scope.row.role.name" -->

      <el-table-column width="200" align="center" prop="stock" label="总库存" />

      <el-table-column width="200" align="center" label="价格(元)">
        <template #default="{ row }">
          <div>
            <span class="text-rose-500">￥{{ row.min_price }}</span>
            <el-divider direction="vertical" />
            <span class="text-gray-500 text-xs">￥{{ row.min_oprice }}</span>
          </div>
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
    <!-- </el-card> -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogSubmit"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from "vue";
import { getGoodsList } from "@/api/goods";
import { getCategoryList } from "@/api/category";
import { useInitTable } from "@/composables/useCommon";
import { Search } from "@element-plus/icons-vue";
import SearchFather from "@/components/SearchFather.vue";
import SearchItem from "@/components/SearchItem.vue";

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
  getList: getGoodsList,
  TempSearchForm: {
    tab: "all",
    title: null,
    category_id: null,
    limit: 10,
  },
  onGetListSuccess: (res) => {
    // console.log(res);
    // roles.value = res.roles;
    totalCount.value = res.totalCount;
    tableData.value = res.list;
  },
});

// 商品分类
const categoryList = ref([]);
getCategoryList().then((res) => {
  // console.log(res);
  categoryList.value = res;
});

const multipleTableRef = ref(null);
const goods_ids = ref([]);
function handleSelectionChange(val) {
  goods_ids.value = val?.map((item) => item.id);
}

const dialogTitle = ref("商品选择");
const dialogVisible = ref(false);

function openDialog() {
  dialogVisible.value = true;
}

function dialogSubmit() {
  emit("setChoose", goods_ids.value);
  if (multipleTableRef.value) {
    multipleTableRef.value.clearSelection();
  }
  dialogVisible.value = false;
}

defineExpose({
  openDialog,
});

const emit = defineEmits(["setChoose"]);
</script>

<style scoped>
.elStyle .el-form-item {
  margin-bottom: 0;
}
</style>
