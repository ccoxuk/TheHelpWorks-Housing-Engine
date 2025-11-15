import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { chatService } from '../services/api';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Initial welcome message
    setMessages([
      {
        _id: 1,
        text: "Hello! I'm your housing legal assistant. How can I help you today?",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Legal Assistant',
          avatar: '🏠',
        },
      },
    ]);
  }, []);

  const onSend = async (newMessages = []) => {
    const userMessage = newMessages[0];
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages)
    );

    setIsTyping(true);

    try {
      // Call the API
      const response = await chatService.sendMessage([
        ...messages.map(m => ({
          role: m.user._id === 1 ? 'user' : 'assistant',
          content: m.text,
        })),
        { role: 'user', content: userMessage.text },
      ]);

      // Add AI response
      const aiMessage = {
        _id: Math.random(),
        text: response.message,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Legal Assistant',
          avatar: '🏠',
        },
      };

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [aiMessage])
      );

      // Add suggestions if available
      if (response.suggestions && response.suggestions.length > 0) {
        const suggestionsMessage = {
          _id: Math.random(),
          text: 'Suggested actions:\n' + response.suggestions.join('\n'),
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Legal Assistant',
            avatar: '💡',
          },
        };

        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, [suggestionsMessage])
        );
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        _id: Math.random(),
        text: 'Sorry, I encountered an error. Please try again.',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Legal Assistant',
          avatar: '❌',
        },
      };

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [errorMessage])
      );
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
        isTyping={isTyping}
        placeholder="Type your housing question..."
        alwaysShowSend
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatScreen;
