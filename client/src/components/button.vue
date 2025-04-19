<script setup lang="ts">
import { NButton, NSpace } from 'naive-ui'

const props = defineProps<{
  text?: string
  color?: string
  size?: 'tiny' | 'small' | 'medium' | 'large'
  circle?: boolean
}>()
</script>

<template>
  <n-space>
    <n-button :color="props.color" :size="props.size" :circle="props.circle">
      {{ props.text }}
    </n-button>
  </n-space>
</template>
