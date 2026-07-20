// We hardcode this for now. In a mature SDK, this might be injected during the build process.
const SDK_VERSION = "1.0.0";
export class EventFactory {
    /**
     * Constructs a fully-formed TraceForgeEvent.
     * This function is pure logic: it gathers config and browser state,
     * generates unique IDs, and outputs the final JSON structure.
     */
    static createEvent(eventType, config, payload = {}) {
        return {
            eventId: crypto.randomUUID(),
            projectKey: config.projectKey,
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
}
//# sourceMappingURL=EventFactory.js.map