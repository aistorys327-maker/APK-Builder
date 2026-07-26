import React from 'react';
import { Play, Loader2, Sparkles, AlertCircle, RefreshCw, GitBranch } from 'lucide-react';
import { BuildStepId } from '../types';

interface BuildButtonProps {
  buildStatus: BuildStepId;
  isDisabled: boolean;
  isGitHubConnected: boolean;
  validationError?: string | null;
  onStartBuild: () => void;
  onCancelBuild: () => void;
}

export const BuildButton: React.FC<BuildButtonProps> = ({
  buildStatus,
  isDisabled,
  isGitHubConnected,
  validationError,
  onStartBuild,
  onCancelBuild,
}) => {
  const isBuilding = buildStatus !== 'idle' && buildStatus !== 'completed' && buildStatus !== 'failed';
  const isCompleted = buildStatus === 'completed';
  const buttonDisabled = isDisabled || !isGitHubConnected;

  return (
    <div className="space-y-3">
      {/* GitHub Connection Notice if not connected */}
      {!isGitHubConnected && !isBuilding && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 rounded-xl text-xs font-medium">
          <GitBranch className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            <strong>GitHub Connection Required:</strong> Connect and verify your repository in Section 4 to enable APK build execution.
          </span>
        </div>
      )}

      {/* Validation Error Banner */}
      {validationError && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-xl text-xs font-medium">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        {isBuilding ? (
          <button
            type="button"
            onClick={onCancelBuild}
            className="w-full py-3.5 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Cancel APK Build...</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onStartBuild}
            disabled={buttonDisabled}
            title={!isGitHubConnected ? 'Please connect GitHub repository to build APK' : ''}
            className={`w-full py-3.5 px-8 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99] ${
              buttonDisabled
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 shadow-none cursor-not-allowed'
                : isCompleted
                ? 'bg-blue-700 hover:bg-blue-800 text-white shadow-blue-700/20 cursor-pointer'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 cursor-pointer'
            }`}
          >
            {isCompleted ? (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Rebuild APK</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Build APK</span>
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
