<script setup lang="ts">
import { NInput, NSpace } from 'naive-ui'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  type?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>


<template>
  <n-space vertical>
    <n-input
      :type="type"
      :placeholder="placeholder"
      :value="props.modelValue"
      @update:value="emit('update:modelValue', $event)"
    />
  </n-space>
</template>
