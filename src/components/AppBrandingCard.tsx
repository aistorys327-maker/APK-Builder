import React, { useRef } from 'react';
import { AppBranding, IconMaskShape } from '../types';
import { Image, Upload, Trash2, Smartphone, Rocket, ShoppingBag, Globe, Zap, Heart, Sparkles, Check } from 'lucide-react';

interface AppBrandingCardProps {
  branding: AppBranding;
  appName: string;
  themeColor: string;
  onChange: (updated: Partial<AppBranding>) => void;
}

export const AppBrandingCard: React.FC<AppBrandingCardProps> = ({
  branding,
  appName,
  themeColor,
  onChange,
}) => {
  const iconFileInputRef = useRef<HTMLInputElement>(null);
  const splashFileInputRef = useRef<HTMLInputElement>(null);

  const handleIconFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        onChange({
          iconUrl: evt.target?.result as string,
          iconName: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSplashFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        onChange({
          splashUrl: evt.target?.result as string,
          splashName: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const maskClass: Record<IconMaskShape, string> = {
    circle: 'rounded-full',
    squircle: 'rounded-[24%]',
    rounded: 'rounded-2xl',
    teardrop: 'rounded-t-full rounded-br-full rounded-bl-xl',
  };

  // Default preset icon templates if user hasn't uploaded a custom icon
  const iconPresets = [
    { id: 'globe', Icon: Globe, bg: '#2563eb' },
    { id: 'rocket', Icon: Rocket, bg: '#0284c7' },
    { id: 'store', Icon: ShoppingBag, bg: '#4f46e5' },
    { id: 'zap', Icon: Zap, bg: '#0891b2' },
    { id: 'heart', Icon: Heart, bg: '#e11d48' },
  ];

  const applyPresetIcon = (preset: typeof iconPresets[0]) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = preset.bg;
      ctx.fillRect(0, 0, 512, 512);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 240px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const initial = (appName || 'A').trim().charAt(0).toUpperCase();
      ctx.fillText(initial, 256, 260);

      const dataUrl = canvas.toDataURL('image/png');
      onChange({
        iconUrl: dataUrl,
        iconName: `${appName || 'App'}_Icon.png`,
      });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 dark:border-slate-800 transition-all">
      
      {/* Card Header */}
      <div className="flex items-center gap-3 mb-5 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
          <Image className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            App Branding & Assets
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Launcher icon and splash screen configuration
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SECTION A: APP ICON UPLOAD & PREVIEW */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Launcher Icon <span className="text-blue-600 dark:text-blue-400">*</span>
            </label>
            {branding.iconUrl && (
              <button
                type="button"
                onClick={() => onChange({ iconUrl: null, iconName: null })}
                className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline inline-flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>

          {/* Upload Drop Zone / Preview Container */}
          <div className="bg-slate-50/70 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-400 rounded-2xl p-4 transition-all">
            <input
              ref={iconFileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp, image/svg+xml"
              onChange={handleIconFileSelect}
              className="hidden"
            />

            {branding.iconUrl ? (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Live Adaptive Icon Preview */}
                <div className="relative group shrink-0">
                  <div
                    className={`w-24 h-24 shadow-md transition-all overflow-hidden bg-slate-900 flex items-center justify-center ${
                      maskClass[branding.iconShape]
                    }`}
                  >
                    <img
                      src={branding.iconUrl}
                      alt="App Icon Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 right-0 bg-blue-600 text-white p-1 rounded-full text-[10px]">
                    <Check className="w-3 h-3" />
                  </div>
                </div>

                <div className="text-center sm:text-left space-y-2 flex-1">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                    {branding.iconName || 'custom-app-icon.png'}
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => iconFileInputRef.current?.click()}
                      className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-slate-700 hover:bg-blue-50 rounded-xl transition-all shadow-xs"
                    >
                      Change Icon
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => iconFileInputRef.current?.click()}
                className="flex flex-col items-center justify-center text-center py-6 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Upload Custom Icon
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  PNG, WEBP, or SVG (Square 512x512px)
                </p>
              </div>
            )}
          </div>

          {/* Icon Shape selector */}
          <div className="space-y-3 pt-1">
            <div>
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                Launcher Mask Shape
              </span>
              <div className="grid grid-cols-4 gap-2">
                {(['squircle', 'circle', 'rounded', 'teardrop'] as IconMaskShape[]).map((shape) => (
                  <button
                    key={shape}
                    type="button"
                    onClick={() => onChange({ iconShape: shape })}
                    className={`py-1.5 px-2 text-xs font-medium rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      branding.iconShape === shape
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-slate-400 dark:bg-slate-500 ${maskClass[shape]}`} />
                    <span className="capitalize text-[10px]">{shape}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Generator presets */}
            {!branding.iconUrl && (
              <div className="bg-slate-50/80 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    Preset Generator:
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {iconPresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPresetIcon(preset)}
                      className="w-8 h-8 rounded-xl text-white flex items-center justify-center transition-transform hover:scale-105 shadow-xs"
                      style={{ backgroundColor: preset.bg }}
                      title={`Generate icon from ${preset.id}`}
                    >
                      <preset.Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* SECTION B: SPLASH SCREEN UPLOAD & PREVIEW */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Splash Screen <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            {branding.splashUrl && (
              <button
                type="button"
                onClick={() => onChange({ splashUrl: null, splashName: null })}
                className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline inline-flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>

          <div className="bg-slate-50/70 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-400 rounded-2xl p-4 transition-all min-h-[148px] flex flex-col justify-center">
            <input
              ref={splashFileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleSplashFileSelect}
              className="hidden"
            />

            {branding.splashUrl ? (
              <div className="flex items-center gap-4">
                {/* Phone Splash Screen Mockup */}
                <div className="w-14 h-24 rounded-xl bg-slate-900 border border-slate-700 shadow-md relative overflow-hidden shrink-0 flex items-center justify-center">
                  <img
                    src={branding.splashUrl}
                    alt="Splash Preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1.5 flex-1">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {branding.splashName || 'splash-screen.png'}
                  </p>
                  <button
                    type="button"
                    onClick={() => splashFileInputRef.current?.click()}
                    className="px-3 py-1 text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-lg transition-all shadow-xs"
                  >
                    Change Image
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => splashFileInputRef.current?.click()}
                className="flex flex-col items-center justify-center text-center py-4 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 flex items-center justify-center transition-all mb-2">
                  <Smartphone className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Upload Splash Image
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  1080×1920px PNG or WEBP
                </p>
              </div>
            )}
          </div>

          {/* Color theme chooser for splash background */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
              Splash Screen Color
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={branding.splashBgColor}
                onChange={(e) => onChange({ splashBgColor: e.target.value })}
                className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer p-0.5 bg-white dark:bg-slate-800"
              />
              <span className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                {branding.splashBgColor}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
