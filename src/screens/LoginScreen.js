import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import * as WebBrowser from 'expo-web-browser';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { getTelegramLoginUrl } from '../services/auth';

export default function LoginScreen() {
  const { theme } = useTheme();
  const { login } = useAuth();
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);

  const handleTelegramLogin = async () => {
    setLoading(true);
    
    try {
      const loginUrl = getTelegramLoginUrl();
      const result = await WebBrowser.openAuthSessionAsync(loginUrl);
      
      if (result.type === 'success') {
        const url = new URL(result.url);
        const params = new URLSearchParams(url.search);
        
        const authData = {
          id: params.get('id'),
          first_name: params.get('first_name'),
          last_name: params.get('last_name'),
          username: params.get('username'),
          photo_url: params.get('photo_url'),
          auth_date: params.get('auth_date'),
          hash: params.get('hash'),
        };

        const loginResult = await login(authData);
        
        if (!loginResult.success) {
          Alert.alert(t('error'), loginResult.error || 'Login failed');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(t('error'), 'Failed to login with Telegram');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
            {t('welcome')}
          </Text>
          
          <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.onSurface }]}>
            {t('loginDescription')}
          </Text>
          
          <Button
            mode="contained"
            onPress={handleTelegramLogin}
            loading={loading}
            disabled={loading}
            style={styles.loginButton}
            contentStyle={styles.loginButtonContent}
          >
            {t('loginWithTelegram')}
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    padding: 20,
  },
  cardContent: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  description: {
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  loginButton: {
    width: '100%',
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
});
