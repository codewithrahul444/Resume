import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0088cc',
    primaryContainer: '#e3f2fd',
    secondary: '#64b5f6',
    surface: '#ffffff',
    background: '#f5f5f5',
    onSurface: '#000000',
    onBackground: '#000000',
    userBubble: '#0088cc',
    botBubble: '#e0e0e0',
    userText: '#ffffff',
    botText: '#000000',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#64b5f6',
    primaryContainer: '#1565c0',
    secondary: '#90caf9',
    surface: '#121212',
    background: '#000000',
    onSurface: '#ffffff',
    onBackground: '#ffffff',
    userBubble: '#64b5f6',
    botBubble: '#2c2c2c',
    userText: '#000000',
    botText: '#ffffff',
  },
};
