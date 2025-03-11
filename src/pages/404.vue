<template>
  <div>
    <el-col :sm="12" :lg="6">
      <el-result icon="error" title="404 NotFound" sub-title="页面丢失~">
        <template #extra>
          <el-button type="primary" @click="$router.replace('/')"
            >返回首页</el-button
          >
        </template>
      </el-result>
    </el-col>
  </div>
</template>
<style scoped>
div {
  margin: auto;
  /* height: 100vh; */
}
</style>
