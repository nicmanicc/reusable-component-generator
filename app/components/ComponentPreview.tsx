import { Eye } from 'lucide-react';
import { SandpackLayout, SandpackPreview } from '@codesandbox/sandpack-react';

interface ComponentPreviewProps {
  code: string;
}

import Header from './Header';

export function ComponentPreview({ code }: ComponentPreviewProps) {
  return (
    <div className="bg-parchment border border-rule overflow-hidden">
      {/* Header */}
      <Header title="Live Preview" icon={Eye} />

      {/* Preview Area */}
      <div className="p-6 min-h-100 flex items-center justify-center bg-rule/10">
        {code ? (
          <div className="w-full flex items-center justify-center">
            <SandpackLayout style={{ flexBasis: '100%' }}>
              <SandpackPreview />
            </SandpackLayout>
          </div>
        ) : (
          <div className="text-[0.7rem] font-dm-mono text-mid">
            Loading preview…
          </div>
        )}
      </div>
    </div>
  );
}
