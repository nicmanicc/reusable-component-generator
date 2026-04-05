'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { ChatMessage } from '../dashboard/page';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isGenerating: boolean;
  refinementSuggestions: string[];
}

export function ChatInterface({
  messages,
  onSendMessage,
  isGenerating,
  refinementSuggestions,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isGenerating) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="bg-parchment border border-rule overflow-hidden flex flex-col h-full sticky top-24">
      {/* Panel header */}
      <div className="px-4 py-3 border-b border-rule flex items-center gap-2">
        <span className="text-[0.58rem] tracking-[0.22em] uppercase text-mid font-medium">
          Refine Component
        </span>
        <span className="text-teal text-[0.55rem] ml-auto animate-ca-blink">
          ●
        </span>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-2.5 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-5 h-5 border border-teal flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-teal text-[0.5rem] font-medium">[/]</span>
              </div>
            )}
            <div
              className={`max-w-[82%] px-3 py-2.5 text-[0.72rem] font-dm-mono leading-[1.7] ${
                message.role === 'user'
                  ? 'bg-ink text-parchment'
                  : 'border border-rule text-ink'
              }`}
            >
              {message.content}
            </div>
            {message.role === 'user' && (
              <div className="w-5 h-5 border border-rule flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-mid text-[0.5rem]">U</span>
              </div>
            )}
          </div>
        ))}

        {refinementSuggestions.length > 0 && (
          <div className="text-center space-y-3 py-6">
            <div className="w-8 h-8 border border-rule flex items-center justify-center mx-auto">
              <span className="text-[0.58rem] text-mid tracking-wide">+</span>
            </div>
            <div className="space-y-2">
              <p className="text-[0.58rem] tracking-[0.18em] uppercase text-mid">
                Quick actions:
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {refinementSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(suggestion)}
                    disabled={isGenerating}
                    className="px-2.5 py-1 border border-rule text-[0.62rem] font-dm-mono text-mid hover:border-teal hover:text-ink transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-transparent cursor-pointer"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-rule bg-parchment">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for changes..."
            className="w-full px-3 py-2.5 border border-rule bg-parchment text-ink font-dm-mono text-[0.75rem] placeholder:text-mid/40 focus:outline-none focus:border-teal transition-colors resize-none"
            rows={3}
            disabled={isGenerating}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="lp-cta-slide font-dm-mono text-[0.65rem] font-medium tracking-[0.14em] uppercase bg-ink text-parchment px-4 py-2.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span className="relative z-1 flex items-center gap-1.5">
              {isGenerating ? (
                'Processing…'
              ) : (
                <>
                  <Send className="w-3 h-3" /> Send
                </>
              )}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
