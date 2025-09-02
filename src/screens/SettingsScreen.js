import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { List, Switch, Button, Divider, Avatar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { CONFIG } from '../config/config';

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { t, changeLanguage, currentLanguage } = useI18n();

  const handleLanguageChange = () => {
    Alert.alert(
      t('language'),
      'Select Language / भाषा चुनें',
      [
        {
          text: 'English',
          onPress: async () => {
            changeLanguage('en');
            await AsyncStorage.setItem('language', 'en');
          },
        },
        {
          text: 'हिंदी',
          onPress: async () => {
            changeLanguage('hi');
            await AsyncStorage.setItem('language', 'hi');
          },
        },
        { text: t('cancel'), style: 'cancel' },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      t('logout'),
      'Are you sure you want to logout?',
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('logout'),
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      t('about'),
      'Resume Craft Pro Mobile\nVersion 1.0.0\n\nA professional resume builder app that connects with your Telegram bot.',
      [{ text: t('ok') }]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <Avatar.Image
          size={80}
          source={{ uri: user?.photo_url }}
          style={styles.avatar}
        />
        <List.Item
          title={`${user?.first_name} ${user?.last_name || ''}`.trim()}
          description={user?.username ? `@${user.username}` : user?.id}
          titleStyle={{ color: theme.colors.onSurface }}
          descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
        />
      </View>

      <Divider />

      {/* App Settings */}
      <List.Section>
        <List.Subheader style={{ color: theme.colors.primary }}>
          App Settings
        </List.Subheader>
        
        <List.Item
          title={t('darkMode')}
          left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
          right={() => (
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              color={theme.colors.primary}
            />
          )}
        />
        
        <List.Item
          title={t('language')}
          description={CONFIG.LANGUAGES[currentLanguage]}
          left={(props) => <List.Icon {...props} icon="translate" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={handleLanguageChange}
        />
      </List.Section>

      <Divider />

      {/* App Info */}
      <List.Section>
        <List.Subheader style={{ color: theme.colors.primary }}>
          Information
        </List.Subheader>
        
        <List.Item
          title={t('about')}
          left={(props) => <List.Icon {...props} icon="information" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={handleAbout}
        />
      </List.Section>

      <Divider />

      {/* Logout Button */}
      <View style={styles.logoutSection}>
        <Button
          mode="contained"
          onPress={handleLogout}
          icon="logout"
          buttonColor={theme.colors.error}
          textColor={theme.colors.onError}
          style={styles.logoutButton}
        >
          {t('logout')}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    marginBottom: 16,
  },
  logoutSection: {
    padding: 20,
    marginTop: 20,
  },
  logoutButton: {
    paddingVertical: 8,
  },
});
