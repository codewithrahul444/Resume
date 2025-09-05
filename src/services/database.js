import * as SQLite from 'expo-sqlite';

class DatabaseService {
  constructor() {
    this.db = null;
    this.initDatabase();
  }

  async initDatabase() {
    try {
      this.db = SQLite.openDatabase('resumeCraftPro.db');
      await this.createTables();
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  }

  async createTables() {
    const createMessagesTable = `
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        messageId TEXT UNIQUE,
        chatId TEXT,
        text TEXT,
        user TEXT,
        createdAt INTEGER,
        type TEXT DEFAULT 'text',
        data TEXT
      );
    `;

    const createResumesTable = `
      CREATE TABLE IF NOT EXISTS resumes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        resumeId TEXT UNIQUE,
        title TEXT,
        data TEXT,
        createdAt INTEGER,
        updatedAt INTEGER
      );
    `;

    this.db.transaction(tx => {
      tx.executeSql(createMessagesTable);
      tx.executeSql(createResumesTable);
    });
  }

  // Message methods
  async saveMessage(message) {
    try {
      this.db.transaction(tx => {
        tx.executeSql(
          'INSERT OR REPLACE INTO messages (messageId, chatId, text, user, createdAt, type, data) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            message._id,
            message.chatId || 'default',
            message.text,
            JSON.stringify(message.user),
            message.createdAt,
            message.type || 'text',
            JSON.stringify(message.data || {})
          ]
        );
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  }

  async getMessages(chatId = 'default', limit = 50) {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM messages WHERE chatId = ? ORDER BY createdAt DESC LIMIT ?',
          [chatId, limit],
          (_, { rows }) => {
            const messages = rows._array.map(row => ({
              _id: row.messageId,
              text: row.text,
              createdAt: new Date(row.createdAt),
              user: JSON.parse(row.user),
              type: row.type,
              data: JSON.parse(row.data || '{}')
            })).reverse();
            resolve(messages);
          },
          (_, error) => {
            console.error('Error getting messages:', error);
            resolve([]);
          }
        );
      });
    });
  }

  async clearMessages(chatId = 'default') {
    try {
      this.db.transaction(tx => {
        tx.executeSql('DELETE FROM messages WHERE chatId = ?', [chatId]);
      });
    } catch (error) {
      console.error('Error clearing messages:', error);
    }
  }

  // Resume methods
  async saveResume(resume) {
    try {
      this.db.transaction(tx => {
        tx.executeSql(
          'INSERT OR REPLACE INTO resumes (resumeId, title, data, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
          [
            resume.id,
            resume.title,
            JSON.stringify(resume),
            resume.createdAt || Date.now(),
            Date.now()
          ]
        );
      });
    } catch (error) {
      console.error('Error saving resume:', error);
    }
  }

  async getResumes() {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM resumes ORDER BY updatedAt DESC',
          [],
          (_, { rows }) => {
            const resumes = rows._array.map(row => ({
              ...JSON.parse(row.data),
              localId: row.id
            }));
            resolve(resumes);
          },
          (_, error) => {
            console.error('Error getting resumes:', error);
            resolve([]);
          }
        );
      });
    });
  }

  async deleteResume(resumeId) {
    try {
      this.db.transaction(tx => {
        tx.executeSql('DELETE FROM resumes WHERE resumeId = ?', [resumeId]);
      });
    } catch (error) {
      console.error('Error deleting resume:', error);
    }
  }
}

export default new DatabaseService();
