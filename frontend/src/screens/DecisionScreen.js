import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, RadioButton, Button, Text } from 'react-native-paper';
import { decisionService } from '../services/api';

const DecisionScreen = () => {
  const [pathways, setPathways] = useState([]);
  const [selectedPathway, setSelectedPathway] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadPathways();
  }, []);

  const loadPathways = async () => {
    try {
      const data = await decisionService.listPathways();
      setPathways(data);
    } catch (error) {
      console.error('Failed to load pathways:', error);
    }
  };

  const selectPathway = async (pathwayId) => {
    try {
      const pathway = await decisionService.getPathway(pathwayId);
      setSelectedPathway(pathway);
      setCurrentStep(0);
      setAnswers({});
      setResult(null);
    } catch (error) {
      console.error('Failed to load pathway:', error);
    }
  };

  const handleAnswer = (answer) => {
    const step = selectedPathway.steps[currentStep];
    setAnswers({ ...answers, [step.id]: answer });
    
    if (currentStep < selectedPathway.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      evaluateDecision();
    }
  };

  const evaluateDecision = async () => {
    try {
      const evaluation = await decisionService.evaluate({ answers });
      setResult(evaluation);
    } catch (error) {
      console.error('Failed to evaluate decision:', error);
    }
  };

  const resetPathway = () => {
    setSelectedPathway(null);
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };

  if (result) {
    return (
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Recommendation</Title>
            <Paragraph>{result.recommendation}</Paragraph>
          </Card.Content>
        </Card>

        {result.applicable_templates && result.applicable_templates.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Applicable Templates</Title>
              {result.applicable_templates.map((template, index) => (
                <Paragraph key={index}>• {template}</Paragraph>
              ))}
            </Card.Content>
          </Card>
        )}

        {result.next_actions && result.next_actions.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Next Actions</Title>
              {result.next_actions.map((action, index) => (
                <Paragraph key={index}>• {action}</Paragraph>
              ))}
            </Card.Content>
          </Card>
        )}

        <Button mode="contained" onPress={resetPathway} style={styles.button}>
          Start Over
        </Button>
      </ScrollView>
    );
  }

  if (selectedPathway) {
    const step = selectedPathway.steps[currentStep];
    
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>{selectedPathway.name}</Title>
            <Paragraph style={styles.stepText}>
              Step {currentStep + 1} of {selectedPathway.steps.length}
            </Paragraph>
            <Title style={styles.question}>{step.question}</Title>
            
            <RadioButton.Group onValueChange={handleAnswer}>
              {step.options.map((option, index) => (
                <View key={index} style={styles.radioItem}>
                  <RadioButton value={option} />
                  <Text>{option}</Text>
                </View>
              ))}
            </RadioButton.Group>
          </Card.Content>
          <Card.Actions>
            <Button onPress={resetPathway}>Cancel</Button>
          </Card.Actions>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Select a Decision Pathway</Title>
          <Paragraph>Choose the pathway that best matches your situation</Paragraph>
        </Card.Content>
      </Card>

      {pathways.map((pathway) => (
        <Card key={pathway.id} style={styles.card}>
          <Card.Content>
            <Title>{pathway.name}</Title>
            <Paragraph>{pathway.description}</Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => selectPathway(pathway.id)}>
              Start
            </Button>
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  card: {
    marginBottom: 10,
    elevation: 4,
  },
  stepText: {
    color: '#666',
    marginBottom: 10,
  },
  question: {
    fontSize: 18,
    marginVertical: 10,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  button: {
    margin: 10,
  },
});

export default DecisionScreen;
