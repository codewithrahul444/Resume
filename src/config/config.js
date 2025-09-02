export const CONFIG = {
  // Replace with your actual bot server URL
  BOT_URL: 'https://your-bot-server.herokuapp.com',
  API_URL: 'https://your-bot-server.herokuapp.com/api',
  
  // Telegram Bot Configuration
  BOT_TOKEN: 'YOUR_BOT_TOKEN_HERE',
  BOT_USERNAME: 'YourBotUsername',
  
  // Telegram OAuth Configuration
  TELEGRAM_BOT_ID: 'YOUR_BOT_ID',
  TELEGRAM_DOMAIN: 'your-domain.com',
  
  // WebSocket URL for real-time updates
  WS_URL: 'wss://your-bot-server.herokuapp.com',
  
  // API Endpoints
  ENDPOINTS: {
    LOGIN: '/auth/telegram',
    CHAT: '/chat',
    RESUMES: '/resumes',
    UPLOAD: '/upload',
    DOWNLOAD: '/download',
    TEMPLATES: '/templates'
  },
  
  // App Settings
  CHAT_HISTORY_LIMIT: 100,
  AUTO_SAVE_INTERVAL: 30000, // 30 seconds
  
  // Supported Languages
  LANGUAGES: {
    en: 'English',
    hi: 'हिंदी'
  }
};
