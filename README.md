# TheHelpWorks-Housing-Engine

Providing assistance and creating ownership for those at risk of losing their home.

## Overview

This is a React-based web application built with TypeScript, Vite, and styled-components. It demonstrates extensible UI components with custom hooks for managing button interactions and drawer navigation.

## Features

- **Custom React Hooks**: Reusable hooks for button handling and drawer state management
- **Styled Components**: Extensible, themeable components using styled-components
- **TypeScript**: Full type safety throughout the application
- **Modern Build Tools**: Fast development with Vite

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
│   ├── components/
│   │   ├── Button.tsx          # Button component
│   │   ├── Drawer.tsx          # Drawer component
│   │   ├── styled.ts           # Extensible styled components
│   │   └── index.ts            # Component exports
│   ├── hooks/
│   │   └── index.ts            # Custom hooks
│   ├── App.tsx                 # Main application
│   ├── main.tsx                # Application entry point
│   └── vite-env.d.ts          # Vite types
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── tsconfig.json              # TypeScript config
├── vite.config.ts             # Vite config
└── .eslintrc.cjs              # ESLint config
```

## Contributing

This project uses standard React and TypeScript best practices. When contributing:

1. Ensure all code passes linting: `npm run lint`
2. Test builds successfully: `npm run build`
3. Follow the existing code style and component patterns
4. Use TypeScript types for all props and function signatures

## License

See [LICENSE](LICENSE) file for details.

