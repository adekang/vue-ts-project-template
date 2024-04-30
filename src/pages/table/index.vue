<script setup lang="ts">
import { ref } from 'vue'
import type { ProTableOptions } from '@/components/pro-table/table-types'
import { getDemoListApi } from '@/services'

interface TableData {
  date: string
  name: string
  address: string

}

const tableData = ref<TableData[]>([])
const total = ref<number>(0)
const options: ProTableOptions[] = [
  {
    prop: 'date',
    label: '日期123',
    width: 180,
    align: 'center',
    slot: 'date',
  },
  {
    prop: 'name',
    label: '姓名',
    width: 180,
    align: 'center',
    slot: 'name',
    editable: true,
  },
  {
    prop: 'address',
    label: '地址',
    align: 'center',
  },
  {
    label: '操作',
    prop: 'edit',
    align: 'center',
    action: true,
  },
]

const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `

const editRowIndex = ref<string>('')
function handleEdit(scope: any) {
  console.log('编辑', scope.row)
  editRowIndex.value = 'edit'
}

function handleDelete(scope: any) {
  console.log('删除', scope.row)
}

function handleCheck(scope: any) {
  console.log('确认', scope.row)
}

function handleClose(scope: any) {
  console.log('关闭', scope.row)
}

function handleCancle(scope: any) {
  console.log('关闭', scope.row)
  editRowIndex.value = 'edit'
}

const page = ref<number>(1)
const pageSize = ref<number>(10)
onMounted(() => {
  getDemoListApi(page.value, pageSize.value).then((res: any) => {
    tableData.value = res.result.items
    total.value = res.result.total
  })
})

watch([page, pageSize], ([page, pageSize]) => {
  getDemoListApi(page, pageSize).then((res: any) => {
    tableData.value = res.result.items
    total.value = res.result.total
  })
})
</script>

<template>
  <div>
    <pro-table
      v-model:edit-row-index="editRowIndex"
      v-model:current-page="page"
      v-model:page-size="pageSize"
      :data="tableData"
      :options
      pagination-align="left"
      stripe
      border
      element-loading-text="加载中"
      :element-loading-spinner="svg"
      element-loading-background="rgba(122, 122, 122, 0.8)"
      :is-edit-row="true"
      :pagination="true"
      :total="total"
      @confirm="handleCheck"
      @cancel="handleClose"
    >
      <template #date="{ scope }">
        <span>{{ scope.row.date }}</span>
      </template>

      <template #name="{ scope }">
        <el-popover effect="light" trigger="hover" placement="top" width="auto">
          <template #default>
            <div>name: {{ scope.row.name }}</div>
            <div>address: {{ scope.row.address }}</div>
          </template>
          <template #reference>
            <el-tag>{{ scope.row.name }}</el-tag>
          </template>
        </el-popover>
      </template>

      <template #action="{ scope }">
        <el-button type="primary" size="small" @click="handleEdit(scope)">
          编辑
        </el-button>
        <el-button type="danger" size="small" @click="handleDelete(scope)">
          删除
        </el-button>
      </template>
      <template #editRow="{ scope }">
        <el-button type="primary" size="small" @click="handleEdit(scope)">
          确认
        </el-button>
        <el-button type="danger" size="small" @click="handleCancle">
          取消
        </el-button>
      </template>
      <!--
        TODO 编辑单元格 的时候 ，点击确认取消按钮 取消编辑状态
        <template #editCell="{ scope }">
        <el-button type="primary" size="small">
          确认
        </el-button>
        <el-button type="danger" size="small">
          取消
        </el-button>
      </template>
     -->
    </pro-table>
  </div>
</template>

<style scoped>

</style>
