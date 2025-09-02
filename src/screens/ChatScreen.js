import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Send } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import ApiService from '../services/api';
import DatabaseService from '../services/database';

export default function ChatScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { t } = useI18n();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const localMessages = await DatabaseService.getMessages();
      setMessages(localMessages);
      
      // Load recent messages from server
      const serverMessages = await ApiService.getChatHistory(user.id);
      if (serverMessages.success) {
        const formattedMessages = serverMessages.messages.map(formatMessage);
        setMessages(formattedMessages);
        
        // Save to local database
        formattedMessages.forEach(msg => DatabaseService.saveMessage(msg));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const formatMessage = (msg) => ({
    _id: msg.id || Math.random().toString(),
    text: msg.text,
    createdAt: new Date(msg.timestamp || Date.now()),
    user: {
      _id: msg.from === 'bot' ? 'bot' : user.id,
      name: msg.from === 'bot' ? 'Resume Bot' : user.first_name,
      avatar: msg.from === 'bot' ? null : user.photo_url,
    },
    type: msg.type || 'text',
    data: msg.data || {},
  });

  const onSend = useCallback(async (newMessages = []) => {
    const message = newMessages[0];
    
    // Add message to chat immediately
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    
    // Save to local database
    await DatabaseService.saveMessage(message);
    
    try {
      setLoading(true);
      const response = await ApiService.sendMessage(message.text, user.id);
      
      if (response.success && response.reply) {
        const botMessage = formatMessage({
          id: response.reply.id,
          text: response.reply.text,
          from: 'bot',
          timestamp: response.reply.timestamp,
          type: response.reply.type,
          data: response.reply.data,
        });
        
        setMessages(previousMessages => GiftedChat.append(previousMessages, [botMessage]));
        await DatabaseService.saveMessage(botMessage);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: theme.colors.userBubble },
        left: { backgroundColor: theme.colors.botBubble },
      }}
      textStyle={{
        right: { color: theme.colors.userText },
        left: { color: theme.colors.botText },
      }}
    />
  );

  const renderInputToolbar = (props) => (
    <InputToolbar
      {...props}
      containerStyle={[
        styles.inputToolbar,
        { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outline }
      ]}
      textInputStyle={{ color: theme.colors.onSurface }}
    />
  );

  const renderSend = (props) => (
    <Send {...props} containerStyle={styles.sendContainer}>
      <Ionicons name="send" size={24} color={theme.colors.primary} />
    </Send>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: user.id }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend}
        placeholder={t('typeMessage')}
        isLoadingEarlier={loading}
        scrollToBottom
        scrollToBottomComponent={() => (
          <Ionicons name="chevron-down" size={24} color={theme.colors.primary} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputToolbar: {
    borderTopWidth: 1,
    paddingHorizontal: 8,
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
});
