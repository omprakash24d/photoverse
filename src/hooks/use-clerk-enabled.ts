'use client';
import * as React from 'react';
import { createContext, useContext, type ReactNode } from 'react';

// This file creates a context and a hook to check if Clerk is enabled.
// This is necessary to avoid crashing the app if Clerk keys are not set.

const ClerkEnabledContext = createContext<boolean>(false);

export function ClerkEnabledProvider({
  children,
  isEnabled,
}: {
  children: ReactNode;
  isEnabled: boolean;
}) {
  return React.createElement(
    ClerkEnabledContext.Provider,
    { value: isEnabled },
    children
  );
}

export function useIsClerkEnabled() {
  return useContext(ClerkEnabledContext);
}
