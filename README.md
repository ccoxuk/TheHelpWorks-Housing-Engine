# TheHelpWorks-Housing-Engine

Providing assistance and creating ownership for those at risk of losing their home.

## Overview

This is the Universal Homelessness Support Platform (U-HSP) - a comprehensive, rule-based system for assisting homeless individuals and families. Built with React, TypeScript, Vite, and styled-components, it demonstrates:

- **Rules Engine**: Evaluates legal and policy-based eligibility rules
- **Triage System**: Dynamic decision trees for assessing needs
- **Content Packs**: Localized resources, services, and workflows
- **Action Templates**: Structured guidance for support workers
- **Service Directory**: Comprehensive local service information

## Features

### Core Platform Features

- **Custom React Hooks**: Reusable hooks for button handling and drawer state management
- **Styled Components**: Extensible, themeable components using styled-components
- **TypeScript**: Full type safety throughout the application
- **Modern Build Tools**: Fast development with Vite
- **Rules Engine**: Automated evaluation of eligibility and rights
- **Content Pack System**: Jurisdiction-specific resources and rules
- **Triage Decision Trees**: Structured assessment workflows

### U-HSP Components

#### Rules Engine

The rules engine (`/src/engine`) provides:

- **RuleEvaluator**: Evaluates legal rules against session state
- **ActionExecutor**: Manages execution of assistance actions
- **ContentPackLoader**: Loads and manages jurisdiction-specific content
- **Type Definitions**: Complete TypeScript types for all schemas

#### Schemas

Comprehensive JSON schemas (`/schemas`) define:

- **RightRule**: Legal/policy-based eligibility rules
- **ActionTemplate**: Structured action guidance
- **Service**: Available resources and organizations
- **Question**: Triage decision tree questions
- **SessionState**: User session and case tracking
- **ContentPack**: Complete jurisdiction bundles

#### Content Packs

Example content pack (`/content-packs/london-rough-sleeping.json`) includes:

- 6 services (StreetLink, shelters, outreach teams, day centers)
- 3 rules (Section 188 emergency duty, pet-friendly prioritization, rough sleeping outreach)
- 7 action templates (emergency accommodation, outreach contact, pet services)
- 4 triage questions (homelessness status, location, pets, children)
- Legal references (Housing Act 1996, Homelessness Reduction Act 2017)
- Helplines and resources

#### Documentation

Comprehensive guides (`/docs`):

- **SCHEMAS.md**: Detailed schema documentation with examples
- **TRIAGE_DECISION_TREES.md**: Guidance on designing triage flows
- **CONTENT_PACKS.md**: Creating and managing content packs

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

You'll see:
- Custom button and drawer components
- **U-HSP Rules Engine Demo** showing rule evaluation in action

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

### U-HSP Engine

The core rules engine is located in `/src/engine` and provides:

#### RuleEvaluator

Evaluates legal and policy-based rules against session state:

```typescript
import { ruleEvaluator } from './engine';

// Evaluate a single rule
const matches = ruleEvaluator.evaluateRule(rule, sessionState);

// Evaluate all rules
const matchedRules = ruleEvaluator.evaluateRules(rules, sessionState);

// Get triggered actions
const actionIds = ruleEvaluator.getTriggeredActions(rules, sessionState);
```

**Key Features:**
- Supports complex conditional logic (all/any/none operators)
- Nested condition groups
- Multiple comparison operators (equals, greaterThan, contains, in, exists, etc.)
- Dot-notation path access to session state
- Priority-based rule evaluation

#### ActionExecutor

Manages execution of action templates:

```typescript
import { actionExecutor } from './engine';

// Prepare an action for execution
const prepared = actionExecutor.prepareAction(action, sessionState);

// Execute an action
const result = actionExecutor.executeAction(action, sessionState);

// Execute multiple actions
const results = actionExecutor.executeActions(actions, sessionState);

// Format action steps for display
const formatted = actionExecutor.formatActionSteps(action);
```

**Key Features:**
- Validates required information
- Checks prerequisites
- Prioritizes by urgency
- Formats steps for user display
- Tracks execution results

#### ContentPackLoader

Loads and manages jurisdiction-specific content packs:

```typescript
import { contentPackLoader } from './engine';

// Load a content pack
await contentPackLoader.loadContentPackFromUrl('/content-packs/london-rough-sleeping.json');

// Get components
const rules = contentPackLoader.getRules(packId);
const actions = contentPackLoader.getActions(packId);
const services = contentPackLoader.getServices(packId);
const questions = contentPackLoader.getQuestions(packId);

// Find specific resources
const petFriendlyServices = contentPackLoader.findPetFriendlyServices(packId);
const emergencyServices = contentPackLoader.find24_7Services(packId);
```

**Key Features:**
- Validates content pack structure
- Checks for duplicate IDs
- Validates version format
- Provides convenience methods for finding resources
- Supports multiple loaded packs

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

### Components

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

## U-HSP Usage Examples

### Loading and Using a Content Pack

```typescript
import { contentPackLoader, ruleEvaluator } from './engine';
import type { SessionState } from './engine/types';

// Load the London rough sleeping content pack
await contentPackLoader.loadContentPackFromUrl('/content-packs/london-rough-sleeping.json');
const packId = 'england-wales-london-rough-sleeping';

// Create a session state
const session: SessionState = {
  sessionId: 'sess-001',
  createdAt: new Date().toISOString(),
  status: 'active',
  user: {
    hasChildren: true,
    hasPets: true,
    age: 28
  },
  situation: {
    homelessTonight: true,
    currentLocation: 'Waterloo Station, London'
  },
  legal: {
    rightToReside: true
  }
};

// Evaluate rules
const rules = contentPackLoader.getRules(packId);
const matchedRules = ruleEvaluator.evaluateRules(rules, session);

// Get triggered actions
const actionIds = matchedRules.flatMap(rule => rule.actions);
const actions = actionIds
  .map(id => contentPackLoader.getAction(packId, id))
  .filter(action => action !== undefined);

// Display actions to user
actions.forEach(action => {
  console.log(action.name);
  console.log(action.description);
  console.log(actionExecutor.formatActionSteps(action));
});
```

### Finding Appropriate Services

```typescript
// Find all pet-friendly services
const petServices = contentPackLoader.findPetFriendlyServices(packId);

// Find 24/7 emergency services
const emergencyServices = contentPackLoader.find24_7Services(packId);

// Find services by type
const shelters = contentPackLoader.findServicesByType(packId, 'emergency_shelter');

// Get a specific service
const service = contentPackLoader.getService(packId, 'streetlink_london');
if (service) {
  console.log(`Call ${service.name}: ${service.contact?.phone}`);
}
```

### Evaluating Complex Rules

```typescript
// Example: Section 188 Emergency Duty
const rule = {
  id: 'section_188_emergency_duty',
  name: 'Section 188 Emergency Accommodation Duty',
  legalBasis: 'Housing Act 1996 Section 188',
  conditions: {
    type: 'all',
    rules: [
      { field: 'situation.homelessTonight', operator: 'equals', value: true },
      { field: 'legal.rightToReside', operator: 'equals', value: true }
    ],
    nested: [{
      type: 'any',
      rules: [
        { field: 'user.hasChildren', operator: 'equals', value: true },
        { field: 'user.isPregnant', operator: 'equals', value: true },
        { field: 'user.age', operator: 'lessThan', value: 18 }
      ]
    }]
  },
  actions: ['emergency_accommodation_assessment']
};

const matches = ruleEvaluator.evaluateRule(rule, session);
// Returns true if homeless tonight, eligible, AND (has children OR pregnant OR under 18)
```

## Repository Structure

```
TheHelpWorks-Housing-Engine/
├── src/
│   ├── components/
│   │   ├── Button.tsx              # Button component
│   │   ├── Drawer.tsx              # Drawer component
│   │   ├── EngineDemo.tsx          # U-HSP engine demo
│   │   ├── styled.ts               # Extensible styled components
│   │   └── index.ts                # Component exports
│   ├── engine/
│   │   ├── types.ts                # TypeScript type definitions
│   │   ├── RuleEvaluator.ts        # Rule evaluation engine
│   │   ├── ActionExecutor.ts       # Action execution engine
│   │   ├── ContentPackLoader.ts    # Content pack management
│   │   └── index.ts                # Engine exports
│   ├── hooks/
│   │   └── index.ts                # Custom hooks
│   ├── App.tsx                     # Main application
│   ├── main.tsx                    # Application entry point
│   └── vite-env.d.ts              # Vite types
├── schemas/
│   ├── RightRule.json              # Rule schema
│   ├── ActionTemplate.json         # Action template schema
│   ├── Service.json                # Service schema
│   ├── Question.json               # Question schema
│   ├── SessionState.json           # Session state schema
│   └── ContentPack.json            # Content pack schema
├── content-packs/
│   └── london-rough-sleeping.json  # London example content pack
├── examples/
│   └── waterloo-dog-homeless-tonight-triage.json  # Triage example
├── docs/
│   ├── SCHEMAS.md                  # Schema documentation
│   ├── TRIAGE_DECISION_TREES.md    # Triage flow guide
│   └── CONTENT_PACKS.md            # Content pack guide
├── public/
│   └── content-packs/              # Public content packs
├── index.html                      # HTML template
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript config
├── vite.config.ts                  # Vite config
├── .eslintrc.cjs                   # ESLint config
└── README.md                       # This file
```

## Technology Stack

- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and dev server
- **styled-components**: CSS-in-JS styling
- **ESLint**: Code linting

## Creating Your Own Content Pack

1. **Define your scope**: Geographic area, target population, legal framework

2. **Research services**: Gather information about local resources
   - Emergency shelters
   - Day centers
   - Outreach teams
   - Helplines
   - Support services

3. **Map legal rules**: Identify relevant legislation and policies
   - Homelessness duties
   - Priority need criteria
   - Eligibility requirements

4. **Design triage flow**: Create decision tree questions
   - Safety and urgency first
   - Priority need assessment
   - Service matching

5. **Create action templates**: Define step-by-step guidance
   - Emergency actions
   - Applications
   - Referrals

6. **Package and validate**: Create content pack JSON
   ```json
   {
     "id": "your-content-pack-id",
     "name": "Your Content Pack Name",
     "version": "1.0.0",
     "jurisdiction": "Your Jurisdiction",
     "questions": [...],
     "rules": [...],
     "actions": [...],
     "services": [...]
   }
   ```

7. **Test thoroughly**: Run through scenarios, verify accuracy

See `/docs/CONTENT_PACKS.md` for detailed guidance.

## Examples and Documentation

### Documentation

- **[SCHEMAS.md](docs/SCHEMAS.md)**: Detailed description of all schemas with examples
- **[TRIAGE_DECISION_TREES.md](docs/TRIAGE_DECISION_TREES.md)**: Guide to designing triage flows
- **[CONTENT_PACKS.md](docs/CONTENT_PACKS.md)**: Creating and managing content packs

### Examples

- **[London Rough Sleeping Content Pack](content-packs/london-rough-sleeping.json)**: Complete content pack with services, rules, and actions
- **[Waterloo Triage Example](examples/waterloo-dog-homeless-tonight-triage.json)**: Worked triage scenario with decision tree

### Live Demo

Run `npm run dev` and navigate to the U-HSP Rules Engine Demo section to see:
- Content pack loading
- Rule evaluation
- Action triggering
- Real scenario processing

## Contributing

This project uses standard React and TypeScript best practices. When contributing:

1. Ensure all code passes linting: `npm run lint`
2. Test builds successfully: `npm run build`
3. Follow the existing code style and component patterns
4. Use TypeScript types for all props and function signatures

## License

See [LICENSE](LICENSE) file for details.

