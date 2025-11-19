/**
 * Privacy and GDPR Utilities
 * 
 * @module utils/privacy
 * @description Utilities for GDPR compliance, data anonymization, and consent management.
 * 
 * @gdpr-essential Core privacy and compliance utilities
 * @version 1.0.0
 */

import type { PrivacyMetadata, User, Case } from '../types';

/**
 * Consent record
 */
export interface ConsentRecord {
  /** User ID */
  userId: string;
  
  /** Processing purpose */
  purpose: string;
  
  /** Consent given */
  consentGiven: boolean;
  
  /** Consent date */
  consentDate: string;
  
  /** Consent method (e.g., 'explicit', 'implied') */
  consentMethod: string;
  
  /** IP address at time of consent */
  ipAddress?: string;
  
  /** Consent withdrawn */
  withdrawn: boolean;
  
  /** Withdrawal date */
  withdrawalDate?: string;
}

/**
 * Data retention policy
 */
export interface RetentionPolicy {
  /** Entity type */
  entityType: string;
  
  /** Retention period in days */
  retentionPeriodDays: number;
  
  /** Action on expiry */
  expiryAction: 'delete' | 'anonymize' | 'archive';
  
  /** Legal basis */
  legalBasis: string;
}

/**
 * Privacy Manager for GDPR compliance
 * 
 * @gdpr-essential Central service for privacy operations
 */
export class PrivacyManager {
  private retentionPolicies: Map<string, RetentionPolicy>;
  private consentRecords: Map<string, ConsentRecord[]>;
  
  constructor() {
    this.retentionPolicies = new Map();
    this.consentRecords = new Map();
    this.initializeDefaultPolicies();
  }
  
  /**
   * Initialize default retention policies
   */
  private initializeDefaultPolicies(): void {
    // User data
    this.retentionPolicies.set('user', {
      entityType: 'user',
      retentionPeriodDays: 365,
      expiryAction: 'anonymize',
      legalBasis: 'Legitimate interests (Art. 6(1)(f) GDPR)',
    });
    
    // Case data
    this.retentionPolicies.set('case', {
      entityType: 'case',
      retentionPeriodDays: 730, // 2 years for legal purposes
      expiryAction: 'archive',
      legalBasis: 'Legal obligation (Art. 6(1)(c) GDPR)',
    });
    
    // Audit logs
    this.retentionPolicies.set('audit_log', {
      entityType: 'audit_log',
      retentionPeriodDays: 730,
      expiryAction: 'delete',
      legalBasis: 'Legal obligation (Art. 6(1)(c) GDPR)',
    });
  }
  
  /**
   * Record user consent
   * 
   * @param userId - User ID
   * @param purpose - Processing purpose
   * @param consentGiven - Whether consent was given
   * @param method - Consent method
   * @param ipAddress - IP address
   */
  recordConsent(
    userId: string,
    purpose: string,
    consentGiven: boolean,
    method: string = 'explicit',
    ipAddress?: string
  ): ConsentRecord {
    const consent: ConsentRecord = {
      userId,
      purpose,
      consentGiven,
      consentDate: new Date().toISOString(),
      consentMethod: method,
      ipAddress,
      withdrawn: false,
    };
    
    if (!this.consentRecords.has(userId)) {
      this.consentRecords.set(userId, []);
    }
    
    this.consentRecords.get(userId)!.push(consent);
    
    return consent;
  }
  
  /**
   * Withdraw consent
   * 
   * @param userId - User ID
   * @param purpose - Processing purpose
   */
  withdrawConsent(userId: string, purpose: string): void {
    const userConsents = this.consentRecords.get(userId) || [];
    
    for (const consent of userConsents) {
      if (consent.purpose === purpose && !consent.withdrawn) {
        consent.withdrawn = true;
        consent.withdrawalDate = new Date().toISOString();
      }
    }
  }
  
  /**
   * Check if user has given consent for a purpose
   * 
   * @param userId - User ID
   * @param purpose - Processing purpose
   * @returns True if consent is active
   */
  hasConsent(userId: string, purpose: string): boolean {
    const userConsents = this.consentRecords.get(userId) || [];
    
    for (const consent of userConsents) {
      if (consent.purpose === purpose && consent.consentGiven && !consent.withdrawn) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Anonymize user data
   * 
   * @param user - User object
   * @returns Anonymized user
   */
  anonymizeUser(user: User): User {
    return {
      ...user,
      fullName: `Anonymous User ${user.metadata.id.substring(0, 8)}`,
      email: `anonymized-${user.metadata.id.substring(0, 8)}@example.com`,
      phone: undefined,
      dateOfBirth: undefined,
      nationalInsuranceNumber: undefined,
      currentAddress: undefined,
      vulnerabilityNotes: user.isVulnerable ? '[REDACTED]' : undefined,
      privacy: {
        ...user.privacy,
        isAnonymized: true,
      },
    };
  }
  
  /**
   * Anonymize case data
   * 
   * @param caseData - Case object
   * @returns Anonymized case
   */
  anonymizeCase(caseData: Case): Case {
    return {
      ...caseData,
      userId: `anonymized-${caseData.userId.substring(0, 8)}`,
      issueDescription: '[REDACTED FOR PRIVACY]',
      notes: caseData.notes?.map(note => ({
        ...note,
        content: note.visibility === 'internal' ? note.content : '[REDACTED]',
      })),
    };
  }
  
  /**
   * Check if data should be deleted based on retention policy
   * 
   * @param entityType - Type of entity
   * @param createdAt - Creation date
   * @returns True if data should be deleted
   */
  shouldDelete(entityType: string, createdAt: string): boolean {
    const policy = this.retentionPolicies.get(entityType);
    if (!policy) return false;
    
    const createdDate = new Date(createdAt);
    const expiryDate = new Date(createdDate);
    expiryDate.setDate(expiryDate.getDate() + policy.retentionPeriodDays);
    
    return new Date() > expiryDate;
  }
  
  /**
   * Get retention policy for entity type
   * 
   * @param entityType - Entity type
   * @returns Retention policy or undefined
   */
  getRetentionPolicy(entityType: string): RetentionPolicy | undefined {
    return this.retentionPolicies.get(entityType);
  }
  
  /**
   * Calculate expiry date for entity
   * 
   * @param entityType - Entity type
   * @param createdAt - Creation date
   * @returns Expiry date or null
   */
  calculateExpiryDate(entityType: string, createdAt: string): string | null {
    const policy = this.retentionPolicies.get(entityType);
    if (!policy) return null;
    
    const createdDate = new Date(createdAt);
    const expiryDate = new Date(createdDate);
    expiryDate.setDate(expiryDate.getDate() + policy.retentionPeriodDays);
    
    return expiryDate.toISOString();
  }
  
  /**
   * Generate privacy metadata for new entity
   * 
   * @param purpose - Processing purpose
   * @param legalBasis - Legal basis for processing
   * @param retentionPeriod - Retention period in days
   * @returns Privacy metadata
   */
  generatePrivacyMetadata(
    purpose: string[],
    legalBasis: PrivacyMetadata['legalBasis'],
    retentionPeriod: number = 365
  ): PrivacyMetadata {
    return {
      consentGiven: false,
      processingPurpose: purpose,
      legalBasis,
      retentionPeriod,
      thirdPartySharing: false,
      rightToErasure: legalBasis === 'consent',
      isAnonymized: false,
    };
  }
  
  /**
   * Validate GDPR compliance for data processing
   * 
   * @param privacyMetadata - Privacy metadata
   * @returns Compliance validation result
   */
  validateCompliance(privacyMetadata: PrivacyMetadata): {
    isCompliant: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    
    // Check consent requirement
    if (privacyMetadata.legalBasis === 'consent' && !privacyMetadata.consentGiven) {
      issues.push('Consent required but not given');
    }
    
    // Check third-party sharing
    if (privacyMetadata.thirdPartySharing && !privacyMetadata.thirdParties?.length) {
      issues.push('Third-party sharing enabled but no parties specified');
    }
    
    // Check retention period
    if (privacyMetadata.retentionPeriod <= 0) {
      issues.push('Invalid retention period');
    }
    
    return {
      isCompliant: issues.length === 0,
      issues,
    };
  }
}

/**
 * Data masking utilities
 */
export class DataMasker {
  /**
   * Mask email address
   * 
   * @param email - Email address
   * @returns Masked email
   */
  static maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!local || !domain) return '***@***.***';
    
    const maskedLocal = local.length > 2 
      ? local[0] + '*'.repeat(local.length - 2) + local[local.length - 1]
      : '***';
    
    return `${maskedLocal}@${domain}`;
  }
  
  /**
   * Mask phone number
   * 
   * @param phone - Phone number
   * @returns Masked phone number
   */
  static maskPhone(phone: string): string {
    if (phone.length < 4) return '***';
    
    return '*'.repeat(phone.length - 4) + phone.slice(-4);
  }
  
  /**
   * Mask name
   * 
   * @param name - Full name
   * @returns Masked name
   */
  static maskName(name: string): string {
    const parts = name.split(' ');
    if (parts.length === 0) return '***';
    
    return parts.map((part, idx) => {
      if (idx === 0) {
        // Keep first name's first letter
        return part[0] + '*'.repeat(Math.max(part.length - 1, 2));
      }
      // Mask other names completely
      return '*'.repeat(part.length);
    }).join(' ');
  }
  
  /**
   * Mask national insurance number
   * 
   * @param nino - National insurance number
   * @returns Masked NINO
   */
  static maskNINO(nino: string): string {
    if (nino.length < 4) return '***';
    
    return '**' + '*'.repeat(Math.max(nino.length - 4, 0)) + nino.slice(-2);
  }
}
