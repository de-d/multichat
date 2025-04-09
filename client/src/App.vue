<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { io } from "socket.io-client";
import ChatWindow from "./components/chatWindow/ChatWindow.vue";
import SideBar from "./components/sideBar/sideBat.vue";

interface ChatMessage {
  id?: number;
  username: string;
  message: string;
  timestamp: string;
}

const messages = ref<ChatMessage[]>([]);
const username = ref("");
const message = ref("");
const connectionStatus = ref("disconnected");

// Подключение к WebSocket серверу
const socket = io("http://localhost:3000", {
  withCredentials: true,
  transports: ["websocket"]
});

// Форматирование времени для отображения
const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString();
};

// Функция прокрутки вниз
const scrollToBottom = () => {
  nextTick(() => {
    const container = document.querySelector('.messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  });
};

onMounted(() => {
  console.log("Setting up socket listeners...");

  socket.on("connect", () => {
    console.log("Connected to WebSocket server");
    connectionStatus.value = "connected";
  });

  socket.on("welcome", (msg: string) => {
    console.log("Welcome message:", msg);
    messages.value.push({
      username: "System",
      message: msg,
      timestamp: new Date().toISOString()
    });
    scrollToBottom();
  });

  socket.on("chatHistory", (chatMessages: ChatMessage[]) => {
    console.log("Received chat history:", chatMessages);
    messages.value = chatMessages;
    scrollToBottom();
  });

  socket.on("newMessage", (newMessage: ChatMessage) => {
    console.log("New message received:", newMessage);
    messages.value.push(newMessage);
    scrollToBottom();
  });

  socket.on("error", (error: string) => {
    console.error("Server error:", error);
  });
});

onUnmounted(() => {
  socket.off("connect");
  socket.off("welcome");
  socket.off("chatHistory");
  socket.off("newMessage");
  socket.off("error");
  socket.disconnect();
});

const sendMessage = () => {
  if (username.value.trim() && message.value.trim()) {
    socket.emit("sendMessage", {
      username: username.value.trim(),
      message: message.value.trim()
    }, () => {
      message.value = "";
    });
  }
};
</script>

<template>
  <!-- <div class="chat-container">
    <h1>Клоунский чат🤡</h1>
    <div class="status" :class="connectionStatus">
      Статус: {{ connectionStatus }}
    </div>
    <div class="messages-container">
      <div v-if="messages.length === 0" class="empty-state">
        Пока нет сообщений. Будьте первым!
      </div>
      <template v-else>
        <div v-for="(msg, index) in messages" :key="index" class="message">
          <div class="message-header">
            <span class="username">{{ msg.username }}</span>
            <span class="timestamp">{{ formatTime(msg.timestamp) }}</span>
          </div>
          <div class="message-content">{{ msg.message }}</div>
        </div>
      </template>
    </div>

    <div class="input-area">
      <input
        v-model="username"
        placeholder="Ваше имя"
        class="name-input"
      />
      <textarea
        v-model="message"
        placeholder="Ваше сообщение"
        class="message-input"
        @keyup.enter="sendMessage"
      ></textarea>
      <button
        @click="sendMessage"
        :disabled="!username.trim() || !message.trim()"
        class="send-button"
      >
        Отправить
      </button>
    </div>
  </div> -->
  <div class="flex flex-row rounded-[20px] shadow-[0_6px_50px_rgba(255,255,255,0.1)] bg-[#2e2e2e]">
    <SideBar />
    <ChatWindow />
  </div>
</template>