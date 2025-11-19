/**
 * Application Configuration
 * 
 * @module config
 * @description Central configuration for the Housing Engine application.
 * Provides type-safe configuration with environment-specific overrides.
 * 
 * @ai-context Application configuration and settings
 * @version 1.0.0
 */

/**
 * Application configuration interface
 */
export interface AppConfig {
  /** Application metadata */
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    apiUrl?: string;
  };
  
  /** GDPR and privacy settings */
  privacy: {
    /** Default data retention period in days */
    defaultRetentionPeriod: number;
    
    /** Whether to enable anonymization */
    enableAnonymization: boolean;
    
    /** Whether consent is required */
    requireConsent: boolean;
    
    /** Cookie consent settings */
    cookieConsent: {
      enabled: boolean;
      categories: string[];
    };
    
    /** Data export settings */
    dataExport: {
      enabled: boolean;
      formats: string[];
    };
  };
  
  /** Workflow settings */
  workflows: {
    /** Whether to allow save and resume */
    allowSaveAndResume: boolean;
    
    /** Session timeout in minutes */
    sessionTimeout: number;
    
    /** Auto-save interval in seconds */
    autoSaveInterval: number;
    
    /** Maximum concurrent sessions per user */
    maxConcurrentSessions: number;
  };
  
  /** Report generation settings */
  reports: {
    /** Default report format */
    defaultFormat: string;
    
    /** Available report formats */
    availableFormats: string[];
    
    /** Report template directory */
    templateDirectory?: string;
    
    /** Whether to include watermarks */
    includeWatermarks: boolean;
    
    /** Default watermark text */
    defaultWatermark?: string;
  };
  
  /** AI and automation settings */
  ai: {
    /** Whether AI assistance is enabled */
    enabled: boolean;
    
    /** Minimum confidence threshold for AI suggestions (0-100) */
    confidenceThreshold: number;
    
    /** Whether to enable auto-fill */
    enableAutoFill: boolean;
    
    /** Whether to enable smart recommendations */
    enableSmartRecommendations: boolean;
  };
  
  /** Security settings */
  security: {
    /** Whether to enable audit logging */
    enableAuditLog: boolean;
    
    /** Audit log retention period in days */
    auditLogRetentionDays: number;
    
    /** Whether to encrypt sensitive data */
    encryptSensitiveData: boolean;
    
    /** Session timeout in minutes */
    sessionTimeoutMinutes: number;
  };
  
  /** Feature flags */
  features: {
    /** Available workflow types */
    enabledWorkflows: string[];
    
    /** Available report types */
    enabledReports: string[];
    
    /** Beta features */
    beta: {
      [key: string]: boolean;
    };
  };
}

/**
 * Default configuration
 * 
 * @ai-context Default application settings
 */
export const defaultConfig: AppConfig = {
  app: {
    name: 'TheHelpWorks Housing Engine',
    version: '1.0.0',
    environment: 'development',
  },
  
  privacy: {
    defaultRetentionPeriod: 365, // 1 year
    enableAnonymization: true,
    requireConsent: true,
    cookieConsent: {
      enabled: true,
      categories: ['necessary', 'functional', 'analytics'],
    },
    dataExport: {
      enabled: true,
      formats: ['json', 'pdf'],
    },
  },
  
  workflows: {
    allowSaveAndResume: true,
    sessionTimeout: 30, // 30 minutes
    autoSaveInterval: 60, // 60 seconds
    maxConcurrentSessions: 3,
  },
  
  reports: {
    defaultFormat: 'pdf',
    availableFormats: ['pdf', 'html', 'docx', 'json'],
    includeWatermarks: false,
  },
  
  ai: {
    enabled: true,
    confidenceThreshold: 70,
    enableAutoFill: false,
    enableSmartRecommendations: true,
  },
  
  security: {
    enableAuditLog: true,
    auditLogRetentionDays: 730, // 2 years
    encryptSensitiveData: true,
    sessionTimeoutMinutes: 30,
  },
  
  features: {
    enabledWorkflows: [
      'rent-arrears-assessment',
      'eviction-support',
      'mortgage-arrears',
      'homelessness-prevention',
    ],
    enabledReports: [
      'case_summary',
      'action_plan',
      'progress_report',
      'timeline',
    ],
    beta: {
      aiAssistance: false,
      advancedAnalytics: false,
    },
  },
};

/**
 * Get configuration value with type safety
 * 
 * @param key - Configuration key path (e.g., 'privacy.defaultRetentionPeriod')
 * @param config - Configuration object (defaults to defaultConfig)
 * @returns Configuration value
 */
export function getConfig<T = unknown>(
  key: string,
  config: AppConfig = defaultConfig
): T {
  const keys = key.split('.');
  let value: unknown = config;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      throw new Error(`Configuration key not found: ${key}`);
    }
  }
  
  return value as T;
}

/**
 * Merge configuration with overrides
 * 
 * @param overrides - Configuration overrides
 * @param base - Base configuration (defaults to defaultConfig)
 * @returns Merged configuration
 */
export function mergeConfig(
  overrides: Partial<AppConfig>,
  base: AppConfig = defaultConfig
): AppConfig {
  return {
    ...base,
    ...overrides,
    app: { ...base.app, ...overrides.app },
    privacy: { ...base.privacy, ...overrides.privacy },
    workflows: { ...base.workflows, ...overrides.workflows },
    reports: { ...base.reports, ...overrides.reports },
    ai: { ...base.ai, ...overrides.ai },
    security: { ...base.security, ...overrides.security },
    features: { ...base.features, ...overrides.features },
  };
}
