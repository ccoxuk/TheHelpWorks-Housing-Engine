import styled from 'styled-components';

/**
 * Extensible styled button component
 * Can be extended and customized by consumers
 */
export const StyledButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  background-color: ${props => props.$variant === 'secondary' ? '#6c757d' : '#007bff'};
  color: white;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.$variant === 'secondary' ? '#5a6268' : '#0056b3'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

/**
 * Extensible styled drawer overlay
 */
export const DrawerOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 999;
`;

/**
 * Extensible styled drawer container
 */
export const DrawerContainer = styled.div<{ $isOpen: boolean; $position?: 'left' | 'right' }>`
  position: fixed;
  top: 0;
  ${props => props.$position === 'left' ? 'left: 0' : 'right: 0'};
  bottom: 0;
  width: 300px;
  background-color: white;
  box-shadow: ${props => props.$position === 'left' 
    ? '2px 0 8px rgba(0, 0, 0, 0.15)' 
    : '-2px 0 8px rgba(0, 0, 0, 0.15)'};
  transform: translateX(${props => {
    if (!props.$isOpen) {
      return props.$position === 'left' ? '-100%' : '100%';
    }
    return '0';
  }});
  transition: transform 0.3s ease;
  z-index: 1000;
  overflow-y: auto;
`;

/**
 * Extensible drawer header
 */
export const DrawerHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/**
 * Extensible drawer content area
 */
export const DrawerContent = styled.div`
  padding: 20px;
`;
