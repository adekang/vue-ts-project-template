<script lang='ts' setup>
import MChooseArea from '@/components/chooseArea/index.vue'

function changeArea(val: any) {
  console.log(val)
}
</script>

<template>
  <MChooseArea @change="changeArea" />
</template>

<style  scoped>
</style>
