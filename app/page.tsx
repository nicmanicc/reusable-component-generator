'use client';

import { useState } from 'react';
import { ComponentGenerator } from './components/ComponentGenerator';
import { CodeViewer } from './components/CodeViewer';
import { ComponentPreview } from './components/ComponentPreview';
import { ChatInterface } from './components/ChatInterface';
import { HistoryPanel } from './components/HistoryPanel';
import { Sparkles } from 'lucide-react';

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

const mockComponent = `export default function Button({ label = 'Click me', onClick }: { label?: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
    >
      {label}
    </button>
  );
}`

export default function App() {
  const [currentComponent, setCurrentComponent] = useState<GeneratedComponent | null>(null);
  const [history, setHistory] = useState<GeneratedComponent[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (prompt: string, isRefinement: boolean = false) => {
    setIsGenerating(true);

    // Add user message to chat
    const userMessage: ChatMessage = {
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMessage]);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newComponent: GeneratedComponent = {
      id: Date.now().toString(),
      code: mockComponent,
      timestamp: new Date(),
      prompt: prompt,
    };

    // Add assistant message to chat
    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: isRefinement
        ? `I've updated the component based on your request: "${prompt}"`
        : `I've generated a new component based on your prompt: "${prompt}"`,
      timestamp: new Date(),
    };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-slate-900">AI Component Generator</h1>
                <p className="text-sm text-slate-500">Create reusable React components with AI</p>
              </div>
            </div>
            {history.length > 0 && (
              <button
                onClick={handleClear}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Clear All
              </button>
            )}
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
            <div className="lg:col-span-6 space-y-6">
              <ComponentPreview code={currentComponent.code} />
              <CodeViewer code={currentComponent.code} />
            </div>

            {/* Right Sidebar - Chat Refinement */}
            <div className="lg:col-span-3">
              <ChatInterface
                messages={chatMessages}
                onSendMessage={(message) => handleGenerate(message, true)}
                isGenerating={isGenerating}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

