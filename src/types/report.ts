/**
 * Report Type Definitions
 * 
 * @module types/report
 * @description Type definitions for report generation system.
 * Supports multiple report formats and templates for professional outputs.
 * 
 * @ai-context Report generation and document creation types
 * @litigation-grade Professional report outputs with full audit trail
 * @version 1.0.0
 */

import { Metadata, DocumentMetadata } from './metadata';
import { Case, Recommendation, Assessment } from './domain';

/**
 * Supported report types
 */
export type ReportType =
  | 'case_summary'      // Comprehensive case overview
  | 'action_plan'       // Actionable recommendations and timeline
  | 'progress_report'   // Progress update report
  | 'timeline'          // Timeline and milestones
  | 'financial_summary' // Financial situation summary
  | 'legal_summary'     // Legal situation and deadlines
  | 'support_needs'     // Support requirements assessment
  | 'custom';           // Custom report template

/**
 * Report output formats
 */
export type ReportFormat =
  | 'pdf'      // PDF document
  | 'html'     // HTML document
  | 'docx'     // Word document
  | 'json'     // JSON data
  | 'markdown'; // Markdown text

/**
 * Report section
 */
export interface ReportSection {
  /** Section identifier */
  id: string;
  
  /** Section title */
  title: string;
  
  /** Section content */
  content: string | Record<string, unknown>;
  
  /** Section order */
  order: number;
  
  /** Whether section is required */
  isRequired: boolean;
  
  /** Subsections */
  subsections?: ReportSection[];
  
  /** AI context for section generation */
  aiContext?: string;
}

/**
 * Base report interface
 * 
 * @ai-context Core report structure with metadata and sections
 */
export interface Report {
  /** Report metadata */
  metadata: Metadata;
  
  /** Document-specific metadata */
  documentMetadata: DocumentMetadata;
  
  /** Report type */
  reportType: ReportType;
  
  /** Report title */
  title: string;
  
  /** Report subtitle */
  subtitle?: string;
  
  /** Case reference */
  caseId: string;
  
  /** User reference */
  userId: string;
  
  /** Report generation date */
  generatedDate: string;
  
  /** Report sections */
  sections: ReportSection[];
  
  /** Report summary/executive summary */
  summary?: string;
  
  /** Report footer text */
  footer?: string;
  
  /** Watermark text (e.g., 'CONFIDENTIAL') */
  watermark?: string;
  
  /** Output format */
  format: ReportFormat;
  
  /** Template version used */
  templateVersion: string;
  
  /** AI confidence in generated content (0-100) */
  aiConfidence?: number;
}

/**
 * Case Summary Report
 * 
 * @ai-context Comprehensive case overview for stakeholders
 * @litigation-grade Full case details with audit trail
 */
export interface CaseSummaryReport extends Report {
  reportType: 'case_summary';
  
  /** Complete case details */
  caseDetails: Case;
  
  /** Assessment summary */
  assessmentSummary: Assessment;
  
  /** Key facts */
  keyFacts: {
    label: string;
    value: string;
  }[];
  
  /** Risk indicators */
  riskIndicators: {
    indicator: string;
    level: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }[];
  
  /** Timeline snapshot */
  timelineSnapshot: {
    openedDate: string;
    currentStatus: string;
    keyMilestones: string[];
    urgentDeadlines: string[];
  };
  
  /** Support summary */
  supportSummary: {
    currentSupport: string[];
    recommendedSupport: string[];
    gaps: string[];
  };
}

/**
 * Action Plan Report
 * 
 * @ai-context Detailed action plan with steps and timelines
 */
export interface ActionPlanReport extends Report {
  reportType: 'action_plan';
  
  /** Strategic goals */
  goals: {
    id: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    targetDate?: string;
  }[];
  
  /** Detailed recommendations */
  recommendations: Recommendation[];
  
  /** Immediate actions (next 7 days) */
  immediateActions: {
    action: string;
    responsibility: string;
    deadline: string;
    resources?: string[];
  }[];
  
  /** Short-term actions (next 30 days) */
  shortTermActions: {
    action: string;
    responsibility: string;
    deadline: string;
    resources?: string[];
  }[];
  
  /** Long-term actions (beyond 30 days) */
  longTermActions: {
    action: string;
    responsibility: string;
    timeline: string;
    resources?: string[];
  }[];
  
  /** Success criteria */
  successCriteria: string[];
  
  /** Resources and support documents */
  resources: {
    title: string;
    description: string;
    type: 'document' | 'link' | 'contact' | 'service';
    reference: string;
  }[];
}

/**
 * Progress Report
 * 
 * @ai-context Progress tracking and status update report
 */
export interface ProgressReport extends Report {
  reportType: 'progress_report';
  
  /** Reporting period */
  reportingPeriod: {
    startDate: string;
    endDate: string;
  };
  
  /** Overall progress percentage */
  overallProgress: number;
  
  /** Completed actions */
  completedActions: {
    action: string;
    completedDate: string;
    outcome: string;
  }[];
  
  /** In-progress actions */
  inProgressActions: {
    action: string;
    progress: number;
    expectedCompletion: string;
    blockers?: string[];
  }[];
  
  /** Upcoming actions */
  upcomingActions: {
    action: string;
    scheduledDate: string;
    preparation?: string[];
  }[];
  
  /** Challenges and issues */
  challenges: {
    issue: string;
    impact: 'low' | 'medium' | 'high';
    mitigation?: string;
  }[];
  
  /** Achievements */
  achievements: string[];
  
  /** Next steps */
  nextSteps: string[];
}

/**
 * Timeline Report
 * 
 * @ai-context Visual timeline of case events and milestones
 */
export interface TimelineReport extends Report {
  reportType: 'timeline';
  
  /** Timeline events */
  events: {
    date: string;
    title: string;
    description: string;
    type: 'milestone' | 'action' | 'deadline' | 'note' | 'decision';
    importance: 'low' | 'medium' | 'high' | 'critical';
  }[];
  
  /** Critical deadlines */
  criticalDeadlines: {
    date: string;
    description: string;
    consequences?: string;
  }[];
  
  /** Projected timeline */
  projectedTimeline: {
    estimatedResolutionDate?: string;
    confidenceLevel?: number;
    assumptions?: string[];
  };
  
  /** Timeline visualization data */
  visualizationData?: {
    type: 'gantt' | 'vertical' | 'horizontal';
    data: unknown;
  };
}
