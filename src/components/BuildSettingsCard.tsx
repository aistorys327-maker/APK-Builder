import React from 'react';
import { AppPermissions, ScreenOrientation } from '../types';
import { Settings, Wifi, Maximize, Bell, UploadCloud, Camera, Mic } from 'lucide-react';

interface BuildSettingsCardProps {
  permissions: AppPermissions;
  orientation: ScreenOrientation;
  onPermissionChange: (key: keyof AppPermissions, value: boolean) => void;
  onOrientationChange: (orientation: ScreenOrientation) => void;
}

export const BuildSettingsCard: React.FC<BuildSettingsCardProps> = ({
  permissions,
  orientation,
  onPermissionChange,
  onOrientationChange,
}) => {
  const permissionList: Array<{
    key: keyof AppPermissions;
    title: string;
    description: string;
    icon: React.FC<{ className?: string }>;
  }> = [
    {
      key: 'internet',
      title: 'Internet Access',
      description: 'Fetch web content and API endpoints (android.permission.INTERNET)',
      icon: Wifi,
    },
    {
      key: 'notifications',
      title: 'Notifications',
      description: 'Send web push alerts (android.permission.POST_NOTIFICATIONS)',
      icon: Bell,
    },
    {
      key: 'cameraAccess',
      title: 'Camera Access',
      description: 'Capture photos & video (android.permission.CAMERA)',
      icon: Camera,
    },
    {
      key: 'microphoneAccess',
      title: 'Microphone Access',
      description: 'Record audio & voice (android.permission.RECORD_AUDIO)',
      icon: Mic,
    },
    {
      key: 'fileUpload',
      title: 'File Access',
      description: 'Access file picker & storage (android.permission.READ_EXTERNAL_STORAGE)',
      icon: UploadCloud,
    },
    {
      key: 'fullScreen',
      title: 'Full Screen',
      description: 'Hide status and navigation bars for immersive display',
      icon: Maximize,
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 dark:border-slate-800 transition-all">
      
      {/* Card Header */}
      <div className="flex items-center gap-3 mb-5 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            App Permissions & Display
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure Android manifest permissions and screen orientation
          </p>
        </div>
      </div>

      {/* Permissions Toggle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {permissionList.map((item) => {
          const isChecked = !!permissions[item.key];
          const IconComponent = item.icon;

          return (
            <div
              key={item.key}
              onClick={() => onPermissionChange(item.key, !isChecked)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isChecked
                  ? 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30'
                  : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isChecked
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 truncate">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Modern Switch Toggle */}
              <div className="shrink-0">
                <button
                  type="button"
                  role="switch"
                  aria-checked={isChecked}
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                    isChecked ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      isChecked ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Screen Orientation Selector */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          Display Orientation Lock
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { id: 'any', label: 'Auto Rotate', sub: 'Any' },
            { id: 'portrait', label: 'Portrait', sub: 'Vertical' },
            { id: 'landscape', label: 'Landscape', sub: 'Horizontal' },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onOrientationChange(opt.id as ScreenOrientation)}
              className={`p-2.5 text-left rounded-xl border transition-all flex flex-col justify-between ${
                orientation === opt.id
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <span className="text-xs font-semibold">{opt.label}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{opt.sub}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
