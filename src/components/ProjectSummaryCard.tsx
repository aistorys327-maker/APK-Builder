import React, { useRef } from 'react';
import { AppConfig } from '../types';
import { ValidationErrors } from '../utils/defaultConfigs';
import {
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Globe,
  Package,
  Tag,
  Shield,
  Image as ImageIcon,
  Download,
  Upload,
  Sparkles,
  Smartphone,
} from 'lucide-react';

interface ProjectSummaryCardProps {
  config: AppConfig;
  errors: ValidationErrors;
  onExportConfig: () => void;
  onImportConfig: (importedConfig: AppConfig) => void;
  importNotice: string | null;
}

export const ProjectSummaryCard: React.FC<ProjectSummaryCardProps> = ({
  config,
  errors,
  onExportConfig,
  onImportConfig,
  importNotice,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isReady = Object.keys(errors).length === 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json && typeof json === 'object') {
          onImportConfig(json as AppConfig);
        } else {
          alert('Invalid build-config.json format');
        }
      } catch (err) {
        alert('Failed to parse build-config.json file. Please select a valid JSON file.');
      }
    };
    reader.readAsText(file);
    // reset input so user can import same file again if needed
    if (e.target) e.target.value = '';
  };

  const activePermissions = Object.entries(config.permissions)
    .filter(([, val]) => val)
    .map(([key]) => key.replace('Access', ''));

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
      
      {/* Card Title & Import/Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Project Summary</h3>
            <p className="text-xs text-slate-500">
              Overview of configured project metadata & build parameters
            </p>
          </div>
        </div>

        {/* Export and Import Actions */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all active:scale-95 shrink-0"
            title="Import a build-config.json file"
          >
            <Upload className="w-3.5 h-3.5 text-slate-600" />
            <span>Import Config</span>
          </button>

          <button
            type="button"
            onClick={onExportConfig}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100/80 border border-blue-200/70 rounded-xl transition-all active:scale-95 shrink-0 shadow-2xs"
            title="Export build-config.json file"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export Config</span>
          </button>
        </div>
      </div>

      {/* Notice Message if imported */}
      {importNotice && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{importNotice}</span>
        </div>
      )}

      {/* Ready for Build Status Banner */}
      {isReady ? (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                <span>Ready for GitHub Build</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200/80 text-emerald-900 uppercase tracking-wider">
                  Verified
                </span>
              </div>
              <p className="text-xs text-emerald-800/80 mt-0.5">
                All required fields are valid and ready for export or simulation.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-rose-950">Configuration Incomplete</div>
            <ul className="text-xs text-rose-700 mt-1 space-y-1 list-disc list-inside">
              {Object.values(errors).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Summary Grid Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Web App URL */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Web App URL</span>
          </div>
          <p className="text-xs font-mono font-medium text-slate-800 truncate" title={config.webAppUrl}>
            {config.webAppUrl || <span className="text-slate-400 italic">Not specified</span>}
          </p>
        </div>

        {/* Package Name */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-blue-600" />
            <span>Package Identifier</span>
          </div>
          <p className="text-xs font-mono font-medium text-slate-800 truncate" title={config.packageName}>
            {config.packageName || <span className="text-slate-400 italic">Not specified</span>}
          </p>
        </div>

        {/* Version */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-blue-600" />
            <span>App Version</span>
          </div>
          <p className="text-xs font-medium text-slate-800">
            {config.appName || 'App'} • <code className="font-mono bg-slate-200/60 px-1 rounded">v{config.versionName || '1.0.0'}</code> (Code {config.versionCode})
          </p>
        </div>

        {/* Permissions */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>Enabled Permissions ({activePermissions.length})</span>
          </div>
          <p className="text-xs font-medium text-slate-700 capitalize truncate">
            {activePermissions.length > 0 ? activePermissions.join(', ') : 'Internet Only'}
          </p>
        </div>

        {/* Selected Icon */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Selected App Icon</span>
            </div>
            <p className="text-xs font-medium text-slate-800 capitalize">
              Shape: <span className="font-mono">{config.branding.iconShape}</span> • {config.branding.iconName || 'Default Icon'}
            </p>
          </div>
          {config.branding.iconUrl ? (
            <img
              src={config.branding.iconUrl}
              alt="Icon"
              className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-2xs"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              {config.appName.charAt(0) || 'A'}
            </div>
          )}
        </div>

        {/* Selected Splash Screen */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-blue-600" />
              <span>Selected Splash Screen</span>
            </div>
            <p className="text-xs font-medium text-slate-800">
              {config.branding.splashName || 'Default Splash'} • BG:{' '}
              <span className="font-mono">{config.branding.splashBgColor}</span>
            </p>
          </div>
          <div
            className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center shadow-2xs"
            style={{ backgroundColor: config.branding.splashBgColor }}
          >
            {config.branding.splashUrl ? (
              <img src={config.branding.splashUrl} alt="Splash" className="w-5 h-5 object-contain" />
            ) : (
              <div className="w-3 h-3 rounded-full bg-white shadow-xs" />
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
