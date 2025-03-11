<script setup>
import { computed, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import SearchFather from "@/components/SearchFather.vue";
import SearchItem from "@/components/SearchItem.vue";
import { toast } from "@/composables/util";

import {
  getCommentList,
  updateCommentStatus,
  reviewComment,
} from "@/api/goods_comment";

import {
  useInitTable,
  useInitForm,
  useInitForm2,
} from "@/composables/useCommon";

const levelList = ref(null);
const titleType = computed(() => (subId.value ? "修改会员" : "新增会员"));

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
  getList: getCommentList,
  TempSearchForm: {
    title: "",
  },
  onGetListSuccess: (res) => {
    console.log(res);
    totalCount.value = res.totalCount;
    tableData.value = res.list.map((item) => {
      item.statusLoading = false;
      return item;
    });
  },
});

const { handleStatusChange, handleDelete } = useInitForm2({
  getData,
  updateStatus: updateCommentStatus,
});

const subData = ref("");
const showReview = ref(false);
function reviewSubmit(id) {
  console.log(subData.value);
  reviewComment(id, subData.value)
    .then((res) => {
      //   console.log(res);
      toast("回复成功");
      getData();
    })
    .finally(() => {
      showReview.value = false;
    });
}
function editReview(data) {
  //   console.log(data);
  subData.value = data[0].data;
  showReview.value = true;
}
</script>
<template>
  <el-card shadow="never" class="border-0">
    <div class="flex justify-between items-center mb-5">
      <!-- 搜索模块 -->
      <SearchFather
        :searchForm="searchForm"
        @search="getData"
        @reset="resetSearchForm"
      >
        <template #default>
          <SearchItem>
            <el-input
              style="width: 160px; margin-right: 10px"
              v-model="searchForm.title"
              clearable
              :prefix-icon="Search"
              @keyup.enter="getData"
              size="small"
              placeholder="筛选关键词..."
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
      default-expand-all
    >
      <el-table-column type="expand">
        <template #default="{ row }">
          <div m="4" class="flex">
            <!-- <p m="t-0 b-2">State: {{ row.review }}</p> -->
            <el-avatar class="mx-4 ml-20" :size="50" :src="row.user.avatar">
              <img
                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
              />
            </el-avatar>
            <div class="flex-1">
              <p>
                {{ row.user.nickname }}
                <span class="text-xs text-gray-400">
                  {{ row.review_time }}
                </span>
              </p>
              <p class="my-1">{{ row.review.data }}</p>
              <el-image
                style="width: 100px; height: 100px"
                v-for="(item, index) in row.review.image"
                :key="index"
                :src="item"
                fit="fill"
                :lazy="true"
              ></el-image>
              <template v-if="showReview">
                <el-form :inline="false">
                  <el-form-item label="">
                    <el-input
                      style="width: 90%"
                      type="textarea"
                      v-model="subData"
                    ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      size="small"
                      type="primary"
                      @click="reviewSubmit(row.id)"
                    >
                      回复
                    </el-button>
                    <el-button size="small" @click="showReview = false"
                      >取消</el-button
                    >
                  </el-form-item>
                </el-form>
              </template>
              <div
                v-else
                class="min-h-12 relative my-3 p-4 bg-gray-100 rounded w-9/10"
              >
                <p>客服</p>
                <p v-for="(item, index) in row.extra" :key="index">
                  {{ item.data }}
                </p>
                <el-button
                  v-if="row.extra.length == 0"
                  class="absolute right-3 top-3"
                  type="info"
                  size="small"
                  @click="showReview = true"
                >
                  回复
                </el-button>
                <el-button
                  v-else
                  class="absolute right-3 top-3"
                  type="info"
                  size="small"
                  @click="editReview(row.extra)"
                >
                  修改
                </el-button>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center" prop="id" label="ID" />
      <el-table-column label="商品">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-avatar :size="40" :src="row.goods_item.cover">
              <img
                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
              />
            </el-avatar>
            <div class="ml-3">
              <p>{{ row.goods_item.title }}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- prop="role.name" 等价于  prop="scope.row.role.name" -->
      <el-table-column width="200" align="center" label="评价信息">
        <template #default="{ row }">
          <p>用户: {{ row.user.nickname }}</p>
          <el-rate
            v-model="row.rating"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}"
          />
        </template>
      </el-table-column>

      <el-table-column
        width="200"
        align="center"
        prop="create_time"
        label="评价时间"
      />

      <el-table-column width="120" label="状态">
        <template #default="{ row }">
          <el-switch
            :disabled="row.super == 1"
            :loading="row.statusLoading"
            @change="handleStatusChange($event, row)"
            :modelValue="row.status"
            :activeValue="1"
            :inactiveValue="0"
          />
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
  </el-card>
</template>
<style scoped>
.elStyle .el-form-item {
  margin-bottom: 0;
}
</style>
