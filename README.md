# TheHelpWorks-Housing-Engine

Providing assistance and creating ownership for those at risk of losing their home.

## Overview

This is a comprehensive React-based web application built with TypeScript, Vite, and styled-components. It provides a modular, extensible architecture for housing assistance case management with a focus on user-centricity, GDPR compliance, and AI-awareness.

## Key Features

- **Dynamic Workflow Engine**: Adaptive pathways based on user responses with conditional logic
- **Professional Report Generation**: Multiple report types (case summaries, action plans, timelines) in various formats
- **GDPR-Compliant Privacy Management**: Built-in consent tracking, data anonymization, and retention policies
- **Comprehensive Type System**: Full TypeScript type safety with litigation-grade audit trails
- **AI-Aware Architecture**: Rich metadata and stable anchors for seamless AI integration
- **Modular Design**: Extensible components, services, and utilities

## Architecture

The application is built on a modular architecture with clear separation of concerns:

```
src/
├── types/          # TypeScript type definitions
├── services/       # Business logic (WorkflowEngine, ReportGenerator)
├── workflows/      # Workflow definitions with conditional logic
├── utils/          # Privacy, validation utilities
├── config/         # Application configuration
├── data/           # Sample and reference data
└── components/     # React UI components
```

For detailed architecture documentation, see [ARCHITECTURE.md](ARCHITECTURE.md).

## Core Components

### Workflow Engine
Dynamic question-and-answer system with:
- 9 question types (single choice, multiple choice, text, number, date, currency, yes/no, scale, file upload)
- Conditional branching logic
- Session state management
- Progress tracking
- Save and resume capability

### Report Generator
Professional document generation supporting:
- Case Summary Reports
- Action Plan Reports with timelines
- Progress Reports
- Timeline Reports with milestones
- Multiple formats: PDF, HTML, Markdown, JSON

### Privacy Manager
GDPR-compliant utilities including:
- Consent management and tracking
- Data anonymization and masking
- Retention policy enforcement
- Audit logging

## Features

- **Custom React Hooks**: Reusable hooks for button handling and drawer state management
- **Styled Components**: Extensible, themeable components using styled-components
- **TypeScript**: Full type safety throughout the application
- **Modern Build Tools**: Fast development with Vite
- **GDPR Compliance**: Privacy-first design with built-in data protection
- **Validation System**: Comprehensive data validation for UK formats (email, phone, postcode, NI number)

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173/`

### Building for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

### Linting

```bash
# Run ESLint
npm run lint
```

## Architecture

### Custom Hooks

#### `useButtonHandler()`

A custom hook for managing button interactions with loading states and event handling.

```tsx
import { useButtonHandler } from './hooks';

const { isLoading, isDisabled, handleClick, disable, enable } = useButtonHandler();
```

**Returns:**
- `isLoading`: Boolean indicating if an async action is in progress
- `isDisabled`: Boolean indicating if the button is disabled
- `handleClick`: Function to handle button clicks with async support
- `disable`: Function to manually disable the button
- `enable`: Function to manually enable the button

#### `useDrawer(initialState?)`

A custom hook for managing drawer/modal state and interactions.

```tsx
import { useDrawer } from './hooks';

const { isOpen, open, close, toggle } = useDrawer();
```

**Parameters:**
- `initialState`: Optional boolean, defaults to `false`

**Returns:**
- `isOpen`: Boolean indicating drawer state
- `open`: Function to open the drawer
- `close`: Function to close the drawer
- `toggle`: Function to toggle drawer state

### Core Services

#### WorkflowEngine

Manages dynamic user pathways through conditional question flows.

```tsx
import { WorkflowEngine } from './services';
import { rentArrearsAssessmentWorkflow } from './workflows';

const engine = new WorkflowEngine(workflow, session);
const result = engine.submitResponse(response);
const nextQuestion = engine.getCurrentQuestion();
```

#### ReportGenerator

Creates professional reports in multiple formats.

```tsx
import { ReportGenerator } from './services';

const generator = new ReportGenerator();
const report = generator.generateCaseSummary(caseData, assessment, 'pdf');
const html = generator.exportReport(report, 'html');
```

#### PrivacyManager

Handles GDPR compliance and data protection.

```tsx
import { PrivacyManager } from './utils';

const privacyManager = new PrivacyManager();
privacyManager.recordConsent(userId, purpose, true);
const anonymized = privacyManager.anonymizeUser(userData);
```

### UI Components

#### `Button`

An extensible button component with built-in loading states and event handling.

```tsx
import { Button } from './components';

<Button onClick={handleClick} variant="primary">
  Click Me
</Button>
```

**Props:**
- `onClick`: Optional async function to execute on click
- `variant`: 'primary' | 'secondary'
- `children`: Button content

#### `Drawer`

A slide-out drawer component with customizable position and content.

```tsx
import { Drawer } from './components';

<Drawer title="Menu" position="right">
  <div>Drawer content here</div>
</Drawer>
```

**Props:**
- `title`: Drawer header title
- `position`: 'left' | 'right' (default: 'right')
- `children`: Drawer content

### Styled Components

All styled components are extensible and can be customized:

```tsx
import { StyledButton, DrawerContainer } from './components/styled';
import styled from 'styled-components';

// Extend the base button
const CustomButton = styled(StyledButton)`
  background-color: green;
  font-size: 18px;
`;

// Extend the drawer container
const WideDrawer = styled(DrawerContainer)`
  width: 500px;
`;
```

**Available Styled Components:**
- `StyledButton`: Extensible button with variant support
- `DrawerOverlay`: Semi-transparent overlay for drawer
- `DrawerContainer`: Sliding drawer container
- `DrawerHeader`: Header section for drawer
- `DrawerContent`: Content area for drawer

## Technology Stack

- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and dev server
- **styled-components**: CSS-in-JS styling
- **ESLint**: Code linting

## Project Structure

```
TheHelpWorks-Housing-Engine/
├── src/
│   ├── components/         # React UI components
│   │   ├── Button.tsx
│   │   ├── Drawer.tsx
│   │   ├── styled.ts
│   │   └── index.ts
│   ├── hooks/              # Custom React hooks
│   │   └── index.ts
│   ├── services/           # Business logic services
│   │   ├── WorkflowEngine.ts
│   │   ├── ReportGenerator.ts
│   │   └── index.ts
│   ├── workflows/          # Workflow definitions
│   │   ├── rentArrearsAssessment.ts
│   │   └── index.ts
│   ├── types/              # TypeScript type definitions
│   │   ├── metadata.ts
│   │   ├── domain.ts
│   │   ├── workflow.ts
│   │   ├── report.ts
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   ├── privacy.ts
│   │   ├── validation.ts
│   │   └── index.ts
│   ├── config/             # Application configuration
│   │   └── index.ts
│   ├── data/               # Sample data
│   │   └── samples.ts
│   ├── App.tsx             # Main application
│   ├── main.tsx            # Application entry point
│   └── vite-env.d.ts       # Vite types
├── ARCHITECTURE.md         # Detailed architecture documentation
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite config
└── .eslintrc.cjs           # ESLint config
```

## Usage Examples

### Creating a Workflow Session

```tsx
import { WorkflowEngine } from './services';
import { rentArrearsAssessmentWorkflow } from './workflows';

const session = {
  sessionId: 'session-001',
  workflowId: 'rent-arrears-assessment',
  userId: 'user-001',
  currentQuestionId: 'q1-arrears-amount',
  responses: [],
  status: 'in_progress',
  // ... other fields
};

const engine = new WorkflowEngine(rentArrearsAssessmentWorkflow, session);
```

### Generating a Report

```tsx
import { ReportGenerator } from './services';
import { sampleCase, sampleAssessment } from './data/samples';

const generator = new ReportGenerator();
const report = generator.generateCaseSummary(
  sampleCase,
  sampleAssessment,
  'html'
);
```

### Managing Privacy

```tsx
import { PrivacyManager, DataMasker } from './utils';

const privacyManager = new PrivacyManager();

// Record consent
privacyManager.recordConsent('user-001', 'housing-assistance', true);

// Mask sensitive data
const masked = DataMasker.maskEmail('john.smith@example.com');
// Returns: j***h@example.com
```

## GDPR Compliance

The application includes built-in GDPR compliance features:

- **Consent Management**: Track and manage user consent for data processing
- **Data Anonymization**: Anonymize personal data when required
- **Data Masking**: Mask sensitive information in displays
- **Retention Policies**: Automatic data retention management
- **Right to Erasure**: Support for data deletion requests
- **Audit Logging**: Complete audit trail of data operations

## Extensibility

The architecture is designed for easy extension:

- **Add New Workflows**: Create workflow definitions in `src/workflows/`
- **Add New Question Types**: Extend the workflow engine
- **Add New Report Types**: Extend the report generator
- **Add New Validators**: Add to `src/utils/validation.ts`

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed guidance.

## Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - Comprehensive architecture documentation
- Inline JSDoc comments throughout the codebase
- AI-context annotations for AI-assisted development
- Sample data in `src/data/samples.ts`

## Contributing

This project uses standard React and TypeScript best practices. When contributing:

1. Ensure all code passes linting: `npm run lint`
2. Test builds successfully: `npm run build`
3. Follow the existing code style and component patterns
4. Use TypeScript types for all props and function signatures

## License

See [LICENSE](LICENSE) file for details.

