import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const resources = {
  en: {
    translation: {
      // Navigation
      chat: 'Chat',
      resumes: 'Resumes',
      settings: 'Settings',
      
      // Login Screen
      welcome: 'Welcome to Resume Craft Pro',
      loginWithTelegram: 'Login with Telegram',
      loginDescription: 'Connect with your Telegram account to access your resume bot',
      
      // Chat Screen
      typeMessage: 'Type a message...',
      send: 'Send',
      
      // Settings Screen
      darkMode: 'Dark Mode',
      language: 'Language',
      logout: 'Logout',
      about: 'About',
      
      // Resume Screen
      myResumes: 'My Resumes',
      noResumes: 'No resumes found',
      download: 'Download',
      share: 'Share',
      delete: 'Delete',
      
      // Common
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      ok: 'OK',
    }
  },
  hi: {
    translation: {
      // Navigation
      chat: 'चैट',
      resumes: 'रिज्यूमे',
      settings: 'सेटिंग्स',
      
      // Login Screen
      welcome: 'Resume Craft Pro में आपका स्वागत है',
      loginWithTelegram: 'टेलीग्राम से लॉगिन करें',
      loginDescription: 'अपने रिज्यूमे बॉट तक पहुंचने के लिए अपने टेलीग्राम खाते से कनेक्ट करें',
      
      // Chat Screen
      typeMessage: 'एक संदेश टाइप करें...',
      send: 'भेजें',
      
      // Settings Screen
      darkMode: 'डार्क मोड',
      language: 'भाषा',
      logout: 'लॉगआउट',
      about: 'के बारे में',
      
      // Resume Screen
      myResumes: 'मेरे रिज्यूमे',
      noResumes: 'कोई रिज्यूमे नहीं मिला',
      download: 'डाउनलोड',
      share: 'साझा करें',
      delete: 'हटाएं',
      
      // Common
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      success: 'सफलता',
      cancel: 'रद्द करें',
      ok: 'ठीक है',
    }
  }
};

const initI18n = async () => {
  let savedLanguage = 'en';
  
  try {
    const language = await AsyncStorage.getItem('language');
    if (language) {
      savedLanguage = language;
    }
  } catch (error) {
    console.error('Error loading saved language:', error);
  }

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: savedLanguage,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });
};

initI18n();

export default i18n;
