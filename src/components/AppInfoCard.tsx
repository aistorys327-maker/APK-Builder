import React, { useState } from 'react';
import { AppConfig } from '../types';
import { Globe, AppWindow, Package, Tag, Hash, Sparkles, CheckCircle2, AlertCircle, Lock, Unlock } from 'lucide-react';
import { derivePackageName, isValidPackageName, isValidUrl, ValidationErrors } from '../utils/defaultConfigs';

interface AppInfoCardProps {
  config: AppConfig;
  errors?: ValidationErrors;
  onChange: (updated: Partial<AppConfig>) => void;
}

export const AppInfoCard: React.FC<AppInfoCardProps> = ({ config, errors = {} as ValidationErrors, onChange }) => {
  const [autoSyncPackage, setAutoSyncPackage] = useState(true);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const updates: Partial<AppConfig> = { webAppUrl: val };

    if (autoSyncPackage) {
      updates.packageName = derivePackageName(val, config.appName);
    }

    onChange(updates);
  };

  const handleAppNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const updates: Partial<AppConfig> = { appName: val };

    if (autoSyncPackage) {
      updates.packageName = derivePackageName(config.webAppUrl, val);
    }

    onChange(updates);
  };

  const urlValid = isValidUrl(config.webAppUrl);
  const pkgValid = isValidPackageName(config.packageName);

  const handleAutoGeneratePackage = () => {
    const generated = derivePackageName(config.webAppUrl, config.appName);
    onChange({ packageName: generated });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 dark:border-slate-800 transition-all">
      
      {/* Card Header */}
      <div className="flex items-center gap-3 mb-5 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
          <Globe className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            App Information
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Target web application URL & Android package parameters
          </p>
        </div>
      </div>

      {/* Input Fields Grid */}
      <div className="space-y-4">
        
        {/* Field 1: Web App URL */}
        <div>
          <label htmlFor="webAppUrl" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Web App URL <span className="text-blue-600 dark:text-blue-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Globe className="w-4 h-4" />
            </div>
            <input
              id="webAppUrl"
              type="url"
              value={config.webAppUrl}
              onChange={handleUrlChange}
              placeholder="https://mywebapp.com"
              className={`w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50/70 dark:bg-slate-800/60 border rounded-xl focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 font-mono ${
                errors.webAppUrl
                  ? 'border-rose-400 ring-2 ring-rose-100 dark:ring-rose-950/50 focus:border-rose-500'
                  : config.webAppUrl && urlValid
                  ? 'border-emerald-300 dark:border-emerald-700 focus:border-emerald-500'
                  : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 dark:focus:ring-blue-900/40'
              }`}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {config.webAppUrl && (
                urlValid && !errors.webAppUrl ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                )
              )}
            </div>
          </div>
          {errors.webAppUrl && (
            <p className="text-[11px] mt-1 text-rose-600 dark:text-rose-400 font-semibold">{errors.webAppUrl}</p>
          )}
        </div>

        {/* Field 2: App Name */}
        <div>
          <label htmlFor="appName" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            App Name <span className="text-blue-600 dark:text-blue-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <AppWindow className="w-4 h-4" />
            </div>
            <input
              id="appName"
              type="text"
              value={config.appName}
              onChange={handleAppNameChange}
              placeholder="e.g. My Web App"
              maxLength={30}
              className={`w-full pl-10 pr-12 py-2.5 text-sm bg-slate-50/70 dark:bg-slate-800/60 border rounded-xl focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 font-medium ${
                errors.appName
                  ? 'border-rose-400 ring-2 ring-rose-100 dark:ring-rose-950/50 focus:border-rose-500'
                  : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 dark:focus:ring-blue-900/40'
              }`}
            />
            <span className="absolute right-3 top-2.5 text-[11px] font-mono text-slate-400">
              {config.appName.length}/30
            </span>
          </div>
          {errors.appName && (
            <p className="text-[11px] mt-1 text-rose-600 dark:text-rose-400 font-semibold">{errors.appName}</p>
          )}
        </div>

        {/* Field 3: Package Name */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="packageName" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Package Name <span className="text-blue-600 dark:text-blue-400">*</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAutoSyncPackage(!autoSyncPackage)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors"
                title={autoSyncPackage ? 'Auto-sync enabled' : 'Manual edit mode'}
              >
                {autoSyncPackage ? (
                  <>
                    <Lock className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">Auto-Synced</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    <span>Custom</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleAutoGeneratePackage}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Sparkles className="w-3 h-3" />
                <span>Suggest</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Package className="w-4 h-4" />
            </div>
            <input
              id="packageName"
              type="text"
              value={config.packageName}
              onChange={(e) => {
                setAutoSyncPackage(false);
                onChange({ packageName: e.target.value });
              }}
              placeholder="com.company.app"
              className={`w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50/70 dark:bg-slate-800/60 border rounded-xl focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 font-mono ${
                errors.packageName
                  ? 'border-rose-400 ring-2 ring-rose-100 dark:ring-rose-950/50 focus:border-rose-500'
                  : config.packageName && pkgValid
                  ? 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 dark:focus:ring-blue-900/40'
                  : 'border-rose-300 focus:border-rose-500'
              }`}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {pkgValid && !errors.packageName ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-500" />
              )}
            </div>
          </div>
          {errors.packageName && (
            <p className="text-[11px] mt-1 text-rose-600 dark:text-rose-400 font-semibold">{errors.packageName}</p>
          )}
        </div>

        {/* Row for Version Name & Version Code */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          
          {/* Field 4: Version Name */}
          <div>
            <label htmlFor="versionName" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Version Name <span className="text-blue-600 dark:text-blue-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Tag className="w-4 h-4" />
              </div>
              <input
                id="versionName"
                type="text"
                value={config.versionName}
                onChange={(e) => onChange({ versionName: e.target.value })}
                placeholder="1.0.0"
                className={`w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50/70 dark:bg-slate-800/60 border rounded-xl focus:bg-white dark:focus:bg-slate-800 transition-all font-mono text-slate-800 dark:text-slate-100 placeholder-slate-400 ${
                  errors.versionName
                    ? 'border-rose-400 ring-2 ring-rose-100 dark:ring-rose-950/50 focus:border-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 dark:focus:ring-blue-900/40'
                }`}
              />
            </div>
            {errors.versionName && (
              <p className="text-[11px] mt-1 text-rose-600 dark:text-rose-400 font-semibold">{errors.versionName}</p>
            )}
          </div>

          {/* Field 5: Version Code */}
          <div>
            <label htmlFor="versionCode" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Version Code <span className="text-blue-600 dark:text-blue-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Hash className="w-4 h-4" />
              </div>
              <input
                id="versionCode"
                type="number"
                min={1}
                max={99999}
                value={config.versionCode || ''}
                onChange={(e) => {
                  const parsed = parseInt(e.target.value, 10);
                  onChange({ versionCode: isNaN(parsed) ? 0 : parsed });
                }}
                placeholder="1"
                className={`w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50/70 dark:bg-slate-800/60 border rounded-xl focus:bg-white dark:focus:bg-slate-800 transition-all font-mono text-slate-800 dark:text-slate-100 placeholder-slate-400 ${
                  errors.versionCode
                    ? 'border-rose-400 ring-2 ring-rose-100 dark:ring-rose-950/50 focus:border-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 dark:focus:ring-blue-900/40'
                }`}
              />
            </div>
            {errors.versionCode && (
              <p className="text-[11px] mt-1 text-rose-600 dark:text-rose-400 font-semibold">{errors.versionCode}</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
