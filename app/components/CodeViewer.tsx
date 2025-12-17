'use client';

import { useEffect, useState } from 'react';
import { Code, Copy, Check } from 'lucide-react';
import {
  useActiveCode,
  SandpackLayout,
  SandpackCodeEditor,
} from "@codesandbox/sandpack-react";

interface CodeViewerProps {
  code: string;
  setCurrentComponent: (component: any) => void;
}

export function CodeViewer({ code, setCurrentComponent }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const { code: activeCode } = useActiveCode();

  useEffect(() => {
    setCurrentComponent((prev: any) => ({
      ...prev,
      code: activeCode,
    }));
  }, [activeCode, setCurrentComponent]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl my-6 shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h3 className="text-slate-900 dark:text-white">Generated Code</h3>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors text-sm"
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
