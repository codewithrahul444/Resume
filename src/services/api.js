import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG } from '../config/config';

class ApiService {
  constructor() {
    this.baseURL = CONFIG.API_URL;
  }

  async getAuthHeaders() {
    const token = await AsyncStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async request(endpoint, options = {}) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: { ...headers, ...options.headers },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Chat methods
  async sendMessage(message, chatId) {
    return this.request(CONFIG.ENDPOINTS.CHAT, {
      method: 'POST',
      body: JSON.stringify({ message, chatId }),
    });
  }

  async getChatHistory(chatId, limit = CONFIG.CHAT_HISTORY_LIMIT) {
    return this.request(`${CONFIG.ENDPOINTS.CHAT}/${chatId}?limit=${limit}`);
  }

  // Resume methods
  async getResumes() {
    return this.request(CONFIG.ENDPOINTS.RESUMES);
  }

  async getResume(resumeId) {
    return this.request(`${CONFIG.ENDPOINTS.RESUMES}/${resumeId}`);
  }

  async deleteResume(resumeId) {
    return this.request(`${CONFIG.ENDPOINTS.RESUMES}/${resumeId}`, {
      method: 'DELETE',
    });
  }

  async downloadResume(resumeId) {
    return this.request(`${CONFIG.ENDPOINTS.DOWNLOAD}/${resumeId}`);
  }

  // Template methods
  async getTemplates() {
    return this.request(CONFIG.ENDPOINTS.TEMPLATES);
  }

  // Upload methods
  async uploadFile(file, type = 'image') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const token = await AsyncStorage.getItem('authToken');
    
    return fetch(`${this.baseURL}${CONFIG.ENDPOINTS.UPLOAD}`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    }).then(response => response.json());
  }
}

export default new ApiService();
