'use client';
import { useEffect, useState } from 'react';
import { Sparkles, Code, Check } from 'lucide-react';

interface ProcessAnimationProps {
  darkMode: boolean;
}

export function ProcessAnimation({ darkMode }: ProcessAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Step 1: Describe Your Component */}
      <div
        className={`absolute inset-0 transition-all duration-700 ${currentStep === 0
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-95 pointer-events-none'
          }`}
      >
        <div className="h-full flex flex-col items-center justify-center gap-6 p-8">
          {/* Browser mockup */}
          <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Browser header */}
            <div className="bg-slate-100 dark:bg-slate-700 px-4 py-3 flex items-center gap-2 border-b border-slate-200 dark:border-slate-600">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">AI Component Generator</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 bg-linear-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-slate-900 dark:text-white">Describe your component</h3>
                </div>

                {/* Animated typing effect */}
                <div className="relative">
                  <div className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900 dark:text-white animate-pulse">
                        Create a button component
                      </span>
                      <span className="w-0.5 h-5 bg-indigo-600 animate-pulse"></span>
                    </div>
                  </div>

                  <button className="mt-4 w-full px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg">
                    Generate Component
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Step indicator */}
          <div className="text-center">
            <p className="text-lg text-indigo-600 dark:text-indigo-400">Step 1: Describe</p>
          </div>
        </div>
      </div>

      {/* Step 2: Preview & Refine */}
      <div
        className={`absolute inset-0 transition-all duration-700 ${currentStep === 1
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-95 pointer-events-none'
          }`}
      >
        <div className="h-full flex flex-col items-center justify-center gap-6 p-8">
          {/* Split view mockup */}
          <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Browser header */}
            <div className="bg-slate-100 dark:bg-slate-700 px-4 py-3 flex items-center gap-2 border-b border-slate-200 dark:border-slate-600">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Component Preview</span>
              </div>
            </div>

            {/* Split content */}
            <div className="grid grid-cols-2 gap-0 bg-slate-50 dark:bg-slate-900">
              {/* Preview side */}
              <div className="p-6 border-r border-slate-200 dark:border-slate-700">
                <h4 className="text-xs text-slate-500 dark:text-slate-400 mb-4">PREVIEW</h4>
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 flex items-center justify-center min-h-30">
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md transform hover:scale-105 transition-transform animate-pulse">
                    Click me
                  </button>
                </div>
              </div>

              {/* Chat side */}
              <div className="p-6">
                <h4 className="text-xs text-slate-500 dark:text-slate-400 mb-4">REFINE</h4>
                <div className="space-y-3">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100 rounded-lg px-3 py-2 text-sm">
                    Make it indigo
                  </div>
                  <div className="bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-sm ml-4">
                    Updated! ✓
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step indicator */}
          <div className="text-center">
            <p className="text-lg text-indigo-600 dark:text-indigo-400">Step 2: Preview & Refine</p>
          </div>
        </div>
      </div>

      {/* Step 3: Copy & Use */}
      <div
        className={`absolute inset-0 transition-all duration-700 ${currentStep === 2
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-95 pointer-events-none'
          }`}
      >
        <div className="h-full flex flex-col items-center justify-center gap-6 p-8">
          {/* Code viewer mockup */}
          <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Browser header */}
            <div className="bg-slate-100 dark:bg-slate-700 px-4 py-3 flex items-center gap-2 border-b border-slate-200 dark:border-slate-600">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Component Code</span>
              </div>
            </div>

            {/* Code content */}
            <div className="p-6 bg-slate-900">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-slate-300">Button.tsx</span>
                </div>
                <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded flex items-center gap-2 transition-colors">
                  <Check className="w-4 h-4" />
                  Copied!
                </button>
              </div>

              {/* Code snippet */}
              <div className="font-mono text-sm space-y-1">
                <div className="text-purple-400">export default function <span className="text-yellow-300">Button</span>() {'{'}</div>
                <div className="text-slate-300 pl-4">return (</div>
                <div className="text-slate-300 pl-8">
                  <span className="text-green-400">&lt;button</span>
                </div>
                <div className="text-slate-300 pl-12">
                  <span className="text-blue-400">className</span>=<span className="text-orange-400">"px-6 py-3..."</span>
                </div>
                <div className="text-slate-300 pl-8">
                  <span className="text-green-400">&gt;</span>
                </div>
                <div className="text-slate-300 pl-12">Click me</div>
                <div className="text-slate-300 pl-8">
                  <span className="text-green-400">&lt;/button&gt;</span>
                </div>
                <div className="text-slate-300 pl-4">)</div>
                <div className="text-purple-400">{'}'}</div>
              </div>
            </div>
          </div>

          {/* Step indicator */}
          <div className="text-center">
            <p className="text-lg text-indigo-600 dark:text-indigo-400">Step 3: Copy & Use</p>
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
        {[0, 1, 2].map((step) => (
          <button
            key={step}
            onClick={() => setCurrentStep(step)}
            className={`w-3 h-3 rounded-full transition-all ${currentStep === step
              ? 'bg-indigo-600 w-8'
              : 'bg-slate-300 dark:bg-slate-600'
              }`}
            aria-label={`Go to step ${step + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
