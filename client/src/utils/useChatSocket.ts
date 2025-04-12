import { ref, onMounted, onUnmounted, nextTick } from "vue";
import socket from "./socket"; // импорт уже сконфигурированного сокета

// Интерфейс для сообщений
export interface ChatMessage {
  id?: number;
  username: string;
  message: string;
  timestamp: string;
}

// Состояния
const messages = ref<ChatMessage[]>([]);
const username = ref("");
const message = ref("");
const connectionStatus = ref("disconnected");

// Прокрутка вниз
const scrollToBottom = () => {
  nextTick(() => {
    const container = document.querySelector(".messages-container");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  });
};

// Отправка сообщения
const sendMessage = () => {
  if (username.value.trim() && message.value.trim()) {
    socket.emit(
      "sendMessage",
      {
        username: username.value.trim(),
        message: message.value.trim(),
      },
      () => {
        message.value = "";
      }
    );
  }
};

// Подключение и подписка на события
onMounted(() => {
  socket.connect();

  socket.on("connect", () => {
    console.log("✅ Соединение установлено:", socket.id);
    connectionStatus.value = "connected";
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Отключено:", reason);
    connectionStatus.value = "disconnected";
  });

  socket.on("connect_error", (err) => {
    console.error("Ошибка подключения:", err.message);
    setTimeout(() => socket.connect(), 1000);
  });

  socket.on("welcome", (msg: string) => {
    messages.value.push({
      username: "System",
      message: msg,
      timestamp: new Date().toISOString(),
    });
    scrollToBottom();
  });

  socket.on("chatHistory", (chatMessages: ChatMessage[]) => {
    messages.value = chatMessages;
    scrollToBottom();
  });

  socket.on("newMessage", (newMessage: ChatMessage) => {
    messages.value.push(newMessage);
    scrollToBottom();
  });

  socket.on("error", (err: string) => {
    console.error("⚠️ Socket error:", err);
  });
});

// Очистка слушателей
onUnmounted(() => {
  socket.off("connect");
  socket.off("disconnect");
  socket.off("connect_error");
  socket.off("welcome");
  socket.off("chatHistory");
  socket.off("newMessage");
  socket.off("error");
  socket.disconnect();
});

// Хук для импорта
export function useChatSocket() {
  return {
    messages,
    username,
    message,
    connectionStatus,
    sendMessage,
  };
}
