'use client';

import { useState } from 'react';
import { Eye } from 'lucide-react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
} from "@codesandbox/sandpack-react";

interface ComponentPreviewProps {
  code: string;
}



export function ComponentPreview({ code }: ComponentPreviewProps) {
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
      <div className="p-8 min-h-100 flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
        {code ? (
          <div className="w-full flex items-center justify-center">
            <SandpackProvider style={{ flexBasis: '100%' }} template="react-ts" options={{
              externalResources: ["https://cdn.tailwindcss.com"],
            }} files={{
              '/App.tsx': code,

            }}>
              <SandpackLayout >
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
