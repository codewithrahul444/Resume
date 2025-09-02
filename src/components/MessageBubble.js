import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';

export default function MessageBubble({ message, theme }) {
  const isUser = message.isUser;
  const bubbleColor = isUser ? theme.colors.userBubble : theme.colors.botBubble;
  const textColor = isUser ? theme.colors.userText : theme.colors.botText;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.botContainer
    ]}>
      <Card style={[
        styles.bubble,
        { backgroundColor: bubbleColor },
        isUser ? styles.userBubble : styles.botBubble
      ]}>
        <Card.Content style={styles.content}>
          <Text style={[styles.messageText, { color: textColor }]}>
            {message.text}
          </Text>
          <Text style={[styles.timeText, { color: textColor, opacity: 0.7 }]}>
            {formatTime(message.timestamp)}
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  botContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    elevation: 1,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  botBubble: {
    borderBottomLeftRadius: 4,
  },
  content: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  timeText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
});
