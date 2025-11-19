/**
 * Validation Utilities
 * 
 * @module utils/validation
 * @description Validation utilities for data integrity and business rules.
 * 
 * @ai-context Validation and data integrity utilities
 * @version 1.0.0
 */

/**
 * Validation result
 */
export interface ValidationResult {
  /** Whether validation passed */
  isValid: boolean;
  
  /** Validation errors */
  errors: ValidationError[];
  
  /** Validation warnings */
  warnings?: ValidationWarning[];
}

/**
 * Validation error
 */
export interface ValidationError {
  /** Field name */
  field: string;
  
  /** Error message */
  message: string;
  
  /** Error code */
  code?: string;
}

/**
 * Validation warning
 */
export interface ValidationWarning {
  /** Field name */
  field: string;
  
  /** Warning message */
  message: string;
  
  /** Warning code */
  code?: string;
}

/**
 * Validator class with common validation methods
 */
export class Validator {
  /**
   * Validate email address
   * 
   * @param email - Email address
   * @returns True if valid
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Validate phone number (UK format)
   * 
   * @param phone - Phone number
   * @returns True if valid
   */
  static isValidPhone(phone: string): boolean {
    // UK phone number format
    const phoneRegex = /^(?:(?:\+44\s?|0)(?:\d\s?){10})$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }
  
  /**
   * Validate UK postcode
   * 
   * @param postcode - Postcode
   * @returns True if valid
   */
  static isValidPostcode(postcode: string): boolean {
    const postcodeRegex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i;
    return postcodeRegex.test(postcode);
  }
  
  /**
   * Validate National Insurance Number (UK)
   * 
   * @param nino - National insurance number
   * @returns True if valid
   */
  static isValidNINO(nino: string): boolean {
    const ninoRegex = /^[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D]{1}$/i;
    return ninoRegex.test(nino.replace(/\s/g, ''));
  }
  
  /**
   * Validate date string (ISO 8601)
   * 
   * @param dateString - Date string
   * @returns True if valid
   */
  static isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
  
  /**
   * Validate date is in the past
   * 
   * @param dateString - Date string
   * @returns True if date is in the past
   */
  static isDateInPast(dateString: string): boolean {
    const date = new Date(dateString);
    return date < new Date();
  }
  
  /**
   * Validate date is in the future
   * 
   * @param dateString - Date string
   * @returns True if date is in the future
   */
  static isDateInFuture(dateString: string): boolean {
    const date = new Date(dateString);
    return date > new Date();
  }
  
  /**
   * Validate required field
   * 
   * @param value - Field value
   * @returns True if not empty
   */
  static isRequired(value: unknown): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  }
  
  /**
   * Validate string length
   * 
   * @param value - String value
   * @param min - Minimum length
   * @param max - Maximum length
   * @returns True if within range
   */
  static isLengthInRange(value: string, min: number, max?: number): boolean {
    if (value.length < min) return false;
    if (max !== undefined && value.length > max) return false;
    return true;
  }
  
  /**
   * Validate number is within range
   * 
   * @param value - Number value
   * @param min - Minimum value
   * @param max - Maximum value
   * @returns True if within range
   */
  static isNumberInRange(value: number, min?: number, max?: number): boolean {
    if (min !== undefined && value < min) return false;
    if (max !== undefined && value > max) return false;
    return true;
  }
  
  /**
   * Validate currency amount
   * 
   * @param amount - Amount
   * @returns True if valid currency amount
   */
  static isValidCurrencyAmount(amount: number): boolean {
    return amount >= 0 && Number.isFinite(amount);
  }
}

/**
 * Case data validator
 */
export class CaseValidator {
  /**
   * Validate case reference number format
   * 
   * @param reference - Case reference
   * @returns True if valid
   */
  static isValidCaseReference(reference: string): boolean {
    // Example format: CASE-2024-001234
    const refRegex = /^CASE-\d{4}-\d{6}$/;
    return refRegex.test(reference);
  }
  
  /**
   * Validate arrears amount
   * 
   * @param amount - Arrears amount
   * @returns Validation result
   */
  static validateArrearsAmount(amount: number): ValidationResult {
    const errors: ValidationError[] = [];
    
    if (amount < 0) {
      errors.push({
        field: 'arrearsAmount',
        message: 'Arrears amount cannot be negative',
        code: 'INVALID_AMOUNT',
      });
    }
    
    if (!Number.isFinite(amount)) {
      errors.push({
        field: 'arrearsAmount',
        message: 'Arrears amount must be a valid number',
        code: 'INVALID_NUMBER',
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
  
  /**
   * Validate case timeline
   * 
   * @param openedDate - Case opened date
   * @param targetResolutionDate - Target resolution date
   * @returns Validation result
   */
  static validateTimeline(
    openedDate: string,
    targetResolutionDate?: string
  ): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    if (!Validator.isValidDate(openedDate)) {
      errors.push({
        field: 'openedDate',
        message: 'Invalid opened date format',
        code: 'INVALID_DATE',
      });
    }
    
    if (targetResolutionDate) {
      if (!Validator.isValidDate(targetResolutionDate)) {
        errors.push({
          field: 'targetResolutionDate',
          message: 'Invalid target resolution date format',
          code: 'INVALID_DATE',
        });
      } else {
        const opened = new Date(openedDate);
        const target = new Date(targetResolutionDate);
        
        if (target <= opened) {
          errors.push({
            field: 'targetResolutionDate',
            message: 'Target resolution date must be after opened date',
            code: 'INVALID_DATE_RANGE',
          });
        }
        
        // Warning if target date is in the past
        if (target < new Date()) {
          warnings.push({
            field: 'targetResolutionDate',
            message: 'Target resolution date is in the past',
            code: 'PAST_TARGET_DATE',
          });
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

/**
 * User data validator
 */
export class UserValidator {
  /**
   * Validate user data
   * 
   * @param userData - User data to validate
   * @returns Validation result
   */
  static validate(userData: {
    fullName: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    nationalInsuranceNumber?: string;
  }): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    // Validate required fields
    if (!Validator.isRequired(userData.fullName)) {
      errors.push({
        field: 'fullName',
        message: 'Full name is required',
        code: 'REQUIRED_FIELD',
      });
    } else if (!Validator.isLengthInRange(userData.fullName, 2, 100)) {
      errors.push({
        field: 'fullName',
        message: 'Full name must be between 2 and 100 characters',
        code: 'INVALID_LENGTH',
      });
    }
    
    // Validate email
    if (!Validator.isRequired(userData.email)) {
      errors.push({
        field: 'email',
        message: 'Email is required',
        code: 'REQUIRED_FIELD',
      });
    } else if (!Validator.isValidEmail(userData.email)) {
      errors.push({
        field: 'email',
        message: 'Invalid email format',
        code: 'INVALID_EMAIL',
      });
    }
    
    // Validate phone (if provided)
    if (userData.phone && !Validator.isValidPhone(userData.phone)) {
      errors.push({
        field: 'phone',
        message: 'Invalid phone number format',
        code: 'INVALID_PHONE',
      });
    }
    
    // Validate date of birth (if provided)
    if (userData.dateOfBirth) {
      if (!Validator.isValidDate(userData.dateOfBirth)) {
        errors.push({
          field: 'dateOfBirth',
          message: 'Invalid date of birth format',
          code: 'INVALID_DATE',
        });
      } else if (!Validator.isDateInPast(userData.dateOfBirth)) {
        errors.push({
          field: 'dateOfBirth',
          message: 'Date of birth must be in the past',
          code: 'INVALID_DATE',
        });
      } else {
        // Check age (18+)
        const age = this.calculateAge(userData.dateOfBirth);
        if (age < 18) {
          warnings.push({
            field: 'dateOfBirth',
            message: 'User appears to be under 18',
            code: 'UNDERAGE',
          });
        }
      }
    }
    
    // Validate NINO (if provided)
    if (userData.nationalInsuranceNumber && 
        !Validator.isValidNINO(userData.nationalInsuranceNumber)) {
      errors.push({
        field: 'nationalInsuranceNumber',
        message: 'Invalid National Insurance Number format',
        code: 'INVALID_NINO',
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
  
  /**
   * Calculate age from date of birth
   * 
   * @param dateOfBirth - Date of birth
   * @returns Age in years
   */
  private static calculateAge(dateOfBirth: string): number {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    return age;
  }
}
