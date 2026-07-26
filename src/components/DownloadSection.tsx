import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { AppConfig, BuildState } from '../types';
import { Download, QrCode, FileCode2, CheckCircle2, Lock, Smartphone, ShieldCheck, Share2, Copy, Check } from 'lucide-react';
import { generateGitHubWorkflowYaml, generateBuildConfigJson } from '../utils/githubWorkflowGenerator';

interface DownloadSectionProps {
  config: AppConfig;
  buildState: BuildState;
}

export const DownloadSection: React.FC<DownloadSectionProps> = ({ config, buildState }) => {
  const isCompleted = buildState.status === 'completed';
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const mockDownloadUrl = `${window.location.origin}/download/${config.packageName || 'app'}-v${config.versionName || '1.0.0'}.apk`;

  useEffect(() => {
    if (isCompleted && qrCanvasRef.current) {
      QRCode.toCanvas(qrCanvasRef.current, mockDownloadUrl, {
        width: 140,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      }).catch((err) => console.error('QR code render error', err));
    }
  }, [isCompleted, mockDownloadUrl]);

  // Handler to trigger real download of simulated APK payload file
  const handleDownloadApk = () => {
    const filename = `${(config.appName || 'app').toLowerCase().replace(/[^a-z0-9]/g, '-')}-v${config.versionName || '1.0.0'}.apk`;
    
    // Create a mock APK text/bundle package with manifest
    const apkContent = `
=====================================================
ANDROID APK BUILD PACKAGE
=====================================================
App Name: ${config.appName}
Package ID: ${config.packageName}
Target URL: ${config.webAppUrl}
Version: ${config.versionName} (Build ${config.versionCode})
Build Date: ${new Date().toISOString()}

MANIFEST PERMISSIONS INCLUDED:
${Object.entries(config.permissions)
  .filter(([_, val]) => val)
  .map(([key]) => `- android.permission.${key.toUpperCase()}`)
  .join('\n')}

Note: This file represents the APK bundle generated for ${config.appName}.
To compile the actual Android binary on GitHub Actions, place the downloaded 
build-apk.yml inside your GitHub repo at .github/workflows/build-apk.yml
=====================================================
`;

    const blob = new Blob([apkContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadWorkflowYaml = () => {
    const yamlString = generateGitHubWorkflowYaml(config);
    const blob = new Blob([yamlString], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'build-apk.yml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mockDownloadUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 transition-all border ${
        isCompleted
          ? 'bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30 border-blue-200 shadow-md ring-1 ring-blue-500/20'
          : 'bg-slate-50 border-slate-200 opacity-60'
      }`}
    >
      
      {/* Card Header */}
      <div className="flex items-center justify-between mb-5 border-b border-slate-200/60 pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isCompleted ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'bg-slate-200 text-slate-500'
            }`}
          >
            {isCompleted ? <Download className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              7. Download & Installation
            </h2>
            <p className="text-xs text-slate-500">
              {isCompleted
                ? 'Your Android APK is ready! Download binary or scan QR code on mobile.'
                : 'This section will unlock once the build is finished.'}
            </p>
          </div>
        </div>

        {!isCompleted && (
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-200 text-slate-600">
            Locked
          </span>
        )}
      </div>

      {isCompleted ? (
        <div className="space-y-6">
          
          {/* Main Download Call to Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Primary Download Button Card */}
            <div className="md:col-span-2 space-y-3">
              <button
                type="button"
                disabled={true}
                className="w-full py-4 px-6 rounded-2xl bg-slate-200 text-slate-400 font-bold text-base shadow-none cursor-not-allowed transition-all flex items-center justify-center gap-3"
              >
                <Download className="w-5 h-5 text-slate-400" />
                <div className="text-left">
                  <div>Download APK (Disabled)</div>
                  <div className="text-[11px] font-normal text-slate-400">
                    Frontend simulation only — download is disabled.
                  </div>
                </div>
              </button>

              {/* Secondary Download Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownloadWorkflowYaml}
                  className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs transition-all flex items-center justify-center gap-2"
                >
                  <FileCode2 className="w-4 h-4 text-blue-600" />
                  <span>GitHub Action (.yml)</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs transition-all flex items-center justify-center gap-2"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-600">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-slate-500" />
                      <span>Copy Install Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* QR Code Scan Container */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col items-center justify-center text-center space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Scan with Phone Camera
              </span>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <canvas ref={qrCanvasRef} />
              </div>
              <span className="text-[10px] text-slate-400">
                Direct install link QR
              </span>
            </div>

          </div>

          {/* Android Installation Instructions */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>How to Install APK on Android:</span>
            </div>
            <ol className="text-xs text-slate-600 space-y-1 pl-5 list-decimal font-medium leading-relaxed">
              <li>Download the <strong>.apk</strong> file or scan the QR code on your mobile device.</li>
              <li>Open your device <strong>Settings &gt; Security</strong> and enable <strong>Install Unknown Apps</strong> for Chrome or Files.</li>
              <li>Tap the downloaded file in your Notification bar or Downloads folder to install and launch!</li>
            </ol>
          </div>

        </div>
      ) : (
        <div className="py-8 text-center text-slate-400 space-y-2">
          <Download className="w-8 h-8 mx-auto stroke-[1.5]" />
          <p className="text-xs font-medium">
            Fill in your app details above and tap <strong>"Build APK"</strong> to start.
          </p>
        </div>
      )}

    </div>
  );
};
