import React, { useState, useEffect } from 'react';
import {
  AppConfig,
  BuildState,
  AppPermissions,
  ScreenOrientation,
  AppBranding,
  BuildHistoryItem,
  GitHubConfig,
} from './types';
import { ValidationErrors, validateAppConfig } from './utils/defaultConfigs';
import { apkConfigManager } from './engine/APKConfigManager';
import { buildManager } from './engine/BuildManager';
import { projectValidator } from './engine/ProjectValidator';
import { buildStatusManager } from './engine/BuildStatusManager';

import { Header } from './components/Header';
import { AppInfoCard } from './components/AppInfoCard';
import { AppBrandingCard } from './components/AppBrandingCard';
import { BuildSettingsCard } from './components/BuildSettingsCard';
import { GitHubConnectionCard } from './components/GitHubConnectionCard';
import { ProjectSummaryCard } from './components/ProjectSummaryCard';
import { BuildButton } from './components/BuildButton';
import { BuildStatusCard } from './components/BuildStatusCard';
import { DownloadSection } from './components/DownloadSection';
import { BuildHistoryCard } from './components/BuildHistoryCard';
import { PhonePreviewModal } from './components/PhonePreviewModal';
import { ExportWorkflowModal } from './components/ExportWorkflowModal';
import { SavedPresetsModal } from './components/SavedPresetsModal';
import { Smartphone, Sparkles, ShieldCheck } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<AppConfig>(() => apkConfigManager.loadAppConfig());
  const [githubConfig, setGithubConfig] = useState<GitHubConfig>(() => apkConfigManager.loadGitHubConfig());

  const [history, setHistory] = useState<BuildHistoryItem[]>(() => {
    try {
      const savedHist = localStorage.getItem('apk_builder_history');
      if (savedHist) return JSON.parse(savedHist);
    } catch {
      // fallback
    }
    return [];
  });

  const [buildState, setBuildState] = useState<BuildState>(() => buildStatusManager.getInitialState());

  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});
  const [importNotice, setImportNotice] = useState<string | null>(null);

  // Persist AppConfig
  useEffect(() => {
    apkConfigManager.saveAppConfig(config);
  }, [config]);

  // Persist GitHubConfig
  useEffect(() => {
    apkConfigManager.saveGitHubConfig(githubConfig);
  }, [githubConfig]);

  // Persist history in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('apk_builder_history', JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  const handleSaveGitHubConfig = (updated: GitHubConfig) => {
    setGithubConfig(updated);
    setValidationError(null);
  };

  const handleConfigChange = (updates: Partial<AppConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...updates,
      updatedAt: Date.now(),
    }));
    setValidationError(null);
    setFieldErrors({});
  };

  const handleBrandingChange = (brandingUpdates: Partial<AppBranding>) => {
    setConfig((prev) => ({
      ...prev,
      branding: {
        ...prev.branding,
        ...brandingUpdates,
      },
      updatedAt: Date.now(),
    }));
  };

  const handlePermissionChange = (key: keyof AppPermissions, value: boolean) => {
    setConfig((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: value,
      },
      updatedAt: Date.now(),
    }));
  };

  const handleOrientationChange = (orientation: ScreenOrientation) => {
    setConfig((prev) => ({
      ...prev,
      orientation,
      updatedAt: Date.now(),
    }));
  };

  const saveToBuildHistory = (cfg: AppConfig) => {
    const now = new Date();
    const newItem: BuildHistoryItem = {
      id: String(Date.now()),
      appName: cfg.appName || 'Untitled App',
      packageName: cfg.packageName || 'com.example.app',
      versionName: cfg.versionName || '1.0.0',
      versionCode: cfg.versionCode || 1,
      dateStr: now.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      timeStr: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      config: cfg,
    };

    setHistory((prev) => [newItem, ...prev.filter((h) => h.id !== newItem.id)].slice(0, 20));
  };

  const handleReloadHistory = (item: BuildHistoryItem) => {
    setConfig(item.config);
    setValidationError(null);
    setFieldErrors({});
    setImportNotice(`Restored configuration for "${item.appName}" from build history.`);
    setTimeout(() => setImportNotice(null), 4000);
  };

  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleExportConfig = () => {
    saveToBuildHistory(config);
    apkConfigManager.exportConfigFile(config);
    setImportNotice('Successfully exported build-config.json file.');
    setTimeout(() => setImportNotice(null), 4000);
  };

  const handleImportConfig = (importedRaw: unknown) => {
    try {
      const merged = apkConfigManager.importConfigFile(importedRaw);
      setConfig(merged);
      setValidationError(null);
      setFieldErrors({});
      setImportNotice(`Successfully imported configuration for "${merged.appName}".`);
      setTimeout(() => setImportNotice(null), 4000);
    } catch {
      alert('Invalid build configuration file format.');
    }
  };

  const playCompletionChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      // ignore audio errors
    }
  };

  // Initiate Build using BuildEngine
  const startBuildProcess = async () => {
    // 1. Validate Project
    const valResult = projectValidator.validateProject(config, githubConfig);
    if (!valResult.isValid) {
      setFieldErrors(valResult.fieldErrors);
      setValidationError(valResult.summaryMessage);
      return;
    }

    setValidationError(null);
    setFieldErrors({});

    saveToBuildHistory(config);

    // 2. Start Build Manager Pipeline
    await buildManager.startBuild(config, githubConfig, {
      onStateUpdate: setBuildState,
      onCompletionSound: playCompletionChime,
    });
  };

  const cancelBuildProcess = () => {
    buildManager.cancelBuild(setBuildState);
  };

  const currentValidationErrors = validateAppConfig(config);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      {/* 1. Header Section */}
      <Header
        onOpenPresets={() => setIsPresetsOpen(true)}
        onOpenPreview={() => setIsPreviewOpen(true)}
        onOpenWorkflow={() => setIsWorkflowOpen(true)}
        onExportConfig={handleExportConfig}
        onImportConfigClick={() => {
          const summaryExportBtn = document.querySelector('button[title="Import a build-config.json file"]') as HTMLButtonElement;
          if (summaryExportBtn) summaryExportBtn.click();
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Intro Banner */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50/40 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 rounded-2xl p-4 sm:p-5 border border-blue-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Web to Android APK Converter Engine
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Build Engine architecture ready for GitHub Actions execution.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 px-2.5 py-1 rounded-xl">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Production Engine Architecture</span>
            </span>
          </div>
        </div>

        {/* 2. App Information Card */}
        <AppInfoCard config={config} errors={fieldErrors} onChange={handleConfigChange} />

        {/* 3. App Branding Card */}
        <AppBrandingCard
          branding={config.branding}
          appName={config.appName}
          themeColor={config.themeColor}
          onChange={handleBrandingChange}
        />

        {/* 4. Build Settings Card */}
        <BuildSettingsCard
          permissions={config.permissions}
          orientation={config.orientation}
          onPermissionChange={handlePermissionChange}
          onOrientationChange={handleOrientationChange}
        />

        {/* 5. GitHub Connection Card */}
        <GitHubConnectionCard
          githubConfig={githubConfig}
          onSaveConfig={handleSaveGitHubConfig}
        />

        {/* 6. Project Summary Card */}
        <ProjectSummaryCard
          config={config}
          errors={currentValidationErrors}
          onExportConfig={handleExportConfig}
          onImportConfig={handleImportConfig}
          importNotice={importNotice}
        />

        {/* 7. Build Button */}
        <BuildButton
          buildStatus={buildState.status}
          isDisabled={buildState.status !== 'idle' && buildState.status !== 'completed' && buildState.status !== 'failed'}
          isGitHubConnected={githubConfig.connectionStatus === 'connected'}
          validationError={validationError}
          onStartBuild={startBuildProcess}
          onCancelBuild={cancelBuildProcess}
        />

        {/* 8. Build Status Card */}
        <BuildStatusCard buildState={buildState} />

        {/* 9. Download Section */}
        <DownloadSection config={config} buildState={buildState} />

        {/* 10. Build History Card */}
        <BuildHistoryCard
          history={history}
          onReloadHistory={handleReloadHistory}
          onDeleteHistory={handleDeleteHistory}
          onClearHistory={handleClearHistory}
        />
      </main>

      {/* Footer */}
      <footer className="bg-slate-100/60 dark:bg-slate-900/60 border-t border-slate-200/60 dark:border-slate-800/80 mt-12 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">APK Builder Engine</span>
            <span>— Production Ready Architecture</span>
          </div>
          <p className="text-slate-400 dark:text-slate-500">
            TypeScript • Modular Build Engine • GitHub Actions Integration
          </p>
        </div>
      </footer>

      {/* Modals */}
      <PhonePreviewModal
        isOpen={isPreviewOpen}
        config={config}
        onClose={() => setIsPreviewOpen(false)}
      />

      <ExportWorkflowModal
        isOpen={isWorkflowOpen}
        config={config}
        onClose={() => setIsWorkflowOpen(false)}
      />

      <SavedPresetsModal
        isOpen={isPresetsOpen}
        currentConfig={config}
        onSelectPreset={(preset) => handleConfigChange(preset)}
        onClose={() => setIsPresetsOpen(false)}
      />
    </div>
  );
}
