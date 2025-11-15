import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Chip, Button } from 'react-native-paper';
import { legislativeService } from '../services/api';

const UpdatesScreen = () => {
  const [updates, setUpdates] = useState([]);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState(null);

  useEffect(() => {
    loadUpdates();
  }, [selectedJurisdiction]);

  const loadUpdates = async () => {
    try {
      const data = await legislativeService.listUpdates(selectedJurisdiction);
      setUpdates(data.updates);
    } catch (error) {
      console.error('Failed to load updates:', error);
    }
  };

  const syncUpdates = async () => {
    try {
      await legislativeService.syncUpdates();
      loadUpdates();
    } catch (error) {
      console.error('Failed to sync updates:', error);
    }
  };

  const jurisdictions = [...new Set(updates.map(u => u.jurisdiction))];

  const getImpactColor = (level) => {
    switch (level) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title>Legislative Updates</Title>
          <Paragraph>Stay informed about housing law changes</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button onPress={syncUpdates} mode="contained">
            Sync Updates
          </Button>
        </Card.Actions>
      </Card>

      <ScrollView horizontal style={styles.chipContainer}>
        <Chip
          selected={!selectedJurisdiction}
          onPress={() => setSelectedJurisdiction(null)}
          style={styles.chip}
        >
          All
        </Chip>
        {jurisdictions.map((jurisdiction) => (
          <Chip
            key={jurisdiction}
            selected={selectedJurisdiction === jurisdiction}
            onPress={() => setSelectedJurisdiction(jurisdiction)}
            style={styles.chip}
          >
            {jurisdiction}
          </Chip>
        ))}
      </ScrollView>

      <ScrollView style={styles.scrollView}>
        {updates.map((update) => (
          <Card key={update.id} style={styles.card}>
            <Card.Content>
              <View style={styles.headerRow}>
                <Title style={styles.updateTitle}>{update.title}</Title>
                <Chip
                  style={[
                    styles.impactChip,
                    { backgroundColor: getImpactColor(update.impact_level) }
                  ]}
                  textStyle={styles.impactText}
                >
                  {update.impact_level}
                </Chip>
              </View>
              <Paragraph style={styles.jurisdiction}>
                {update.jurisdiction} • {update.source}
              </Paragraph>
              <Paragraph>{update.description}</Paragraph>
              {update.effective_date && (
                <Paragraph style={styles.effectiveDate}>
                  Effective: {new Date(update.effective_date).toLocaleDateString()}
                </Paragraph>
              )}
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    margin: 10,
    elevation: 4,
  },
  chipContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  chip: {
    marginRight: 8,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 10,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  updateTitle: {
    flex: 1,
    fontSize: 18,
  },
  impactChip: {
    marginLeft: 10,
  },
  impactText: {
    color: 'white',
    fontWeight: 'bold',
  },
  jurisdiction: {
    color: '#666',
    fontSize: 12,
    marginBottom: 10,
  },
  effectiveDate: {
    fontStyle: 'italic',
    color: '#666',
    marginTop: 10,
  },
});

export default UpdatesScreen;
