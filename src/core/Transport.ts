import type { TraceForgeEvent } from "../types/event.js";

// The SDK intrinsically knows its backend URL
// const API_URL = "http://localhost:4000";

const API_URL = "https://trace-forge-backend.onrender.com";

export class Transport {
  /**
   * Send a single event to the TraceForge ingestion endpoint.
   * The `x-api-key` header authenticates the request against the server's
   * SDK auth middleware, which resolves the owning Project from the key hash.
   */
  static async send(event: TraceForgeEvent, apiKey: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      console.error("[TraceForge] Failed to send event:", response.statusText);
    }
  }
}
