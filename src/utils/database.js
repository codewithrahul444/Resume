import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('telegram_bot.db');

export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT NOT NULL,
          isUser BOOLEAN NOT NULL,
          timestamp INTEGER NOT NULL,
          messageId TEXT
        );`,
        [],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

export const saveMessage = (text, isUser, messageId = null) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO messages (text, isUser, timestamp, messageId) VALUES (?, ?, ?, ?)',
        [text, isUser, Date.now(), messageId],
        (_, result) => resolve(result.insertId),
        (_, error) => reject(error)
      );
    });
  });
};

export const getMessages = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM messages ORDER BY timestamp ASC',
        [],
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
};

export const clearMessages = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM messages',
        [],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};
