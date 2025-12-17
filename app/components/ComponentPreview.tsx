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
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h3 className="text-slate-900 dark:text-white">Live Preview</h3>
        </div>
      </div>

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
