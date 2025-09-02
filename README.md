# Resume Craft Pro Mobile App

A React Native mobile app that connects to your existing Resume Craft Pro Telegram bot, providing a native chat interface for Android and iOS with professional resume building capabilities.

## 🚀 Features

- 🔐 **Telegram OAuth Authentication**
- 💬 **Real-time Chat Interface** with your bot
- 🌙 **Dark/Light Mode Toggle**
- 💾 **Local Message & Resume Storage** (SQLite)
- 📱 **Cross-platform** (iOS & Android)
- 🔔 **Push Notifications** ready
- 🎨 **Modern Material Design UI**
- 🌍 **Multi-language Support** (English + Hindi)
- 📄 **Resume Management** (View, Download, Share, Delete)
- 📧 **Email Export** functionality

## 📋 Prerequisites

```bash
# Install Node.js (18+)
# Install Expo CLI
npm install -g @expo/cli

# For Android development
# Install Android Studio and set up Android SDK

# For iOS development (macOS only)
# Install Xcode and iOS Simulator
```

## 🛠️ Installation & Setup

### 1. Clone and Install Dependencies

```bash
cd TelegramBotApp
npm install
```

### 2. Configure Your Bot Connection

Edit `src/config/config.js` and replace the placeholder values:

```javascript
export const CONFIG = {
  // Replace with your actual bot server URL
  BOT_URL: 'https://your-resume-bot-server.herokuapp.com',
  API_URL: 'https://your-resume-bot-server.herokuapp.com/api',
  
  // Your Telegram Bot Configuration
  BOT_TOKEN: 'YOUR_ACTUAL_BOT_TOKEN',
  BOT_USERNAME: 'YourResumeBotUsername',
  
  // Telegram OAuth Configuration
  TELEGRAM_BOT_ID: 'YOUR_BOT_ID',
  TELEGRAM_DOMAIN: 'your-domain.com',
  
  // WebSocket URL for real-time updates
  WS_URL: 'wss://your-resume-bot-server.herokuapp.com',
};
```

### 3. Add App Assets

Replace placeholder files in `assets/` directory:
- `icon.png` (1024x1024) - App icon
- `adaptive-icon.png` (1024x1024) - Android adaptive icon
- `splash.png` (1284x2778) - Splash screen
- `favicon.png` (48x48) - Web favicon
- `notification-icon.png` (96x96) - Notification icon

### 4. Backend Integration Requirements

Your existing Node.js Telegram bot needs these API endpoints:

```javascript
// Authentication endpoint
POST /api/auth/telegram
Body: { id, first_name, last_name, username, photo_url, auth_date, hash }
Response: { success: true, user: {...}, token: "jwt_token" }

// Chat endpoints
POST /api/chat
Body: { message: "text", chatId: "user_id" }
Response: { success: true, reply: { text: "bot_response", type: "text" } }

GET /api/chat/:chatId?limit=50
Response: { success: true, messages: [...] }

// Resume endpoints
GET /api/resumes
Response: { success: true, resumes: [...] }

GET /api/resumes/:resumeId
Response: { success: true, resume: {...} }

DELETE /api/resumes/:resumeId
Response: { success: true }

GET /api/download/:resumeId
Response: { success: true, pdfUrl: "download_link" }

// Template endpoint
GET /api/templates
Response: { success: true, templates: [...] }

// File upload endpoint
POST /api/upload
Body: FormData with file
Response: { success: true, fileUrl: "uploaded_file_url" }
```

## 🏃‍♂️ Running the App

### Development Mode

```bash
# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

### Building for Production

#### Using EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for Android
npm run build:android

# Build for iOS
npm run build:ios

# Build for both platforms
eas build --platform all
```

#### Local Builds

```bash
# Android APK
expo build:android

# iOS IPA (macOS only)
expo build:ios
```

## 📁 Project Structure

```
TelegramBotApp/
├── src/
│   ├── components/           # Reusable UI components
│   ├── screens/             # App screens
│   │   ├── SplashScreen.js  # App loading screen
│   │   ├── LoginScreen.js   # Telegram authentication
│   │   ├── ChatScreen.js    # Main chat interface
│   │   ├── SavedResumesScreen.js # Resume management
│   │   └── SettingsScreen.js # App settings
│   ├── context/             # React contexts
│   │   ├── ThemeContext.js  # Dark/Light theme
│   │   ├── AuthContext.js   # User authentication
│   │   └── I18nContext.js   # Internationalization
│   ├── services/            # API and utility services
│   │   ├── api.js          # Backend API calls
│   │   ├── auth.js         # Telegram authentication
│   │   ├── database.js     # Local SQLite database
│   │   └── i18n.js         # Language translations
│   ├── theme/
│   │   └── theme.js        # App themes (light/dark)
│   └── config/
│       └── config.js       # App configuration
├── assets/                  # App assets (icons, splash)
├── App.js                  # Main app component
├── package.json            # Dependencies
├── app.json               # Expo configuration
├── eas.json               # EAS Build configuration
└── README.md              # This file
```

## 🔧 Configuration Options

### Theme Customization

Edit `src/theme/theme.js` to customize colors:

```javascript
export const lightTheme = {
  colors: {
    primary: '#0088cc',        // Primary brand color
    userBubble: '#0088cc',     // User message bubble
    botBubble: '#e0e0e0',      // Bot message bubble
    // ... other colors
  },
};
```

### Language Support

Add new languages in `src/services/i18n.js`:

```javascript
const resources = {
  en: { translation: { /* English translations */ } },
  hi: { translation: { /* Hindi translations */ } },
  // Add more languages here
};
```

### Push Notifications

Configure in `app.json`:

```json
{
  "expo": {
    "plugins": ["expo-notifications"],
    "notification": {
      "icon": "./assets/notification-icon.png",
      "color": "#000000"
    }
  }
}
```

## 🔐 Security Considerations

1. **Environment Variables**: Store sensitive data in environment variables
2. **API Security**: Implement proper authentication and rate limiting
3. **Data Validation**: Validate all user inputs on both client and server
4. **HTTPS**: Always use HTTPS for API communications
5. **Token Storage**: Secure token storage using Expo SecureStore for production

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues**:
   ```bash
   expo start -c  # Clear cache
   ```

2. **Android build fails**:
   - Check Android SDK setup
   - Verify ANDROID_HOME environment variable

3. **iOS build fails**:
   - Ensure Xcode is properly configured
   - Check iOS Simulator setup

4. **API connection errors**:
   - Verify bot server URL in config
   - Check network connectivity
   - Validate API endpoints

5. **Authentication issues**:
   - Verify Telegram bot token
   - Check OAuth configuration
   - Validate webhook URLs

### Debug Mode

```bash
# Enable debug mode
expo start --dev-client

# View logs
expo logs

# Clear all data
expo start -c --reset-cache
```

## 📱 App Store Deployment

### Android (Google Play Store)

1. Build production APK/AAB
2. Create Google Play Console account
3. Upload build and configure store listing
4. Submit for review

### iOS (Apple App Store)

1. Build production IPA
2. Create Apple Developer account
3. Upload to App Store Connect
4. Configure app metadata and submit for review

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review Expo documentation: https://docs.expo.dev/

---

**Note**: This mobile app is designed to work with your existing Resume Craft Pro Telegram bot. Make sure your bot server implements the required API endpoints for full functionality.
