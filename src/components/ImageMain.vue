<script setup>
import { deleteImage, updateImage, getImageList } from "@/api/image";
import { computed, ref } from "vue";
import { showPrompt, toast } from "@/composables/util";
import UploadFile from "./UploadFile.vue";

const props = defineProps({
  id: {
    type: Number,
    default: 0,
  },
  iconShow: {
    type: Boolean,
    default: true,
  },
  imgType: {
    type: Number,
    default: 1,
  },
});
const loading = ref(false);
const list = ref([]);
const totalCount = ref(0);
const currentPage = ref(1);
const limit = ref(10);
const image_class_id = ref(0);
const checkValue = ref("");
const checkListValue = ref([]);
const checkList = computed(() => {
  return checkListValue.value.map((o) => o.url);
});
function checkChange(e, item) {
  // checkValue.value = item
  // console.log(checkValue.value);
  // console.log(e, url);
  if (e) {
    item.checked = true;
    checkValue.value = item.url;
    list.value = list.value.map((e) => {
      if (e.id != item.id) {
        e.checked = false;
      }
      return e;
    });
  } else {
    item.checked = false;
    checkValue.value = "";
  }
  // console.log(checkValue.value);
}

function multipleCheck(e, item) {
  // console.log(e, item);
  if (e) {
    checkListValue.value.push(item);
  } else {
    checkListValue.value = checkListValue.value.filter((o) => o.id != item.id);
  }
  // console.log(checkListValue.value);
}

function resetCheckList() {
  list.value = list.value.map((e) => {
    e.checked = false;
    return e;
  });
}

function getData() {
  loading.value = true;
  getImageList(image_class_id.value, currentPage.value)
    .then((res) => {
      // console.log(res);
      list.value = res.list.map((item) => {
        item.checked = false;
        return item;
      });
      totalCount.value = res.totalCount;
    })
    .finally(() => {
      loading.value = false;
    });
}
// getData();

// 根据分类id重新加载图片列表
function loadData(id) {
  currentPage.value = 1;
  image_class_id.value = id;
  getData();
}
function pageChange(pageId) {
  currentPage.value = pageId;
  getData();
}

function nameEdit(id, value) {
  showPrompt("重命名", value)
    .then((res) => {
      loading.value = true;
      updateImage(id, res.value)
        .then(() => {
          getData();
          toast("修改成功");
        })
        .finally(() => {
          loading.value = false;
        });
    })
    .catch(() => {});
}

function imgDelete(ids) {
  loading.value = true;
  deleteImage([ids])
    .then((res) => {
      getData();
      toast("删除成功");
      throw new Error("取消");
    })
    .catch(() => {})
    .finally(() => {
      loading.value = false;
    });
}

const drawer = ref(false);
function openUploadFile() {
  drawer.value = true;
}

defineExpose({
  checkValue,
  checkList,
  loadData,
  openUploadFile,
  resetCheckList,
});
</script>

<template>
  <el-main v-loading="loading" class="image-main">
    <div class="top p-3">
      <el-row :gutter="12">
        <el-col v-for="item in list" :key="item.id" :span="6">
          <el-card
            :class="{ activeCard: item.checked }"
            :style="{ height: iconShow ? '180px' : '150px' }"
            class="relative mb-3"
            :body-style="{ padding: 0 }"
            shadow="hover"
          >
            <el-image
              class="w-full h-150px"
              :lazy="true"
              fit="cover"
              :src="item.url"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[item.url]"
              :initial-index="0"
            />
            <p class="img-title">{{ item.name }}</p>

            <div
              v-if="iconShow"
              class="btnSty flex justify-evenly items-center"
            >
              <el-button
                @click="nameEdit(item.id, item.name)"
                text
                type="primary"
                size="small"
                >重命名</el-button
              >
              <el-popconfirm
                title="是否删除该图片?"
                confirm-button-text="确定"
                cancel-button-text="取消"
                @confirm="imgDelete(item.id)"
              >
                <template #reference>
                  <el-button text type="primary" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
            <el-checkbox
              v-else
              class="checkSty"
              v-model="item.checked"
              @change="
                (e) => {
                  imgType ? checkChange(e, item) : multipleCheck(e, item);
                }
              "
            >
            </el-checkbox>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="bottom">
      <el-pagination
        small
        background
        layout="prev, pager,next"
        :total="totalCount"
        :current-page="currentPage"
        :page-size="10"
        @current-change="pageChange"
      />
    </div>
  </el-main>
  <el-drawer v-model="drawer" title="上传图片">
    <UploadFile :data="{ image_class_id }"></UploadFile>
  </el-drawer>
</template>

<style scoped>
.image-main {
  border-right: none;
  position: relative;
  & .top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
    overflow-y: auto;
  }
  & .bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    @apply flex items-center justify-center;
  }
  & .el-image {
    display: block;
  }
}
.img-title {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  /* padding: 4px; */
  font-size: 14px;
  width: 100%;
  height: 30px;
  top: 120px;
  @apply truncate flex items-center px-2;

  /* overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; */
}
.btnSty {
  /* margin-bottom: auto; */
  /* position: absolute; */
  height: 30px;
  /* background-color: red; */
  & button {
    padding: 0;
    @apply mx-6px;
  }
}
.checkSty {
  position: absolute;
  right: 8px;
  top: 0;
}
.activeCard {
  @apply border-[2px] border-blue-500;
  transition: ease all 0.2s;
  /* transform: scale(1.02); */
}
</style>
