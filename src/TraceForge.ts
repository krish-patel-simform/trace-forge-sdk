import type { TraceForgeConfig } from "./types/config.js";
import { EventFactory } from "./core/EventFactory.js";
import { Transport } from "./core/Transport.js";
import { User, type UserTraits } from "./core/User.js";

import { HeartbeatManager } from "./realtime/heartbeat.js";

class TraceForgeSDK {
  private config: TraceForgeConfig | null = null;
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

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

    let finalEventType = eventName;
    let finalPayload = { ...properties };

    if (!['page_view', 'click', 'scroll', 'search'].includes(eventName)) {
      finalEventType = 'custom';
      finalPayload.eventName = eventName;
    }

    const config = this.getConfig();
    const event = EventFactory.createEvent(config, finalEventType, finalPayload);

    Transport.send(event, config.apiKey).catch((err: unknown) => {
      console.error("[TraceForge] Transport error:", err);
    });
  }

  /**
   * Track an explicit button or link click.
   *
   * @param elementName - The name of the element clicked.
   * @param properties - Optional additional properties to attach to the event.
   */
  trackClick(elementName: string, properties: Record<string, unknown> = {}): void {
    this.track('click', { ...properties, element: elementName, text: elementName, name: elementName });
  }

  /**
   * Track scroll milestones.
   *
   * @param pageName - The name of the page being scrolled.
   * @param depth - Number between 0 and 100 representing percentage scrolled.
   * @param properties - Optional additional properties to attach to the event.
   */
  trackScroll(pageName: string, depth: number, properties: Record<string, unknown> = {}): void {
    this.track('scroll', { ...properties, page: pageName, depth });
  }

  /**
   * Track a search query, with built-in debouncing.
   *
   * @param query - The search query typed by the user.
   * @param properties - Optional additional properties to attach to the event.
   * @param delayMs - Debounce delay in milliseconds (default: 500).
   */
  trackSearch(query: string, properties: Record<string, unknown> = {}, delayMs: number = 500): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    // Only track if the query is not purely whitespace
    if (!query.trim()) {
      return;
    }

    this.searchTimeout = setTimeout(() => {
      this.track('search', { ...properties, query: query.trim() });
      this.searchTimeout = null;
    }, delayMs);
  }

  /**
   * Identify a user with a unique user ID and their traits.
   *
   * @param userId - Unique identifier for the user (e.g., database ID, email, username).
   * @param traits - User properties. `name` is **required** and is displayed in the dashboard.
   *
   * @example
   * TraceForge.identify("usr_1001", {
   *   name: "Alex Mercer",        // required
   *   email: "alex@example.com",  // optional
   *   role: "admin",              // optional – any extra trait
   * });
   */
  identify(userId: string, traits: UserTraits): void {
    if (!this.isInitialized()) {
      console.warn(
        "[TraceForge] Cannot identify user before calling init().",
      );
      return;
    }

    if (!userId || typeof userId !== "string" || !userId.trim()) {
      console.warn("[TraceForge] identify() requires a valid non-empty userId string.");
      return;
    }

    if (!traits.name || typeof traits.name !== "string" || !traits.name.trim()) {
      console.warn("[TraceForge] identify() requires a non-empty \"name\" in traits. This is shown in the dashboard.");
      return;
    }

    const trimmedUserId = userId.trim();
    User.identify(trimmedUserId, traits);

    const config = this.getConfig();
    const event = EventFactory.createEvent(config, "identify", {
      userId: trimmedUserId,
      ...traits,
    });

    Transport.send(event, config.apiKey).catch((err: unknown) => {
      console.error("[TraceForge] Transport error on identify:", err);
    });

    console.log(`[TraceForge] Identified user: ${trimmedUserId} (name: "${traits.name}")`);
  }

  /**
   * Reset current user identity (e.g., on user logout).
   */
  reset(): void {
    User.clear();
    console.log("[TraceForge] Reset user identity 🔄");
  }

  /**
   * Get current identified user ID, or null if unidentified.
   */
  getUserId(): string | null {
    return User.getId();
  }
}

export const TraceForge = new TraceForgeSDK();
