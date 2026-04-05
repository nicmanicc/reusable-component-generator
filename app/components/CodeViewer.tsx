'use client';

import { useEffect, useState } from 'react';
import { Code, Copy, Check, Save } from 'lucide-react';
import {
  useActiveCode,
  SandpackLayout,
  SandpackCodeEditor,
} from '@codesandbox/sandpack-react';
import Header from './Header';

interface CodeViewerProps {
  onCodeChanged: (code: string) => void;
  handleSave: () => void;
  setMessageInput: (message: string) => void;
  messageInput: string;
  messageInputError?: boolean;
  saved: boolean;
}

export function CodeViewer({
  onCodeChanged,
  handleSave,
  setMessageInput,
  messageInput,
  messageInputError,
  saved,
}: CodeViewerProps) {
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
    <div className="bg-parchment border border-rule overflow-hidden my-4">
      {/* Header */}
      <Header title="Generated Code" icon={Code}>
        <div className="flex gap-4 items-center">
          <input
            onChange={(e) => setMessageInput(e.target.value)}
            value={messageInput}
            type="text"
            name="promptMessage"
            placeholder="Save message"
            className={`border px-3 py-1.5 text-[0.72rem] font-dm-mono bg-parchment text-ink focus:outline-none focus:border-teal transition-colors ${messageInputError ? 'border-red-500' : 'border-rule'}`}
          />
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-ink text-parchment font-dm-mono text-[0.65rem] tracking-widest uppercase hover:bg-teal hover:text-ink transition-all cursor-pointer border-none"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saved ? 'Saved!' : 'Save'}</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-1.5 border border-rule font-dm-mono text-[0.65rem] tracking-widest uppercase text-mid hover:border-teal hover:text-ink transition-all cursor-pointer bg-transparent"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </Header>

      {/* Code Display */}
      <div className="relative">
        <SandpackLayout>
          <SandpackCodeEditor showLineNumbers />
        </SandpackLayout>
      </div>
    </div>
  );
}
