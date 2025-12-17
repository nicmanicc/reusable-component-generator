'use client';

import { useState } from 'react';
import { Wand2, Sparkles } from 'lucide-react';

interface ComponentGeneratorProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

export function ComponentGenerator({ onGenerate, isGenerating }: ComponentGeneratorProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt.trim());
      setPrompt('');
    }
  };

  const examplePrompts = [
    'Create a button component with hover effects',
    'Build a card with an image, title, and description',
    'Make a contact form with validation',
    'Design a pricing card with features list',
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Powered by AI</span>
        </div>
        <h2 className="text-slate-900 dark:text-white">What component would you like to create?</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Describe your component in natural language, and AI will generate production-ready React code with Tailwind styles.
        </p>
      </div>

      {/* Main Input */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Create a button component with a gradient background and loading state..."
            className="w-full px-6 py-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none shadow-sm"
            rows={4}
            disabled={isGenerating}
          />
        </div>

        <button
          type="submit"
          disabled={!prompt.trim() || isGenerating}
          className="w-full px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Generating Component...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>Generate Component</span>
            </>
          )}
        </button>
      </form>

      {/* Example Prompts */}
      <div className="space-y-4">
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center">Try one of these examples:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              onClick={() => setPrompt(example)}
              disabled={isGenerating}
              className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors text-left text-sm text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mx-auto">
            <Wand2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-slate-900 dark:text-white">AI-Powered</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Natural language to React components</p>
        </div>
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h3 className="text-slate-900 dark:text-white">Live Preview</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">See your component instantly</p>
        </div>
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 className="text-slate-900 dark:text-white">Refine with Chat</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Iterate conversationally</p>
        </div>
      </div>
    </div>
  );
}
