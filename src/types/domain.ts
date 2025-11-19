/**
 * Domain Model Type Definitions
 * 
 * @module types/domain
 * @description Core domain models for housing assistance cases and users.
 * These types represent the primary business entities in the system.
 * 
 * @ai-context Primary domain models for housing assistance management
 * @version 1.0.0
 */

import { Metadata, PrivacyMetadata } from './metadata';

/**
 * User case status
 */
export type CaseStatus = 
  | 'new'           // Newly created case
  | 'in_progress'   // Active case being worked on
  | 'awaiting_info' // Waiting for additional information
  | 'on_hold'       // Temporarily paused
  | 'resolved'      // Successfully resolved
  | 'closed'        // Closed without resolution
  | 'escalated';    // Escalated to higher authority

/**
 * Case priority levels
 */
export type CasePriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Housing issue types
 */
export type HousingIssueType =
  | 'rent_arrears'           // Behind on rent payments
  | 'eviction_notice'        // Received eviction notice
  | 'mortgage_arrears'       // Behind on mortgage
  | 'repossession_threat'    // Property repossession threat
  | 'homelessness_risk'      // At risk of homelessness
  | 'temporary_accommodation' // Need temporary housing
  | 'housing_disrepair'      // Property in poor condition
  | 'benefit_issues'         // Housing benefit problems
  | 'other';                 // Other housing issues

/**
 * User information
 * 
 * @gdpr-relevant Contains personal data requiring protection
 */
export interface User {
  /** Metadata for audit and tracking */
  metadata: Metadata;
  
  /** Privacy and consent information */
  privacy: PrivacyMetadata;
  
  /** User's full name */
  fullName: string;
  
  /** Contact email */
  email: string;
  
  /** Contact phone number */
  phone?: string;
  
  /** Preferred contact method */
  preferredContact: 'email' | 'phone' | 'both';
  
  /** Date of birth (for eligibility checking) */
  dateOfBirth?: string;
  
  /** National Insurance number (UK) */
  nationalInsuranceNumber?: string;
  
  /** Current address */
  currentAddress?: Address;
  
  /** Whether user is vulnerable (requires special consideration) */
  isVulnerable?: boolean;
  
  /** Vulnerability details if applicable */
  vulnerabilityNotes?: string;
}

/**
 * Address information
 * 
 * @gdpr-relevant Contains personal location data
 */
export interface Address {
  /** Street address line 1 */
  addressLine1: string;
  
  /** Street address line 2 */
  addressLine2?: string;
  
  /** City or town */
  city: string;
  
  /** County or region */
  county?: string;
  
  /** Postal code */
  postalCode: string;
  
  /** Country */
  country: string;
}

/**
 * Housing assistance case
 * 
 * @ai-context Central entity representing a user's housing assistance request
 * @gdpr-relevant Contains personal and sensitive data
 */
export interface Case {
  /** Metadata for audit and tracking */
  metadata: Metadata;
  
  /** Reference to user who owns this case */
  userId: string;
  
  /** Case reference number for external communication */
  caseReferenceNumber: string;
  
  /** Current status of the case */
  status: CaseStatus;
  
  /** Priority level */
  priority: CasePriority;
  
  /** Type of housing issue */
  issueType: HousingIssueType;
  
  /** Detailed description of the issue */
  issueDescription: string;
  
  /** Date the issue started */
  issueStartDate: string;
  
  /** Amount of arrears if applicable */
  arrearsAmount?: number;
  
  /** Currency code (e.g., 'GBP') */
  currency?: string;
  
  /** Timeline details */
  timeline: CaseTimeline;
  
  /** Assessment results */
  assessment?: Assessment;
  
  /** Recommended actions */
  recommendations?: Recommendation[];
  
  /** Documents associated with the case */
  documents?: string[]; // Document IDs
  
  /** Notes and updates */
  notes?: CaseNote[];
  
  /** Related case IDs */
  relatedCases?: string[];
}

/**
 * Case timeline
 */
export interface CaseTimeline {
  /** Date case was opened */
  openedDate: string;
  
  /** Target resolution date */
  targetResolutionDate?: string;
  
  /** Actual resolution date */
  resolvedDate?: string;
  
  /** Important milestone dates */
  milestones?: Milestone[];
}

/**
 * Timeline milestone
 */
export interface Milestone {
  /** Milestone identifier */
  id: string;
  
  /** Milestone name */
  name: string;
  
  /** Description */
  description: string;
  
  /** Target date */
  targetDate: string;
  
  /** Actual completion date */
  completedDate?: string;
  
  /** Whether milestone is completed */
  isCompleted: boolean;
  
  /** Whether milestone is critical */
  isCritical: boolean;
}

/**
 * Case assessment results
 * 
 * @ai-context Contains analyzed data from user responses
 */
export interface Assessment {
  /** Assessment metadata */
  metadata: Metadata;
  
  /** Overall risk level */
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  
  /** Urgency score (0-100) */
  urgencyScore: number;
  
  /** Complexity score (0-100) */
  complexityScore: number;
  
  /** Financial situation assessment */
  financialSituation?: FinancialAssessment;
  
  /** Legal situation assessment */
  legalSituation?: LegalAssessment;
  
  /** Support needs assessment */
  supportNeeds?: string[];
  
  /** Eligibility for programs */
  eligibility?: EligibilityResult[];
  
  /** Assessment summary */
  summary: string;
  
  /** Confidence level in assessment (0-100) */
  confidenceLevel: number;
}

/**
 * Financial assessment
 */
export interface FinancialAssessment {
  /** Monthly income */
  monthlyIncome?: number;
  
  /** Monthly expenses */
  monthlyExpenses?: number;
  
  /** Disposable income */
  disposableIncome?: number;
  
  /** Outstanding debts */
  totalDebt?: number;
  
  /** Has access to emergency funds */
  hasEmergencyFunds: boolean;
  
  /** Receives benefits */
  receivesBenefits: boolean;
  
  /** Benefit types if applicable */
  benefitTypes?: string[];
}

/**
 * Legal assessment
 */
export interface LegalAssessment {
  /** Has legal representation */
  hasLegalRepresentation: boolean;
  
  /** Court proceedings initiated */
  courtProceedingsActive: boolean;
  
  /** Court hearing date if applicable */
  courtHearingDate?: string;
  
  /** Eviction notice received */
  evictionNoticeReceived: boolean;
  
  /** Eviction notice date */
  evictionNoticeDate?: string;
  
  /** Legal deadlines */
  legalDeadlines?: string[];
}

/**
 * Eligibility result for assistance programs
 */
export interface EligibilityResult {
  /** Program identifier */
  programId: string;
  
  /** Program name */
  programName: string;
  
  /** Whether user is eligible */
  isEligible: boolean;
  
  /** Reason for eligibility/ineligibility */
  reason: string;
  
  /** Required actions to apply */
  requiredActions?: string[];
  
  /** Application deadline */
  applicationDeadline?: string;
}

/**
 * Actionable recommendation
 */
export interface Recommendation {
  /** Recommendation identifier */
  id: string;
  
  /** Recommendation title */
  title: string;
  
  /** Detailed description */
  description: string;
  
  /** Priority level */
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  /** Category */
  category: 'financial' | 'legal' | 'housing' | 'support' | 'administrative';
  
  /** Action steps */
  actionSteps: ActionStep[];
  
  /** Expected timeline */
  timelineDescription: string;
  
  /** Expected outcome */
  expectedOutcome: string;
  
  /** Resources needed */
  resourcesNeeded?: string[];
  
  /** Supporting documents */
  supportingDocuments?: string[];
}

/**
 * Action step
 */
export interface ActionStep {
  /** Step identifier */
  id: string;
  
  /** Step number/order */
  stepNumber: number;
  
  /** Step description */
  description: string;
  
  /** Who is responsible */
  responsibility: 'user' | 'caseworker' | 'external';
  
  /** Whether step is completed */
  isCompleted: boolean;
  
  /** Completion date */
  completedDate?: string;
  
  /** Due date */
  dueDate?: string;
  
  /** Estimated time to complete */
  estimatedDuration?: string;
}

/**
 * Case note
 */
export interface CaseNote {
  /** Note metadata */
  metadata: Metadata;
  
  /** Note content */
  content: string;
  
  /** Note type */
  type: 'general' | 'phone_call' | 'meeting' | 'email' | 'decision' | 'update';
  
  /** Visibility */
  visibility: 'internal' | 'shared_with_user';
  
  /** Attachments */
  attachments?: string[];
}
