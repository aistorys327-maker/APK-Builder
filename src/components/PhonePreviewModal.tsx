import React, { useState } from 'react';
import { AppConfig, IconMaskShape } from '../types';
import { X, RefreshCw, Smartphone, Globe, Shield, Wifi, Battery, Signal, Home, ArrowLeft, RotateCcw } from 'lucide-react';

interface PhonePreviewModalProps {
  isOpen: boolean;
  config: AppConfig;
  onClose: () => void;
}

export const PhonePreviewModal: React.FC<PhonePreviewModalProps> = ({
  isOpen,
  config,
  onClose,
}) => {
  const [appLaunched, setAppLaunched] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

  const maskClass: Record<IconMaskShape, string> = {
    circle: 'rounded-full',
    squircle: 'rounded-[24%]',
    rounded: 'rounded-2xl',
    teardrop: 'rounded-t-full rounded-br-full rounded-bl-xl',
  };

  const handleRefreshIframe = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-slate-100">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-sm font-bold">Android Device Live Preview</h3>
              <p className="text-[11px] text-slate-400">
                Testing app behavior on Android Webview
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAppLaunched(!appLaunched)}
              className="px-3 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all"
            >
              {appLaunched ? 'Home Screen' : 'Launch App'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="p-6 overflow-y-auto bg-slate-100 flex flex-col items-center justify-center min-h-[500px]">
          
          {/* Android Device Frame */}
          <div className="w-[300px] h-[580px] bg-slate-950 rounded-[40px] p-3 shadow-2xl border-4 border-slate-800 relative flex flex-col overflow-hidden">
            
            {/* Camera Punch Hole Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-900 rounded-full z-30 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
            </div>

            {/* Android Status Bar */}
            <div
              className={`w-full h-8 pt-1.5 px-6 flex items-center justify-between text-[11px] font-medium text-white z-20 shrink-0 ${
                config.permissions.fullScreen && appLaunched ? 'hidden' : 'block'
              }`}
              style={{ backgroundColor: appLaunched ? config.branding.splashBgColor || '#0f172a' : '#0f172a' }}
            >
              <span>09:41</span>
              <div className="flex items-center gap-1.5 text-xs">
                <Wifi className="w-3 h-3" />
                <Signal className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Screen Content Viewport */}
            <div className="w-full flex-1 bg-slate-900 rounded-t-2xl rounded-b-3xl overflow-hidden relative flex flex-col">
              
              {appLaunched ? (
                /* LIVE WEBVIEW SCREEN */
                <div className="w-full h-full flex flex-col bg-white relative">
                  
                  {/* Top Webview Bar (if not fullscreen) */}
                  {!config.permissions.fullScreen && (
                    <div className="bg-slate-900 text-white px-3 py-1.5 flex items-center justify-between text-xs border-b border-slate-800">
                      <div className="flex items-center gap-2 truncate">
                        <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate text-[11px] font-mono text-slate-300">
                          {config.webAppUrl || 'https://example.com'}
                        </span>
                      </div>
                      <button
                        onClick={handleRefreshIframe}
                        className="p-1 hover:bg-slate-800 rounded transition-colors"
                      >
                        <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  )}

                  {/* Web App Frame */}
                  <div className="w-full flex-1 relative bg-slate-50">
                    {isRefreshing ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                        <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                      </div>
                    ) : (
                      <iframe
                        src={config.webAppUrl || 'about:blank'}
                        title="Web App Live View"
                        className="w-full h-full border-0"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                      />
                    )}
                  </div>

                </div>
              ) : (
                /* ANDROID HOME SCREEN LAUNCHER MOCKUP */
                <div className="w-full h-full bg-gradient-to-b from-indigo-900 via-slate-900 to-black p-4 flex flex-col justify-between text-white">
                  
                  {/* Clock Widget */}
                  <div className="text-center pt-8">
                    <div className="text-3xl font-extralight tracking-wider">09:41</div>
                    <div className="text-[11px] text-indigo-200 mt-0.5">Thursday, July 24</div>
                  </div>

                  {/* App Launcher Grid */}
                  <div className="grid grid-cols-4 gap-4 pb-4 px-2">
                    {/* The Target User App Icon */}
                    <div
                      onClick={() => setAppLaunched(true)}
                      className="flex flex-col items-center gap-1 cursor-pointer group"
                    >
                      <div
                        className={`w-12 h-12 bg-blue-600 shadow-lg group-hover:scale-105 transition-transform overflow-hidden flex items-center justify-center ${
                          maskClass[config.branding.iconShape]
                        }`}
                      >
                        {config.branding.iconUrl ? (
                          <img
                            src={config.branding.iconUrl}
                            alt="App Icon"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-bold text-white text-lg">
                            {(config.appName || 'A').charAt(0)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-white font-medium truncate max-w-[60px] text-center">
                        {config.appName || 'My App'}
                      </span>
                    </div>

                    {/* Dummy System Icons for Realism */}
                    {['Phone', 'Messages', 'Camera', 'Photos'].map((sys, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1 opacity-50">
                        <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-xs">
                          {sys.charAt(0)}
                        </div>
                        <span className="text-[10px] text-slate-400">{sys}</span>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* Android Bottom Navigation Bar */}
              <div className="w-full h-8 bg-slate-950 flex items-center justify-around text-slate-400 z-20 shrink-0">
                <button
                  onClick={() => setAppLaunched(false)}
                  className="p-1 hover:text-white"
                  title="Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setAppLaunched(false)}
                  className="p-1 hover:text-white"
                  title="Home"
                >
                  <Home className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setAppLaunched(false)}
                  className="p-1 hover:text-white"
                  title="App Switcher"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
