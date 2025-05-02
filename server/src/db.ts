import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

let dbInstance: Database | null = null;
const dbPath = path.resolve(__dirname, "database.sqlite");

export async function connectDB(): Promise<Database> {
  if (!dbInstance) {
    dbInstance = await open({
      filename: dbPath,
      driver: sqlite3.Database,
      mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    });

    await dbInstance.exec("PRAGMA journal_mode = WAL");
  }
  return dbInstance;
}

export async function initDB(): Promise<void> {
  try {
    const db = await connectDB();

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      avatar TEXT,
      password TEXT NOT NULL,
      is_online INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS chats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        is_group INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS user_chats (
        user_id INTEGER,
        chat_id INTEGER,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(chat_id) REFERENCES chats(id),
        PRIMARY KEY (user_id, chat_id)
      );

      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chat_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        message TEXT,
        type TEXT DEFAULT 'text', -- text | image | video | audio | gif | file
        media_url TEXT,
        reply_to INTEGER, -- ID сообщения, на которое ответили
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        edited_at DATETIME,
        deleted_at DATETIME,
        read INTEGER DEFAULT 0,
        FOREIGN KEY(chat_id) REFERENCES chats(id),
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(reply_to) REFERENCES messages(id)
      );

      CREATE TABLE IF NOT EXISTS media_files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message_id INTEGER,
        type TEXT, -- "image", "audio", "video", "gif", etc.
        file_path TEXT NOT NULL,
        FOREIGN KEY(message_id) REFERENCES messages(id)
      );

    `);

    const existingUsers = await db.get("SELECT COUNT(*) as count FROM users");
    if (existingUsers.count === 0) {
      await db.run("INSERT INTO users (username, avatar, password) VALUES (?, ?, ?)", ["admin", "https://i.pravatar.cc/150?img=1", "admin123"]);
    }

    const existingChats = await db.get("SELECT COUNT(*) as count FROM chats");
    if (existingChats.count === 0) {
      await db.run("INSERT INTO chats (name, is_group) VALUES (?, ?)", ["General", 1]);
    }

    console.log("Database initialized ✅");
    console.log(`Database file: ${dbPath}`);
  } catch (err) {
    console.error("Database initialization error:", err);
    throw err;
  }
}

export async function setUserOnline(userId: number) {
  const db = await connectDB();
  await db.run("UPDATE users SET is_online = 1 WHERE id = ?", userId);
}

export async function setUserOffline(userId: number) {
  const db = await connectDB();
  await db.run("UPDATE users SET is_online = 0 WHERE id = ?", userId);
}
