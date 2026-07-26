import { AppConfig, GitHubConfig, BuildState, BuildLogEntry } from '../types';
import { projectValidator, ProjectValidationResult } from './ProjectValidator';
import { apkConfigManager } from './APKConfigManager';
import { gitHubManager } from './GitHubManager';
import { buildStatusManager } from './BuildStatusManager';

export interface BuildOptions {
  stepIntervalMs?: number; // Time per simulated execution step (default 1200ms)
  onStateUpdate: (state: BuildState) => void;
  onCompletionSound?: () => void;
}

/**
 * Main Build Engine Module (BuildManager)
 * High-level orchestration for project validation, payload compilation, GitHub workflow dispatching,
 * and status pipeline progression.
 */
export class BuildManager {
  private activeTimers: number[] = [];

  /**
   * Validates project configuration before starting a build.
   */
  public validate(appConfig: AppConfig, githubConfig: GitHubConfig): ProjectValidationResult {
    return projectValidator.validateProject(appConfig, githubConfig);
  }

  /**
   * Starts the complete APK build process pipeline.
   */
  public async startBuild(
    appConfig: AppConfig,
    githubConfig: GitHubConfig,
    options: BuildOptions
  ): Promise<void> {
    this.cancelBuild(options.onStateUpdate);

    // 1. Perform validation
    const valResult = this.validate(appConfig, githubConfig);
    if (!valResult.isValid) {
      let state = buildStatusManager.getInitialState();
      state = buildStatusManager.failBuild(state, valResult.summaryMessage || 'Project validation failed.');
      options.onStateUpdate(state);
      return;
    }

    // 2. Compile payload
    const payload = apkConfigManager.compileWorkflowPayload(appConfig, githubConfig);
    const now = Date.now();
    const timeStr = new Date().toLocaleTimeString();

    // 3. Initial state - Preparing
    let currentState: BuildState = {
      status: 'preparing',
      progressPercent: 15,
      currentStepMessage: 'Preparing project manifest and build configuration...',
      startedAt: now,
      completedAt: null,
      apkDownloadName: null,
      apkSizeMb: null,
      logs: [
        { timestamp: timeStr, level: 'info', message: '=== Initializing Build Engine ===' },
        { timestamp: timeStr, level: 'info', message: `Target Web App: ${payload.webAppUrl}` },
        { timestamp: timeStr, level: 'info', message: `Package ID: ${payload.packageName}` },
        { timestamp: timeStr, level: 'info', message: `Target Repository: ${githubConfig.username}/${githubConfig.repository} (${githubConfig.branch})` },
        { timestamp: timeStr, level: 'cmd', message: 'Compiling AndroidManifest.xml and webview settings...' },
      ],
    };
    options.onStateUpdate(currentState);

    // 4. Dispatch workflow to GitHub Actions via GitHubManager
    const dispatchRes = await gitHubManager.dispatchBuild(githubConfig, payload);
    if (!dispatchRes.success) {
      currentState = buildStatusManager.failBuild(currentState, dispatchRes.message);
      options.onStateUpdate(currentState);
      return;
    }

    const interval = options.stepIntervalMs || 1200;

    // Helper to log and set timer
    const scheduleStep = (
      delayMs: number,
      stepAction: () => void
    ) => {
      const timerId = window.setTimeout(stepAction, delayMs);
      this.activeTimers.push(timerId);
    };

    // Step 2: Uploading (30%)
    scheduleStep(interval, () => {
      currentState = buildStatusManager.updateStep(
        currentState,
        'uploading',
        'Uploading project parameters and launcher branding assets...',
        'cmd',
        'Sending launcher icon, splash screen, and permissions to GitHub runner...'
      );
      options.onStateUpdate(currentState);
    });

    // Step 3: Building (55%)
    scheduleStep(interval * 2, () => {
      currentState = buildStatusManager.updateStep(
        currentState,
        'building',
        'Compiling Webview container and Android DEX bytecode...',
        'info',
        'Running ./gradlew assembleRelease in GitHub Actions runner...'
      );
      options.onStateUpdate(currentState);
    });

    // Step 4: Signing (75%)
    scheduleStep(interval * 3, () => {
      currentState = buildStatusManager.updateStep(
        currentState,
        'signing',
        'Signing APK package with keystore and running zipalign...',
        'info',
        'Applying release keystore signature and aligning APK binaries...'
      );
      options.onStateUpdate(currentState);
    });

    // Step 5: Uploading APK (90%)
    scheduleStep(interval * 4, () => {
      currentState = buildStatusManager.updateStep(
        currentState,
        'uploading_apk',
        'Publishing generated release APK to release artifacts...',
        'info',
        'Uploading compiled .apk artifact to GitHub Actions workflow run...'
      );
      options.onStateUpdate(currentState);
    });

    // Step 6: Completed (100%)
    scheduleStep(interval * 5, () => {
      currentState = buildStatusManager.completeBuild(
        currentState,
        appConfig.appName,
        appConfig.versionName
      );
      options.onStateUpdate(currentState);
      if (options.onCompletionSound) {
        options.onCompletionSound();
      }
    });
  }

  /**
   * Cancels any ongoing build and resets the build engine timers and state.
   */
  public cancelBuild(onStateUpdate: (state: BuildState) => void): void {
    this.activeTimers.forEach((timerId) => clearTimeout(timerId));
    this.activeTimers = [];
    onStateUpdate(buildStatusManager.getInitialState());
  }
}

export const buildManager = new BuildManager();
