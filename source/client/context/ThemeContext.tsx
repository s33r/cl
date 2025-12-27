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
 * Theme provider component
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

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
