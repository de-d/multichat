import * as sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import * as path from "path";

let dbInstance: Database | null = null;
const dbPath = path.resolve(__dirname, "database.sqlite");

export async function connectDB(): Promise<Database> {
  if (!dbInstance) {
    dbInstance = await open({
      filename: dbPath,
      driver: sqlite3.Database,
      mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    });

    // Включаем журналирование WAL для лучшей производительности
    await dbInstance.exec("PRAGMA journal_mode = WAL");
  }
  return dbInstance;
}

export async function initDB(): Promise<void> {
  try {
    const db = await connectDB();

    // Проверяем существование таблицы
    const tableExists = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='messages'");

    if (!tableExists) {
      await db.exec(`
        CREATE TABLE messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL,
          message TEXT NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Добавляем тестовое сообщение
      await db.run("INSERT INTO messages (username, message) VALUES (?, ?)", ["System", "Database initialized"]);
    }

    console.log("Database initialized ✅");
    console.log(`Database file: ${dbPath}`);

    // Проверяем содержимое таблицы
    const messageCount = await db.get("SELECT COUNT(*) as count FROM messages");
    console.log(`Messages in database: ${messageCount.count}`);
  } catch (err) {
    console.error("Database initialization error:", err);
    throw err;
  }
}
