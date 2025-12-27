import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Theme type
 */
type Theme = 'light' | 'dark';

/**
 * Theme context type
 */
type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

/**
 * Theme context
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Theme provider props
 */
type ThemeProviderProps = {
  children: ReactNode;
};

/**
 * Detects the system's preferred color scheme
 */
const getSystemTheme = (): Theme => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

/**
 * Theme provider component
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getSystemTheme());

  /**
   * Toggles between light and dark theme
   */
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to use the theme context
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
