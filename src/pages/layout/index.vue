<script lang='ts' setup>
import { ref, watchEffect } from 'vue'
import NavHeader from './navHeader/index.vue'
import NavSide from './navSide/index.vue'

const isCollapse = ref(false)

watchEffect(() => {
  console.log(isCollapse.value)
})
</script>

<template>
  <el-container>
    <el-aside width="auto">
      <NavSide :collapse="isCollapse" />
    </el-aside>
    <el-container>
      <el-header class="p-0  border-b  border-gray-400">
        <NavHeader v-model:collapse="isCollapse" />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style  scoped>

</style>
