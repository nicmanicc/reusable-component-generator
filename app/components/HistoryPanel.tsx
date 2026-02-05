import { History, RotateCcw, Clock } from 'lucide-react';
import { GeneratedComponent } from '../dashboard/page';

interface HistoryPanelProps {
  history: GeneratedComponent[];
  currentId: string;
  onRevert: (component: GeneratedComponent) => void;
}

export function HistoryPanel({ history, currentId, onRevert }: HistoryPanelProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden sticky top-24 max-h-[calc(100vh-12rem)] flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h3 className="text-slate-900 dark:text-white">History</h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{history.length} generations</p>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto">
        {history.length === 0 ? (
          <div className="p-6 text-center text-slate-500 dark:text-slate-400">
            <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="text-sm">No history yet</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {[...history].reverse().map((item, index) => {
              const isActive = item.id === currentId;
              const reverseIndex = history.length - 1 - index;

              return (
                <div
                  key={item.id}
                  className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-600' : ''
                    }`}
                  onClick={() => onRevert(item)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${isActive
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                        >
                          v{reverseIndex + 1}
                        </span>
                        {isActive && (
                          <span className="text-xs text-indigo-600 dark:text-indigo-400">Current</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-900 dark:text-slate-100 line-clamp-2 mb-1">
                        {item.prompt}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatTime(item.timestamp)}
                      </p>
                    </div>
                    {!isActive && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRevert(item);
                        }}
                        className="shrink-0 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Revert to this version"
                      >
                        <RotateCcw className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
