<script setup lang="ts">
import { ref, watch, watchEffect, nextTick, computed } from 'vue'
import { useChatSocket } from '../../utils/useChatSocket'
import data from 'emoji-mart-vue-fast/data/all.json'
import { Picker, EmojiIndex } from "emoji-mart-vue-fast/src";
import 'emoji-mart-vue-fast/css/emoji-mart.css'
import { useChatStore } from '../../stores/chat';

const chatStore = useChatStore()
const { messages, sendMessage, joinChat } = useChatSocket()
const messageValue = ref<string>('')
const user = localStorage.getItem('currentUser')
const messagesContainer = ref<HTMLElement | null>(null)
const show = ref(false)
const emojiIndex = new EmojiIndex(data)

watchEffect(async () => {
  if (chatStore.activeChatId) {
    await joinChat(chatStore.activeChatId)
  }
})

watch(messages, async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}, { deep: true })

function send() {
  console.log('Отправляю сообщение:', { chatId: chatStore.activeChatId, message: messageValue.value });
  sendMessage(chatStore.activeChatId, messageValue.value);
  messageValue.value = '';
  show.value = !show
}

const currentUserId = computed(() => {
  const userData = user ? JSON.parse(user) : null;
  console.log('Current User ID:', userData?.id);
  return userData ? userData.id : null;
});

const isChatterOnline = computed(() => {
  const chatter = chatStore.activeChatterStatus;
  return chatter === true ? 'Онлайн' : 'Оффлайн';
})

function addEmoji(emoji: any) {
  messageValue.value += emoji.native
}

</script>

<template>
  <div class="flex flex-col w-[1100px] h-[910px] border-l-1 border-[#1b1b1b] bg-[#2e2e2e] rounded-r-lg">
    <div class="flex justify-between items-center h-[60px] p-[20px] bg-[#252525]">
      <div class="flex flex-row items-start">
        <img :src="chatStore.activeChatterAvatar" alt="avatar" class="w-[40px] h-[40px] rounded-[50%]">
        <div class="flex flex-col items-start ml-[10px]">
          <p>{{ chatStore.activeChatterName }}</p>
          <p class="text-[#289ed5]">
            {{ isChatterOnline }}
          </p>
        </div>
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

    <div ref="messagesContainer" class="flex-1 overflow-y-auto px-[10px] pb-[5px]">
      <div v-for="msg in messages" :key="`${msg.id}_${msg.timestamp}_${msg.userId}`"
        :class="['flex py-[2px]', msg.userId === currentUserId ? 'justify-end' : 'justify-start']">
        <div
          :class="['bubble', msg.userId === currentUserId ? 'right' : 'left', 'max-w-[400px] px-[15px] py-[10px] relative']">
          <div class="flex flex-row items-end gap-[5px]">
            <div class="max-w-[300px] wrap-break-word text-left">
              {{ msg.message }}
            </div>
            <div class="text-xs text-gray-400 mt-1">
              {{ new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-between items-center w-full h-[60px] p-[20px] gap-[10px] bg-[#252525]">
      <label class="relative cursor-pointer flex items-center justify-center">
        <input type="file" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        <img src="../../assets/chat/paperclip.svg" alt="Attach" class="w-full h-full" />
      </label>
      <input v-model="messageValue" placeholder="Сообщение..."
        class="flex-1 h-[30px] bg-transparent text-white border-none outline-none focus:outline-none"
        @keyup.enter="send" />
      <button class="w-[25px] h-[25px] flex items-center justify-center" @click="show = !show">
        <img src="../../assets/chat/emoji.svg" alt="Emoji"
          class="w-full h-full cursor-pointer hover:scale-110 hover:duration-200" />
      </button>
      <picker v-if="show" :data="emojiIndex" set="apple" :show-preview="false" :skin="1"
        class="absolute bottom-[100px] right-[300px]" @select="addEmoji" />
      <div class="relative w-[25px] h-[25px]">
        <Transition name="fade-scale" mode="out-in">
          <button v-if="messageValue.trim()" @click="send" class="absolute inset-0 flex items-center justify-center">
            <img src="../../assets/chat/send.svg" alt="Send" class="w-full h-full rotate-40 cursor-pointer" />
          </button>
          <button v-else class="absolute inset-0 flex items-center justify-center">
            <img src="../../assets/chat/voice.svg" alt="Voice"
              class="w-full h-full cursor-pointer hover:scale-110 hover:duration-200" />
          </button>
        </Transition>
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

.bubble {
  --r: 1em;
  --t: 1em;

  border-inline: var(--t) solid #0000;
  border-radius: calc(var(--r) + var(--t))/var(--r);
  mask:
    radial-gradient(100% 100% at var(--_p) 0, #0000 99%, #000 102%) var(--_p) 100%/var(--t) var(--t) no-repeat,
    linear-gradient(#000 0 0) padding-box;
  background: #252525 border-box;
  color: #fff;
}

.bubble.left {
  --_p: 0;
  border-bottom-left-radius: 0;
  background: #252525 border-box;
}

.bubble.right {
  --_p: 100%;
  border-bottom-right-radius: 0;
  background: #1384C5 border-box;
}
</style>
