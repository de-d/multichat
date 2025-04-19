<script setup lang="ts">
const props = defineProps<{
  avatar: string
  username: string
  message: string
  time: string
  messageCount: number
  is_online: boolean
}>()
</script>

<template>
  <div
    class="flex items-center w-full gap-[10px] text-[14px] p-[10px] cursor-pointer hover:bg-[#393939] focus:bg-[#232323]">
    <div class="flex justify-center items-center w-[50px] h-[40px] relative">
      <img :src="props.avatar" alt="avatar" class="rounded-[50%]">
      <div v-if="props.is_online" class="absolute right-0 bottom-0 w-[10px] h-[10px] bg-[#28d545] rounded-[50%]"></div>
      <div v-else class="absolute right-0 bottom-0 w-[10px] h-[10px] bg-[#e42d2d] rounded-[50%]"></div>
    </div>
    <div class="flex flex-col items-center w-full gap-[10px]">
      <div class="flex justify-between w-full items-center gap-[10px]">
        <p class="max-w-[280px] truncate overflow-hidden whitespace-nowrap">{{ props.username }}</p>
        <p>{{ props.time }}</p>
      </div>
      <div class="flex justify-between w-full items-center gap-[10px]">
        <p class="max-w-[280px] truncate overflow-hidden whitespace-nowrap">{{ props.message }}</p>
        <p v-if="props.messageCount > 0"
          class="flex justify-center items-center bg-[#af2525] rounded-[20px] p-[3px] text-[12px]">
          {{ props.messageCount }}
        </p>
      </div>
    </div>
  </div>
</template>
