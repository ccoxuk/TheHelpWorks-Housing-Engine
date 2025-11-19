import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { contentPackLoader, ruleEvaluator } from '../engine';
import type { SessionState, RightRule, ActionTemplate } from '../engine/types';

const DemoContainer = styled.div`
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
  margin: 20px 0;
`;

const Title = styled.h3`
  margin-top: 0;
  color: #333;
`;

const Section = styled.div`
  margin: 15px 0;
  padding: 15px;
  background: white;
  border-radius: 4px;
  border-left: 4px solid #4CAF50;
`;

const Label = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
  color: #555;
`;

const List = styled.ul`
  margin: 8px 0;
  padding-left: 20px;
`;

const ActionCard = styled.div`
  margin: 10px 0;
  padding: 12px;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
`;

const LoadingText = styled.div`
  color: #666;
  font-style: italic;
`;

const ErrorText = styled.div`
  color: #d32f2f;
  padding: 10px;
  background: #ffebee;
  border-radius: 4px;
`;

/**
 * Demo component showing U-HSP engine integration
 * Loads the London content pack and demonstrates rule evaluation
 */
export const EngineDemo: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matchedRules, setMatchedRules] = useState<RightRule[]>([]);
  const [triggeredActions, setTriggeredActions] = useState<ActionTemplate[]>([]);

  useEffect(() => {
    loadContentPackAndEvaluate();
  }, []);

  const loadContentPackAndEvaluate = async () => {
    try {
      // Load the London rough sleeping content pack
      await contentPackLoader.loadContentPackFromUrl('/content-packs/london-rough-sleeping.json');
      
      const packId = 'england-wales-london-rough-sleeping';
      const pack = contentPackLoader.getContentPack(packId);
      
      if (!pack) {
        throw new Error('Failed to load content pack');
      }

      // Create example session state (Waterloo + dog + homeless tonight scenario)
      const exampleSession: SessionState = {
        sessionId: 'demo-session-001',
        createdAt: new Date().toISOString(),
        status: 'active',
        user: {
          age: 32,
          hasChildren: false,
          hasPets: true,
          pets: [{
            type: 'dog',
            size: 'medium'
          }],
          hasLocalConnection: true
        },
        situation: {
          homelessTonight: true,
          currentLocation: 'Waterloo Station, London',
          isHomeless: true,
          roughSleeping: true,
          urgentNeeds: ['shelter', 'safety']
        },
        legal: {
          rightToReside: true,
          hasPriorityNeed: false
        },
        metadata: {
          contentPackId: packId,
          jurisdiction: 'England/Wales'
        }
      };

      // Evaluate rules against session state
      const rules = contentPackLoader.getRules(packId);
      const matched = ruleEvaluator.evaluateRules(rules, exampleSession);
      setMatchedRules(matched);

      // Get triggered actions
      const actionIds = matched.flatMap(rule => rule.actions);
      const actions = actionIds
        .map(id => contentPackLoader.getAction(packId, id))
        .filter((action): action is ActionTemplate => action !== undefined);
      setTriggeredActions(actions);

      setIsLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  };

  if (error) {
    return (
      <DemoContainer>
        <Title>U-HSP Engine Demo</Title>
        <ErrorText>Error loading content pack: {error}</ErrorText>
      </DemoContainer>
    );
  }

  if (!isLoaded) {
    return (
      <DemoContainer>
        <Title>U-HSP Engine Demo</Title>
        <LoadingText>Loading content pack and evaluating rules...</LoadingText>
      </DemoContainer>
    );
  }

  return (
    <DemoContainer>
      <Title>U-HSP Engine Demo</Title>
      
      <Section>
        <Label>Scenario:</Label>
        <p>Person at Waterloo Station with a dog, facing homelessness tonight</p>
      </Section>

      <Section>
        <Label>Matched Rules ({matchedRules.length}):</Label>
        {matchedRules.length === 0 ? (
          <p>No rules matched for this scenario</p>
        ) : (
          <List>
            {matchedRules.map(rule => (
              <li key={rule.id}>
                <strong>{rule.name}</strong>
                {rule.legalBasis && <div style={{ fontSize: '0.9em', color: '#666' }}>
                  Legal Basis: {rule.legalBasis}
                </div>}
              </li>
            ))}
          </List>
        )}
      </Section>

      <Section>
        <Label>Triggered Actions ({triggeredActions.length}):</Label>
        {triggeredActions.length === 0 ? (
          <p>No actions triggered</p>
        ) : (
          <>
            {triggeredActions.map(action => (
              <ActionCard key={action.id}>
                <strong>{action.name}</strong>
                <div style={{ fontSize: '0.9em', margin: '5px 0' }}>
                  Type: {action.type} | Urgency: {action.urgency || 'medium'}
                </div>
                {action.description && (
                  <div style={{ fontSize: '0.9em', color: '#555', marginTop: '5px' }}>
                    {action.description}
                  </div>
                )}
                {action.contactInfo?.phone && (
                  <div style={{ fontSize: '0.9em', marginTop: '5px' }}>
                    📞 {action.contactInfo.phone}
                  </div>
                )}
              </ActionCard>
            ))}
          </>
        )}
      </Section>
    </DemoContainer>
  );
};
