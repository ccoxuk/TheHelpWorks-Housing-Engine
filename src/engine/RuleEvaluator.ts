import type { 
  RightRule, 
  RightRuleConditions, 
  RightRuleConditionRule, 
  SessionState 
} from './types';

/**
 * Rule evaluation engine for U-HSP
 * Evaluates RightRule logic against session state data
 */
export class RuleEvaluator {
  /**
   * Evaluate a rule against the current session state
   */
  public evaluateRule(rule: RightRule, sessionState: SessionState): boolean {
    try {
      return this.evaluateConditions(rule.conditions, sessionState);
    } catch (error) {
      console.error(`Error evaluating rule ${rule.id}:`, error);
      return false;
    }
  }

  /**
   * Evaluate a set of conditions with logical operators
   */
  private evaluateConditions(
    conditions: RightRuleConditions,
    sessionState: SessionState
  ): boolean {
    const { type, rules = [], nested = [] } = conditions;

    // Evaluate direct rules
    const ruleResults = rules.map(rule => 
      this.evaluateConditionRule(rule, sessionState)
    );

    // Evaluate nested condition groups
    const nestedResults = nested.map(nestedCondition => 
      this.evaluateConditions(nestedCondition, sessionState)
    );

    // Combine all results
    const allResults = [...ruleResults, ...nestedResults];

    // Apply logical operator
    switch (type) {
      case 'all':
        return allResults.length > 0 && allResults.every(result => result);
      case 'any':
        return allResults.length > 0 && allResults.some(result => result);
      case 'none':
        return allResults.length > 0 && allResults.every(result => !result);
      default:
        return false;
    }
  }

  /**
   * Evaluate a single condition rule
   */
  private evaluateConditionRule(
    rule: RightRuleConditionRule,
    sessionState: SessionState
  ): boolean {
    const fieldValue = this.getFieldValue(rule.field, sessionState);
    const { operator, value } = rule;

    switch (operator) {
      case 'equals':
        return fieldValue === value;
      case 'notEquals':
        return fieldValue !== value;
      case 'greaterThan':
        return typeof fieldValue === 'number' && 
               typeof value === 'number' && 
               fieldValue > value;
      case 'lessThan':
        return typeof fieldValue === 'number' && 
               typeof value === 'number' && 
               fieldValue < value;
      case 'greaterThanOrEqual':
        return typeof fieldValue === 'number' && 
               typeof value === 'number' && 
               fieldValue >= value;
      case 'lessThanOrEqual':
        return typeof fieldValue === 'number' && 
               typeof value === 'number' && 
               fieldValue <= value;
      case 'contains':
        if (typeof fieldValue === 'string' && typeof value === 'string') {
          return fieldValue.includes(value);
        }
        if (Array.isArray(fieldValue)) {
          return fieldValue.includes(value);
        }
        return false;
      case 'notContains':
        if (typeof fieldValue === 'string' && typeof value === 'string') {
          return !fieldValue.includes(value);
        }
        if (Array.isArray(fieldValue)) {
          return !fieldValue.includes(value);
        }
        return true;
      case 'in':
        return Array.isArray(value) && value.includes(fieldValue);
      case 'notIn':
        return Array.isArray(value) && !value.includes(fieldValue);
      case 'exists':
        return fieldValue !== undefined && fieldValue !== null;
      case 'notExists':
        return fieldValue === undefined || fieldValue === null;
      default:
        console.warn(`Unknown operator: ${operator}`);
        return false;
    }
  }

  /**
   * Get a nested field value from session state using dot notation
   * e.g., "user.hasChildren", "situation.homelessTonight"
   */
  private getFieldValue(path: string, sessionState: SessionState): unknown {
    const parts = path.split('.');
    let value: unknown = sessionState;

    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = (value as Record<string, unknown>)[part];
      } else {
        return undefined;
      }
    }

    return value;
  }

  /**
   * Evaluate multiple rules and return those that match
   * Rules are evaluated in priority order (highest first)
   */
  public evaluateRules(
    rules: RightRule[],
    sessionState: SessionState
  ): RightRule[] {
    // Sort by priority (highest first)
    const sortedRules = [...rules].sort((a, b) => 
      (b.priority ?? 0) - (a.priority ?? 0)
    );

    // Filter to rules that match
    return sortedRules.filter(rule => 
      this.evaluateRule(rule, sessionState)
    );
  }

  /**
   * Get all action IDs from matching rules
   */
  public getTriggeredActions(
    rules: RightRule[],
    sessionState: SessionState
  ): string[] {
    const matchingRules = this.evaluateRules(rules, sessionState);
    const actionIds = new Set<string>();

    matchingRules.forEach(rule => {
      rule.actions.forEach(actionId => actionIds.add(actionId));
    });

    return Array.from(actionIds);
  }
}

/**
 * Singleton instance for convenience
 */
export const ruleEvaluator = new RuleEvaluator();
