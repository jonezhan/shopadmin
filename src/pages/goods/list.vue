<script setup>
import { computed, ref, defineAsyncComponent } from "vue";
import { Search } from "@element-plus/icons-vue";
// import ChooseImage from "@/components/ChooseImage.vue";
import FormDrawer from "@/components/FormDrawer.vue";
import ListHeader from "@/components/ListHeader.vue";
import { getCategoryList } from "@/api/category";
import SearchFather from "@/components/SearchFather.vue";
import SearchItem from "@/components/SearchItem.vue";
// import Banners from "./banners.vue";
// import Content from "./content.vue";
// import Skus from "./skus.vue";
import { toast } from "@/composables/util";

const Skus = defineAsyncComponent(() => {
  return import("./skus.vue");
});
const Content = defineAsyncComponent(() => {
  return import("./content.vue");
});
const Banners = defineAsyncComponent(() => {
  return import("./banners.vue");
});
const ChooseImage = defineAsyncComponent(() => {
  return import("@/components/ChooseImage.vue");
});

import {
  getGoodsList,
  createGoods,
  updateGoods,
  deleteGoods,
  updateGoodsStatus,
  restoreGoods,
  destroyGoods,
} from "@/api/goods";

import {
  useInitTable,
  useInitForm,
  useInitForm2,
} from "@/composables/useCommon";

const titleType = computed(() => (subId.value ? "修改管理员" : "新增管理员"));

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
    tableData.value = res.list.map((item) => {
      item.bannersLoading = false;
      item.contentLoading = false;
      item.skusLoading = false;
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
    title: null,
    category_id: null,
    cover: null,
    desc: null,
    unit: "件",
    stock: 100,
    min_stock: 10,
    status: 1, // 1, 是否上架 0仓库 1上架
    stock_display: 1, // 库存显示 0隐藏 1显示
    min_price: 0, // 最低售价
    min_oprice: 0, // 最低原价
  },
  getData,
  update: updateGoods,
  create: createGoods,
});

const {
  ids,
  handleStatusChange,
  handleDelete,
  multipleTableRef,
  handleSelectionChange,
  handleMultiDelete,
  handleMultiStatusChange,
} = useInitForm2({
  getData,
  updateStatus: updateGoodsStatus,
  delete: deleteGoods,
});

// 商品分类
const categoryList = ref([]);
getCategoryList().then((res) => {
  // console.log(res);
  categoryList.value = res;
});

// 设置轮播图
const bannersRef = ref(null);
function handleSetBanners(row) {
  bannersRef.value.open(row);
}

// 设置商品详情
const contentRef = ref(null);
function handleSetContent(row) {
  contentRef.value.open(row);
}

// 设置商品规格
const skusRef = ref(null);
function handleSetSkus(row) {
  skusRef.value.open(row);
}

// 恢复商品
function handleRestoreGoods() {
  restoreGoods(ids.value).then((res) => {
    // console.log(res);
    toast("恢复成功");
    // 清空用户选中
    if (multipleTableRef.value) {
      multipleTableRef.value.clearSelection();
    }
    ids.value.length = 0;
    getData();
  });
}

// 彻底删除商品
function handleDestroyGoods() {
  destroyGoods(ids.value).then((res) => {
    // console.log(res);
    toast("彻底删除成功");
    // 清空用户选中
    if (multipleTableRef.value) {
      multipleTableRef.value.clearSelection();
    }
    ids.value.length = 0;
    getData();
  });
}
</script>
<template>
  <div>
    <!-- tabs标签栏 -->
    <el-tabs v-model="searchForm.tab" class="" @tab-change="getData">
      <el-tab-pane label="全部" name="all" />
      <el-tab-pane label="审核中" name="checking" />
      <el-tab-pane label="出售中" name="saling" />
      <el-tab-pane label="已下架" name="off" />
      <el-tab-pane label="库存预警" name="min_stock" />
      <el-tab-pane label="回收站" name="delete" />
    </el-tabs>
    <!-- 主体区域 -->
    <el-card shadow="never" class="border-0">
      <!-- 主体头部区域 -->
      <div class="flex justify-between items-center mb-5">
        <!-- 新增|刷新 按钮 -->
        <ListHeader
          layout="create,refresh"
          @create="handleCreate"
          @refresh="getData"
        >
          <el-button
            type="danger"
            v-if="searchForm.tab != 'delete'"
            size="small"
            @click="handleMultiDelete"
          >
            批量删除
          </el-button>
          <el-button
            type="warning"
            v-else
            size="small"
            @click="handleRestoreGoods"
          >
            恢复商品
          </el-button>

          <el-popconfirm
            v-if="searchForm.tab == 'delete'"
            title="是否删除选中记录?"
            confirm-button-text="确定"
            confirm-button
            :hide-after="0"
            cancel-button-text="取消"
            @confirm="handleDestroyGoods"
          >
            <template #reference>
              <el-button type="danger" size="small"> 彻底删除 </el-button>
            </template>
          </el-popconfirm>

          <el-button
            v-if="searchForm.tab == 'all' || searchForm.tab == 'off'"
            size="small"
            @click="handleMultiStatusChange(1)"
          >
            上架
          </el-button>
          <el-button
            v-if="searchForm.tab == 'all' || searchForm.tab == 'saling'"
            size="small"
            @click="handleMultiStatusChange(0)"
          >
            下架
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
      <el-scrollbar>
        <el-table
          v-loading="loading"
          :data="tableData"
          stripe
          style="width: 100%; min-width: 1100px"
          class="flex justify-center"
          ref="multipleTableRef"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40" />
          <el-table-column width="300" label="商品">
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
                  <div>
                    <span class="text-rose-500">￥{{ row.min_price }}</span>
                    <el-divider direction="vertical" />
                    <span class="text-gray-500 text-xs"
                      >￥{{ row.min_oprice }}</span
                    >
                  </div>
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
          <el-table-column align="center" prop="sale_count" label="实际销量" />
          <el-table-column align="center" prop="status" label="商品状态">
            <template #default="{ row }">
              <el-tag v-if="row.ischeck == 0" type="warning">待审核</el-tag>
              <el-tag v-else-if="row.status == 1" type="success">已上架</el-tag>
              <el-tag v-else type="danger">在仓库</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            v-if="searchForm.tab != 'delete'"
            width="100"
            align="center"
            prop="status"
            label="审核状态"
          >
            <template #default="{ row }">
              <div v-if="row.ischeck == 0">
                <el-button plain type="success" size="small"
                  >审核通过</el-button
                >
                <el-button
                  style="margin-left: 0"
                  class="mt-2"
                  plain
                  type="danger"
                  size="small"
                  >审核拒绝</el-button
                >
              </div>
              <span v-else>{{ row.ischeck == 1 ? "已通过" : "已拒绝" }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="stock" label="库存" />

          <el-table-column width="340" align="center" label="操作">
            <template #default="scope">
              <small
                v-if="searchForm.tab == 'delete'"
                class="text-sm text-gray-500"
                >暂无操作</small
              >
              <template v-else>
                <el-button
                  text
                  type="primary"
                  size="small"
                  @click="handleEdit(scope.row)"
                  >修改</el-button
                >
                <el-button
                  text
                  :type="
                    (scope.row.sku_type == 0 && !scope.row.sku_value) ||
                    (scope.row.sku_type == 1 && !scope.row.goods_skus.length)
                      ? 'danger'
                      : 'primary'
                  "
                  size="small"
                  @click="handleSetSkus(scope.row)"
                  :loading="scope.row.skusLoading"
                  >商品规格</el-button
                >
                <el-button
                  text
                  :type="
                    scope.row.goods_banner?.length != 0 ? 'primary' : 'danger'
                  "
                  size="small"
                  @click="handleSetBanners(scope.row)"
                  :loading="scope.row.bannersLoading"
                  >设置轮播图</el-button
                >
                <el-button
                  :type="scope.row.content ? 'primary' : 'danger'"
                  text
                  type="primary"
                  size="small"
                  @click="handleSetContent(scope.row)"
                  :loading="scope.row.contentLoading"
                  >商品详情</el-button
                >
                <el-popconfirm
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
                </el-popconfirm>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>

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
          <el-form-item label="商品名称" prop="title">
            <el-input
              style="width: 90%"
              v-model="ruleForm.title"
              maxlength="20"
              show-word-limit
              placeholder="请输入商品名称, 不得大于20个字符"
            />
          </el-form-item>
          <el-form-item label="封面" prop="cover">
            <ChooseImage v-model="ruleForm.cover"></ChooseImage>
          </el-form-item>
          <el-form-item label="商品分类" prop="category_id">
            <el-select
              v-model="ruleForm.category_id"
              placeholder="选择商品分类"
              style="width: 240px"
            >
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="商品描述" prop="desc">
            <el-input
              v-model="ruleForm.desc"
              style="width: 90%"
              type="textarea"
              :rows="5"
              maxlength="100"
              show-word-limit
              placeholder="描述您的商品"
            />
          </el-form-item>
          <el-form-item label="单位" prop="unit">
            <el-input
              style="width: 120px"
              v-model="ruleForm.unit"
              placeholder="输入商品单位"
            ></el-input>
          </el-form-item>
          <el-form-item label="总库存" prop="stock">
            <el-input
              type="number"
              style="width: 160px"
              v-model="ruleForm.stock"
            >
              <template #append>
                {{ ruleForm.unit }}
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存预警" prop="min_stock">
            <el-input
              type="number"
              style="width: 160px"
              v-model="ruleForm.min_stock"
            >
              <template #append>
                {{ ruleForm.unit }}
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="最低售价" prop="min_price">
            <el-input
              type="number"
              style="width: 160px"
              v-model="ruleForm.min_price"
            >
              <template #append> 元 </template>
            </el-input>
          </el-form-item>
          <el-form-item label="最低原价" prop="min_oprice">
            <el-input
              type="number"
              style="width: 160px"
              v-model="ruleForm.min_oprice"
            >
              <template #append> 元 </template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存显示" prop="stock_display">
            <el-radio-group v-model="ruleForm.stock_display">
              <el-radio :value="0" size="large">隐藏</el-radio>
              <el-radio :value="1" size="large">显示</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否上架" prop="status">
            <el-radio-group v-model="ruleForm.status">
              <el-radio :value="0" size="large">放入仓库</el-radio>
              <el-radio :value="1" size="large">立即上架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </FormDrawer>
    </el-card>
    <Banners @reloadData="getData" ref="bannersRef"></Banners>
    <Content @reloadData="getData" ref="contentRef"></Content>
    <Skus @reloadData="getData" ref="skusRef"></Skus>
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
