'use client';
import { Sparkles, Moon, Sun } from 'lucide-react';
import { ProcessAnimation } from './components/ProcessAnimation';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LandingPageProps {
  onGetStarted: () => void;

  onToggleDarkMode: () => void;
}

export default function LandingPage({ onGetStarted, onToggleDarkMode }: LandingPageProps) {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors overflow-hidden flex flex-col">
        {/* Header */}
        <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm transition-colors">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-linear-to-br from-indigo-500 to-purple-600 p-1.5 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-lg text-slate-900 dark:text-white">Component Gen</h1>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title={darkMode ? 'Light mode' : 'Dark mode'}
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => router.push('/auth/login')}
                  className="px-5 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white text-sm rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="max-w-7xl w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Hero Content */}
              <div>

                <h2 className="text-4xl lg:text-5xl text-slate-900 dark:text-white mb-4 leading-tight">
                  React Components
                  <span className="block mt-1 bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    From Plain English
                  </span>
                </h2>

                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                  Describe what you want. Preview it live. Refine with chat. Copy production-ready code.
                </p>

                {/* How it works - Inline */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-sm text-indigo-600 dark:text-indigo-400">1</span>
                    </div>
                    <div>
                      <h4 className="text-slate-900 dark:text-white mb-0.5">Describe</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Type what you want in natural language</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-sm text-indigo-600 dark:text-indigo-400">2</span>
                    </div>
                    <div>
                      <h4 className="text-slate-900 dark:text-white mb-0.5">Refine</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Chat with AI to perfect your component</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-sm text-indigo-600 dark:text-indigo-400">3</span>
                    </div>
                    <div>
                      <h4 className="text-slate-900 dark:text-white mb-0.5">Ship</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Copy clean code to your project</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/auth/login')}
                  className="px-8 py-3.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Start Building →
                </button>
              </div>

              {/* Right: Animation */}
              <div>
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
                  <div className="aspect-4/3">
                    <ProcessAnimation darkMode={darkMode} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-colors">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 dark:text-slate-500">
                © 2026 Component Gen
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
                <span>Made for developers</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}