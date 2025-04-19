import { ref, onMounted, onUnmounted, nextTick } from "vue";
import socket from "./socket";

export interface ChatMessage {
  id?: number;
  username: string;
  message: string;
  timestamp: string;
}

export interface Chat {
  chatId: string;
  partnerId: number;
  partner: {
    username: string;
    avatar: string;
    is_online: boolean | number;
  };
  lastMessage?: {
    message: string;
    timestamp: string;
  };
  unreadCount: number;
}

// Состояния
const messages = ref<ChatMessage[]>([]);
const username = ref("");
const message = ref("");
const chats = ref<Chat[]>([]);
const connectionStatus = ref("disconnected");

export function useChatSocket() {
  const messages = ref<ChatMessage[]>([]);
  const username = ref("");
  const message = ref("");
  const chats = ref<Chat[]>([]);
  const connectionStatus = ref("disconnected");

  const scrollToBottom = () => {
    nextTick(() => {
      const container = document.querySelector(".messages-container");
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
  };

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

  function handleBeforeUnload() {
    socket.disconnect();
  }

  onMounted(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      socket.auth = { token };
    }

    socket.connect();
    socket.connect();
    window.addEventListener("beforeunload", handleBeforeUnload);

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

    socket.on("statusChange", ({ userId, isOnline }) => {
      const chat = chats.value.find((c) => c.partnerId === userId);
      if (chat) {
        chat.partner.is_online = isOnline;
      }
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

  onUnmounted(() => {
    socket.off("connect");
    socket.off("disconnect");
    socket.off("connect_error");
    socket.off("welcome");
    socket.off("chatHistory");
    socket.off("newMessage");
    socket.off("statusChange");
    socket.off("error");
    window.removeEventListener("beforeunload", handleBeforeUnload);
    socket.disconnect();
  });

  console.log("🔁 useChatSocket вызван");

  return {
    messages,
    username,
    message,
    connectionStatus,
    sendMessage,
    chats,
  };
}
