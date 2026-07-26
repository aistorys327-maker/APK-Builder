import { AppConfig } from '../types';

export const DEFAULT_APP_CONFIG: AppConfig = {
  id: 'default-config',
  webAppUrl: 'https://m.youtube.com',
  appName: 'My Web App',
  packageName: 'com.mycompany.app',
  versionName: '1.0.0',
  versionCode: 1,
  orientation: 'any',
  themeColor: '#2563eb',
  permissions: {
    internet: true,
    fullScreen: false,
    notifications: true,
    fileUpload: true,
    cameraAccess: false,
    microphoneAccess: false,
    keepScreenOn: false,
  },
  branding: {
    iconUrl: null,
    iconName: null,
    iconShape: 'squircle',
    splashUrl: null,
    splashName: null,
    splashBgColor: '#2563eb',
  },
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export interface AppPreset {
  title: string;
  category: string;
  config: Partial<AppConfig>;
  iconBg: string;
  iconSvg: string;
}

export const SAMPLE_PRESETS: AppPreset[] = [
  {
    title: 'Modern E-Commerce Store',
    category: 'Shopping',
    iconBg: 'bg-blue-600',
    iconSvg: 'store',
    config: {
      webAppUrl: 'https://store.example.com',
      appName: 'Apex Store',
      packageName: 'com.apexstore.app',
      versionName: '1.0.0',
      versionCode: 1,
      themeColor: '#2563eb',
      permissions: {
        internet: true,
        fullScreen: false,
        notifications: true,
        fileUpload: true,
        cameraAccess: true,
        microphoneAccess: false,
        keepScreenOn: false,
      },
    },
  },
  {
    title: 'SaaS Dashboard App',
    category: 'Productivity',
    iconBg: 'bg-indigo-600',
    iconSvg: 'layout-dashboard',
    config: {
      webAppUrl: 'https://app.dashboard.io',
      appName: 'Metrics Hub',
      packageName: 'com.metricshub.analytics',
      versionName: '1.2.0',
      versionCode: 2,
      themeColor: '#4f46e5',
      permissions: {
        internet: true,
        fullScreen: true,
        notifications: true,
        fileUpload: true,
        cameraAccess: false,
        microphoneAccess: false,
        keepScreenOn: true,
      },
    },
  },
  {
    title: 'Media Player & Streamer',
    category: 'Entertainment',
    iconBg: 'bg-cyan-600',
    iconSvg: 'play',
    config: {
      webAppUrl: 'https://music.example.com',
      appName: 'StreamPulse',
      packageName: 'com.streampulse.player',
      versionName: '2.0.1',
      versionCode: 5,
      themeColor: '#0891b2',
      permissions: {
        internet: true,
        fullScreen: true,
        notifications: true,
        fileUpload: false,
        cameraAccess: false,
        microphoneAccess: true,
        keepScreenOn: true,
      },
    },
  },
];

export function derivePackageName(url: string, appName: string): string {
  try {
    if (url) {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      const hostname = parsed.hostname.replace(/^www\./, '');
      const parts = hostname.split('.').reverse();
      if (parts.length >= 2) {
        const cleanParts = parts.map((p) => p.toLowerCase().replace(/[^a-z0-9]/g, ''));
        return cleanParts.join('.');
      }
    }
  } catch {
    // fallback to app name
  }

  const cleanAppName = appName
    ? appName.toLowerCase().replace(/[^a-z0-9]/g, '')
    : 'app';
  return `com.company.${cleanAppName || 'webapp'}`;
}

export function isValidUrl(url: string): boolean {
  if (!url || !url.trim()) return false;
  const trimmed = url.trim();
  if (!trimmed.startsWith('https://')) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' && parsed.hostname.length > 0;
  } catch {
    return false;
  }
}

export function isValidPackageName(pkg: string): boolean {
  if (!pkg || !pkg.trim()) return false;
  const trimmed = pkg.trim();
  // Valid Android package name: at least 2 segments separated by dots, starting with letters
  const standardRegex = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/i;
  return standardRegex.test(trimmed);
}

export interface ValidationErrors {
  webAppUrl?: string;
  appName?: string;
  packageName?: string;
  versionName?: string;
  versionCode?: string;
}

export function validateAppConfig(config: AppConfig): ValidationErrors {
  const errors: ValidationErrors = {};

  // 1. Web App URL is required & must start with https://
  if (!config.webAppUrl || !config.webAppUrl.trim()) {
    errors.webAppUrl = 'Web App URL is required.';
  } else if (!config.webAppUrl.trim().startsWith('https://')) {
    errors.webAppUrl = 'Web App URL must start with https://';
  } else if (!isValidUrl(config.webAppUrl)) {
    errors.webAppUrl = 'Please enter a valid https:// URL.';
  }

  // 2. App Name is required
  if (!config.appName || !config.appName.trim()) {
    errors.appName = 'App Name is required.';
  }

  // 3. Package Name is required & valid format (e.g. com.company.app)
  if (!config.packageName || !config.packageName.trim()) {
    errors.packageName = 'Package Name is required.';
  } else if (!isValidPackageName(config.packageName)) {
    errors.packageName = 'Invalid Package Name format. Example: com.company.app';
  }

  // 4. Version Name is required
  if (!config.versionName || !config.versionName.trim()) {
    errors.versionName = 'Version Name is required.';
  }

  // 5. Version Code is required
  if (config.versionCode === undefined || config.versionCode === null || isNaN(config.versionCode) || config.versionCode <= 0) {
    errors.versionCode = 'Version Code is required and must be a positive integer.';
  }

  return errors;
}
