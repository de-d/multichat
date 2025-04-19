<script setup lang="ts">
import { ref } from 'vue'

const messageValue = ref('')

function sendMessage() {
  if (!messageValue.value.trim()) return
  console.log('sending:', messageValue.value)
  messageValue.value = ''
}
</script>

<template>
  <div class="flex flex-col w-[1100px] h-[910px] border-l-1 border-[#1b1b1b] bg-[#2e2e2e] rounded-r-lg overflow-hidden">
    <div class="flex justify-between items-center h-[60px] p-[20px] bg-[#252525]">
      <div class="flex flex-col items-start">
        <p>Челик челиков</p>
        <p class="text-[#289ed5]">Онлайн</p>
      </div>
      <div class="flex items-center gap-[5px]">
        <button class="cursor-pointer">
          <img src="../../assets/search.svg" alt="search" class="w-[20px] h-[20px]" />
        </button>
        <button class="cursor-pointer">
          <img src="../../assets/more-one.svg" alt="search" class="w-[25px] h-[25px]" />
        </button>
      </div>
    </div>

    <div class="flex flex-col justify-between items-center w-full h-full overflow-y-auto">
      <div class="flex flex-col h-full">тут сообщения</div>
      <div class="flex justify-between items-center w-full h-[60px] p-[20px] gap-[10px] bg-[#252525]">
        <label class="relative cursor-pointer flex items-center justify-center">
          <input type="file" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          <img src="../../assets/chat/paperclip.svg" alt="Attach" class="w-full h-full" />
        </label>
        <input v-model="messageValue" placeholder="Сообщение..."
          class="flex-1 h-[30px] bg-transparent text-white border-none outline-none focus:outline-none"
          @keyup.enter="sendMessage" />
        <button class="w-[25px] h-[25px] flex items-center justify-center">
          <img src="../../assets/chat/emoji.svg" alt="Send"
            class="w-full h-full cursor-pointer hover:scale-110 hover:duration-200" />
        </button>
        <div class="relative w-[25px] h-[25px]">
          <Transition name="fade-scale" mode="out-in">
            <button v-if="messageValue.trim()" @click="sendMessage"
              class="absolute inset-0 flex items-center justify-center">
              <img src="../../assets/chat/send.svg" alt="Send" class="w-full h-full rotate-40 cursor-pointer" />
            </button>
            <button v-else class="absolute inset-0 flex items-center justify-center">
              <img src="../../assets/chat/voice.svg" alt="Send"
                class="w-full h-full cursor-pointer hover:scale-110 hover:duration-200" />
            </button>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.2s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

.fade-scale-enter-to,
.fade-scale-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
