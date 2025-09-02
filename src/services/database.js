import * as SQLite from 'expo-sqlite';

class DatabaseService {
  constructor() {
    this.db = null;
    this.initDatabase();
  }

  async initDatabase() {
    try {
      this.db = await SQLite.openDatabaseAsync('resumeCraftPro.db');
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

    await this.db.execAsync(createMessagesTable);
    await this.db.execAsync(createResumesTable);
  }

  // Message methods
  async saveMessage(message) {
    try {
      await this.db.runAsync(
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
    } catch (error) {
      console.error('Error saving message:', error);
    }
  }

  async getMessages(chatId = 'default', limit = 50) {
    try {
      const result = await this.db.getAllAsync(
        'SELECT * FROM messages WHERE chatId = ? ORDER BY createdAt DESC LIMIT ?',
        [chatId, limit]
      );

      return result.map(row => ({
        _id: row.messageId,
        text: row.text,
        createdAt: new Date(row.createdAt),
        user: JSON.parse(row.user),
        type: row.type,
        data: JSON.parse(row.data || '{}')
      })).reverse();
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  async clearMessages(chatId = 'default') {
    try {
      await this.db.runAsync('DELETE FROM messages WHERE chatId = ?', [chatId]);
    } catch (error) {
      console.error('Error clearing messages:', error);
    }
  }

  // Resume methods
  async saveResume(resume) {
    try {
      await this.db.runAsync(
        'INSERT OR REPLACE INTO resumes (resumeId, title, data, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
        [
          resume.id,
          resume.title,
          JSON.stringify(resume),
          resume.createdAt || Date.now(),
          Date.now()
        ]
      );
    } catch (error) {
      console.error('Error saving resume:', error);
    }
  }

  async getResumes() {
    try {
      const result = await this.db.getAllAsync(
        'SELECT * FROM resumes ORDER BY updatedAt DESC'
      );

      return result.map(row => ({
        ...JSON.parse(row.data),
        localId: row.id
      }));
    } catch (error) {
      console.error('Error getting resumes:', error);
      return [];
    }
  }

  async deleteResume(resumeId) {
    try {
      await this.db.runAsync('DELETE FROM resumes WHERE resumeId = ?', [resumeId]);
    } catch (error) {
      console.error('Error deleting resume:', error);
    }
  }
}

export default new DatabaseService();
