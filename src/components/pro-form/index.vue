<script lang='ts' setup>
import cloneDeep from 'lodash/cloneDeep'
import type { PropType } from 'vue'
import { onMounted, ref, watch } from 'vue'
import type { FormInstance, FormOptions } from './types'

const props = defineProps({
  // 表单的配置项
  options: {
    type: Array as PropType<FormOptions[]>,
    required: true,
  },
  // 用户自定义上传方法
  httpRequest: {
    type: Function,
  },
})

const emits = defineEmits(['onPreview', 'onRemove', 'onSuccess', 'onError', 'onProgress', 'onChange', 'beforeUpload', 'beforeRemove', 'onExceed'])

const model = ref<any>(null)
const rules = ref<any>(null)
const form = ref<FormInstance | null>()
const edit = ref()

// 初始化表单
function initForm() {
  if (props.options && props.options.length) {
    const m: any = {}
    const r: any = {}
    props.options.map((item: FormOptions) => {
      m[item.prop!] = item.value
      r[item.prop!] = item.rules
      if (item.type === 'editor') {
        // 初始化富文本
        // nextTick(() => {
        //   if (document.getElementById('editor')) {
        //     const editor = new E('#editor')
        //     editor.config.placeholder = item.placeholder!
        //     editor.create()
        //     // 初始化富文本的内容
        //     editor.txt.html(item.value)
        //     editor.config.onchange = (newHtml: string) => {
        //       model.value[item.prop!] = newHtml
        //     }
        //     edit.value = editor
        //   }
        // })
      }

      return item
    })
    model.value = cloneDeep(m)
    rules.value = cloneDeep(r)
  }
}

// 重置表单
function resetFields() {
  // 重置element-plus的表单
  form.value!.resetFields()
  // 重置富文本编辑器的内容
  // 获取到富文本的配置项
  if (props.options && props.options.length) {
    const editorItem = props.options.find(item => item.type === 'editor')!
    edit.value.txt.html(editorItem.value)
  }
}
// 表单验证方法
function validate() {
  return form.value!.validate
}
// 获取表单数据
function getFormData() {
  return model.value
}

// 分发方法
defineExpose({
  resetFields,
  validate,
  getFormData,
})

onMounted(() => {
  initForm()
})
// 监听父组件传递进来的options
watch(() => props.options, () => {
  initForm()
}, { deep: true })

// 上传组件的所有方法
function onPreview(file: File) {
  emits('onPreview', file)
}
function onRemove(file: File, fileList: FileList) {
  emits('onRemove', { file, fileList })
}
function onSuccess(response: any, file: File, fileList: FileList) {
  // 上传图片成功 给表单上传项赋值
  const uploadItem = props.options.find(item => item.type === 'upload')!
  model.value[uploadItem.prop!] = { response, file, fileList }
  emits('onSuccess', { response, file, fileList })
}
function onError(err: any, file: File, fileList: FileList) {
  emits('onError', { err, file, fileList })
}
function onProgress(event: any, file: File, fileList: FileList) {
  emits('onProgress', { event, file, fileList })
}
function onChange(file: File, fileList: FileList) {
  emits('onChange', { file, fileList })
}
function beforeUpload(file: File) {
  emits('beforeUpload', file)
}
function beforeRemove(file: File, fileList: FileList) {
  emits('beforeRemove', { file, fileList })
}
function onExceed(files: File, fileList: FileList) {
  emits('onExceed', { files, fileList })
}
</script>

<template>
  <el-form
    v-if="model"
    ref="form"
    :validate-on-rule-change="false"
    :model="model"
    :rules="rules"
    v-bind="$attrs"
  >
    <template v-for="(item, index) in options" :key="index">
      <el-form-item
        v-if="!item.children || !item.children!.length"
        :prop="item.prop"
        :label="item.label"
      >
        <component
          v-bind="item.attrs"
          :is="`el-${item.type}`"
          v-if="item.type !== 'upload' && item.type !== 'editor'"
          v-model="model[item.prop!]"
          :placeholder="item.placeholder"
        />
        <el-upload
          v-if="item.type === 'upload'"
          v-bind="item.uploadAttrs"
          :on-preview="onPreview"
          :on-remove="onRemove"
          :on-success="onSuccess"
          :on-error="onError"
          :on-progress="onProgress"
          :on-change="onChange"
          :before-upload="beforeUpload"
          :before-remove="beforeRemove"
          :http-request="httpRequest"
          :on-exceed="onExceed"
        >
          <slot name="uploadArea" />
          <slot name="uploadTip" />
        </el-upload>
        <div v-if="item.type === 'editor'" id="editor" />
      </el-form-item>
      <el-form-item
        v-if="item.children && item.children.length"
        :prop="item.prop"
        :label="item.label"
      >
        <component
          v-bind="item.attrs"
          :is="`el-${item.type}`"
          v-model="model[item.prop!]"
          :placeholder="item.placeholder"
        >
          <component
            :is="`el-${child.type}`"
            v-for="(child, i) in item.children"
            :key="i"
            :label="child.label"
            :value="child.value"
          />
        </component>
      </el-form-item>
    </template>
    <el-form-item>
      <slot name="action" :form="form" :model="model" />
    </el-form-item>
  </el-form>
</template>

<style scoped>
</style>
