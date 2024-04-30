export interface ProTableOptions {
  label: string // 表头名称
  prop: string // 字段名称
  width?: string | number // 列宽
  align?: 'left' | 'center' | 'right' // 对齐方式'
  slot?: string // 自定义列模板名称
  action?: boolean // 是否显示操作列
  editable?: boolean // 是否可编辑
}
