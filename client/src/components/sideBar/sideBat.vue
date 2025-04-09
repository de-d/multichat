<script setup lang="ts">
import Input from '../input.vue';

import { ref } from 'vue'

const searchValue = ref('')
</script>

<template>
  <div class="flex flex-col items-center w-[400px] h-[910px] text-5xl rounded-l-lg overflow-hidden">
    <div class="flex justify-between items-center w-full h-[60px] p-[20px] bg-[#252525]">
      <button class="cursor-pointer"><img src="../../assets/hamburger-button.svg" alt="search" class="w-[25px] h-[25px]"></button>
      <div>
        <Input v-model="searchValue" type="text" placeholder="Поиск" />
      </div>
    </div>
    sideBar
  </div>
</template>