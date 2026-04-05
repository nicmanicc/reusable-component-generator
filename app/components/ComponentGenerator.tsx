'use client';

import { useState } from 'react';

interface ComponentGeneratorProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

export function ComponentGenerator({
  onGenerate,
  isGenerating,
}: ComponentGeneratorProps) {
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
      <div className="space-y-3 py-10">
        <div className="text-[0.6rem] tracking-[0.28em] uppercase text-teal flex items-center gap-2.5 lp-label-line">
          AI Component Generator
        </div>
        <h2 className="font-dm-serif text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.05] font-normal text-ink tracking-[-0.02em]">
          What would you like
          <br />
          <span className="italic text-teal">to build?</span>
        </h2>
        <p className="text-[0.78rem] leading-[1.9] text-mid font-light max-w-lg">
          Describe your component in plain English — AI generates
          production-ready React code with Tailwind styles.
        </p>
      </div>

      {/* Main Input */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Create a button component with a gradient background and loading state..."
            className="w-full px-4 py-3.5 border border-rule bg-parchment text-ink font-dm-mono text-[0.82rem] placeholder:text-mid/40 focus:outline-none focus:border-teal transition-colors resize-none"
            rows={4}
            disabled={isGenerating}
          />
        </div>

        <button
          type="submit"
          disabled={!prompt.trim() || isGenerating}
          className="lp-cta-slide w-full font-dm-mono text-[0.72rem] font-medium tracking-[0.14em] uppercase bg-ink text-parchment px-7.5 py-3.25 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="relative z-1">
            {isGenerating ? 'Generating…' : 'Generate component →'}
          </span>
        </button>
      </form>

      {/* Example Prompts */}
      <div className="space-y-3">
        <p className="text-[0.6rem] tracking-[0.2em] uppercase text-mid">
          Try an example:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              onClick={() => setPrompt(example)}
              disabled={isGenerating}
              className="border border-rule bg-transparent px-4 py-3 text-left text-[0.72rem] font-dm-mono text-mid hover:border-teal hover:text-ink transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-rule bg-rule mt-4">
        <div className="bg-parchment p-5 space-y-1.5">
          <p className="text-[0.58rem] tracking-[0.2em] uppercase text-teal">
            — 01
          </p>
          <p className="font-dm-serif text-[1rem] text-ink">AI-Powered</p>
          <p className="text-[0.65rem] text-mid leading-relaxed">
            Natural language to React components
          </p>
        </div>
        <div className="bg-parchment p-5 space-y-1.5">
          <p className="text-[0.58rem] tracking-[0.2em] uppercase text-teal">
            — 02
          </p>
          <p className="font-dm-serif text-[1rem] text-ink">Live Preview</p>
          <p className="text-[0.65rem] text-mid leading-relaxed">
            See your component instantly
          </p>
        </div>
        <div className="bg-parchment p-5 space-y-1.5">
          <p className="text-[0.58rem] tracking-[0.2em] uppercase text-teal">
            — 03
          </p>
          <p className="font-dm-serif text-[1rem] text-ink">Refine with Chat</p>
          <p className="text-[0.65rem] text-mid leading-relaxed">
            Iterate conversationally
          </p>
        </div>
      </div>
    </div>
  );
}
