/**
 * Configuration object passed to `TraceForge.init()`.
 */
export interface TraceForgeConfig {
  /**
   * The project's API key, obtained from the TraceForge dashboard.
   * Sent as the `x-api-key` header on every event request.
   */
  apiKey: string;

  /**
   * The project key (short identifier) included in every event payload.
   * This is derived from the API key prefix for quick look-up on the server.
   * If not provided, the SDK will use the first 8 characters of the apiKey.
   */
  projectKey?: string;
}
