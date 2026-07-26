import { GitHubConfig, BuildWorkflowPayload } from '../types';
import { githubApiService, GitHubRepoInfo, WorkflowDispatchResponse } from '../services/githubApi';

/**
 * GitHub Manager Module
 * Coordinates GitHub repository connection state, credentials verification, and build workflow dispatching.
 */
export class GitHubManager {
  /**
   * Tests and validates GitHub repository connection credentials.
   */
  public async testAndConnect(config: GitHubConfig): Promise<{
    updatedConfig: GitHubConfig;
    repoInfo?: GitHubRepoInfo;
    success: boolean;
    message: string;
  }> {
    const result = await githubApiService.testConnection(config);
    const now = Date.now();

    const updatedConfig: GitHubConfig = {
      ...config,
      connectionStatus: result.success ? 'connected' : 'not_connected',
      lastTestedAt: now,
      statusMessage: result.message,
    };

    return {
      updatedConfig,
      repoInfo: result.repoInfo,
      success: result.success,
      message: result.message,
    };
  }

  /**
   * Dispatches build event payload to the connected GitHub repository.
   */
  public async dispatchBuild(config: GitHubConfig, payload: BuildWorkflowPayload): Promise<WorkflowDispatchResponse> {
    if (config.connectionStatus !== 'connected') {
      return {
        success: false,
        message: 'Cannot dispatch build workflow: GitHub connection is not verified.',
      };
    }

    return await githubApiService.dispatchWorkflow(config, payload);
  }

  /**
   * Helper to verify if build is allowed based on connection state.
   */
  public isReadyForBuild(config: GitHubConfig): boolean {
    return (
      config.connectionStatus === 'connected' &&
      !!config.username.trim() &&
      !!config.repository.trim() &&
      !!config.personalAccessToken.trim()
    );
  }
}

export const gitHubManager = new GitHubManager();
