import {createContext, useContext} from 'react';

type Theme = 'light' | 'dark';

interface ThemeContext {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContext | undefined>(undefined);

export function ThemeProvider({children}: { children: React.ReactNode }) {
  const theme = "dark";

  return (
    <ThemeContext.Provider value={{theme}}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
