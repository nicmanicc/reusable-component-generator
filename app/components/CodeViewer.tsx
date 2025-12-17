'use client';

import { useState } from 'react';
import { Code, Copy, Check } from 'lucide-react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
} from "@codesandbox/sandpack-react";

interface CodeViewerProps {
  code: string;
}

export function CodeViewer({ code }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl my-6 shadow-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-slate-600" />
          <h3 className="text-slate-900">Generated Code</h3>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Display */}
      <div className="relative">
        <SandpackLayout >
          <SandpackCodeEditor />
        </SandpackLayout>
      </div>
    </div>
  );
}
