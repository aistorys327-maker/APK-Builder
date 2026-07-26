import React, { useState } from 'react';
import { AppConfig } from '../types';
import { X, FileCode2, Copy, Download, Check, Sparkles } from 'lucide-react';
import { generateGitHubWorkflowYaml, generateBuildConfigJson } from '../utils/githubWorkflowGenerator';

interface ExportWorkflowModalProps {
  isOpen: boolean;
  config: AppConfig;
  onClose: () => void;
}

export const ExportWorkflowModal: React.FC<ExportWorkflowModalProps> = ({
  isOpen,
  config,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'yaml' | 'json'>('yaml');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const yamlContent = generateGitHubWorkflowYaml(config);
  const jsonContent = generateBuildConfigJson(config);
  const displayContent = activeTab === 'yaml' ? yamlContent : jsonContent;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = activeTab === 'yaml' ? 'build-apk.yml' : 'apk-config.json';
    const mime = activeTab === 'yaml' ? 'text/yaml' : 'application/json';
    const blob = new Blob([displayContent], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-slate-100">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                GitHub Action & Build Config
              </h3>
              <p className="text-xs text-slate-500">
                Use this automated workflow file in your GitHub repository
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-200/60 hover:bg-slate-200 text-slate-600 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toolbar & Actions */}
        <div className="px-6 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('yaml')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'yaml'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              .github/workflows/build-apk.yml
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'json'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              apk-config.json
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-2xs transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-6 bg-slate-900 overflow-y-auto flex-1 font-mono text-xs text-slate-200 leading-relaxed scrollbar-thin scrollbar-thumb-slate-700">
          <pre>{displayContent}</pre>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Commit this file into your GitHub repository to trigger automatic APK builds on every push!</span>
        </div>

      </div>
    </div>
  );
};
