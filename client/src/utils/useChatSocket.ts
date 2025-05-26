import { ref, onMounted, onUnmounted, nextTick } from "vue";
import socket from "./socket";

export interface ChatMessage {
  id?: number;
  username: string;
  message: string;
  timestamp: string;
  userId?: number;
}

export interface Chat {
  chatId: number;
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

  const sendMessage = (chatId: number, text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    socket.emit("sendMessage", { chatId, message: trimmedText });
  };

  const joinChat = (chatId: number) => {
    socket.emit("joinChat", chatId);
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
    window.addEventListener("beforeunload", handleBeforeUnload);

    socket.off("connect").on("connect", () => {
      console.log("✅ Соединение установлено:", socket.id);
      connectionStatus.value = "connected";
    });

    socket.off("disconnect").on("disconnect", (reason) => {
      console.log("❌ Отключено:", reason);
      connectionStatus.value = "disconnected";
    });

    socket.off("connect_error").on("connect_error", (err) => {
      console.error("Ошибка подключения:", err.message);
      setTimeout(() => socket.connect(), 1000);
    });

    socket.off("welcome").on("welcome", (msg: string) => {
      messages.value.push({
        username: "System",
        message: msg,
        timestamp: new Date().toISOString(),
      });
      scrollToBottom();
    });

    socket.off("statusChange").on("statusChange", ({ userId, isOnline }) => {
      const chat = chats.value.find((c) => c.partnerId === userId);
      if (chat) {
        chat.partner.is_online = isOnline;
      }
    });

    socket.off("chatHistory").on("chatHistory", (chatMessages: ChatMessage[]) => {
      messages.value = chatMessages;
      scrollToBottom();
    });

    socket.off("newMessage").on("newMessage", (newMessage: ChatMessage) => {
      messages.value.push(newMessage);
      scrollToBottom();
    });

    socket.off("error").on("error", (err: string) => {
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
    joinChat,
    chats,
  };
}
