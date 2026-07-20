import { EventFactory } from "./core/EventFactory.js";
import { Transport } from "./core/Transport.js";
class TraceForgeSDK {
    config = null;
    init(config) {
        this.config = config;
    }
    getConfig() {
        if (!this.config) {
            throw new Error("TraceForge has not been initialized. Call TraceForge.init() first.");
        }
        return this.config;
    }
    isInitialized() {
        return this.config !== null;
    }
    trackPageView(payload = {}) {
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
//# sourceMappingURL=TraceForge.js.map