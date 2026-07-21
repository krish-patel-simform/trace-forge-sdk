import { TraceForge } from "../TraceForge.js";
import { Transport } from "../core/Transport.js";
import { EventFactory } from "../core/EventFactory.js";

const HEARTBEAT_INTERVAL_MS = 30000; // 30 seconds

export class HeartbeatManager {
  private static intervalId: number | null = null;

  static start(): void {
    if (this.intervalId !== null) return;

    this.sendHeartbeat();

    this.intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        this.sendHeartbeat();
      }
    }, HEARTBEAT_INTERVAL_MS);

    // Also send immediately when tab becomes visible
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  }

  static stop(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
  }

  private static handleVisibilityChange = (): void => {
    if (document.visibilityState === "visible") {
      this.sendHeartbeat();
    }
  };

  private static sendHeartbeat(): void {
    if (!TraceForge.isInitialized()) return;
    const config = TraceForge.getConfig();
    const event = EventFactory.createEvent(config, "heartbeat", {});
    
    Transport.send(event, config.apiKey).catch((err) => {
      console.warn("[TraceForge] Heartbeat failed:", err);
    });
  }
}
