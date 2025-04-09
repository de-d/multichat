import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  // Оптимальные настройки:
  withCredentials: true,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  timeout: 20000,
  autoConnect: true,
  forceNew: false,
  upgrade: false,
});

// Обработчики событий соединения
socket.on("connect", () => {
  console.log("✅ Соединение установлено. ID:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Соединение разорвано:", reason);
});

socket.on("connect_error", (err) => {
  console.error("Ошибка соединения:", err.message);
  setTimeout(() => socket.connect(), 1000);
});

socket.on("reconnect", (attempt) => {
  console.log(`♻️ Переподключение #${attempt}`);
});

socket.on("reconnect_error", (err) => {
  console.error("Ошибка переподключения:", err.message);
});

socket.on("reconnect_failed", () => {
  console.error("❌ Не удалось переподключиться");
  alert("Соединение с сервером потеряно. Пожалуйста, обновите страницу.");
});

export default socket;
