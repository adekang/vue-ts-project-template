<script lang='ts' setup>
import { onUnmounted, ref, watch } from 'vue'
import allAreas from './lib/pca-code.json'

export interface AreaItem {
  name: string
  code: string
  children?: AreaItem[]
}

export interface Data {
  name: string
  code: string
}

// 分发事件给父组件
const emits = defineEmits(['change'])
// 下拉框选择省份的值
const province = ref<string>('')
// 下拉框选择城市的值
const city = ref<string>('')
// 下拉框选择区域的值
const area = ref<string>('')
// 所有的省市区数据
const areas = ref(allAreas)

// 城市下拉框的所有的值
const selectCity = ref<AreaItem[]>([])

// 区域下拉框的所有的值
const selectArea = ref<AreaItem[]>([])

// 监听选择省份
const watcher1 = watch(() => province.value, (val) => {
  if (val) {
    const cities = areas.value.find(item => item.code === province.value)!.children!
    selectCity.value = cities
  }
  city.value = ''
  area.value = ''
})
// 监听选择城市
const watcher2 = watch(() => city.value, (val) => {
  if (val) {
    const area = selectCity.value.find(item => item.code === city.value)!.children!
    selectArea.value = area
  }
  area.value = ''
})

// 监听选择区域
const watcher3 = watch(() => area.value, (val) => {
  if (val) {
    const provinceData: Data = {
      code: province.value,
      name: province.value && allAreas.find(item => item.code === province.value)!.name,
    }
    const cityData: Data = {
      code: city.value,
      name: city.value && selectCity.value.find(item => item.code === city.value)!.name,
    }
    const areaData: Data = {
      code: val,
      name: val && selectArea.value.find(item => item.code === val)!.name,
    }
    emits('change', {
      province: provinceData,
      city: cityData,
      area: areaData,
    })
  }
})

onUnmounted(() => {
  watcher1()
  watcher2()
  watcher3()
})
</script>

<template>
  <div class="w-1/2 flex">
    <el-select v-model="province" clearable placeholder="请选择省份">
      <el-option v-for="item in areas" :key="item.code" :value="item.code" :label="item.name" />
    </el-select>
    <el-select
      v-model="city"
      clearable
      :disabled="!province"
      style="margin: 0 10px;"
      placeholder="请选择城市"
    >
      <el-option v-for="item in selectCity" :key="item.code" :value="item.code" :label="item.name" />
    </el-select>
    <el-select v-model="area" clearable :disabled="!province || !city" placeholder="请选择区域">
      <el-option v-for="item in selectArea" :key="item.code" :value="item.code" :label="item.name" />
    </el-select>
  </div>
</template>

<style scoped>
</style>
