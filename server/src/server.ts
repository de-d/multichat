import express, { Request, Response } from "express";
import http from "http";
import path from "path";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { initDB, connectDB, setUserOnline, setUserOffline } from "./db";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
  pingInterval: 5000,
  pingTimeout: 10000,
});

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const JWT_SECRET = process.env.JWT_SECRET || "secret";

initDB().catch((err) => {
  console.error("Database initialization failed:", err);
  process.exit(1);
});

app.get("/api/chats", async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("TOKEN:", token);
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.id;
    const db = await connectDB();

    const chats = await db.all(
      `
      SELECT c.id as chatId
      FROM chats c
      JOIN user_chats uc ON uc.chat_id = c.id
      WHERE uc.user_id = ?
    `,
      userId
    );

    const chatDetails = await Promise.all(
      chats.map(async (chat) => {
        const partner = await db.get(
          `
          SELECT u.id, u.username, u.avatar, u.is_online
          FROM users u
          JOIN user_chats uc ON uc.user_id = u.id
          WHERE uc.chat_id = ? AND u.id != ?
        `,
          [chat.chatId, userId]
        );

        const lastMessage = await db.get(
          `
          SELECT message, timestamp
          FROM messages
          WHERE chat_id = ?
          ORDER BY timestamp DESC
          LIMIT 1
        `,
          [chat.chatId]
        );

        const unreadCount = await db.get(
          `
          SELECT COUNT(*) as count
          FROM messages
          WHERE chat_id = ? AND read = 0 AND user_id != ?
        `,
          [chat.chatId, userId]
        );

        return {
          chatId: chat.chatId,
          partner,
          lastMessage,
          unreadCount: unreadCount.count,
        };
      })
    );

    res.json(chatDetails);
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid token" });
  }
});

app.post("/api/register", async (req, res) => {
  const { username, password, avatar } = req.body;
  const db = await connectDB();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run("INSERT INTO users (username, avatar, password) VALUES (?, ?, ?)", [username, avatar, hashedPassword]);
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Username already exists" });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const db = await connectDB();
  const user = await db.get("SELECT * FROM users WHERE username = ?", username);

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    await setUserOnline(user.id);
    res.json({ token, user: { id: user.id, username: user.username, avatar: user.avatar } });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.get("/api/chats/:chatId", async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("TOKEN:", token);
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const chatId = req.params.chatId;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.id;
    const db = await connectDB();

    const messages = await db.all(
      `SELECT id, user_id as id, message, timestamp
       FROM messages
       WHERE chat_id = ?
       ORDER BY timestamp ASC`,
      [chatId]
    );

    const partner = await db.get(
      `SELECT u.id, u.username, u.avatar, u.is_online
       FROM users u
       JOIN user_chats uc ON uc.user_id = u.id
       WHERE uc.chat_id = ? AND u.id != ?`,
      [chatId, userId]
    );

    res.json({ partner, messages });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid token" });
  }
});

io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    socket.data.user = decoded;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

io.on("connection", async (socket) => {
  const user = socket.data.user;
  console.log("👤 Новый клиент подключён:", socket.id);
  socket.emit("welcome", "Добро пожаловать в чат!");

  const db = await connectDB();

  await setUserOnline(user.id);

  socket.on("joinChat", async (chatId) => {
    const messages = await db.all(
      `SELECT m.message, m.timestamp, m.read, m.user_id AS userId, u.username, u.avatar
       FROM messages m
       JOIN users u ON u.id = m.user_id
       WHERE chat_id = ?
       ORDER BY timestamp ASC`,
      chatId
    );
    socket.join(`${chatId}`);
    socket.emit("chatHistory", messages);
  });

  socket.on("chatHistory", (messages) => {
    console.log("История чата:", messages);
  });

  socket.on("sendMessage", async ({ chatId, message }) => {
    if (!message.trim()) return;

    const timestamp = new Date().toISOString();

    await db.run("INSERT INTO messages (chat_id, user_id, message, timestamp) VALUES (?, ?, ?, ?)", [
      chatId,
      socket.data.user.id,
      message,
      timestamp,
    ]);

    const newMessage = {
      username: socket.data.user.username,
      message: message.trim(),
      timestamp,
      userId: socket.data.user.id,
    };

    io.to(`${chatId}`).emit("newMessage", newMessage);
  });

  socket.on("markAsRead", async ({ chatId }) => {
    await db.run("UPDATE messages SET read = 1 WHERE chat_id = ? AND read = 0", chatId);
  });

  socket.on("disconnect", async () => {
    console.log(`User disconnected: ${user.username}`);
    await setUserOffline(user.id);
    io.emit("statusChange", { userId: user.id, isOnline: false });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
