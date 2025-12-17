'use client';

import { useEffect, useRef, useState } from 'react';
import { Eye, AlertCircle } from 'lucide-react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";

interface ComponentPreviewProps {
  code: string;
}



export function ComponentPreview({ code }: ComponentPreviewProps) {
  const [error, setError] = useState<string | null>(null);


  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-slate-600" />
          <h3 className="text-slate-900">Live Preview</h3>
        </div>
      </div>

      {/* Preview Area */}
      <div className="p-8 min-h-[400px] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        {error ? (
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-red-600">Failed to render component</p>
            <p className="text-sm text-slate-500">{error}</p>
          </div>
        ) : code ? (
          <div className="w-full flex items-center justify-center">
            <SandpackProvider template="react-ts" options={{
              externalResources: ["https://cdn.tailwindcss.com"],
            }} files={{
              '/App.tsx': code,

            }}>
              <SandpackLayout>
                <SandpackPreview />
              </SandpackLayout>
            </SandpackProvider>
          </div>
        ) : (
          <div className="text-slate-400">Loading preview...</div>
        )}
      </div>
    </div>
  );
}
