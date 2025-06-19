// src/components/theme-provider.tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps as NextThemesProviderOriginalProps } from "next-themes/dist/types"

// Define our own ThemeProviderProps that includes children explicitly
interface ThemeProviderProps extends NextThemesProviderOriginalProps {
  children: React.ReactNode;
}

// Re-export useTheme from next-themes for convenience
export { useTheme } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
