import { Eye } from 'lucide-react';
import {
  SandpackLayout,
  SandpackPreview,
} from "@codesandbox/sandpack-react";

interface ComponentPreviewProps {
  code: string;
}

import Header from './Header';

export function ComponentPreview({ code }: ComponentPreviewProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <Header title="Live Preview" icon={Eye} />


      {/* Preview Area */}
      <div className="p-8 min-h-100 flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
        {code ? (
          <div className="w-full flex items-center justify-center">
            <SandpackLayout style={{ flexBasis: '100%' }}  >
              <SandpackPreview />
            </SandpackLayout>
          </div>
        ) : (
          <div className="text-slate-400 dark:text-slate-500">Loading preview...</div>
        )}
      </div>
    </div>
  );
}
