'use client';

import { useEffect, useState } from 'react';
import { Code, Copy, Check, Save } from 'lucide-react';
import {
  useActiveCode,
  SandpackLayout,
  SandpackCodeEditor,
} from "@codesandbox/sandpack-react";
interface CodeViewerProps {
  onCodeChanged: (code: string) => void;
  handleSave: () => void;
  setMessageInput: (message: string) => void;
  messageInput: string;
  messageInputError?: boolean;
  saved: boolean;
}

export function CodeViewer({ onCodeChanged, handleSave, setMessageInput, messageInput, messageInputError, saved }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const { code: activeCode } = useActiveCode();

  useEffect(() => {
    onCodeChanged(activeCode);
  }, [activeCode]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(activeCode);
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
        <div className='flex gap-x-6'>
          <input onChange={(e) => setMessageInput(e.target.value)} value={messageInput} type='text' name='promptMessage' placeholder='Message:' className={`rounded-lg border px-3 py-1 text-sm text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 ${messageInputError ? 'border-red-500 dark:border-red-600' : 'border-slate-300 dark:border-slate-600'}`} />
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors text-sm">

            {saved ? <><Save className="w-4 h-4" />
              <span>Saved!</span></> : <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>}
          </button>
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

      </div>

      {/* Code Display */}
      <div className="relative">
        <SandpackLayout >
          <SandpackCodeEditor showLineNumbers />
        </SandpackLayout>
      </div>
    </div>
  );
}
