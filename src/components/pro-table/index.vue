<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { Check, Close, Edit } from '@element-plus/icons-vue'
import cloneDeep from 'lodash/cloneDeep'
import type { ProTableOptions } from './table-types'

interface Props {
  options: ProTableOptions[] // table options
  data: any[] // table data
  elementLoadingText?: string // 显示在加载图标下方的加载文案
  elementLoadingSpinner?: string // 自定义加载图标
  elementLoadingBackground?: string // 背景遮罩的颜色
  elementLoadingSvg?: string // 自定义加载图标 (与 element-loading-spinner 相同)
  editIcon?: string // 可编辑单元格的图标 (默认为 edit) 首字母大写 TODO
  isEditRow?: boolean // 是否可编辑行
  editRowIndex?: string // 可编辑行的唯一标识
  pageSizes?: number[] // 每页显示个数的集合
  total?: number // 总条数
  pagination?: boolean // 是否显示分页
  paginationAlign?: 'left' | 'center' | 'right' // 分页的排列方式
}

const props = withDefaults(defineProps<Props>(), {
  paginationAlign: 'center',
  pagination: false,
  isEditRow: false,
  editIcon: 'Edit',
  editRowIndex: '',
  pageSizes: () => [10, 20, 30, 40],
  total: 0,
})

const emits = defineEmits(['confirm', 'cancel', 'update:editRowIndex'])
const currentPage = defineModel<number>('currentPage', { type: Number, default: 1 })
const pageSize = defineModel<number>('pageSize', { type: Number, default: 10 })

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

function handleCurrentChange(val: number) {
  currentPage.value = val
}

function handleSizeChange(val: number) {
  pageSize.value = val
}

// 表格分页的排列方式
const justifyContent = computed(() => {
  if (props.paginationAlign === 'left')
    return 'flex-start'
  else if (props.paginationAlign === 'right')
    return 'flex-end'
  else return 'center'
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
    v-bind="$attrs"
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

  <div v-if="pagination && !isLoading" class="pagination" :style="{ justifyContent }">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="pageSizes"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
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

.pagination{
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>
