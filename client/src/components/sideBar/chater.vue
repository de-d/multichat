<script setup lang="ts">

</script>

<template>
  <div class="flex items-center w-full gap-[10px] text-[14px] p-[10px] cursor-pointer hover:bg-[#393939] focus:bg-[#232323]">
    <img src="../../assets/testAv.png" alt="avatar" class="w-[40px] h-[40px] rounded-[50%]">
    <div class="flex flex-col items-center w-full gap-[10px]">
      <div class="flex justify-between w-full items-center gap-[10px]">
        <p class="max-w-[280px] truncate overflow-hidden whitespace-nowrap">ОченьДлинныйUsernameКоторыйНеВлезаетВКонтейнер</p>
        <p>17:00</p>
      </div>
      <div class="flex justify-between w-full items-center gap-[10px]">
        <p class="max-w-[280px] truncate overflow-hidden whitespace-nowrap">Очень длинное сообщение которое нужно обрезать</p>
        <p class="flex justify-center items-center bg-[#af2525] rounded-[20px] p-[3px] text-[12px]">22</p>
      </div>
    </div>
  </div>
</template>
