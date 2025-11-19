/**
 * Workflow Type Definitions
 * 
 * @module types/workflow
 * @description Type definitions for dynamic workflow and decision tree system.
 * Enables AI-navigable, user-adaptive pathways through housing assistance processes.
 * 
 * @ai-context Workflow engine types for dynamic user journeys
 * @version 1.0.0
 */

import { Metadata, WorkflowMetadata } from './metadata';

/**
 * Question types supported in the workflow
 */
export type QuestionType =
  | 'single_choice'    // Single selection from options
  | 'multiple_choice'  // Multiple selections allowed
  | 'text'            // Free text input
  | 'number'          // Numeric input
  | 'date'            // Date picker
  | 'currency'        // Currency amount
  | 'yes_no'          // Boolean yes/no
  | 'scale'           // Rating scale (e.g., 1-10)
  | 'file_upload';    // File attachment

/**
 * Validation rule for question responses
 */
export interface ValidationRule {
  /** Rule type */
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  
  /** Rule value (e.g., minimum number, regex pattern) */
  value?: unknown;
  
  /** Error message to display if validation fails */
  errorMessage: string;
  
  /** Custom validation function name (for 'custom' type) */
  validatorFunction?: string;
}

/**
 * Conditional logic for question visibility and workflow branching
 * 
 * @ai-context Enables dynamic pathway adaptation based on user responses
 */
export interface ConditionalLogic {
  /** Question ID that this condition depends on */
  dependsOn: string;
  
  /** Operator for comparison */
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  
  /** Expected value(s) */
  value: unknown;
  
  /** Action to take when condition is met */
  action: 'show' | 'hide' | 'skip' | 'jump_to' | 'end_workflow';
  
  /** Target question ID for 'jump_to' action */
  targetQuestionId?: string;
}

/**
 * Question option for choice-based questions
 */
export interface QuestionOption {
  /** Option identifier */
  id: string;
  
  /** Display label */
  label: string;
  
  /** Option value */
  value: string | number;
  
  /** Optional description/help text */
  description?: string;
  
  /** Whether this option should trigger special handling */
  isSpecial?: boolean;
  
  /** Next question to jump to if selected */
  nextQuestionId?: string;
  
  /** AI context for this option */
  aiContext?: string;
}

/**
 * Question definition in workflow
 * 
 * @ai-context Individual question with rich metadata for AI navigation
 */
export interface WorkflowQuestion {
  /** Metadata for tracking and versioning */
  metadata: Metadata;
  
  /** Unique question identifier (stable anchor) */
  questionId: string;
  
  /** Human-readable question text */
  questionText: string;
  
  /** Question type */
  questionType: QuestionType;
  
  /** Help text or additional context */
  helpText?: string;
  
  /** Placeholder text for input fields */
  placeholder?: string;
  
  /** Question options (for choice-based questions) */
  options?: QuestionOption[];
  
  /** Validation rules */
  validationRules?: ValidationRule[];
  
  /** Conditional logic rules */
  conditionalLogic?: ConditionalLogic[];
  
  /** Whether question is required */
  isRequired: boolean;
  
  /** Order/sequence number */
  order: number;
  
  /** Section/category this question belongs to */
  section?: string;
  
  /** GDPR purpose for collecting this data */
  gdprPurpose?: string;
  
  /** Tags for categorization and AI search */
  tags?: string[];
  
  /** AI context and hints */
  aiContext?: string;
  
  /** Cross-references to related questions */
  relatedQuestions?: string[];
}

/**
 * User response to a workflow question
 */
export interface QuestionResponse {
  /** Metadata for audit trail */
  metadata: Metadata;
  
  /** Question ID this response is for */
  questionId: string;
  
  /** User's response value */
  response: unknown;
  
  /** Whether response passed validation */
  isValid: boolean;
  
  /** Validation errors if any */
  validationErrors?: string[];
  
  /** Confidence in response (for AI-assisted responses) */
  confidence?: number;
  
  /** Whether response was auto-filled */
  isAutoFilled?: boolean;
}

/**
 * Workflow definition
 * 
 * @ai-context Complete workflow definition with questions and branching logic
 */
export interface Workflow {
  /** Workflow metadata */
  metadata: WorkflowMetadata;
  
  /** Workflow identifier (e.g., 'rent-arrears-assessment') */
  workflowId: string;
  
  /** Human-readable workflow name */
  name: string;
  
  /** Workflow description */
  description: string;
  
  /** Workflow version for compatibility */
  version: string;
  
  /** All questions in this workflow */
  questions: WorkflowQuestion[];
  
  /** Starting question ID */
  startQuestionId: string;
  
  /** Workflow category */
  category: string;
  
  /** Estimated completion time in minutes */
  estimatedDuration?: number;
  
  /** Whether workflow can be saved and resumed */
  allowSaveAndResume: boolean;
  
  /** GDPR information */
  gdprInformation?: {
    purpose: string;
    legalBasis: string;
    retentionPeriod: number;
  };
  
  /** AI context for this workflow */
  aiContext?: string;
  
  /** Tags for categorization */
  tags?: string[];
}

/**
 * Workflow session representing a user's progress through a workflow
 * 
 * @ai-context Active workflow session with user responses and state
 */
export interface WorkflowSession {
  /** Session metadata */
  metadata: Metadata;
  
  /** Session identifier */
  sessionId: string;
  
  /** Workflow being executed */
  workflowId: string;
  
  /** User executing the workflow */
  userId: string;
  
  /** Associated case ID if applicable */
  caseId?: string;
  
  /** Current question ID */
  currentQuestionId: string;
  
  /** All responses collected so far */
  responses: QuestionResponse[];
  
  /** Questions already shown */
  questionsShown: string[];
  
  /** Questions skipped due to conditional logic */
  questionsSkipped: string[];
  
  /** Session status */
  status: 'in_progress' | 'completed' | 'abandoned' | 'paused';
  
  /** Completion percentage */
  completionPercentage: number;
  
  /** Session start time */
  startTime: string;
  
  /** Session end time */
  endTime?: string;
  
  /** Time spent so far (seconds) */
  timeSpent: number;
  
  /** Whether session can be resumed */
  canResume: boolean;
}

/**
 * Workflow result after completion
 */
export interface WorkflowResult {
  /** Result metadata */
  metadata: Metadata;
  
  /** Session that generated this result */
  sessionId: string;
  
  /** Workflow executed */
  workflowId: string;
  
  /** All collected responses */
  responses: QuestionResponse[];
  
  /** Computed outcomes */
  outcomes: {
    [key: string]: unknown;
  };
  
  /** Next recommended actions */
  nextActions?: string[];
  
  /** Generated recommendations */
  recommendations?: string[];
  
  /** Confidence score in results (0-100) */
  confidenceScore: number;
  
  /** Human-readable summary */
  summary: string;
}
