import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Chip, Searchbar } from 'react-native-paper';
import { templateService } from '../services/api';

const TemplatesScreen = () => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [searchQuery, selectedCategory, templates]);

  const loadTemplates = async () => {
    try {
      const data = await templateService.listTemplates();
      setTemplates(data.templates);
      setFilteredTemplates(data.templates);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    if (selectedCategory) {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTemplates(filtered);
  };

  const categories = [...new Set(templates.map(t => t.category))];

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search templates"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <ScrollView horizontal style={styles.chipContainer}>
        <Chip
          selected={!selectedCategory}
          onPress={() => setSelectedCategory(null)}
          style={styles.chip}
        >
          All
        </Chip>
        {categories.map((category) => (
          <Chip
            key={category}
            selected={selectedCategory === category}
            onPress={() => setSelectedCategory(category)}
            style={styles.chip}
          >
            {category}
          </Chip>
        ))}
      </ScrollView>

      <ScrollView style={styles.scrollView}>
        {filteredTemplates.map((template) => (
          <Card key={template.id} style={styles.card}>
            <Card.Content>
              <Title>{template.name}</Title>
              <Chip style={styles.categoryChip}>{template.category}</Chip>
              <Paragraph style={styles.version}>Version: {template.version}</Paragraph>
              <Paragraph numberOfLines={3}>{template.content}</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Chip icon="download">Download</Chip>
              <Chip icon="eye">Preview</Chip>
            </Card.Actions>
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
  searchbar: {
    margin: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  chip: {
    marginRight: 8,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    marginVertical: 5,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 10,
    elevation: 4,
  },
  version: {
    color: '#666',
    fontSize: 12,
  },
});

export default TemplatesScreen;
