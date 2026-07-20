import type { TraceForgeEvent } from "./types/events.js";
export declare class Transport {
    /**
     * The "dumb" pipe. It doesn't care about what the event is, it just
     * takes the built JSON object and sends it over the network via POST.
     */
    static sendEvent(apiUrl: string, event: TraceForgeEvent): Promise<void>;
}
//# sourceMappingURL=transport.d.ts.map