'use client';

import * as React from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: ResolvedTheme;
  systemTheme: ResolvedTheme;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
  attribute = 'class',
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [systemTheme, setSystemTheme] = React.useState<ResolvedTheme>('light');

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mq.matches ? 'dark' : 'light');
    const handler = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey) as Theme | null;
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setThemeState(stored);
      }
    } catch {}
  }, [storageKey]);

  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme;

  React.useEffect(() => {
    const root = document.documentElement;

    if (disableTransitionOnChange) {
      root.style.setProperty('transition', 'none');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => root.style.removeProperty('transition'));
      });
    }

    if (attribute === 'class') {
      root.classList.remove('light', 'dark');
      root.classList.add(resolvedTheme);
    } else {
      root.setAttribute(attribute, resolvedTheme);
    }
  }, [resolvedTheme, attribute, disableTransitionOnChange]);

  const setTheme = React.useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch {}
    },
    [storageKey],
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme, systemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
