<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <el-result title="404" sub-title="Sorry,404 error">
    <template #extra>
      <el-button type="primary" @click="router.back()">
        Back
      </el-button>
    </template>
  </el-result>
</template>

<style scoped>

</style>
