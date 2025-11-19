/**
 * TypeScript types for U-HSP schemas
 */

// Common types
export type ConditionOperator = 
  | 'equals' 
  | 'notEquals' 
  | 'greaterThan' 
  | 'lessThan' 
  | 'greaterThanOrEqual' 
  | 'lessThanOrEqual' 
  | 'contains' 
  | 'notContains' 
  | 'in' 
  | 'notIn' 
  | 'exists' 
  | 'notExists';

export type LogicalOperator = 'all' | 'any' | 'none';

// RightRule types
export interface RightRuleConditionRule {
  field: string;
  operator: ConditionOperator;
  value?: unknown;
}

export interface RightRuleConditions {
  type: LogicalOperator;
  rules?: RightRuleConditionRule[];
  nested?: RightRuleConditions[];
}

export interface RightRule {
  id: string;
  name: string;
  description?: string;
  jurisdiction: string;
  legalBasis?: string;
  priority?: number;
  conditions: RightRuleConditions;
  actions: string[];
  metadata?: {
    version?: string;
    effectiveDate?: string;
    expiryDate?: string;
    author?: string;
    tags?: string[];
  };
}

// ActionTemplate types
export type ActionType = 'immediate' | 'referral' | 'application' | 'assessment' | 'notification' | 'documentation';
export type ActionCategory = 'emergency' | 'housing' | 'financial' | 'support' | 'legal' | 'medical' | 'other';
export type ActionUrgency = 'critical' | 'high' | 'medium' | 'low';
export type InputFieldType = 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect' | 'textarea';

export interface ActionInputField {
  name: string;
  label?: string;
  type: InputFieldType;
  required?: boolean;
  options?: string[];
  validation?: Record<string, unknown>;
}

export interface ActionStep {
  order: number;
  instruction: string;
  requiresInput?: boolean;
  inputFields?: ActionInputField[];
}

export interface ActionContactInfo {
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  hoursOfOperation?: string;
}

export interface ActionOutcome {
  id: string;
  description: string;
  nextActions?: string[];
}

export interface ActionTemplate {
  id: string;
  name: string;
  description?: string;
  type: ActionType;
  category: ActionCategory;
  urgency?: ActionUrgency;
  steps?: ActionStep[];
  requiredInformation?: string[];
  estimatedDuration?: string;
  contactInfo?: ActionContactInfo;
  prerequisites?: string[];
  relatedServices?: string[];
  documentation?: {
    forms?: Array<{
      name?: string;
      url?: string;
      required?: boolean;
    }>;
    guidance?: string;
  };
  outcomes?: ActionOutcome[];
  metadata?: {
    version?: string;
    author?: string;
    tags?: string[];
  };
}

// Service types
export type ServiceType = 
  | 'emergency_shelter' 
  | 'day_center' 
  | 'food_bank' 
  | 'medical' 
  | 'mental_health' 
  | 'substance_abuse' 
  | 'legal_aid' 
  | 'job_training' 
  | 'housing_assistance' 
  | 'financial_aid' 
  | 'outreach_team' 
  | 'hotline' 
  | 'other';

export interface ServiceProvider {
  name: string;
  type?: 'government' | 'charity' | 'ngo' | 'religious' | 'private' | 'volunteer';
  website?: string;
  charityNumber?: string;
}

export interface ServiceContact {
  phone?: string;
  emergencyPhone?: string;
  email?: string;
  website?: string;
  textLine?: string;
}

export interface ServiceLocation {
  address?: {
    street?: string;
    city?: string;
    region?: string;
    postcode?: string;
    country?: string;
  };
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  accessibilityInfo?: string;
  nearestTransport?: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  type: ServiceType;
  provider: ServiceProvider;
  contact?: ServiceContact;
  location?: ServiceLocation;
  availability?: {
    schedule?: Record<string, string>;
    isAvailable24_7?: boolean;
    exceptionalClosures?: Array<{
      date: string;
      reason?: string;
    }>;
  };
  capacity?: {
    total?: number;
    available?: number;
    lastUpdated?: string;
  };
  eligibility?: {
    ageRestrictions?: {
      minimum?: number;
      maximum?: number;
    };
    genderRestrictions?: 'any' | 'male' | 'female' | 'non-binary';
    acceptsPets?: boolean;
    petRestrictions?: string;
    requiresReferral?: boolean;
    localConnectionRequired?: boolean;
    otherRequirements?: string[];
  };
  services?: string[];
  cost?: {
    isFree?: boolean;
    amount?: number;
    currency?: string;
    details?: string;
  };
  tags?: string[];
  metadata?: {
    version?: string;
    lastVerified?: string;
    dataSource?: string;
  };
}

// Question types
export type QuestionType = 'yes_no' | 'single_choice' | 'multiple_choice' | 'text' | 'number' | 'date' | 'location';
export type QuestionCategory = 'personal' | 'situation' | 'housing' | 'financial' | 'health' | 'legal' | 'family' | 'pets' | 'other';

export interface QuestionOption {
  id: string;
  text: string;
  value?: unknown;
  description?: string;
}

export interface QuestionTransition {
  condition: {
    operator: string;
    value?: unknown;
    values?: unknown[];
  };
  next: {
    type: 'question' | 'action' | 'end';
    id?: string;
    message?: string;
  };
}

export interface Question {
  id: string;
  text: string;
  description?: string;
  type: QuestionType;
  category?: QuestionCategory;
  required?: boolean;
  options?: QuestionOption[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    customMessage?: string;
  };
  stateMapping?: string;
  transitions?: QuestionTransition[];
  defaultTransition?: {
    type: 'question' | 'action' | 'end';
    id?: string;
    message?: string;
  };
  priority?: number;
  showIf?: {
    field: string;
    operator: string;
    value?: unknown;
  };
  helpText?: string;
  metadata?: {
    version?: string;
    author?: string;
    tags?: string[];
  };
}

// SessionState types
export interface Pet {
  type: 'dog' | 'cat' | 'other';
  breed?: string;
  size?: 'small' | 'medium' | 'large';
}

export interface SessionState {
  sessionId: string;
  createdAt: string;
  updatedAt?: string;
  status: 'active' | 'completed' | 'abandoned' | 'escalated';
  user?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    age?: number;
    gender?: string;
    nationalInsuranceNumber?: string;
    contact?: {
      phone?: string;
      email?: string;
      preferredContact?: 'phone' | 'email' | 'text' | 'in-person';
    };
    hasChildren?: boolean;
    numberOfChildren?: number;
    childrenAges?: number[];
    isPregnant?: boolean;
    hasPets?: boolean;
    pets?: Pet[];
    disabilities?: string[];
    medicalConditions?: string[];
    hasLocalConnection?: boolean;
    localConnectionDetails?: string;
  };
  situation?: {
    isHomeless?: boolean;
    homelessTonight?: boolean;
    currentLocation?: string;
    currentLocationCoordinates?: {
      latitude: number;
      longitude: number;
    };
    roughSleeping?: boolean;
    nightsSleepingRough?: number;
    hasBeenEvicted?: boolean;
    evictionDate?: string;
    reasonForHomelessness?: string;
    reasonDetails?: string;
    atRiskOfViolence?: boolean;
    hasLuggageOrBelongings?: boolean;
    belongingsLocation?: string;
    urgentNeeds?: string[];
  };
  housing?: {
    previousAddress?: string;
    tenureType?: string;
    hasRentArrears?: boolean;
    rentArrearsAmount?: number;
    preferredAreas?: string[];
  };
  legal?: {
    rightToReside?: boolean;
    immigrationStatus?: string;
    hasPriorityNeed?: boolean;
    priorityNeedReasons?: string[];
    intentionallyHomeless?: boolean;
  };
  currentQuestion?: string;
  answers?: Record<string, unknown>;
  triggeredRules?: Array<{
    ruleId: string;
    triggeredAt: string;
    result: 'matched' | 'not_matched' | 'error';
  }>;
  completedActions?: Array<{
    actionId: string;
    completedAt: string;
    outcome?: string;
    notes?: string;
  }>;
  pendingActions?: string[];
  recommendedServices?: string[];
  notes?: Array<{
    timestamp: string;
    author?: string;
    text: string;
    type?: 'observation' | 'action_taken' | 'user_statement' | 'assessment' | 'other';
  }>;
  metadata?: {
    contentPackId?: string;
    jurisdiction?: string;
    language?: string;
    channel?: 'web' | 'mobile' | 'phone' | 'in-person' | 'chatbot';
    assistedBy?: string;
  };
}

// ContentPack types
export interface ContentPack {
  id: string;
  name: string;
  description?: string;
  version: string;
  jurisdiction: string;
  language?: string;
  supportedLanguages?: string[];
  effectiveDate?: string;
  expiryDate?: string;
  entryPoint?: string;
  questions?: Question[];
  rules?: RightRule[];
  actions?: ActionTemplate[];
  services?: Service[];
  workflows?: Array<{
    id: string;
    name: string;
    description?: string;
    trigger: {
      conditions?: unknown[];
    };
    steps?: Array<{
      order: number;
      type: 'question' | 'rule_check' | 'action' | 'decision';
      id: string;
    }>;
  }>;
  legalReferences?: Array<{
    id: string;
    name: string;
    citation?: string;
    url?: string;
    summary?: string;
  }>;
  resources?: {
    documents?: Array<{
      id: string;
      name: string;
      type?: 'form' | 'guide' | 'factsheet' | 'template' | 'other';
      url?: string;
      description?: string;
    }>;
    helplines?: Array<{
      name: string;
      phone: string;
      description?: string;
      available24_7?: boolean;
    }>;
  };
  metadata?: {
    author?: string;
    maintainer?: string;
    license?: string;
    dataSource?: string;
    lastVerified?: string;
    tags?: string[];
  };
}
