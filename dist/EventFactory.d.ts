import type { TraceForgeConfig } from "./types/config.js";
import type { TraceForgeEvent } from "./types/events.js";
export declare class EventFactory {
    /**
     * Constructs a fully-formed TraceForgeEvent.
     * This function is pure logic: it gathers config and browser state,
     * generates unique IDs, and outputs the final JSON structure.
     */
    static createEvent(eventType: string, config: TraceForgeConfig, payload?: Record<string, unknown>): TraceForgeEvent;
}
//# sourceMappingURL=EventFactory.d.ts.map