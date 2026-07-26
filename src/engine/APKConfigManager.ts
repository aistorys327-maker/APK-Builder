import { AppConfig, GitHubConfig, BuildWorkflowPayload } from '../types';
import { DEFAULT_APP_CONFIG } from '../utils/defaultConfigs';

export const DEFAULT_GITHUB_CONFIG: GitHubConfig = {
  username: '',
  repository: '',
  branch: 'main',
  personalAccessToken: '',
  connectionStatus: 'not_connected',
  lastTestedAt: null,
  statusMessage: null,
};

const STORAGE_KEY_APP_CONFIG = 'apk_builder_current_config';
const STORAGE_KEY_GITHUB_CONFIG = 'apk_builder_github_config';

/**
 * APK Configuration Manager
 * Responsible for loading, saving, compiling, exporting, and importing complete app & GitHub build configurations.
 */
export class APKConfigManager {
  /**
   * Load stored AppConfig from localStorage or fallback to defaults.
   */
  public loadAppConfig(): AppConfig {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_APP_CONFIG);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...DEFAULT_APP_CONFIG,
          ...parsed,
          permissions: {
            ...DEFAULT_APP_CONFIG.permissions,
            ...(parsed.permissions || {}),
          },
          branding: {
            ...DEFAULT_APP_CONFIG.branding,
            ...(parsed.branding || {}),
          },
        };
      }
    } catch (e) {
      console.warn('Failed to parse app config from localStorage:', e);
    }
    return { ...DEFAULT_APP_CONFIG };
  }

  /**
   * Save AppConfig to localStorage.
   */
  public saveAppConfig(config: AppConfig): void {
    try {
      localStorage.setItem(STORAGE_KEY_APP_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save app config:', e);
    }
  }

  /**
   * Load stored GitHubConfig from localStorage or fallback to defaults.
   */
  public loadGitHubConfig(): GitHubConfig {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_GITHUB_CONFIG);
      if (raw) {
        return {
          ...DEFAULT_GITHUB_CONFIG,
          ...JSON.parse(raw),
        };
      }
    } catch (e) {
      console.warn('Failed to parse github config from localStorage:', e);
    }
    return { ...DEFAULT_GITHUB_CONFIG };
  }

  /**
   * Save GitHubConfig to localStorage.
   */
  public saveGitHubConfig(config: GitHubConfig): void {
    try {
      localStorage.setItem(STORAGE_KEY_GITHUB_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save github config:', e);
    }
  }

  /**
   * Compiles complete project configuration into a unified workflow payload for GitHub Actions.
   */
  public compileWorkflowPayload(appConfig: AppConfig, githubConfig: GitHubConfig): BuildWorkflowPayload {
    return {
      appName: appConfig.appName.trim(),
      webAppUrl: appConfig.webAppUrl.trim(),
      packageName: appConfig.packageName.trim(),
      versionName: appConfig.versionName.trim(),
      versionCode: Number(appConfig.versionCode) || 1,
      orientation: appConfig.orientation,
      themeColor: appConfig.themeColor,
      permissions: appConfig.permissions,
      branding: appConfig.branding,
      github: {
        username: githubConfig.username.trim(),
        repository: githubConfig.repository.trim(),
        branch: githubConfig.branch.trim() || 'main',
      },
      buildTimestamp: Date.now(),
    };
  }

  /**
   * Exports project configuration as a downloadable JSON blob.
   */
  public exportConfigFile(appConfig: AppConfig): void {
    const jsonString = JSON.stringify(appConfig, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const cleanName = (appConfig.appName || 'app').toLowerCase().replace(/[^a-z0-9]/g, '-');
    link.download = `${cleanName}-build-config.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Validates and imports external config JSON object into standard AppConfig format.
   */
  public importConfigFile(rawObject: unknown): AppConfig {
    if (!rawObject || typeof rawObject !== 'object') {
      throw new Error('Invalid JSON structure. Expecting a valid build-config object.');
    }
    const imported = rawObject as Partial<AppConfig>;
    return {
      ...DEFAULT_APP_CONFIG,
      ...imported,
      permissions: {
        ...DEFAULT_APP_CONFIG.permissions,
        ...(imported.permissions || {}),
      },
      branding: {
        ...DEFAULT_APP_CONFIG.branding,
        ...(imported.branding || {}),
      },
      updatedAt: Date.now(),
    };
  }
}

export const apkConfigManager = new APKConfigManager();
