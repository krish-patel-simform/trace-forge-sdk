import type { TraceForgeConfig } from "./types/config.js";
import { EventFactory } from "./core/EventFactory.js";
import { Transport } from "./core/Transport.js";
import { initClickTracking } from "./auto-capture/click.js";
import { initScrollTracking } from "./auto-capture/scroll.js";
import { initSearchTracking } from "./auto-capture/search.js";
import { HeartbeatManager } from "./realtime/heartbeat.js";

class TraceForgeSDK {
  private config: TraceForgeConfig | null = null;

  /**
   * Initialize the SDK with your project's API key.
   * Must be called before any tracking methods.
   *
   * @example
   * TraceForge.init({ apiKey: 'tf_your_api_key_here' });
   */
  init(config: TraceForgeConfig): void {
    if (!config.apiKey) {
      console.error(
        "[TraceForge] init() requires an apiKey. Tracking is disabled.",
      );
      return;
    }

    this.config = config;

    // Initialize auto-capture modules
    initClickTracking();
    initScrollTracking();
    initSearchTracking();

    HeartbeatManager.start();

    console.log("[TraceForge] Initialized ✅");
  }

  /**
   * Shutdown the SDK, stopping heartbeats and cleaning up.
   */
  shutdown(): void {
    HeartbeatManager.stop();
    this.config = null;
    console.log("[TraceForge] Shutdown 🛑");
  }

  getConfig(): TraceForgeConfig {
    if (!this.config) {
      throw new Error(
        "TraceForge has not been initialized. Call TraceForge.init() first.",
      );
    }
    return this.config;
  }

  isInitialized(): boolean {
    return this.config !== null;
  }

  /**
   * Track a page view event.
   * Call this on route changes in SPAs, or once on page load.
   *
   * @param payload - Optional additional properties to attach to the event.
   */
  trackPageView(payload: Record<string, unknown> = {}): void {
    if (!this.isInitialized()) {
      console.warn(
        "[TraceForge] Cannot track page view before calling init().",
      );
      return;
    }

    const config = this.getConfig();
    const event = EventFactory.createPageView(config, payload);

    Transport.send(event, config.apiKey).catch((err: unknown) => {
      console.error("[TraceForge] Transport error:", err);
    });
  }

  /**
   * Track a custom event.
   *
   * @param eventName - Must be alphanumeric + underscores, 1-100 characters.
   * @param properties - Optional key/value properties for the event.
   */
  track(eventName: string, properties: Record<string, unknown> = {}): void {
    if (!this.isInitialized()) {
      console.warn(
        `[TraceForge] Cannot track event "${eventName}" before calling init().`,
      );
      return;
    }

    // Basic validation for custom event names
    if (!/^[a-zA-Z0-9_]{1,100}$/.test(eventName)) {
      console.warn(
        `[TraceForge] Invalid event name "${eventName}". Must be alphanumeric + underscores, 1-100 chars.`,
      );
      return;
    }

    const config = this.getConfig();
    const event = EventFactory.createEvent(config, eventName, properties);

    Transport.send(event, config.apiKey).catch((err: unknown) => {
      console.error("[TraceForge] Transport error:", err);
    });
  }
}

export const TraceForge = new TraceForgeSDK();
