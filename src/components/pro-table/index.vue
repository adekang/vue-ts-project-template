<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { Check, Close, Edit } from '@element-plus/icons-vue'
import cloneDeep from 'lodash/cloneDeep'
import type { ProTableOptions } from './table-types'

const props = defineProps<{
  options: ProTableOptions[] // table options
  data: any[] // table data
  elementLoadingText?: string // 显示在加载图标下方的加载文案
  elementLoadingSpinner?: string // 自定义加载图标
  elementLoadingBackground?: string // 背景遮罩的颜色
  elementLoadingSvg?: string // 自定义加载图标 (与 element-loading-spinner 相同)
  editIcon?: string // 可编辑单元格的图标 (默认为 edit) 首字母大写 TODO
  isEditRow?: boolean // 是否可编辑行
  editRowIndex?: string // 可编辑行的唯一标识
}>()

// const props = defineProps({
//   options: {
//     type: Array as PropType<ProTableOptions[]>,
//     required: true,
//   },
//   data: {
//     type: Array,
//     required: true,
//   },
//   elementLoadingText: {
//     type: String,
//   },
//   elementLoadingSpinner: {
//     type: String,
//   },
//   elementLoadingBackground: {
//     type: String,
//   },
//   elementLoadingSvg: {
//     type: String,
//   },
//   editIcon: {
//     type: String,
//     default: 'Edit',
//   },
//   isEditRow: {
//     type: Boolean,
//     default: false,
//   },
//   editRowIndex: {
//     type: String,
//   },
// })

const emits = defineEmits(['confirm', 'cancel', 'update:editRowIndex'])
// 可编辑的唯一标识
const currentEdit = ref<string>('')

// 过滤操作选项之后的配置
const tableOptions = computed(() => props.options.filter(item => !item.action))

// 找出操作选项配置
const actionOptions = computed(() => props.options.find(item => item.action))

// 是否显示加载中
const isLoading = computed(() => !props.data || !props.data.length)

// 拷贝表格数据
const tableData = ref<any>(cloneDeep(props.data))
const cloneEditRowIndex = ref(cloneDeep(props.editRowIndex))

watch(() => props.data, (val) => {
  tableData.value = cloneDeep(val)
  tableData.value.map((item: any) => {
    return item.editRow = false
  })
}, { deep: true })

watch(() => props.editRowIndex, (val) => {
  if (val)
    cloneEditRowIndex.value = val
})

onMounted(() => {
  tableData.value.map((item: any) => {
    return item.editRow = false
  })
})

// 点击编辑图标
function clickEditIcon(scope: any) {
  currentEdit.value = scope.$index + scope.column.id
  console.log(scope)
}

// 点击确认图标
function clickCheck(scope: any) {
  emits('confirm', scope)
  currentEdit.value = ''
}

// 点击关闭图标
function clickClose(scope: any) {
  emits('cancel', scope)
  currentEdit.value = ''
}

// 点击行
function clickRow(row: any, column: any) {
  // 判断是否是点击的操作项
  if (column.label === actionOptions.value!.label) {
    if (props.isEditRow && cloneEditRowIndex.value === props.editRowIndex) {
      console.log('操作行', row)

      // 编辑行的操作
      row.editRow = !row.editRow
      // 重置其他数据的rowEdit
      // eslint-disable-next-line array-callback-return
      tableData.value.map((item: any) => {
        if (item !== row)
          item.editRow = false
      })
      // 重置按钮的标识
      if (!row.rowEdit)
        emits('update:editRowIndex', '')
    }
  }
}

watch(() => currentEdit.value, (val) => {
  console.log('可编辑单元格：：', val)
})
</script>

<template>
  <el-table
    v-loading="isLoading"
    :data="tableData"
    :element-loading-text
    :element-loading-spinner
    :element-loading-svg
    :element-loading-background
    @row-click="clickRow"
  >
    <template v-for="(item, index) in tableOptions" :key="index">
      <el-table-column :prop="item.prop" :label="item.label" :align="item.align" :width="item.width">
        <template #default="scope">
          <template v-if="scope.row.editRow">
            <el-input v-model="scope.row[item.prop]" size="small" />
          </template>
          <template v-else>
            <template v-if="(scope.$index + scope.column.id) === currentEdit">
              <div style="display:flex; align-items: center;">
                <el-input v-model="scope.row[item.prop]" />
                <slot v-if="$slots.editCell" name="editCell" :scope="scope" />
                <div v-else class="icons">
                  <el-icon v-if="item.editable" class="check" @click.stop="clickCheck(scope)">
                    <Check />
                  </el-icon>
                  <el-icon v-if="item.editable" class="close" @click.stop="clickClose(scope)">
                    <Close />
                  </el-icon>
                </div>
              </div>
            </template>
            <template v-else>
              <div style="display:flex; align-items: center;">
                <slot v-if="item.slot" :name="item. slot" :scope="scope" />
                <span v-else>{{ scope.row[item.prop] }}</span>
                <el-icon v-if="item.editable" class="edit" @click.stop="clickEditIcon(scope)">
                  <Edit />
                </el-icon>
              </div>
            </template>
          </template>
        </template>
      </el-table-column>
    </template>

    <el-table-column v-if="actionOptions" :label="actionOptions.label" :align="actionOptions.align" :width="actionOptions.width">
      <template #default="scope">
        <slot v-if="scope.row.editRow" name="editRow" :scope="scope" />
        <slot v-else name="action" :scope="scope" />
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>
.edit {
  cursor: pointer;
  margin-left: 6px;
}
.icons{
  display: flex;
  align-items: center;
}
.icons > .check{
margin-left: 6px;
color: red;
cursor: pointer;
}
.icons > .close{
margin-left: 6px;
color: green;
cursor: pointer;
}
</style>
