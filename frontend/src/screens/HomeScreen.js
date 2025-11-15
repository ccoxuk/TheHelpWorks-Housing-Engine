import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Welcome to TheHelpWorks</Title>
        <Paragraph style={styles.subtitle}>
          Get help with your housing legal issues
        </Paragraph>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title>AI Legal Assistant</Title>
          <Paragraph>
            Chat with our AI-powered assistant to get immediate help with your housing questions.
          </Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => navigation.navigate('Chat')}>
            Start Chat
          </Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Decision Guide</Title>
          <Paragraph>
            Follow our step-by-step guide to understand your rights and options.
          </Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => navigation.navigate('Decision')}>
            Start Guide
          </Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Legal Templates</Title>
          <Paragraph>
            Access templates for common housing legal documents.
          </Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => navigation.navigate('Templates')}>
            View Templates
          </Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Legislative Updates</Title>
          <Paragraph>
            Stay informed about the latest housing law changes.
          </Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => navigation.navigate('Updates')}>
            View Updates
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#2196F3',
    marginBottom: 10,
  },
  title: {
    color: 'white',
    fontSize: 24,
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
  },
  card: {
    margin: 10,
    elevation: 4,
  },
});

export default HomeScreen;
