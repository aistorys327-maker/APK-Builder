import React, { useState } from 'react';
import { GitHubConfig, GitHubConnectionStatus } from '../types';
import { gitHubManager } from '../engine/GitHubManager';
import {
  Github,
  GitBranch,
  User,
  FolderGit2,
  Key,
  CheckCircle2,
  Loader2,
  Save,
  Radio,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface GitHubConnectionCardProps {
  githubConfig: GitHubConfig;
  onSaveConfig: (updated: GitHubConfig) => void;
}

export interface GitHubValidationErrors {
  username?: string;
  repository?: string;
  branch?: string;
  token?: string;
}

export const GitHubConnectionCard: React.FC<GitHubConnectionCardProps> = ({
  githubConfig,
  onSaveConfig,
}) => {
  const [formData, setFormData] = useState<GitHubConfig>(githubConfig);
  const [showToken, setShowToken] = useState(false);
  const [errors, setErrors] = useState<GitHubValidationErrors>({});
  const [testLogMessage, setTestLogMessage] = useState<string | null>(
    githubConfig.statusMessage || null
  );
  const [isTesting, setIsTesting] = useState(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  // Sync internal form data if external props change
  React.useEffect(() => {
    setFormData(githubConfig);
  }, [githubConfig]);

  const validateForm = (data: GitHubConfig): GitHubValidationErrors => {
    const errs: GitHubValidationErrors = {};
    if (!data.username || !data.username.trim()) {
      errs.username = 'GitHub Username is required.';
    }
    if (!data.repository || !data.repository.trim()) {
      errs.repository = 'Repository Name is required.';
    }
    if (!data.branch || !data.branch.trim()) {
      errs.branch = 'Branch Name is required.';
    }
    if (!data.personalAccessToken || !data.personalAccessToken.trim()) {
      errs.token = 'Personal Access Token is required.';
    }
    return errs;
  };

  const handleFieldChange = (field: keyof GitHubConfig, value: string) => {
    const updated = {
      ...formData,
      [field]: value,
      connectionStatus: 'not_connected' as GitHubConnectionStatus,
      statusMessage: null,
    };
    setFormData(updated);
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSaveNotice(null);
  };

  const handleSave = () => {
    const errs = validateForm(formData);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    onSaveConfig(formData);
    setSaveNotice('GitHub configuration saved securely to local storage.');
    setTimeout(() => setSaveNotice(null), 4000);
  };

  const handleTestConnection = async () => {
    const errs = validateForm(formData);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setFormData((prev) => ({ ...prev, connectionStatus: 'not_connected' }));
      return;
    }

    setErrors({});
    setIsTesting(true);
    setFormData((prev) => ({ ...prev, connectionStatus: 'connecting' }));
    setTestLogMessage('Contacting GitHub API...');

    try {
      const res = await gitHubManager.testAndConnect(formData);
      setIsTesting(false);
      setFormData(res.updatedConfig);
      onSaveConfig(res.updatedConfig);
      setTestLogMessage(res.message);
    } catch {
      setIsTesting(false);
      const failedConfig: GitHubConfig = {
        ...formData,
        connectionStatus: 'not_connected',
        statusMessage: 'Failed to connect to GitHub.',
      };
      setFormData(failedConfig);
      onSaveConfig(failedConfig);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-5 transition-all">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center shrink-0">
            <Github className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                GitHub Connection & Actions
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Target repository credentials for GitHub Actions APK build workflow
            </p>
          </div>
        </div>

        {/* Status Badge in Header */}
        <div className="flex items-center gap-2 shrink-0">
          {formData.connectionStatus === 'connected' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Connected</span>
            </span>
          )}
          {formData.connectionStatus === 'connecting' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 dark:text-blue-400" />
              <span>Testing...</span>
            </span>
          )}
          {formData.connectionStatus === 'not_connected' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              <Radio className="w-3.5 h-3.5 text-slate-400" />
              <span>Not Connected</span>
            </span>
          )}
        </div>
      </div>

      {/* Connection Status Card */}
      <div
        className={`p-4 rounded-xl border transition-all ${
          formData.connectionStatus === 'connected'
            ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900'
            : formData.connectionStatus === 'connecting'
            ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
            : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                formData.connectionStatus === 'connected'
                  ? 'bg-emerald-600 text-white'
                  : formData.connectionStatus === 'connecting'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}
            >
              {formData.connectionStatus === 'connected' ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : formData.connectionStatus === 'connecting' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Github className="w-4 h-4" />
              )}
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Connection Status
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                {formData.connectionStatus === 'connected' && 'Connected to GitHub Repository'}
                {formData.connectionStatus === 'connecting' && 'Testing Connection...'}
                {formData.connectionStatus === 'not_connected' && 'Not Connected — Testing Required'}
              </div>
            </div>
          </div>

          {formData.lastTestedAt && formData.connectionStatus === 'connected' && (
            <span className="text-[10px] font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md shrink-0">
              Verified {new Date(formData.lastTestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        {/* Live Step Message */}
        {isTesting && testLogMessage && (
          <div className="mt-2.5 pt-2.5 border-t border-blue-200/60 dark:border-blue-900/60 flex items-center gap-2 text-xs font-mono text-blue-900 dark:text-blue-300">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 shrink-0" />
            <span>{testLogMessage}</span>
          </div>
        )}

        {!isTesting && formData.connectionStatus === 'connected' && (
          <div className="mt-2.5 pt-2.5 border-t border-emerald-200/60 dark:border-emerald-900/60 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Target: <code className="font-mono bg-emerald-100 dark:bg-emerald-900/80 px-1 rounded">{formData.username}/{formData.repository}:{formData.branch}</code></span>
          </div>
        )}
      </div>

      {/* Save Notice */}
      {saveNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 font-medium flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{saveNotice}</span>
        </div>
      )}

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Field 1: GitHub Username */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            GitHub Username <span className="text-blue-600 dark:text-blue-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleFieldChange('username', e.target.value)}
              placeholder="e.g. octocat"
              className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50/70 dark:bg-slate-800/50 border rounded-xl focus:bg-white dark:focus:bg-slate-800 transition-all font-mono text-slate-800 dark:text-slate-200 placeholder-slate-400 ${
                errors.username
                  ? 'border-rose-400 dark:border-rose-600 ring-1 ring-rose-100'
                  : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'
              }`}
            />
          </div>
          <p className="text-[11px] mt-1 flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">GitHub username or org</span>
            {errors.username && (
              <span className="text-rose-600 dark:text-rose-400 font-semibold">{errors.username}</span>
            )}
          </p>
        </div>

        {/* Field 2: Repository Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Repository Name <span className="text-blue-600 dark:text-blue-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={formData.repository}
              onChange={(e) => handleFieldChange('repository', e.target.value)}
              placeholder="e.g. my-apk-builder"
              className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50/70 dark:bg-slate-800/50 border rounded-xl focus:bg-white dark:focus:bg-slate-800 transition-all font-mono text-slate-800 dark:text-slate-200 placeholder-slate-400 ${
                errors.repository
                  ? 'border-rose-400 dark:border-rose-600 ring-1 ring-rose-100'
                  : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'
              }`}
            />
          </div>
          <p className="text-[11px] mt-1 flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Target repository name</span>
            {errors.repository && (
              <span className="text-rose-600 dark:text-rose-400 font-semibold">{errors.repository}</span>
            )}
          </p>
        </div>

        {/* Field 3: Branch Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Branch Name <span className="text-blue-600 dark:text-blue-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <GitBranch className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={formData.branch}
              onChange={(e) => handleFieldChange('branch', e.target.value)}
              placeholder="main"
              className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50/70 dark:bg-slate-800/50 border rounded-xl focus:bg-white dark:focus:bg-slate-800 transition-all font-mono text-slate-800 dark:text-slate-200 placeholder-slate-400 ${
                errors.branch
                  ? 'border-rose-400 dark:border-rose-600 ring-1 ring-rose-100'
                  : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'
              }`}
            />
          </div>
          <p className="text-[11px] mt-1 flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Target branch for workflow trigger</span>
            {errors.branch && (
              <span className="text-rose-600 dark:text-rose-400 font-semibold">{errors.branch}</span>
            )}
          </p>
        </div>

        {/* Field 4: Personal Access Token */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Personal Access Token <span className="text-blue-600 dark:text-blue-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Key className="w-4 h-4" />
            </div>
            <input
              type={showToken ? 'text' : 'password'}
              value={formData.personalAccessToken}
              onChange={(e) => handleFieldChange('personalAccessToken', e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className={`w-full pl-9 pr-10 py-2 text-xs sm:text-sm bg-slate-50/70 dark:bg-slate-800/50 border rounded-xl focus:bg-white dark:focus:bg-slate-800 transition-all font-mono text-slate-800 dark:text-slate-200 placeholder-slate-400 ${
                errors.token
                  ? 'border-rose-400 dark:border-rose-600 ring-1 ring-rose-100'
                  : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              title={showToken ? 'Hide token' : 'Show token'}
            >
              {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] mt-1 flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Saved locally in browser</span>
            {errors.token && (
              <span className="text-rose-600 dark:text-rose-400 font-semibold">{errors.token}</span>
            )}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-1">
        <button
          type="button"
          onClick={handleSave}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
        >
          <Save className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>Save Credentials</span>
        </button>

        <button
          type="button"
          onClick={handleTestConnection}
          disabled={isTesting}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            isTesting
              ? 'bg-blue-100 dark:bg-blue-950 text-blue-400 cursor-not-allowed'
              : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white shadow-xs'
          }`}
        >
          {isTesting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
              <span>Testing Connection...</span>
            </>
          ) : (
            <>
              <Github className="w-3.5 h-3.5" />
              <span>Test & Verify Connection</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
