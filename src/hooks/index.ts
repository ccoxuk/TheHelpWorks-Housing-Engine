import { useState, useCallback } from 'react';

/**
 * Custom hook for managing button interactions with event handling
 * Provides extensible button state management
 */
export const useButtonHandler = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleClick = useCallback(async (onClick?: () => void | Promise<void>) => {
    if (isDisabled || isLoading) return;

    setIsLoading(true);
    try {
      if (onClick) {
        await onClick();
      }
    } finally {
      setIsLoading(false);
    }
  }, [isDisabled, isLoading]);

  const disable = useCallback(() => setIsDisabled(true), []);
  const enable = useCallback(() => setIsDisabled(false), []);

  return {
    isLoading,
    isDisabled,
    handleClick,
    disable,
    enable,
  };
};

/**
 * Custom hook for managing drawer state and interactions
 */
export const useDrawer = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
};
