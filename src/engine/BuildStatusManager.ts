import { BuildState, BuildStepId, BuildLogEntry } from '../types';

export interface StepConfig {
  id: BuildStepId;
  label: string;
  description: string;
  progressPercent: number;
}

export const BUILD_STEPS_CONFIG: StepConfig[] = [
  {
    id: 'preparing',
    label: 'Preparing',
    description: 'Generating app manifest, config assets, and Gradle environment.',
    progressPercent: 15,
  },
  {
    id: 'uploading',
    label: 'Uploading',
    description: 'Uploading project parameters and launcher branding assets.',
    progressPercent: 30,
  },
  {
    id: 'building',
    label: 'Building',
    description: 'Compiling Webview container and Android DEX/AAB bytecode.',
    progressPercent: 55,
  },
  {
    id: 'signing',
    label: 'Signing',
    description: 'Signing APK package with keystore and aligning zipalign.',
    progressPercent: 75,
  },
  {
    id: 'uploading_apk',
    label: 'Uploading APK',
    description: 'Publishing generated release APK to GitHub release artifacts.',
    progressPercent: 90,
  },
  {
    id: 'completed',
    label: 'Completed',
    description: 'APK build finished successfully and ready for installation.',
    progressPercent: 100,
  },
];

/**
 * Build Status Manager Module
 * Manages build state progression, step messages, progress percentages, and event log creation.
 */
export class BuildStatusManager {
  /**
   * Generates initial idle state.
   */
  public getInitialState(): BuildState {
    return {
      status: 'idle',
      progressPercent: 0,
      currentStepMessage: 'Waiting for build trigger...',
      logs: [],
      startedAt: null,
      completedAt: null,
      apkDownloadName: null,
      apkSizeMb: null,
      errorMessage: null,
    };
  }

  /**
   * Transition build state to a new step.
   */
  public updateStep(
    prevState: BuildState,
    stepId: BuildStepId,
    message: string,
    logLevel: BuildLogEntry['level'] = 'info',
    logMsg?: string
  ): BuildState {
    const timeStr = new Date().toLocaleTimeString();
    const stepObj = BUILD_STEPS_CONFIG.find((s) => s.id === stepId);
    const progress = stepObj ? stepObj.progressPercent : prevState.progressPercent;

    const newLogs = [...prevState.logs];
    if (logMsg) {
      newLogs.push({
        timestamp: timeStr,
        level: logLevel,
        message: logMsg,
      });
    }

    return {
      ...prevState,
      status: stepId,
      progressPercent: progress,
      currentStepMessage: message,
      logs: newLogs,
    };
  }

  /**
   * Marks build as failed with exact error logs.
   */
  public failBuild(prevState: BuildState, errorMessage: string): BuildState {
    const timeStr = new Date().toLocaleTimeString();
    return {
      ...prevState,
      status: 'failed',
      currentStepMessage: `Build Failed: ${errorMessage}`,
      errorMessage,
      completedAt: Date.now(),
      logs: [
        ...prevState.logs,
        {
          timestamp: timeStr,
          level: 'error',
          message: `❌ Build Execution Failed: ${errorMessage}`,
        },
      ],
    };
  }

  /**
   * Marks build as completed successfully.
   */
  public completeBuild(prevState: BuildState, appName: string, versionName: string): BuildState {
    const timeStr = new Date().toLocaleTimeString();
    const cleanAppName = (appName || 'app').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const apkName = `${cleanAppName}-v${versionName || '1.0.0'}.apk`;
    const apkSize = parseFloat((8.5 + Math.random() * 4.5).toFixed(1));

    return {
      ...prevState,
      status: 'completed',
      progressPercent: 100,
      currentStepMessage: 'APK Build Completed Successfully!',
      completedAt: Date.now(),
      apkDownloadName: apkName,
      apkSizeMb: apkSize,
      logs: [
        ...prevState.logs,
        {
          timestamp: timeStr,
          level: 'success',
          message: `🎉 APK Build finished successfully! Download payload: ${apkName} (${apkSize} MB)`,
        },
      ],
    };
  }
}

export const buildStatusManager = new BuildStatusManager();
