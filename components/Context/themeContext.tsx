import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  appTheme: DefaultTheme,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState(systemTheme || 'light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const appTheme = theme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, appTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
