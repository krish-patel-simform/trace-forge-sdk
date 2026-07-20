import type { TraceForgeConfig } from "../types/config.js";
import type { TraceForgeEvent } from "../types/event.js";
export declare class EventFactory {
    static createEvent(config: TraceForgeConfig, eventType: string, payload?: Record<string, unknown>): TraceForgeEvent;
    static createPageView(config: TraceForgeConfig, payload?: Record<string, unknown>): TraceForgeEvent;
}
//# sourceMappingURL=EventFactory.d.ts.map