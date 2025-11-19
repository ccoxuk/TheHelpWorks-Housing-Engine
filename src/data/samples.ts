/**
 * Sample Data
 * 
 * @module data/samples
 * @description Sample data for testing and demonstration purposes
 * 
 * @ai-context Example data demonstrating the system's capabilities
 * @version 1.0.0
 */

import type { User, Case, Assessment, Recommendation } from '../types';

/**
 * Sample user data
 */
export const sampleUser: User = {
  metadata: {
    id: 'user-001',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    createdBy: 'system',
    updatedBy: 'system',
    version: 1,
    tags: ['active', 'rent-arrears'],
  },
  privacy: {
    consentGiven: true,
    consentDate: '2024-01-15T10:00:00Z',
    processingPurpose: ['housing-assistance', 'case-management'],
    legalBasis: 'consent',
    retentionPeriod: 365,
    thirdPartySharing: false,
    rightToErasure: true,
    isAnonymized: false,
  },
  fullName: 'John Smith',
  email: 'john.smith@example.com',
  phone: '07700900123',
  preferredContact: 'email',
  dateOfBirth: '1985-03-20',
  currentAddress: {
    addressLine1: '123 Main Street',
    addressLine2: 'Flat 2B',
    city: 'London',
    county: 'Greater London',
    postalCode: 'SW1A 1AA',
    country: 'United Kingdom',
  },
  isVulnerable: false,
};

/**
 * Sample case data
 */
export const sampleCase: Case = {
  metadata: {
    id: 'case-001',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:00:00Z',
    createdBy: 'user-001',
    updatedBy: 'caseworker-001',
    version: 2,
    tags: ['urgent', 'rent-arrears', 'eviction-risk'],
  },
  userId: 'user-001',
  caseReferenceNumber: 'CASE-2024-000123',
  status: 'in_progress',
  priority: 'high',
  issueType: 'rent_arrears',
  issueDescription: 'Tenant has fallen behind on rent payments due to recent job loss. Currently owes 3 months of rent. Has received a Section 21 notice requiring possession of the property.',
  issueStartDate: '2023-11-01',
  arrearsAmount: 3600.00,
  currency: 'GBP',
  timeline: {
    openedDate: '2024-01-15T10:30:00Z',
    targetResolutionDate: '2024-03-15T00:00:00Z',
    milestones: [
      {
        id: 'milestone-001',
        name: 'Initial Assessment Complete',
        description: 'Complete initial housing needs assessment',
        targetDate: '2024-01-20T00:00:00Z',
        completedDate: '2024-01-20T14:00:00Z',
        isCompleted: true,
        isCritical: false,
      },
      {
        id: 'milestone-002',
        name: 'Respond to Eviction Notice',
        description: 'Submit response to Section 21 notice',
        targetDate: '2024-02-01T00:00:00Z',
        isCompleted: false,
        isCritical: true,
      },
      {
        id: 'milestone-003',
        name: 'Benefit Application Submitted',
        description: 'Submit Universal Credit application',
        targetDate: '2024-01-25T00:00:00Z',
        isCompleted: false,
        isCritical: false,
      },
    ],
  },
  notes: [
    {
      metadata: {
        id: 'note-001',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        createdBy: 'user-001',
        updatedBy: 'user-001',
        version: 1,
      },
      content: 'Initial contact made. User is cooperative and willing to engage with the process.',
      type: 'general',
      visibility: 'internal',
    },
    {
      metadata: {
        id: 'note-002',
        createdAt: '2024-01-20T14:00:00Z',
        updatedAt: '2024-01-20T14:00:00Z',
        createdBy: 'caseworker-001',
        updatedBy: 'caseworker-001',
        version: 1,
      },
      content: 'Assessment completed. User has good prospects for securing employment. Recommend immediate benefit application and negotiation with landlord.',
      type: 'decision',
      visibility: 'shared_with_user',
    },
  ],
};

/**
 * Sample assessment data
 */
export const sampleAssessment: Assessment = {
  metadata: {
    id: 'assessment-001',
    createdAt: '2024-01-20T14:00:00Z',
    updatedAt: '2024-01-20T14:00:00Z',
    createdBy: 'caseworker-001',
    updatedBy: 'caseworker-001',
    version: 1,
  },
  riskLevel: 'high',
  urgencyScore: 85,
  complexityScore: 60,
  financialSituation: {
    monthlyIncome: 0, // Currently unemployed
    monthlyExpenses: 1800,
    disposableIncome: -1800,
    totalDebt: 3600,
    hasEmergencyFunds: false,
    receivesBenefits: false,
    benefitTypes: [],
  },
  legalSituation: {
    hasLegalRepresentation: false,
    courtProceedingsActive: false,
    evictionNoticeReceived: true,
    evictionNoticeDate: '2024-01-10T00:00:00Z',
    legalDeadlines: ['2024-02-01T00:00:00Z - Response to eviction notice required'],
  },
  supportNeeds: [
    'Financial counseling',
    'Job search assistance',
    'Benefit application support',
    'Landlord negotiation',
    'Legal advice',
  ],
  eligibility: [
    {
      programId: 'universal-credit',
      programName: 'Universal Credit',
      isEligible: true,
      reason: 'Currently unemployed with low income',
      requiredActions: [
        'Create online account at gov.uk',
        'Complete application form',
        'Attend work coach appointment',
      ],
      applicationDeadline: '2024-01-25T00:00:00Z',
    },
    {
      programId: 'discretionary-housing-payment',
      programName: 'Discretionary Housing Payment',
      isEligible: true,
      reason: 'Receiving housing benefit and facing eviction',
      requiredActions: [
        'Contact local council housing team',
        'Provide evidence of arrears',
        'Demonstrate efforts to resolve situation',
      ],
    },
  ],
  summary: 'High-risk case due to eviction notice and lack of income. Immediate action required to secure benefits and negotiate with landlord. User is cooperative and has good employment prospects, which improves chances of successful resolution.',
  confidenceLevel: 85,
};

/**
 * Sample recommendations
 */
export const sampleRecommendations: Recommendation[] = [
  {
    id: 'rec-001',
    title: 'Apply for Universal Credit Immediately',
    description: 'Universal Credit can provide financial support while you search for employment. This is your most urgent priority as it will provide income to cover living expenses and potentially contribute to rent.',
    priority: 'critical',
    category: 'financial',
    actionSteps: [
      {
        id: 'step-001',
        stepNumber: 1,
        description: 'Create an account on the Universal Credit website (gov.uk/apply-universal-credit)',
        responsibility: 'user',
        isCompleted: false,
        dueDate: '2024-01-22T00:00:00Z',
        estimatedDuration: '30 minutes',
      },
      {
        id: 'step-002',
        stepNumber: 2,
        description: 'Complete the online application form with all required information',
        responsibility: 'user',
        isCompleted: false,
        dueDate: '2024-01-23T00:00:00Z',
        estimatedDuration: '1-2 hours',
      },
      {
        id: 'step-003',
        stepNumber: 3,
        description: 'Attend the initial work coach appointment',
        responsibility: 'user',
        isCompleted: false,
        dueDate: '2024-01-30T00:00:00Z',
        estimatedDuration: '1 hour',
      },
    ],
    timelineDescription: 'Application should be completed within 7 days. First payment typically arrives 5-6 weeks after application.',
    expectedOutcome: 'Monthly Universal Credit payment to cover basic living expenses and contribute to rent',
    resourcesNeeded: [
      'National Insurance number',
      'Bank account details',
      'Proof of identity',
      'Details of savings and capital',
    ],
    supportingDocuments: [
      'Universal Credit Application Guide',
      'Benefits Calculator',
    ],
  },
  {
    id: 'rec-002',
    title: 'Negotiate Payment Plan with Landlord',
    description: 'Contact your landlord immediately to discuss a payment plan for the arrears. Many landlords prefer to work with tenants rather than go through eviction proceedings.',
    priority: 'critical',
    category: 'housing',
    actionSteps: [
      {
        id: 'step-004',
        stepNumber: 1,
        description: 'Draft a letter to your landlord explaining your situation and proposing a payment plan',
        responsibility: 'user',
        isCompleted: false,
        dueDate: '2024-01-25T00:00:00Z',
        estimatedDuration: '1 hour',
      },
      {
        id: 'step-005',
        stepNumber: 2,
        description: 'Send the letter via email and recorded delivery',
        responsibility: 'user',
        isCompleted: false,
        dueDate: '2024-01-26T00:00:00Z',
        estimatedDuration: '30 minutes',
      },
      {
        id: 'step-006',
        stepNumber: 3,
        description: 'Follow up with a phone call if no response within 3 days',
        responsibility: 'user',
        isCompleted: false,
        dueDate: '2024-01-29T00:00:00Z',
        estimatedDuration: '30 minutes',
      },
    ],
    timelineDescription: 'Should be initiated within 10 days',
    expectedOutcome: 'Agreement with landlord for manageable payment plan to clear arrears',
    resourcesNeeded: [
      'Statement of arrears from landlord',
      'Budget plan showing income and expenses',
    ],
    supportingDocuments: [
      'Sample Letter to Landlord Template',
      'Payment Plan Proposal Template',
    ],
  },
  {
    id: 'rec-003',
    title: 'Seek Free Legal Advice',
    description: 'Get professional legal advice about your eviction notice to understand your rights and options.',
    priority: 'high',
    category: 'legal',
    actionSteps: [
      {
        id: 'step-007',
        stepNumber: 1,
        description: 'Contact Shelter or Citizens Advice for free legal advice',
        responsibility: 'user',
        isCompleted: false,
        dueDate: '2024-01-27T00:00:00Z',
        estimatedDuration: '1 hour',
      },
      {
        id: 'step-008',
        stepNumber: 2,
        description: 'Gather all relevant documents for the legal consultation',
        responsibility: 'user',
        isCompleted: false,
        dueDate: '2024-01-26T00:00:00Z',
        estimatedDuration: '30 minutes',
      },
    ],
    timelineDescription: 'Should be completed within 2 weeks',
    expectedOutcome: 'Understanding of legal rights and potential defenses against eviction',
    resourcesNeeded: [
      'Copy of tenancy agreement',
      'Copy of eviction notice',
      'Correspondence with landlord',
    ],
    supportingDocuments: [
      'Shelter Contact Information',
      'Citizens Advice Contact Information',
    ],
  },
];

/**
 * Get all sample data
 */
export function getSampleData() {
  return {
    user: sampleUser,
    case: sampleCase,
    assessment: sampleAssessment,
    recommendations: sampleRecommendations,
  };
}
