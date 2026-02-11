import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react"
import { useTheme } from "next-themes";

export default function ToggleThemeButton() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false)

  const toggleDarkMode = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDarkMode = theme === "dark";

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}