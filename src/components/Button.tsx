import React from 'react';
import { useButtonHandler } from '../hooks';
import { StyledButton } from './styled';

interface ButtonProps {
  onClick?: () => void | Promise<void>;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

/**
 * Extensible Button component with built-in handler hook
 * Demonstrates the use of custom button-handler hooks with styled-components
 */
export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children,
  variant = 'primary'
}) => {
  const { isLoading, isDisabled, handleClick } = useButtonHandler();

  return (
    <StyledButton
      variant={variant}
      onClick={() => handleClick(onClick)}
      disabled={isDisabled || isLoading}
    >
      {isLoading ? 'Loading...' : children}
    </StyledButton>
  );
};
