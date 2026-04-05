'use client';
import { Sun, Moon } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';

const emptySubscribe = () => () => {};

export default function ToggleThemeButton() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const isDarkMode = theme === 'dark';

  const toggleDarkMode = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleDarkMode}
      className="text-mid hover:text-ink transition-colors bg-transparent border-none cursor-pointer p-0"
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
