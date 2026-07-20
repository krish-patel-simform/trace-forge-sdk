import type { TraceForgeConfig } from "./types/config.js";
declare class TraceForgeSDK {
    private config;
    init(config: TraceForgeConfig): void;
    getConfig(): TraceForgeConfig;
    isInitialized(): boolean;
    trackPageView(payload?: Record<string, unknown>): void;
}
export declare const TraceForge: TraceForgeSDK;
export {};
//# sourceMappingURL=TraceForge.d.ts.map