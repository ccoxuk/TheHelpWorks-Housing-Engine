/**
 * Metadata Type Definitions
 * 
 * @module types/metadata
 * @description Core metadata structures for AI-awareness, documentation, and workflow tracking.
 * These types provide stable anchors and consistent naming conventions for AI-assisted features.
 * 
 * @ai-context This file defines metadata structures used throughout the application
 * @version 1.0.0
 * @gdpr-relevant Contains structures for tracking data processing and consent
 */

/**
 * Base metadata interface for all domain entities
 * Provides audit trail and AI-navigable structure
 */
export interface Metadata {
  /** Unique identifier for the entity - stable anchor for AI references */
  id: string;
  
  /** ISO 8601 timestamp of creation */
  createdAt: string;
  
  /** ISO 8601 timestamp of last modification */
  updatedAt: string;
  
  /** User or system that created the entity */
  createdBy: string;
  
  /** User or system that last modified the entity */
  updatedBy: string;
  
  /** Version number for change tracking */
  version: number;
  
  /** Human-readable tags for categorization and AI search */
  tags?: string[];
  
  /** Additional context or notes */
  notes?: string;
}

/**
 * Workflow metadata for dynamic pathway tracking
 * 
 * @ai-context Used to track user journey through decision trees
 */
export interface WorkflowMetadata extends Metadata {
  /** Unique workflow identifier (e.g., 'rent-arrears-assessment') */
  workflowId: string;
  
  /** Human-readable workflow name */
  workflowName: string;
  
  /** Current step/stage in the workflow */
  currentStep: string;
  
  /** Previous step for navigation */
  previousStep?: string;
  
  /** Next possible steps based on current state */
  nextSteps: string[];
  
  /** Workflow completion percentage (0-100) */
  completionPercentage: number;
  
  /** Whether workflow is completed */
  isCompleted: boolean;
  
  /** Cross-reference to related workflows */
  relatedWorkflows?: string[];
}

/**
 * Document metadata for generated reports and templates
 * 
 * @ai-context Tracks generated documents with full provenance
 * @gdpr-relevant Contains data processing activity records
 */
export interface DocumentMetadata extends Metadata {
  /** Document type identifier (e.g., 'case-summary', 'action-plan') */
  documentType: string;
  
  /** Human-readable document title */
  title: string;
  
  /** Document template version used */
  templateVersion: string;
  
  /** Data sources used to generate document */
  dataSources: string[];
  
  /** Legal basis for document generation */
  legalBasis?: string;
  
  /** Retention period in days */
  retentionPeriodDays?: number;
  
  /** Expiry date for document (GDPR compliance) */
  expiryDate?: string;
}

/**
 * Privacy metadata for GDPR compliance
 * 
 * @gdpr-required Essential for data protection compliance
 */
export interface PrivacyMetadata {
  /** User consent status */
  consentGiven: boolean;
  
  /** ISO 8601 timestamp of consent */
  consentDate?: string;
  
  /** Purpose of data processing */
  processingPurpose: string[];
  
  /** Legal basis for processing (GDPR Article 6) */
  legalBasis: 'consent' | 'contract' | 'legal_obligation' | 'vital_interests' | 'public_task' | 'legitimate_interests';
  
  /** Data retention period in days */
  retentionPeriod: number;
  
  /** Whether data can be shared with third parties */
  thirdPartySharing: boolean;
  
  /** List of third parties if sharing is enabled */
  thirdParties?: string[];
  
  /** Whether user has right to erasure */
  rightToErasure: boolean;
  
  /** Whether data is anonymized */
  isAnonymized: boolean;
}

/**
 * Audit log entry for tracking all system operations
 * 
 * @litigation-grade Provides complete audit trail for legal purposes
 */
export interface AuditLogEntry extends Metadata {
  /** Type of action performed */
  action: 'create' | 'read' | 'update' | 'delete' | 'export' | 'anonymize';
  
  /** Entity type affected */
  entityType: string;
  
  /** Entity ID affected */
  entityId: string;
  
  /** User who performed the action */
  userId: string;
  
  /** IP address of the user */
  ipAddress?: string;
  
  /** Changes made (before and after) */
  changes?: {
    field: string;
    oldValue: unknown;
    newValue: unknown;
  }[];
  
  /** Result of the action */
  result: 'success' | 'failure' | 'partial';
  
  /** Error message if action failed */
  errorMessage?: string;
}
