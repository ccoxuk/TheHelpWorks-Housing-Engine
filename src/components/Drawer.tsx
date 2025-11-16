import React from 'react';
import { useDrawer } from '../hooks';
import { DrawerOverlay, DrawerContainer, DrawerHeader, DrawerContent, StyledButton } from './styled';

interface DrawerProps {
  title?: string;
  position?: 'left' | 'right';
  children?: React.ReactNode;
}

/**
 * Extensible Drawer component with built-in interaction handling
 * Uses custom hooks for state management and styled-components for styling
 */
export const Drawer: React.FC<DrawerProps> = ({ 
  title = 'Drawer',
  position = 'right',
  children 
}) => {
  const { isOpen, close, toggle } = useDrawer();

  return (
    <>
      <StyledButton onClick={toggle}>
        {isOpen ? 'Close' : 'Open'} Drawer
      </StyledButton>

      <DrawerOverlay $isOpen={isOpen} onClick={close} />
      
      <DrawerContainer $isOpen={isOpen} $position={position}>
        <DrawerHeader>
          <h2 style={{ margin: 0, fontSize: '20px' }}>{title}</h2>
          <StyledButton $variant="secondary" onClick={close}>
            Close
          </StyledButton>
        </DrawerHeader>
        
        <DrawerContent>
          {children || <p>Drawer content goes here</p>}
        </DrawerContent>
      </DrawerContainer>
    </>
  );
};
