import * as express from "express";
import * as http from "http";
import { Server } from "socket.io";
import * as cors from "cors";
import { initDB, connectDB } from "./db";

const app = express();
const server = http.createServer(app);

// Настройка CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Инициализация Socket.IO с правильными настройками
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"], // Явно указываем транспорты
  allowUpgrades: false, // Отключаем переключение транспортов
  pingTimeout: 60000, // Увеличиваем таймауты
  pingInterval: 25000,
});

// Инициализация БД
initDB().catch((err) => {
  console.error("Database initialization failed:", err);
  process.exit(1);
});

// Обработчик соединений
io.on("connection", async (socket) => {
  console.log(`Client connected: ${socket.id}`);

  try {
    const db = await connectDB();

    // Получаем сообщения (старые сначала)
    const messages = await db.all(`
      SELECT username, message, timestamp
      FROM messages
      ORDER BY timestamp ASC
      LIMIT 100
    `);

    // Отправляем историю с пометкой о порядке
    socket.emit("chatHistory", {
      messages,
      order: "asc", // Указываем порядок сортировки
    });

    // Обработка новых сообщений
    socket.on("sendMessage", async ({ username, message }, callback = () => {}) => {
      if (!username?.trim() || !message?.trim()) {
        callback({ status: "error", message: "Username and message are required" });
        return;
      }

      try {
        const timestamp = new Date().toISOString();
        await db.run("INSERT INTO messages (username, message, timestamp) VALUES (?, ?, ?)", [username.trim(), message.trim(), timestamp]);

        const newMessage = { username, message, timestamp };
        io.emit("newMessage", newMessage);
        callback({ status: "success" });
      } catch (err) {
        console.error("Error saving message:", err);
        callback({ status: "error", message: "Failed to save message" });
      }
    });
  } catch (err) {
    console.error("Database error:", err);
    socket.emit("error", "Database connection error");
  }

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
