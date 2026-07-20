import type { TraceForgeEvent } from "../types/event.js";

// The SDK intrinsically knows its backend URL
const API_URL = "http://localhost:4000";

export class Transport {
  static async send(event: TraceForgeEvent): Promise<void> {
    const response = await fetch(`${API_URL}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      console.error("[TraceForge] Failed to send event:", response.statusText);
    }
  }
}
