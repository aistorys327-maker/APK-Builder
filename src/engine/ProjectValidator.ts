import { AppConfig, GitHubConfig } from '../types';
import { isValidUrl, isValidPackageName } from '../utils/defaultConfigs';

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export interface ProjectValidationResult {
  isValid: boolean;
  errors: ValidationErrorDetail[];
  fieldErrors: Record<string, string>;
  summaryMessage: string | null;
}

/**
 * Project Validator Module
 * Validates all app configuration parameters and GitHub connection prerequisites before initiating a build.
 */
export class ProjectValidator {
  /**
   * Performs full validation of AppConfig and GitHubConfig.
   */
  public validateProject(appConfig: AppConfig, githubConfig: GitHubConfig): ProjectValidationResult {
    const errors: ValidationErrorDetail[] = [];
    const fieldErrors: Record<string, string> = {};

    // 1. Web App URL validation
    if (!appConfig.webAppUrl || !appConfig.webAppUrl.trim()) {
      const msg = 'Web App URL is required.';
      errors.push({ field: 'webAppUrl', message: msg });
      fieldErrors.webAppUrl = msg;
    } else if (!appConfig.webAppUrl.trim().startsWith('https://')) {
      const msg = 'Web App URL must start with https:// for secure webview playback.';
      errors.push({ field: 'webAppUrl', message: msg });
      fieldErrors.webAppUrl = msg;
    } else if (!isValidUrl(appConfig.webAppUrl)) {
      const msg = 'Please enter a valid https:// URL (e.g. https://my-app.com).';
      errors.push({ field: 'webAppUrl', message: msg });
      fieldErrors.webAppUrl = msg;
    }

    // 2. App Name validation
    if (!appConfig.appName || !appConfig.appName.trim()) {
      const msg = 'App Name is required.';
      errors.push({ field: 'appName', message: msg });
      fieldErrors.appName = msg;
    }

    // 3. Package Name validation
    if (!appConfig.packageName || !appConfig.packageName.trim()) {
      const msg = 'Package Name is required.';
      errors.push({ field: 'packageName', message: msg });
      fieldErrors.packageName = msg;
    } else if (!isValidPackageName(appConfig.packageName)) {
      const msg = 'Invalid Package Name format. Must use dot notation (e.g. com.company.app).';
      errors.push({ field: 'packageName', message: msg });
      fieldErrors.packageName = msg;
    }

    // 4. Version Name validation
    if (!appConfig.versionName || !appConfig.versionName.trim()) {
      const msg = 'Version Name is required (e.g. 1.0.0).';
      errors.push({ field: 'versionName', message: msg });
      fieldErrors.versionName = msg;
    }

    // 5. Version Code validation
    if (appConfig.versionCode === undefined || appConfig.versionCode === null || isNaN(appConfig.versionCode) || appConfig.versionCode <= 0) {
      const msg = 'Version Code is required and must be a positive integer (e.g. 1).';
      errors.push({ field: 'versionCode', message: msg });
      fieldErrors.versionCode = msg;
    }

    // 6. GitHub Connection Validation
    if (!githubConfig.username || !githubConfig.username.trim()) {
      const msg = 'GitHub Username is missing. Please configure GitHub connection.';
      errors.push({ field: 'github_username', message: msg });
      fieldErrors.github_username = msg;
    }

    if (!githubConfig.repository || !githubConfig.repository.trim()) {
      const msg = 'GitHub Repository name is missing. Please configure GitHub connection.';
      errors.push({ field: 'github_repository', message: msg });
      fieldErrors.github_repository = msg;
    }

    if (!githubConfig.personalAccessToken || !githubConfig.personalAccessToken.trim()) {
      const msg = 'GitHub Personal Access Token is required for Actions dispatching.';
      errors.push({ field: 'github_token', message: msg });
      fieldErrors.github_token = msg;
    }

    if (githubConfig.connectionStatus !== 'connected') {
      const msg = 'GitHub repository is not connected. Please test and verify connection in Section 4.';
      errors.push({ field: 'github_status', message: msg });
      fieldErrors.github_status = msg;
    }

    const isValid = errors.length === 0;
    const summaryMessage = isValid
      ? null
      : `Validation Failed (${errors.length} error${errors.length > 1 ? 's' : ''}): ${errors[0].message}`;

    return {
      isValid,
      errors,
      fieldErrors,
      summaryMessage,
    };
  }
}

export const projectValidator = new ProjectValidator();
