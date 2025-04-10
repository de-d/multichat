<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import { NInput, NSpace } from 'naive-ui'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  type?: 'text' | 'password' | 'textarea'
  size?: 'tiny' | 'small' | 'medium' | 'large'
  status?: 'success' | 'warning' | 'error'
  round?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const modelValue = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  modelValue.value = newVal
})

watch(modelValue, (val) => {
  emit('update:modelValue', val)
})
</script>

<template>
  <n-space vertical>
    <n-input
      v-model:value="modelValue"
      v-bind="props"
    />
  </n-space>
</template>
