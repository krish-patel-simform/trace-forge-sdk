const SDK_VERSION = "1.0.0";
export class EventFactory {
    static createEvent(config, eventType, payload = {}) {
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
    static createPageView(config, payload = {}) {
        return this.createEvent(config, "page_view", payload);
    }
}
//# sourceMappingURL=EventFactory.js.map