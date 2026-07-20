export interface TraceForgeEvent {
    eventId: string;
    projectKey: string;
    eventType: string;
    timestamp: string;
    sdkVersion: string;
    platform: 'web';
    context: {
        url: string;
        path: string;
        title?: string;
        referrer?: string;
    };
    payload: Record<string, unknown>;
}
//# sourceMappingURL=event.d.ts.map