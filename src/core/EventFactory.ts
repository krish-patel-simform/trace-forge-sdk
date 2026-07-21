import type { TraceForgeConfig } from "../types/config.js";
import type { TraceForgeEvent } from "../types/event.js";

const SDK_VERSION = "1.0.0";

export class EventFactory {
  /**
   * Resolve the projectKey from config.
   * Developers may pass an explicit projectKey, or we derive it from
   * the first 8 characters of the apiKey (matching the server's apiKeyPrefix).
   */
  private static resolveProjectKey(config: TraceForgeConfig): string {
    return config.projectKey ?? config.apiKey.substring(0, 8);
  }

  static createEvent(
    config: TraceForgeConfig,
    eventType: string,
    payload: Record<string, unknown> = {}
  ): TraceForgeEvent {
    return {
      eventId: crypto.randomUUID(),
      projectKey: this.resolveProjectKey(config),
      eventType,
      timestamp: new Date().toISOString(),
      sdkVersion: SDK_VERSION,
      platform: "web",
      context: {
        url: window.location.href,
        path: window.location.pathname,
        title: document.title,
        referrer: document.referrer,
      },
      payload,
    };
  }

  static createPageView(
    config: TraceForgeConfig,
    payload: Record<string, unknown> = {}
  ): TraceForgeEvent {
    return this.createEvent(config, "page_view", payload);
  }
}
