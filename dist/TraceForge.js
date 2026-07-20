import { EventFactory } from "./core/EventFactory.js";
import { Transport } from "./core/Transport.js";
import { initClickTracking } from "./auto-capture/click.js";
import { initScrollTracking } from "./auto-capture/scroll.js";
import { initSearchTracking } from "./auto-capture/search.js";
class TraceForgeSDK {
    config = null;
    init(config) {
        this.config = config;
        // Initialize auto-capture modules
        initClickTracking();
        initScrollTracking();
        initSearchTracking();
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
    track(eventName, properties = {}) {
        if (!this.isInitialized()) {
            console.warn(`[TraceForge] Cannot track event "${eventName}" before calling init().`);
            return;
        }
        // Basic validation for custom event names
        if (!/^[a-zA-Z0-9_]{1,100}$/.test(eventName)) {
            console.warn(`[TraceForge] Invalid event name "${eventName}". Must be alphanumeric + underscores, 1-100 chars.`);
            return;
        }
        const config = this.getConfig();
        const event = EventFactory.createEvent(config, eventName, properties);
        Transport.send(event).catch((err) => {
            console.error("[TraceForge] Transport error:", err);
        });
    }
}
export const TraceForge = new TraceForgeSDK();
//# sourceMappingURL=TraceForge.js.map