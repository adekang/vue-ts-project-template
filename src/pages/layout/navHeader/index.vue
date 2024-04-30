<script lang='ts' setup>
import { Expand, Fold } from '@element-plus/icons-vue'

const props = defineProps<{
  collapse: boolean
}>()
const emits = defineEmits(['update:collapse'])
function toggle() {
  // 需要修改父组件的数据
  emits('update:collapse', !props.collapse)
}
</script>

<template>
  <div class="p-0 flex items-center h-[60px]">
    <span @click="toggle">
      <el-icon v-if="collapse">
        <Expand />
      </el-icon>
      <el-icon v-else>
        <Fold />
      </el-icon>
    </span>
  </div>
</template>

<style  scoped>
.header {
  height: 60px;
  padding: 0;
  display: flex;
  align-items: center;
}
</style>
