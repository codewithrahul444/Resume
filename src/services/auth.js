import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';
import { CONFIG } from '../config/config';

WebBrowser.maybeCompleteAuthSession();

export const telegramAuth = async (authData) => {
  try {
    const response = await fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Telegram auth error:', error);
    return { success: false, error: 'Authentication failed' };
  }
};

export const validateTelegramAuth = (authData) => {
  const { hash, ...data } = authData;
  
  const dataCheckString = Object.keys(data)
    .sort()
    .map(key => `${key}=${data[key]}`)
    .join('\n');
    
  const secretKey = Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    CONFIG.BOT_TOKEN,
    { encoding: Crypto.CryptoEncoding.HEX }
  );
  
  const calculatedHash = Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    dataCheckString,
    { encoding: Crypto.CryptoEncoding.HEX }
  );
  
  return calculatedHash === hash;
};

export const getTelegramLoginUrl = () => {
  const params = new URLSearchParams({
    bot_id: CONFIG.TELEGRAM_BOT_ID,
    origin: CONFIG.TELEGRAM_DOMAIN,
    request_access: 'write',
    return_to: `${CONFIG.API_URL}/auth/callback`
  });
  
  return `https://oauth.telegram.org/auth?${params.toString()}`;
};
