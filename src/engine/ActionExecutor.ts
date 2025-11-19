import type { ActionTemplate, SessionState } from './types';

/**
 * Result of executing an action
 */
export interface ActionExecutionResult {
  actionId: string;
  status: 'completed' | 'pending' | 'failed' | 'skipped';
  message?: string;
  timestamp: string;
  outcome?: string;
  notes?: string;
}

/**
 * Action execution engine for U-HSP
 * Manages the execution and tracking of ActionTemplates
 */
export class ActionExecutor {
  /**
   * Prepare an action for execution
   * Returns the action with any required information highlighted
   */
  public prepareAction(
    action: ActionTemplate,
    sessionState: SessionState
  ): {
    action: ActionTemplate;
    missingInformation: string[];
    canExecute: boolean;
  } {
    const missingInformation: string[] = [];

    // Check if required information is available
    if (action.requiredInformation) {
      action.requiredInformation.forEach(info => {
        // Simple check - in a real implementation, this would be more sophisticated
        if (!this.hasRequiredInfo(info, sessionState)) {
          missingInformation.push(info);
        }
      });
    }

    // Check prerequisites
    if (action.prerequisites && action.prerequisites.length > 0) {
      const completedActionIds = new Set(
        sessionState.completedActions?.map(a => a.actionId) ?? []
      );
      
      action.prerequisites.forEach(prereqId => {
        if (!completedActionIds.has(prereqId)) {
          missingInformation.push(`Prerequisite action: ${prereqId}`);
        }
      });
    }

    return {
      action,
      missingInformation,
      canExecute: missingInformation.length === 0
    };
  }

  /**
   * Execute an action
   * In a real implementation, this would integrate with external systems
   * For now, it prepares the action and returns execution instructions
   */
  public executeAction(
    action: ActionTemplate,
    sessionState: SessionState
  ): ActionExecutionResult {
    const prepared = this.prepareAction(action, sessionState);

    if (!prepared.canExecute) {
      return {
        actionId: action.id,
        status: 'pending',
        message: `Missing required information: ${prepared.missingInformation.join(', ')}`,
        timestamp: new Date().toISOString()
      };
    }

    // For critical/high urgency actions, mark as pending (requires human action)
    if (action.urgency === 'critical' || action.urgency === 'high') {
      return {
        actionId: action.id,
        status: 'pending',
        message: `Action prepared for execution. Follow the steps provided.`,
        timestamp: new Date().toISOString()
      };
    }

    // For other actions, mark as completed (would integrate with systems in production)
    return {
      actionId: action.id,
      status: 'completed',
      message: `Action executed successfully`,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Execute multiple actions
   */
  public executeActions(
    actions: ActionTemplate[],
    sessionState: SessionState
  ): ActionExecutionResult[] {
    // Sort by urgency (critical first)
    const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const sortedActions = [...actions].sort((a, b) => {
      const aUrgency = urgencyOrder[a.urgency ?? 'medium'];
      const bUrgency = urgencyOrder[b.urgency ?? 'medium'];
      return aUrgency - bUrgency;
    });

    return sortedActions.map(action => 
      this.executeAction(action, sessionState)
    );
  }

  /**
   * Get recommended next steps based on action outcomes
   */
  public getNextSteps(
    action: ActionTemplate,
    outcomeId: string
  ): string[] {
    const outcome = action.outcomes?.find(o => o.id === outcomeId);
    return outcome?.nextActions ?? [];
  }

  /**
   * Format action steps for display to user or caseworker
   */
  public formatActionSteps(action: ActionTemplate): string {
    if (!action.steps || action.steps.length === 0) {
      return action.description ?? 'No steps available';
    }

    const steps = action.steps
      .sort((a, b) => a.order - b.order)
      .map(step => {
        let stepText = `${step.order}. ${step.instruction}`;
        
        if (step.requiresInput && step.inputFields) {
          const fields = step.inputFields
            .map(f => `   - ${f.label ?? f.name}${f.required ? ' (required)' : ''}`)
            .join('\n');
          stepText += `\n${fields}`;
        }
        
        return stepText;
      })
      .join('\n\n');

    let formatted = `${action.name}\n`;
    formatted += `${'='.repeat(action.name.length)}\n\n`;
    
    if (action.description) {
      formatted += `${action.description}\n\n`;
    }
    
    if (action.urgency) {
      formatted += `Urgency: ${action.urgency.toUpperCase()}\n\n`;
    }
    
    formatted += `Steps:\n${steps}\n`;
    
    if (action.estimatedDuration) {
      formatted += `\nEstimated Duration: ${action.estimatedDuration}\n`;
    }
    
    if (action.contactInfo) {
      formatted += '\nContact Information:\n';
      if (action.contactInfo.phone) {
        formatted += `  Phone: ${action.contactInfo.phone}\n`;
      }
      if (action.contactInfo.email) {
        formatted += `  Email: ${action.contactInfo.email}\n`;
      }
      if (action.contactInfo.website) {
        formatted += `  Website: ${action.contactInfo.website}\n`;
      }
      if (action.contactInfo.hoursOfOperation) {
        formatted += `  Hours: ${action.contactInfo.hoursOfOperation}\n`;
      }
    }

    return formatted;
  }

  /**
   * Check if session state has required information
   * This is a simplified check - real implementation would be more sophisticated
   */
  private hasRequiredInfo(info: string, sessionState: SessionState): boolean {
    const infoLower = info.toLowerCase();
    
    // Check common required information
    if (infoLower.includes('location')) {
      return !!sessionState.situation?.currentLocation;
    }
    if (infoLower.includes('age')) {
      return !!sessionState.user?.age;
    }
    if (infoLower.includes('children') || infoLower.includes('dependents')) {
      return sessionState.user?.hasChildren !== undefined;
    }
    if (infoLower.includes('name')) {
      return !!(sessionState.user?.firstName && sessionState.user?.lastName);
    }
    if (infoLower.includes('contact')) {
      return !!(sessionState.user?.contact?.phone || sessionState.user?.contact?.email);
    }
    
    // Default to true if we can't determine
    return true;
  }
}

/**
 * Singleton instance for convenience
 */
export const actionExecutor = new ActionExecutor();
