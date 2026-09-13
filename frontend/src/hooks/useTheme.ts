import { useEffect } from 'react';
import { useUIStore } from '../store/uiStore';

export function useTheme() {
  const { theme, setTheme, toggleTheme } = useUIStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  return { theme, setTheme, toggleTheme, isDark: theme === 'dark' };
}
