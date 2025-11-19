/**
 * Example Workflow: Rent Arrears Assessment
 * 
 * @module workflows/rentArrearsAssessment
 * @description Example workflow for assessing rent arrears situations.
 * Demonstrates dynamic branching and conditional logic.
 * 
 * @ai-context Sample workflow definition for rent arrears cases
 * @version 1.0.0
 */

import type { Workflow } from '../types';

/**
 * Rent Arrears Assessment Workflow
 * 
 * This workflow guides users through a series of questions to assess
 * their rent arrears situation and determine appropriate support.
 */
export const rentArrearsAssessmentWorkflow: Workflow = {
  metadata: {
    id: 'workflow-rent-arrears-v1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'system',
    updatedBy: 'system',
    version: 1,
    tags: ['rent', 'arrears', 'assessment', 'housing'],
    workflowId: 'rent-arrears-assessment',
    workflowName: 'Rent Arrears Assessment',
    currentStep: 'q1-arrears-amount',
    nextSteps: ['q1-arrears-amount'],
    completionPercentage: 0,
    isCompleted: false,
  },
  
  workflowId: 'rent-arrears-assessment',
  
  name: 'Rent Arrears Assessment',
  
  description: 'Comprehensive assessment workflow for individuals facing rent arrears. Collects information about the situation, financial circumstances, and determines appropriate support pathways.',
  
  version: '1.0.0',
  
  category: 'financial-assessment',
  
  estimatedDuration: 15,
  
  allowSaveAndResume: true,
  
  startQuestionId: 'q1-arrears-amount',
  
  gdprInformation: {
    purpose: 'To assess housing assistance needs and provide appropriate support recommendations',
    legalBasis: 'Consent and legitimate interests',
    retentionPeriod: 365,
  },
  
  aiContext: 'This workflow assesses rent arrears situations through dynamic questioning, adapting based on user responses to provide personalized support recommendations.',
  
  tags: ['rent', 'financial', 'assessment', 'support'],
  
  questions: [
    // Question 1: Arrears Amount
    {
      metadata: {
        id: 'q1-arrears-amount',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'system',
        updatedBy: 'system',
        version: 1,
      },
      questionId: 'q1-arrears-amount',
      questionText: 'How much rent arrears do you currently owe?',
      questionType: 'currency',
      helpText: 'Enter the total amount of rent arrears you owe to your landlord. This should be the current outstanding balance.',
      placeholder: '0.00',
      validationRules: [
        {
          type: 'required',
          errorMessage: 'Please enter the arrears amount',
        },
        {
          type: 'min',
          value: 0,
          errorMessage: 'Amount cannot be negative',
        },
      ],
      isRequired: true,
      order: 1,
      section: 'financial-situation',
      gdprPurpose: 'To assess the severity of the financial situation',
      tags: ['financial', 'arrears'],
      aiContext: 'Critical question for determining urgency and support level',
    },
    
    // Question 2: Arrears Duration
    {
      metadata: {
        id: 'q2-arrears-duration',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'system',
        updatedBy: 'system',
        version: 1,
      },
      questionId: 'q2-arrears-duration',
      questionText: 'How long have you been in arrears?',
      questionType: 'single_choice',
      helpText: 'Select the approximate duration of your rent arrears',
      options: [
        {
          id: 'opt-1month',
          label: 'Less than 1 month',
          value: 'less_than_1_month',
        },
        {
          id: 'opt-1-3months',
          label: '1-3 months',
          value: '1_to_3_months',
        },
        {
          id: 'opt-3-6months',
          label: '3-6 months',
          value: '3_to_6_months',
        },
        {
          id: 'opt-6plus',
          label: 'More than 6 months',
          value: 'more_than_6_months',
        },
      ],
      isRequired: true,
      order: 2,
      section: 'financial-situation',
      gdprPurpose: 'To assess urgency and timeline for intervention',
      tags: ['timeline', 'arrears'],
      aiContext: 'Helps determine urgency level',
    },
    
    // Question 3: Eviction Notice
    {
      metadata: {
        id: 'q3-eviction-notice',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'system',
        updatedBy: 'system',
        version: 1,
      },
      questionId: 'q3-eviction-notice',
      questionText: 'Have you received an eviction notice?',
      questionType: 'yes_no',
      helpText: 'An eviction notice is a formal legal document from your landlord requiring you to vacate the property',
      isRequired: true,
      order: 3,
      section: 'legal-situation',
      gdprPurpose: 'To assess legal urgency',
      tags: ['legal', 'eviction', 'urgent'],
      aiContext: 'Critical for determining urgency - yes answer triggers high priority pathway',
    },
    
    // Question 4: Eviction Date (conditional)
    {
      metadata: {
        id: 'q4-eviction-date',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'system',
        updatedBy: 'system',
        version: 1,
      },
      questionId: 'q4-eviction-date',
      questionText: 'What is the date specified in your eviction notice?',
      questionType: 'date',
      helpText: 'Enter the date by which you are required to vacate the property',
      conditionalLogic: [
        {
          dependsOn: 'q3-eviction-notice',
          operator: 'equals',
          value: true,
          action: 'show',
        },
      ],
      validationRules: [
        {
          type: 'required',
          errorMessage: 'Please enter the eviction date',
        },
      ],
      isRequired: true,
      order: 4,
      section: 'legal-situation',
      gdprPurpose: 'To calculate time available for intervention',
      tags: ['legal', 'eviction', 'deadline'],
      aiContext: 'Only shown if eviction notice received - critical for timeline',
    },
    
    // Question 5: Monthly Income
    {
      metadata: {
        id: 'q5-monthly-income',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'system',
        updatedBy: 'system',
        version: 1,
      },
      questionId: 'q5-monthly-income',
      questionText: 'What is your total monthly income?',
      questionType: 'currency',
      helpText: 'Include all sources of income: salary, benefits, pensions, etc.',
      placeholder: '0.00',
      validationRules: [
        {
          type: 'required',
          errorMessage: 'Please enter your monthly income',
        },
        {
          type: 'min',
          value: 0,
          errorMessage: 'Amount cannot be negative',
        },
      ],
      isRequired: true,
      order: 5,
      section: 'financial-situation',
      gdprPurpose: 'To assess ability to repay and eligibility for support',
      tags: ['financial', 'income'],
      aiContext: 'Used to calculate disposable income and repayment capacity',
    },
    
    // Question 6: Monthly Expenses
    {
      metadata: {
        id: 'q6-monthly-expenses',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'system',
        updatedBy: 'system',
        version: 1,
      },
      questionId: 'q6-monthly-expenses',
      questionText: 'What are your total monthly expenses (excluding rent)?',
      questionType: 'currency',
      helpText: 'Include essential expenses: utilities, food, transport, childcare, etc.',
      placeholder: '0.00',
      validationRules: [
        {
          type: 'required',
          errorMessage: 'Please enter your monthly expenses',
        },
        {
          type: 'min',
          value: 0,
          errorMessage: 'Amount cannot be negative',
        },
      ],
      isRequired: true,
      order: 6,
      section: 'financial-situation',
      gdprPurpose: 'To assess disposable income',
      tags: ['financial', 'expenses'],
      aiContext: 'Used with income to calculate disposable income',
    },
    
    // Question 7: Benefits
    {
      metadata: {
        id: 'q7-receives-benefits',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'system',
        updatedBy: 'system',
        version: 1,
      },
      questionId: 'q7-receives-benefits',
      questionText: 'Do you currently receive any benefits?',
      questionType: 'yes_no',
      helpText: 'This includes Universal Credit, Housing Benefit, or any other government benefits',
      isRequired: true,
      order: 7,
      section: 'support-eligibility',
      gdprPurpose: 'To assess current support and eligibility for additional help',
      tags: ['benefits', 'eligibility'],
      aiContext: 'Determines eligibility pathways',
    },
    
    // Question 8: Vulnerability
    {
      metadata: {
        id: 'q8-vulnerability',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'system',
        updatedBy: 'system',
        version: 1,
      },
      questionId: 'q8-vulnerability',
      questionText: 'Do any of the following circumstances apply to you?',
      questionType: 'multiple_choice',
      helpText: 'Select all that apply. This information helps us provide appropriate support.',
      options: [
        {
          id: 'vuln-disability',
          label: 'Physical or mental disability',
          value: 'disability',
        },
        {
          id: 'vuln-dependent',
          label: 'Dependent children',
          value: 'dependent_children',
        },
        {
          id: 'vuln-elderly',
          label: 'Over 65 years old',
          value: 'elderly',
        },
        {
          id: 'vuln-domestic',
          label: 'Domestic abuse survivor',
          value: 'domestic_abuse',
        },
        {
          id: 'vuln-none',
          label: 'None of the above',
          value: 'none',
        },
      ],
      isRequired: false,
      order: 8,
      section: 'vulnerability-assessment',
      gdprPurpose: 'To ensure appropriate priority and specialized support',
      tags: ['vulnerability', 'priority'],
      aiContext: 'Affects priority level and support recommendations',
    },
    
    // Question 9: Previous Support
    {
      metadata: {
        id: 'q9-previous-support',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'system',
        updatedBy: 'system',
        version: 1,
      },
      questionId: 'q9-previous-support',
      questionText: 'Have you sought help for this issue before?',
      questionType: 'yes_no',
      helpText: 'This includes advice from Citizens Advice, Shelter, local council, or other organizations',
      isRequired: true,
      order: 9,
      section: 'support-history',
      gdprPurpose: 'To avoid duplication and build on existing support',
      tags: ['support', 'history'],
      aiContext: 'Helps tailor recommendations',
    },
    
    // Question 10: Landlord Communication
    {
      metadata: {
        id: 'q10-landlord-communication',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'system',
        updatedBy: 'system',
        version: 1,
      },
      questionId: 'q10-landlord-communication',
      questionText: 'Have you discussed your situation with your landlord?',
      questionType: 'single_choice',
      helpText: 'It\'s important to keep your landlord informed about your situation',
      options: [
        {
          id: 'comm-yes-positive',
          label: 'Yes, and they were understanding',
          value: 'yes_positive',
        },
        {
          id: 'comm-yes-negative',
          label: 'Yes, but they were not sympathetic',
          value: 'yes_negative',
        },
        {
          id: 'comm-no-plan',
          label: 'No, but I plan to',
          value: 'no_plan_to',
        },
        {
          id: 'comm-no-afraid',
          label: 'No, I\'m afraid to',
          value: 'no_afraid',
        },
      ],
      isRequired: true,
      order: 10,
      section: 'landlord-relationship',
      gdprPurpose: 'To assess relationship and negotiation potential',
      tags: ['landlord', 'communication'],
      aiContext: 'Affects mediation and negotiation recommendations',
    },
  ],
};

/**
 * Get workflow by ID
 * 
 * @param workflowId - Workflow identifier
 * @returns Workflow or undefined
 */
export function getWorkflowById(workflowId: string): Workflow | undefined {
  if (workflowId === 'rent-arrears-assessment') {
    return rentArrearsAssessmentWorkflow;
  }
  return undefined;
}

/**
 * List all available workflows
 * 
 * @returns Array of workflows
 */
export function listWorkflows(): Workflow[] {
  return [rentArrearsAssessmentWorkflow];
}
