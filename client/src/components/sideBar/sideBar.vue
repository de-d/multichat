<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Input from '../input.vue';
import Chater from './chater.vue';
import { Chat, FormattedChat } from '../../types';
import { useChatStore } from '../../stores/chat';
import { useChatSocket } from '../../utils/useChatSocket'

const chatStore = useChatStore()
const { joinChat } = useChatSocket()
const searchValue = ref('')
const chats = ref<FormattedChat[]>([])

async function fetchChats() {
  try {
    const token = localStorage.getItem('authToken')
    if (!token) return

    const response = await axios.get<Chat[]>('http://localhost:3000/api/chats', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    chats.value = response.data.map(chat => ({
      partnerId: chat.partner?.id,
      avatar: chat.partner?.avatar || 'https://i.pravatar.cc/150?img=3',
      is_online: !!chat.partner?.is_online,
      username: chat.partner?.username || 'Unknown',
      message: chat.lastMessage?.message || 'Нет сообщений',
      time: chat.lastMessage?.timestamp
        ? new Date(chat.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '',
      messageCount: chat.unreadCount || 0,
      chatId: chat.chatId
    }));


  } catch (error) {
    console.error('Failed to fetch chats:', error)
  }
}

onMounted(() => {
  fetchChats()
})

const setChat = async (chatId: number, avatar: string, username: string, status: boolean) => {
  await joinChat(chatId)
  chatStore.setActiveChatId(chatId)
  chatStore.setActiveChatterAvatar(avatar)
  chatStore.setActiveChatterName(username)
  chatStore.setActiveChatterStatus(status)
}

</script>

<template>
  <div class="flex flex-col items-center w-[400px] h-[910px] text-5xl rounded-l-lg overflow-hidden">
    <div class="flex justify-between items-center w-full h-[60px] p-[20px] bg-[#252525]">
      <button class="cursor-pointer">
        <img src="../../assets/hamburger-button.svg" alt="search" class="w-[25px] h-[25px]">
      </button>
      <Input v-model="searchValue" size="tiny" type="text" round placeholder="Поиск" class="w-[310px] pb-[28px]" />
    </div>
    <div class="flex flex-col justify-between items-center w-full overflow-y-auto">
      <Chater v-for="chat in chats" :key="chat.chatId" :avatar="chat.avatar" :is_online="chat.is_online"
        :username="chat.username" :message="chat.message" :time="chat.time" :message-count="chat.messageCount"
        @click="setChat(chat.chatId, chat.avatar, chat.username, chat.is_online)" />
    </div>
  </div>
</template>