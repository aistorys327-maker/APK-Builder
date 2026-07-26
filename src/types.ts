export interface AppPermissions {
  internet: boolean;
  fullScreen: boolean;
  notifications: boolean;
  fileUpload: boolean;
  cameraAccess: boolean;
  microphoneAccess: boolean;
  keepScreenOn?: boolean;
}

export type ScreenOrientation = 'any' | 'portrait' | 'landscape';
export type IconMaskShape = 'circle' | 'squircle' | 'rounded' | 'teardrop';

export interface AppBranding {
  iconUrl: string | null;
  iconName: string | null;
  iconShape: IconMaskShape;
  splashUrl: string | null;
  splashName: string | null;
  splashBgColor: string;
}

export interface AppConfig {
  id: string;
  webAppUrl: string;
  appName: string;
  packageName: string;
  versionName: string;
  versionCode: number;
  orientation: ScreenOrientation;
  themeColor: string;
  permissions: AppPermissions;
  branding: AppBranding;
  createdAt: number;
  updatedAt: number;
}

export type BuildStepId =
  | 'idle'
  | 'preparing'
  | 'uploading'
  | 'building'
  | 'signing'
  | 'uploading_apk'
  | 'completed'
  | 'failed';

export interface BuildLogEntry {
  timestamp: string;
  level: 'info' | 'success' | 'warn' | 'error' | 'cmd';
  message: string;
}

export interface BuildState {
  status: BuildStepId;
  progressPercent: number;
  currentStepMessage: string;
  logs: BuildLogEntry[];
  startedAt: number | null;
  completedAt: number | null;
  apkDownloadName: string | null;
  apkSizeMb: number | null;
  errorMessage?: string | null;
}

export interface BuildHistoryItem {
  id: string;
  appName: string;
  packageName: string;
  versionName: string;
  versionCode: number;
  dateStr: string;
  timeStr: string;
  timestamp: number;
  config: AppConfig;
}

export type GitHubConnectionStatus = 'not_connected' | 'connecting' | 'connected';

export interface GitHubConfig {
  username: string;
  repository: string;
  branch: string;
  personalAccessToken: string;
  connectionStatus: GitHubConnectionStatus;
  lastTestedAt?: number | null;
  statusMessage?: string | null;
}

export interface BuildWorkflowPayload {
  appName: string;
  webAppUrl: string;
  packageName: string;
  versionName: string;
  versionCode: number;
  orientation: ScreenOrientation;
  themeColor: string;
  permissions: AppPermissions;
  branding: AppBranding;
  github: {
    username: string;
    repository: string;
    branch: string;
  };
  buildTimestamp: number;
}
