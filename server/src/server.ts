import * as express from "express";
import * as http from "http";
import * as cors from "cors";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { initDB, connectDB } from "./db";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "secret";

initDB().catch((err) => {
  console.error("Database initialization failed:", err);
  process.exit(1);
});

// Роуты авторизации
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
    res.json({ token, user: { id: user.id, username: user.username, avatar: user.avatar } });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Middleware для валидации токена
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
  console.log(`User connected: ${user.username}`);

  const db = await connectDB();

  socket.on("joinChat", async (chatId) => {
    const messages = await db.all(
      `SELECT m.message, m.timestamp, m.read, u.username, u.avatar FROM messages m
       JOIN users u ON u.id = m.user_id WHERE chat_id = ? ORDER BY timestamp ASC`,
      chatId
    );
    socket.join(`chat_${chatId}`);
    socket.emit("chatHistory", messages);
  });

  socket.on("sendMessage", async ({ chatId, message }) => {
    const timestamp = new Date().toISOString();
    await db.run("INSERT INTO messages (chat_id, user_id, message, timestamp) VALUES (?, ?, ?, ?)", [chatId, user.id, message, timestamp]);

    const newMessage = {
      username: user.username,
      avatar: user.avatar,
      message,
      timestamp,
      read: false,
    };
    io.to(`chat_${chatId}`).emit("newMessage", newMessage);
  });

  socket.on("markAsRead", async ({ chatId }) => {
    await db.run("UPDATE messages SET read = 1 WHERE chat_id = ? AND read = 0", chatId);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
