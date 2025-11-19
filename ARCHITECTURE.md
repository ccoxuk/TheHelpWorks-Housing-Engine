# Housing Engine Architecture Documentation

## Overview

This document provides comprehensive documentation of the Housing Engine architecture, designed to deliver both strategic and operational outputs for housing assistance cases.

## Architecture Principles

The architecture is built on the following core principles:

1. **User-Centricity**: All features and workflows are designed with the end user in mind
2. **Simplicity**: Clear, intuitive interfaces and logical flow
3. **GDPR Compliance**: Privacy-first design with built-in consent management
4. **Flexibility**: Modular architecture allowing easy extension and customization
5. **Dynamism**: Adaptive workflows that respond to user inputs
6. **AI-Awareness**: Rich metadata and stable anchors for AI integration

## System Architecture

### Core Components

```
src/
├── types/              # TypeScript type definitions
│   ├── metadata.ts     # Metadata and audit types
│   ├── domain.ts       # Domain models (User, Case, etc.)
│   ├── workflow.ts     # Workflow and question types
│   ├── report.ts       # Report generation types
│   └── index.ts        # Type exports
│
├── services/           # Business logic services
│   ├── WorkflowEngine.ts    # Dynamic workflow execution
│   ├── ReportGenerator.ts   # Report generation
│   └── index.ts             # Service exports
│
├── workflows/          # Workflow definitions
│   ├── rentArrearsAssessment.ts  # Example workflow
│   └── index.ts                   # Workflow exports
│
├── utils/              # Utility functions
│   ├── privacy.ts      # GDPR and privacy utilities
│   ├── validation.ts   # Data validation
│   └── index.ts        # Utility exports
│
├── config/             # Configuration
│   └── index.ts        # App configuration
│
└── data/               # Sample and reference data
    └── samples.ts      # Sample data for testing

```

## Key Features

### 1. Modular Type System

The type system provides:
- **Metadata tracking**: Full audit trail for all entities
- **Domain models**: User, Case, Assessment, Recommendation
- **Workflow definitions**: Dynamic, conditional question flows
- **Report templates**: Multiple report types with flexible formatting

### 2. Workflow Engine

**Location**: `src/services/WorkflowEngine.ts`

The workflow engine enables:
- Dynamic question branching based on user responses
- Conditional logic (show/hide/jump based on answers)
- Multiple question types (choice, text, number, date, currency, etc.)
- Session state management
- Progress tracking
- Save and resume capability

**Example Usage**:
```typescript
import { WorkflowEngine } from './services';
import { rentArrearsAssessmentWorkflow } from './workflows';

// Create a new session
const session: WorkflowSession = {
  sessionId: 'session-001',
  workflowId: 'rent-arrears-assessment',
  userId: 'user-001',
  currentQuestionId: 'q1-arrears-amount',
  responses: [],
  questionsShown: [],
  questionsSkipped: [],
  status: 'in_progress',
  completionPercentage: 0,
  // ... other fields
};

// Initialize engine
const engine = new WorkflowEngine(rentArrearsAssessmentWorkflow, session);

// Submit response
const result = engine.submitResponse({
  questionId: 'q1-arrears-amount',
  response: 3600.00,
  // ... metadata
});

// Get next question
const nextQuestion = engine.getCurrentQuestion();
```

### 3. Report Generator

**Location**: `src/services/ReportGenerator.ts`

The report generator creates:
- **Case Summary Reports**: Comprehensive overview of a case
- **Action Plan Reports**: Detailed recommendations with timelines
- **Progress Reports**: Tracking case progress over time
- **Timeline Reports**: Visual timeline of events and deadlines

Supports multiple output formats:
- PDF (for professional distribution)
- HTML (for web viewing)
- Markdown (for documentation)
- JSON (for data exchange)

**Example Usage**:
```typescript
import { ReportGenerator } from './services';

const generator = new ReportGenerator();

// Generate case summary
const report = generator.generateCaseSummary(
  caseData,
  assessment,
  'pdf'
);

// Export to HTML
const html = generator.exportReport(report, 'html');
```

### 4. GDPR Compliance

**Location**: `src/utils/privacy.ts`

Privacy utilities include:
- **Consent Management**: Record and track user consent
- **Data Anonymization**: Anonymize user and case data
- **Retention Policies**: Automatic data retention management
- **Data Masking**: Mask sensitive information
- **Compliance Validation**: Ensure GDPR compliance

**Example Usage**:
```typescript
import { PrivacyManager, DataMasker } from './utils';

const privacyManager = new PrivacyManager();

// Record consent
privacyManager.recordConsent(
  'user-001',
  'housing-assistance',
  true,
  'explicit'
);

// Check consent
const hasConsent = privacyManager.hasConsent('user-001', 'housing-assistance');

// Anonymize data
const anonymizedUser = privacyManager.anonymizeUser(userData);

// Mask email
const masked = DataMasker.maskEmail('john.smith@example.com');
// Returns: j***h@example.com
```

### 5. Validation System

**Location**: `src/utils/validation.ts`

Comprehensive validation for:
- Email addresses
- Phone numbers (UK format)
- Postcodes (UK format)
- National Insurance Numbers
- Dates and date ranges
- Currency amounts
- User data
- Case data

**Example Usage**:
```typescript
import { UserValidator, Validator } from './utils';

// Validate user data
const result = UserValidator.validate({
  fullName: 'John Smith',
  email: 'john@example.com',
  phone: '07700900123',
});

if (!result.isValid) {
  console.error('Validation errors:', result.errors);
}

// Validate email
if (!Validator.isValidEmail(email)) {
  console.error('Invalid email');
}
```

## AI-Awareness Features

The architecture includes several features designed for AI integration:

### 1. Rich Metadata

Every entity includes comprehensive metadata:
```typescript
{
  id: string;              // Stable anchor for AI references
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
  tags?: string[];         // Categorization for AI search
  notes?: string;          // Additional context
}
```

### 2. AI Context Annotations

JSDoc comments throughout the codebase include:
- `@ai-context`: Describes the purpose and usage for AI
- `@gdpr-relevant`: Flags GDPR-sensitive components
- `@litigation-grade`: Identifies components requiring audit trails

### 3. Stable Naming Conventions

- Consistent naming across the codebase
- Descriptive identifiers (e.g., 'rent-arrears-assessment' not 'raa')
- Cross-references using stable IDs

### 4. Workflow AI Integration Points

Workflows include:
- `aiContext` fields on questions
- `confidenceScore` for AI-generated content
- `aiConfidence` in reports
- Support for auto-fill with `isAutoFilled` flag

## Workflow System

### Creating a New Workflow

1. Define the workflow structure:

```typescript
import type { Workflow } from '../types';

export const myWorkflow: Workflow = {
  metadata: { /* ... */ },
  workflowId: 'my-workflow-id',
  name: 'My Workflow',
  description: 'Description of workflow',
  version: '1.0.0',
  category: 'category-name',
  estimatedDuration: 15,
  allowSaveAndResume: true,
  startQuestionId: 'q1',
  questions: [
    {
      questionId: 'q1',
      questionText: 'Question text?',
      questionType: 'single_choice',
      options: [/* ... */],
      isRequired: true,
      order: 1,
      // ... other fields
    },
    // More questions...
  ],
};
```

2. Add conditional logic:

```typescript
{
  questionId: 'q2',
  // ...
  conditionalLogic: [
    {
      dependsOn: 'q1',
      operator: 'equals',
      value: 'yes',
      action: 'show',
    },
  ],
}
```

3. Export the workflow:

```typescript
// In workflows/index.ts
export { myWorkflow } from './myWorkflow';
```

### Question Types

- `single_choice`: Radio buttons
- `multiple_choice`: Checkboxes
- `text`: Free text input
- `number`: Numeric input
- `date`: Date picker
- `currency`: Currency amount
- `yes_no`: Boolean yes/no
- `scale`: Rating scale
- `file_upload`: File attachment

### Conditional Logic Operators

- `equals`: Response equals value
- `not_equals`: Response does not equal value
- `contains`: Response contains value
- `greater_than`: Response is greater than value
- `less_than`: Response is less than value
- `in`: Response is in array of values
- `not_in`: Response is not in array of values

### Actions

- `show`: Show question when condition is met
- `hide`: Hide question when condition is met
- `skip`: Skip question when condition is met
- `jump_to`: Jump to specific question
- `end_workflow`: End workflow

## Report System

### Report Types

1. **Case Summary Report**: Comprehensive case overview
   - Case details
   - Assessment summary
   - Key facts
   - Risk indicators
   - Timeline snapshot
   - Support summary

2. **Action Plan Report**: Actionable recommendations
   - Strategic goals
   - Immediate actions (next 7 days)
   - Short-term actions (next 30 days)
   - Long-term actions (beyond 30 days)
   - Success criteria
   - Resources

3. **Progress Report**: Progress tracking
   - Completed actions
   - In-progress actions
   - Upcoming actions
   - Challenges
   - Achievements

4. **Timeline Report**: Visual timeline
   - Timeline events
   - Critical deadlines
   - Projected timeline

### Output Formats

- **PDF**: Professional documents for printing/sharing
- **HTML**: Web-based viewing
- **Markdown**: Documentation and notes
- **JSON**: Data exchange and API integration

## Configuration System

**Location**: `src/config/index.ts`

The configuration system provides:
- Environment-specific settings
- Feature flags
- Privacy and GDPR settings
- Workflow settings
- Report settings
- AI settings
- Security settings

**Example**:
```typescript
import { defaultConfig, getConfig, mergeConfig } from './config';

// Get specific config value
const retentionPeriod = getConfig<number>('privacy.defaultRetentionPeriod');

// Merge with overrides
const customConfig = mergeConfig({
  ai: {
    enabled: true,
    confidenceThreshold: 80,
  },
});
```

## Security and Compliance

### GDPR Compliance

- **Consent Management**: Track and manage user consent
- **Data Minimization**: Collect only necessary data
- **Right to Erasure**: Support data deletion
- **Data Portability**: Export data in standard formats
- **Privacy by Design**: Privacy built into architecture
- **Audit Trails**: Complete logging of data access

### Data Retention

Default retention periods:
- User data: 365 days
- Case data: 730 days (2 years for legal purposes)
- Audit logs: 730 days

### Audit Logging

Every operation is logged with:
- Action type (create, read, update, delete)
- User ID
- Timestamp
- IP address
- Changes made
- Result

## Extensibility

### Adding New Question Types

1. Add type to `QuestionType` enum
2. Implement validation logic in `WorkflowEngine.validateResponse()`
3. Update UI components to render new type

### Adding New Report Types

1. Define interface extending `Report`
2. Add type to `ReportType` enum
3. Implement generation method in `ReportGenerator`
4. Add export format support

### Adding New Workflows

1. Create workflow definition file
2. Export from `workflows/index.ts`
3. Add to enabled workflows in config

## Best Practices

1. **Always use TypeScript types**: Ensure type safety throughout
2. **Include metadata**: All entities should have complete metadata
3. **Document with JSDoc**: Include AI-context annotations
4. **Validate data**: Use validation utilities before processing
5. **Check GDPR compliance**: Ensure privacy requirements are met
6. **Log operations**: Maintain audit trail for all actions
7. **Handle errors gracefully**: Provide clear error messages
8. **Test workflows**: Verify all conditional paths work correctly

## Future Enhancements

Potential areas for expansion:
- Integration with external APIs (benefits systems, legal databases)
- Machine learning for risk assessment
- Multi-language support
- Mobile applications
- Real-time collaboration
- Advanced analytics dashboard
- Document scanning and OCR
- Automated reminder system

## Support and Maintenance

For questions or issues:
1. Check this documentation
2. Review code comments and JSDoc annotations
3. Examine sample data in `src/data/samples.ts`
4. Test with provided workflows

## License

See [LICENSE](../LICENSE) file for details.
