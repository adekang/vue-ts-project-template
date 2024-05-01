<script setup lang="ts">
const iconList = ref([
  'Tickets',
  'Notebook',
  'House',
  'ShoppingCartFull',
  'Goods',
  'Memo',
  'Avatar',
  'User',
  'Lock',
])
</script>

<template>
  <div>
    home
  </div>
  <el-icon v-for="(icon, index) in iconList" :key="index">
    <component :is="icon" />
  </el-icon>
</template>
