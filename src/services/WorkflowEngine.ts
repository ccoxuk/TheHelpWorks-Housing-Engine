/**
 * Workflow Engine Service
 * 
 * @module services/WorkflowEngine
 * @description Core workflow engine for managing dynamic user pathways.
 * Handles question flow, conditional logic, and session state.
 * 
 * @ai-context Workflow execution and state management service
 * @version 1.0.0
 */

import type {
  Workflow,
  WorkflowQuestion,
  WorkflowSession,
  QuestionResponse,
  ConditionalLogic,
  WorkflowResult,
} from '../types';

/**
 * Workflow Engine for managing dynamic pathways
 * 
 * @ai-context Central engine for workflow execution and branching logic
 */
export class WorkflowEngine {
  private workflow: Workflow;
  private session: WorkflowSession;
  
  /**
   * Create a new workflow engine instance
   * 
   * @param workflow - Workflow definition
   * @param session - Active workflow session
   */
  constructor(workflow: Workflow, session: WorkflowSession) {
    this.workflow = workflow;
    this.session = session;
  }
  
  /**
   * Get the current question
   * 
   * @returns Current workflow question
   */
  getCurrentQuestion(): WorkflowQuestion | null {
    return this.getQuestionById(this.session.currentQuestionId);
  }
  
  /**
   * Get question by ID
   * 
   * @param questionId - Question identifier
   * @returns Workflow question or null if not found
   */
  getQuestionById(questionId: string): WorkflowQuestion | null {
    return this.workflow.questions.find(q => q.questionId === questionId) || null;
  }
  
  /**
   * Submit response to current question
   * 
   * @param response - User's response
   * @returns Validation result
   */
  submitResponse(response: QuestionResponse): {
    isValid: boolean;
    errors: string[];
    nextQuestionId: string | null;
  } {
    const question = this.getCurrentQuestion();
    if (!question) {
      return {
        isValid: false,
        errors: ['Current question not found'],
        nextQuestionId: null,
      };
    }
    
    // Validate response
    const validationResult = this.validateResponse(question, response);
    
    if (!validationResult.isValid) {
      return {
        isValid: false,
        errors: validationResult.errors,
        nextQuestionId: null,
      };
    }
    
    // Add response to session
    this.session.responses.push({
      ...response,
      isValid: true,
      validationErrors: [],
    });
    
    // Update session state
    this.session.questionsShown.push(question.questionId);
    this.session.completionPercentage = this.calculateCompletionPercentage();
    
    // Determine next question
    const nextQuestionId = this.determineNextQuestion(question, response);
    
    if (nextQuestionId) {
      this.session.currentQuestionId = nextQuestionId;
    } else {
      // Workflow completed
      this.session.status = 'completed';
      this.session.completionPercentage = 100;
      this.session.endTime = new Date().toISOString();
    }
    
    return {
      isValid: true,
      errors: [],
      nextQuestionId,
    };
  }
  
  /**
   * Validate a response against question rules
   * 
   * @param question - Workflow question
   * @param response - User response
   * @returns Validation result
   */
  private validateResponse(
    question: WorkflowQuestion,
    response: QuestionResponse
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check if required
    if (question.isRequired && !response.response) {
      errors.push('This question is required');
    }
    
    // Run validation rules
    if (question.validationRules) {
      for (const rule of question.validationRules) {
        switch (rule.type) {
          case 'required':
            if (!response.response) {
              errors.push(rule.errorMessage);
            }
            break;
            
          case 'min':
            if (typeof response.response === 'number' && typeof rule.value === 'number') {
              if (response.response < rule.value) {
                errors.push(rule.errorMessage);
              }
            }
            break;
            
          case 'max':
            if (typeof response.response === 'number' && typeof rule.value === 'number') {
              if (response.response > rule.value) {
                errors.push(rule.errorMessage);
              }
            }
            break;
            
          case 'pattern':
            if (typeof response.response === 'string' && typeof rule.value === 'string') {
              const regex = new RegExp(rule.value);
              if (!regex.test(response.response)) {
                errors.push(rule.errorMessage);
              }
            }
            break;
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
  
  /**
   * Determine the next question based on conditional logic
   * 
   * @param currentQuestion - Current question
   * @param response - User response
   * @returns Next question ID or null if workflow is complete
   */
  private determineNextQuestion(
    currentQuestion: WorkflowQuestion,
    response: QuestionResponse
  ): string | null {
    // Check if response has a specific next question (for option-based questions)
    if (currentQuestion.questionType === 'single_choice' && currentQuestion.options) {
      const selectedOption = currentQuestion.options.find(
        opt => opt.value === response.response
      );
      if (selectedOption?.nextQuestionId) {
        return selectedOption.nextQuestionId;
      }
    }
    
    // Evaluate conditional logic
    if (currentQuestion.conditionalLogic) {
      for (const condition of currentQuestion.conditionalLogic) {
        if (this.evaluateCondition(condition, response)) {
          if (condition.action === 'jump_to' && condition.targetQuestionId) {
            return condition.targetQuestionId;
          }
          if (condition.action === 'end_workflow') {
            return null;
          }
        }
      }
    }
    
    // Default: get next question in order
    const currentIndex = this.workflow.questions.findIndex(
      q => q.questionId === currentQuestion.questionId
    );
    
    if (currentIndex < this.workflow.questions.length - 1) {
      // Get next question and check if it should be shown
      const nextQuestion = this.workflow.questions[currentIndex + 1];
      
      if (this.shouldShowQuestion(nextQuestion)) {
        return nextQuestion.questionId;
      } else {
        // Skip this question and try next
        this.session.questionsSkipped.push(nextQuestion.questionId);
        // Recursively find next visible question
        return this.findNextVisibleQuestion(currentIndex + 1);
      }
    }
    
    return null; // End of workflow
  }
  
  /**
   * Find next visible question from a starting index
   * 
   * @param startIndex - Starting index
   * @returns Next question ID or null
   */
  private findNextVisibleQuestion(startIndex: number): string | null {
    for (let i = startIndex; i < this.workflow.questions.length; i++) {
      const question = this.workflow.questions[i];
      if (this.shouldShowQuestion(question)) {
        return question.questionId;
      }
      this.session.questionsSkipped.push(question.questionId);
    }
    return null;
  }
  
  /**
   * Check if a question should be shown based on conditional logic
   * 
   * @param question - Question to check
   * @returns True if question should be shown
   */
  private shouldShowQuestion(question: WorkflowQuestion): boolean {
    if (!question.conditionalLogic) {
      return true; // No conditions, always show
    }
    
    for (const condition of question.conditionalLogic) {
      const dependentResponse = this.session.responses.find(
        r => r.questionId === condition.dependsOn
      );
      
      if (!dependentResponse) {
        continue; // Dependent question not answered yet
      }
      
      const conditionMet = this.evaluateCondition(condition, dependentResponse);
      
      if (condition.action === 'hide' && conditionMet) {
        return false;
      }
      
      if (condition.action === 'show' && !conditionMet) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Evaluate a conditional logic expression
   * 
   * @param condition - Conditional logic
   * @param response - Response to evaluate against
   * @returns True if condition is met
   */
  private evaluateCondition(
    condition: ConditionalLogic,
    response: QuestionResponse
  ): boolean {
    const { operator, value } = condition;
    const responseValue = response.response;
    
    switch (operator) {
      case 'equals':
        return responseValue === value;
        
      case 'not_equals':
        return responseValue !== value;
        
      case 'contains':
        if (typeof responseValue === 'string' && typeof value === 'string') {
          return responseValue.includes(value);
        }
        if (Array.isArray(responseValue)) {
          return responseValue.includes(value);
        }
        return false;
        
      case 'greater_than':
        if (typeof responseValue === 'number' && typeof value === 'number') {
          return responseValue > value;
        }
        return false;
        
      case 'less_than':
        if (typeof responseValue === 'number' && typeof value === 'number') {
          return responseValue < value;
        }
        return false;
        
      case 'in':
        if (Array.isArray(value)) {
          return value.includes(responseValue);
        }
        return false;
        
      case 'not_in':
        if (Array.isArray(value)) {
          return !value.includes(responseValue);
        }
        return false;
        
      default:
        return false;
    }
  }
  
  /**
   * Calculate workflow completion percentage
   * 
   * @returns Completion percentage (0-100)
   */
  private calculateCompletionPercentage(): number {
    const totalQuestions = this.workflow.questions.length;
    const answeredQuestions = this.session.responses.length;
    
    if (totalQuestions === 0) return 0;
    
    return Math.round((answeredQuestions / totalQuestions) * 100);
  }
  
  /**
   * Get workflow result (for completed workflows)
   * 
   * @returns Workflow result or null if not completed
   */
  getResult(): WorkflowResult | null {
    if (this.session.status !== 'completed') {
      return null;
    }
    
    // Generate result based on responses
    const outcomes = this.computeOutcomes();
    
    return {
      metadata: {
        id: `result-${this.session.sessionId}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: this.session.userId,
        updatedBy: this.session.userId,
        version: 1,
      },
      sessionId: this.session.sessionId,
      workflowId: this.workflow.workflowId,
      responses: this.session.responses,
      outcomes,
      confidenceScore: 85, // This would be calculated based on validation and completeness
      summary: this.generateSummary(),
    };
  }
  
  /**
   * Compute outcomes from responses
   * 
   * @returns Computed outcomes
   */
  private computeOutcomes(): Record<string, unknown> {
    // This is a simplified implementation
    // In a real system, this would apply business logic to determine outcomes
    const outcomes: Record<string, unknown> = {};
    
    for (const response of this.session.responses) {
      const question = this.getQuestionById(response.questionId);
      if (question) {
        outcomes[question.questionId] = response.response;
      }
    }
    
    return outcomes;
  }
  
  /**
   * Generate summary from outcomes
   * 
   * @returns Human-readable summary
   */
  private generateSummary(): string {
    // This is a simplified implementation
    // In a real system, this would generate a detailed summary
    return `Workflow "${this.workflow.name}" completed with ${this.session.responses.length} responses.`;
  }
  
  /**
   * Get session state
   * 
   * @returns Current session
   */
  getSession(): WorkflowSession {
    return this.session;
  }
}
