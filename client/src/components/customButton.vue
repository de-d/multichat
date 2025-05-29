<script setup lang="ts">
defineProps<{
  label: string
  color?: string
  icon: string
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

</script>

<template>
  <button class="Btn" :style="{ backgroundColor: color }" @click="emit('click')">
    <div class="sign">
      <img :src="icon" alt="icon" />
    </div>
    <div class="text">{{ label }}</div>
  </button>
</template>

<style scoped>
.Btn {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  height: 45px;
  min-width: 45px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
  background-color: rgb(255, 65, 65);
  padding: 0;
}

.sign {
  width: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sign img {
  width: 24px;
  height: 24px;
}

.text {
  white-space: nowrap;
  opacity: 0;
  max-width: 0;
  padding: 0;
  color: white;
  font-size: 14px;
  font-weight: 600;
  transition: max-width 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
  overflow: hidden;
}

.Btn:hover {
  border-radius: 40px;
  padding-right: 20px;
}

.Btn:hover .text {
  opacity: 1;
  max-width: 200px;
}

.Btn:active {
  transform: translate(2px, 2px);
}
</style>