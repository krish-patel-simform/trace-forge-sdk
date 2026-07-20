const SDK_VERSION = "1.0.0";
export class EventFactory {
    static createPageView(config, payload = {}) {
        return {
            eventId: crypto.randomUUID(),
            projectKey: config.projectKey,
            eventType: "page_view",
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