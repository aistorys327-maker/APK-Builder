import React, { useState } from 'react';
import { BuildState, BuildStepId } from '../types';
import { Cpu, CheckCircle2, Clock, Terminal, ChevronDown, ChevronUp, Loader2, Sparkles, XCircle } from 'lucide-react';
import { BUILD_STEPS_CONFIG } from '../engine/BuildStatusManager';

interface BuildStatusCardProps {
  buildState: BuildState;
}

export const BuildStatusCard: React.FC<BuildStatusCardProps> = ({ buildState }) => {
  const [showLogs, setShowLogs] = useState(false);

  const getStepStatus = (stepId: BuildStepId) => {
    if (buildState.status === 'completed') return 'completed';
    if (buildState.status === 'failed') {
      if (stepId === 'completed') return 'failed';
    }
    if (buildState.status === 'idle') return 'pending';

    const order: BuildStepId[] = ['preparing', 'uploading', 'building', 'signing', 'uploading_apk', 'completed'];
    const currentIndex = order.indexOf(buildState.status);
    const stepIndex = order.indexOf(stepId);

    if (currentIndex === -1) {
      if (buildState.status === 'idle') return 'pending';
    }

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const isFinished = buildState.status === 'completed';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 dark:border-slate-800 transition-all">
      
      {/* Card Header */}
      <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              isFinished
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                : buildState.status === 'failed'
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                : buildState.status === 'idle'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
            }`}
          >
            {isFinished ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : buildState.status === 'failed' ? (
              <XCircle className="w-5 h-5" />
            ) : buildState.status !== 'idle' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Cpu className="w-5 h-5" />
            )}
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Build Status
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live progression of Android APK assembly
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="shrink-0">
          {buildState.status === 'idle' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Waiting</span>
            </span>
          )}

          {buildState.status !== 'idle' && !isFinished && buildState.status !== 'failed' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 dark:text-blue-400" />
              <span>{buildState.progressPercent}%</span>
            </span>
          )}

          {isFinished && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Completed</span>
            </span>
          )}

          {buildState.status === 'failed' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Failed</span>
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar when building */}
      {buildState.status !== 'idle' && (
        <div className="mb-5 space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>{buildState.currentStepMessage}</span>
            <span className="font-mono text-blue-600 dark:text-blue-400">{buildState.progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                buildState.status === 'failed'
                  ? 'bg-rose-600'
                  : 'bg-blue-600'
              }`}
              style={{ width: `${buildState.progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Step List Timeline */}
      <div className="space-y-2">
        {BUILD_STEPS_CONFIG.map((step, idx) => {
          const status = getStepStatus(step.id);

          return (
            <div
              key={step.id}
              className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                status === 'completed'
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40'
                  : status === 'active'
                  ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700'
                  : status === 'failed'
                  ? 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900'
                  : 'bg-slate-50/50 dark:bg-slate-800/20 border-slate-100 dark:border-slate-800/80 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                    status === 'completed'
                      ? 'bg-emerald-600 text-white'
                      : status === 'active'
                      ? 'bg-blue-600 text-white'
                      : status === 'failed'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {status === 'completed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : status === 'active' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : status === 'failed' ? (
                    <XCircle className="w-3.5 h-3.5" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                <div>
                  <h3
                    className={`text-xs font-semibold ${
                      status === 'completed'
                        ? 'text-emerald-950 dark:text-emerald-200'
                        : status === 'active'
                        ? 'text-blue-950 dark:text-blue-200 font-bold'
                        : status === 'failed'
                        ? 'text-rose-950 dark:text-rose-200 font-bold'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {step.label}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>

              {status === 'completed' && (
                <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md shrink-0">
                  Done
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Expandable Build Logs */}
      {buildState.logs.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setShowLogs(!showLogs)}
            className="w-full flex items-center justify-between py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Console Logs ({buildState.logs.length})</span>
            </div>
            {showLogs ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showLogs && (
            <div className="mt-2 bg-slate-900 rounded-xl p-3 font-mono text-[11px] text-slate-300 max-h-48 overflow-y-auto space-y-1">
              {buildState.logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-500 shrink-0">{log.timestamp}</span>
                  <span
                    className={
                      log.level === 'success'
                        ? 'text-emerald-400 font-semibold'
                        : log.level === 'warn'
                        ? 'text-amber-400'
                        : log.level === 'error'
                        ? 'text-rose-400'
                        : log.level === 'cmd'
                        ? 'text-cyan-300'
                        : 'text-slate-300'
                    }
                  >
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
