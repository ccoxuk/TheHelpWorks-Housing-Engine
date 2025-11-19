/**
 * Core Type Definitions Index
 * 
 * @module types
 * @description Central export point for all type definitions.
 * Provides a single import location for consuming code.
 * 
 * @ai-context Main type system entry point
 * @version 1.0.0
 */

// Metadata types
export type {
  Metadata,
  WorkflowMetadata,
  DocumentMetadata,
  PrivacyMetadata,
  AuditLogEntry,
} from './metadata';

// Domain model types
export type {
  CaseStatus,
  CasePriority,
  HousingIssueType,
  User,
  Address,
  Case,
  CaseTimeline,
  Milestone,
  Assessment,
  FinancialAssessment,
  LegalAssessment,
  EligibilityResult,
  Recommendation,
  ActionStep,
  CaseNote,
} from './domain';

// Workflow types
export type {
  QuestionType,
  ValidationRule,
  ConditionalLogic,
  QuestionOption,
  WorkflowQuestion,
  QuestionResponse,
  Workflow,
  WorkflowSession,
  WorkflowResult,
} from './workflow';

// Report types
export type {
  ReportType,
  ReportFormat,
  ReportSection,
  Report,
  CaseSummaryReport,
  ActionPlanReport,
  ProgressReport,
  TimelineReport,
} from './report';
