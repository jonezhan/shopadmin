<script setup>
import { uploadImageAction } from "@/api/image";
import { getToken } from "@/composables/auth";
import { toast } from "@/composables/util";
import { ref } from "vue";
const uploadRef = ref(null);
const submitUpload = () => {
  uploadRef.value.submit();
};

const emit = defineEmits(["success"]);
const token = getToken();

function uploadSuccess(response, UploadFile, UploadFiles) {
  // console.log(response);
  // toast("上传成功", "success");
}
function uploadError(error, UploadFile, UploadFiles) {
  let msg = JSON.parse(error.message).msg || "上传失败";
  toast(msg, "error");
}
defineProps({
  data: Object,
});
</script>

<template>
  <el-upload
    :limit="2"
    ref="uploadRef"
    :auto-upload="false"
    :on-success="uploadSuccess"
    :on-error="uploadError"
    name="img"
    :data="data"
    :headers="{ token }"
    drag
    :action="uploadImageAction"
    :multiple="true"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      Drop file here or <em>click to upload</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500kb
      </div>
    </template>
  </el-upload>
  <el-button class="ml-3" type="success" @click="submitUpload">
    upload to server
  </el-button>
</template>
