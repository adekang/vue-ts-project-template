<script lang='ts' setup>
import MMenu from '@/components/menu/index.vue'

defineProps<{
  collapse: boolean
}>()

const data = [
  {
    icon: 'HomeFilled',
    name: '首页',
    index: '/home',
  },
  {
    icon: 'ShoppingBag',
    name: 'Pro 表格',
    index: '/table',
  },
]
</script>

<template>
  <MMenu :collapse="collapse" :data="data" router :default-active="$route.path" />
</template>

<style  scoped>
</style>
