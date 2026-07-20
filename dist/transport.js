export class Transport {
    /**
     * The "dumb" pipe. It doesn't care about what the event is, it just
     * takes the built JSON object and sends it over the network via POST.
     */
    static async sendEvent(apiUrl, event) {
        try {
            const response = await fetch(`${apiUrl}/events`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(event),
            });
            if (!response.ok) {
                console.error("[TraceForge] Failed to send event:", response.status, response.statusText);
            }
        }
        catch (error) {
            // In a real SDK, you might want to queue this locally if it failed
            // due to a network error so it can be retried later.
            console.error("[TraceForge] Network error sending event:", error);
        }
    }
}
//# sourceMappingURL=transport.js.map