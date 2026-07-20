import type { TraceForgeConfig } from "./types/config.js";
import { EventFactory } from "./core/EventFactory.js";
import { Transport } from "./core/Transport.js";

class TraceForgeSDK {
  private config: TraceForgeConfig | null = null;

  init(config: TraceForgeConfig) {
    this.config = config;
  }

  getConfig(): TraceForgeConfig {
    if (!this.config) {
      throw new Error(
        "TraceForge has not been initialized. Call TraceForge.init() first.",
      );
    }
    return this.config;
  }

  isInitialized() {
    return this.config !== null;
  }

  trackPageView(payload: Record<string, unknown> = {}) {
    if (!this.isInitialized()) {
      console.warn("[TraceForge] Cannot track page view before calling init().");
      return;
    }

    const config = this.getConfig();
    const event = EventFactory.createPageView(config, payload);
    
    Transport.send(event).catch((err) => {
      console.error("[TraceForge] Transport error:", err);
    });
  }
}

export const TraceForge = new TraceForgeSDK();
