<script setup lang="ts">
import Logo from '../components/reg-logo.vue'
</script>

<template>
  <div
    class="flex flex-col items-center p-[20px] rounded-[20px] shadow-[0_6px_50px_rgba(255,255,255,0.1)] bg-[#252525]">
    <div class="flex flex-col items-center p-[20px]">
      <Logo />
    </div>
    <div class="flex flex-col gap-2">
      <RouterLink to="/reg">
        <button
          class="w-[150px] h-[40px] font-bold text-[#ffffff] box-border border-2 border-dashed border-[#289ed5] rounded-[20px] cursor-pointer
              bg-gradient-to-r from-[#289ed5] to-[#289ed5] bg-[length:0%_100%] bg-left
              hover:bg-[length:100%_100%] hover:border-[#289ed5] transition-all duration-500 ease-in-out bg-no-repeat hover:border-solid hover:text-[#000000]">
          Регистрация
        </button>
      </RouterLink>
      <RouterLink to="/chat">
        <button
          class="w-[150px] h-[40px] font-bold text-[#ffffff] box-border border-2 border-dashed border-[#09bb80] rounded-[20px] cursor-pointer
              bg-gradient-to-r from-[#09bb80] to-[#09bb80] bg-[length:0%_100%] bg-right hover:bg-[length:100%_100%] hover:border-[#09bb80]
              transition-all duration-800 ease-in-out bg-no-repeat hover:border-solid hover:text-[#000000]">Войти</Button>
      </RouterLink>
    </div>
  </div>
</template>