<script setup lang="ts">
import { ref } from 'vue'
import Input from '../input.vue';
import Chater from './chater.vue';

const searchValue = ref('')
</script>

<template>
  <div class="flex flex-col items-center w-[400px] h-[910px] text-5xl rounded-l-lg overflow-hidden">
    <div class="flex justify-between items-center w-full h-[60px] p-[20px] bg-[#252525]">
      <button class="cursor-pointer"><img src="../../assets/hamburger-button.svg" alt="search" class="w-[25px] h-[25px]"></button>
      <Input v-model="searchValue" size="tiny" type="text" round placeholder="Поиск" class="w-[310px] pb-[28px]" />
    </div>
    <div class="flex flex-col justify-between items-center w-full">
      <Chater/>
      <Chater/>
      <Chater/>
      <Chater/>
    </div>
  </div>
</template>