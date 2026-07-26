import React from 'react';
import { BuildHistoryItem } from '../types';
import { History, RotateCcw, Trash2, Calendar, Clock, Package, ExternalLink, Sparkles } from 'lucide-react';

interface BuildHistoryCardProps {
  history: BuildHistoryItem[];
  onReloadHistory: (item: BuildHistoryItem) => void;
  onDeleteHistory: (id: string) => void;
  onClearHistory: () => void;
}

export const BuildHistoryCard: React.FC<BuildHistoryCardProps> = ({
  history,
  onReloadHistory,
  onDeleteHistory,
  onClearHistory,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-700 shrink-0">
            <History className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Build History</h3>
            <p className="text-xs text-slate-500">
              Saved previous build configurations stored in Local Storage ({history.length})
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors px-2 py-1 rounded-lg hover:bg-rose-50"
          >
            Clear All
          </button>
        )}
      </div>

      {/* History List or Empty State */}
      {history.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200/80 space-y-2">
          <div className="w-10 h-10 rounded-full bg-slate-200/60 text-slate-400 mx-auto flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium text-slate-600">No build history yet</p>
          <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
            Build configurations will be automatically saved here whenever you trigger or prepare a build simulation.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 hover:bg-white hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs group"
            >
              {/* Info Column */}
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 truncate">
                    {item.appName || 'Untitled App'}
                  </h4>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-slate-200/80 text-slate-700 shrink-0">
                    v{item.versionName} ({item.versionCode})
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                  <span className="font-mono text-slate-600 truncate max-w-[180px] sm:max-w-[220px]">
                    {item.packageName}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1 text-slate-500">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{item.dateStr}</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1 text-slate-500">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{item.timeStr}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                <button
                  type="button"
                  onClick={() => onReloadHistory(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all active:scale-95"
                  title="Reload this configuration"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reload</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteHistory(item.id)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                  title="Delete from build history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
