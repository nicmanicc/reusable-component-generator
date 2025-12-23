'use client';

import { useState, useEffect, useMemo } from 'react';
import { ComponentGenerator } from './components/ComponentGenerator';
import { CodeViewer } from './components/CodeViewer';
import { ComponentPreview } from './components/ComponentPreview';
import { ChatInterface } from './components/ChatInterface';
import { HistoryPanel } from './components/HistoryPanel';
import { Sparkles, Moon, Sun, LogOut } from 'lucide-react';
import {
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import type { SandpackFiles } from '@codesandbox/sandpack-react';
import { generateComponent } from './actions/generateComponent';
import { signout } from '@/lib/auth-actions';
import { createClient } from "@/utils/supabase/client";
export interface GeneratedComponent {
  id: string;
  code: string;
  timestamp: Date;
  prompt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}


export default function App() {
  const [currentComponent, setCurrentComponent] = useState<GeneratedComponent | null>(null);
  const [history, setHistory] = useState<GeneratedComponent[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [updatedCode, setUpdatedCode] = useState<string>('');
  const [refinementSuggestions, setRefinementSuggestions] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      console.log("Fetched user:", user);
    };
    fetchUser();
  }, []);

  const sandpackFiles: SandpackFiles | undefined = useMemo(
    () =>
      currentComponent
        ? { "/App.tsx": currentComponent.code }
        : undefined,
    [currentComponent?.id, currentComponent?.code]
  );

  useEffect(() => {
    // Check for saved dark mode preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('darkMode', 'true');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('darkMode', 'false');
      }
      return newMode;
    });
  };

  const handleGenerate = async (prompt: string, isRefinement: boolean = false) => {
    setIsGenerating(true);

    const userMessage: ChatMessage = {
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMessage]);

    const response = JSON.parse(isRefinement ? await generateComponent(prompt, updatedCode) : await generateComponent(prompt));

    var refinedComponent = response.code;
    var assistantMessage: ChatMessage = {
      role: 'assistant',
      content: isRefinement
        ? `I've updated the component based on your request: "${prompt}"`
        : `I've generated a new component based on your prompt: "${prompt}"`,
      timestamp: new Date(),
    }
    if (!response.changed) {
      assistantMessage = {
        role: 'assistant',
        content: `The requested changes could not be applied. Here's the original component code.`,
        timestamp: new Date(),
      }
    }

    const newComponent: GeneratedComponent = {
      id: Date.now().toString(),
      code: refinedComponent,
      timestamp: new Date(),
      prompt: prompt,
    };


    setRefinementSuggestions(response.actions || []);
    setCurrentComponent(newComponent);
    setHistory(prev => [...prev, newComponent]);
    setChatMessages(prev => [...prev, assistantMessage]);
    setIsGenerating(false);
  };

  const handleRevert = (component: GeneratedComponent) => {
    setCurrentComponent(component);
  };

  const handleClear = () => {
    setCurrentComponent(null);
    setHistory([]);
    setChatMessages([]);
  };

  return (
    <div className="min-h-screen bg-linear-to-br dark:from-slate-900 dark:to-slate-800 from-slate-50 to-slate-100  ">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 shadow-sm">
        <div className="mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-linear-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-slate-900 dark:text-white">AI Component Generator</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Create reusable React components with AI</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <div className="flex items-center gap-3 pl-3 border-l border-slate-300 dark:border-slate-600">
                <div className="text-right">
                  <p className="text-sm text-slate-900 dark:text-white">{user?.name || user?.identities[0].identity_data.full_name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                </div>
                <button
                  onClick={() => signout()}
                  className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
              {history.length > 0 && (
                <button
                  onClick={handleClear}
                  className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        {!currentComponent ? (
          /* Initial State - Prompt Input */
          <div className="max-w-3xl mx-auto">
            <ComponentGenerator
              onGenerate={(prompt) => handleGenerate(prompt, false)}
              isGenerating={isGenerating}
            />
          </div>
        ) : (
          /* Main Workspace - Split View */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - History */}
            <div className="lg:col-span-3">
              <HistoryPanel
                history={history}
                currentId={currentComponent.id}
                onRevert={handleRevert}
              />
            </div>

            {/* Center - Preview & Code */}
            <div className="lg:col-span-6">
              <SandpackProvider template="react-ts" options={{
                externalResources: ["https://cdn.tailwindcss.com"],
              }} files={sandpackFiles} theme={isDarkMode ? "dark" : "light"}>
                <ComponentPreview code={currentComponent.code} />
                <CodeViewer onCodeChanged={setUpdatedCode} />
              </SandpackProvider>

            </div>

            {/* Right Sidebar - Chat Refinement */}
            <div className="lg:col-span-3">
              <ChatInterface
                messages={chatMessages}
                onSendMessage={(message) => handleGenerate(message, true)}
                isGenerating={isGenerating}
                refinementSuggestions={refinementSuggestions}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

