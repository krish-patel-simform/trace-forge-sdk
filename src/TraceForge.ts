import type { TraceForgeConfig } from "./types/config.js";

class TraceForgeSDK {
  private config: TraceForgeConfig | null = null;

  init(config: TraceForgeConfig) {
    this.config = config;
    console.log("✅ TraceForge initialized");
    console.log(this.config);
  }

  getConfig() {
    if (!this.config) {
      throw new Error(
        "TraceForge has not been initialized. Call TraceForge.init() first.",
      );
    }

    return this.config;
  }

  isIntialized() {
    if (this.config) return true;
    return false;
  }
}

export const TraceForge = new TraceForgeSDK();
