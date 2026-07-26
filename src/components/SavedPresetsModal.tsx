import React, { useState, useEffect } from 'react';
import { AppConfig } from '../types';
import { SAMPLE_PRESETS, AppPreset } from '../utils/defaultConfigs';
import { X, Sparkles, Store, LayoutDashboard, Play, BookmarkPlus, Trash2, Check } from 'lucide-react';

interface SavedPresetsModalProps {
  isOpen: boolean;
  currentConfig: AppConfig;
  onSelectPreset: (presetConfig: Partial<AppConfig>) => void;
  onClose: () => void;
}

export const SavedPresetsModal: React.FC<SavedPresetsModalProps> = ({
  isOpen,
  currentConfig,
  onSelectPreset,
  onClose,
}) => {
  const [savedUserConfigs, setSavedUserConfigs] = useState<AppConfig[]>([]);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem('apk_builder_user_presets');
        if (stored) {
          setSavedUserConfigs(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load local presets', e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveCurrentAsPreset = () => {
    const updated = [
      currentConfig,
      ...savedUserConfigs.filter((c) => c.id !== currentConfig.id),
    ].slice(0, 5); // Keep up to 5 user presets

    setSavedUserConfigs(updated);
    try {
      localStorage.setItem('apk_builder_user_presets', JSON.stringify(updated));
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2000);
    } catch (e) {
      console.error('Failed to save preset', e);
    }
  };

  const handleDeleteSaved = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = savedUserConfigs.filter((c) => c.id !== id);
    setSavedUserConfigs(filtered);
    try {
      localStorage.setItem('apk_builder_user_presets', JSON.stringify(filtered));
    } catch (err) {
      console.error(err);
    }
  };

  const renderIcon = (iconName: string) => {
    if (iconName === 'store') return <Store className="w-5 h-5" />;
    if (iconName === 'layout-dashboard') return <LayoutDashboard className="w-5 h-5" />;
    return <Play className="w-5 h-5" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-slate-100">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Preset App Templates
              </h3>
              <p className="text-xs text-slate-500">
                Load sample configurations or save your custom setup
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

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Section 1: Sample Presets */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Sample App Templates
            </h4>

            <div className="space-y-2.5">
              {SAMPLE_PRESETS.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onSelectPreset(preset.config);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl border border-slate-200/80 hover:border-blue-500 hover:bg-blue-50/40 transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl text-white flex items-center justify-center shrink-0 ${preset.iconBg}`}
                    >
                      {renderIcon(preset.iconSvg)}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-800 group-hover:text-blue-700">
                        {preset.title}
                      </h5>
                      <p className="text-xs text-slate-500">
                        {preset.config.webAppUrl} • {preset.config.packageName}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white px-3 py-1 rounded-xl transition-colors">
                    Load
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: User Saved Presets */}
          {savedUserConfigs.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                My Saved Presets ({savedUserConfigs.length})
              </h4>

              <div className="space-y-2">
                {savedUserConfigs.map((cfg) => (
                  <div
                    key={cfg.id}
                    onClick={() => {
                      onSelectPreset(cfg);
                      onClose();
                    }}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-400 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800">{cfg.appName}</div>
                      <div className="text-[11px] font-mono text-slate-500">{cfg.packageName}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleDeleteSaved(cfg.id, e)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleSaveCurrentAsPreset}
            className="px-4 py-2 text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 rounded-xl transition-all shadow-2xs flex items-center gap-2"
          >
            {savedNotice ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-600">Saved to Local Storage!</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-4 h-4 text-blue-600" />
                <span>Save Current App as Preset</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-xl transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
