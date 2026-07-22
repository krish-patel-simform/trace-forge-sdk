# TraceForge SDK

A lightweight, strongly-typed Browser SDK for the TraceForge analytics platform.

## Installation

```bash
npm install trace-forge-sdk
```

## Initialization

```typescript
import { TraceForge } from "trace-forge-sdk";

TraceForge.init({
  projectKey: "your-project-key",
  apiUrl: "http://localhost:3000", // Your TraceForge backend URL
});
```

## Usage

```typescript
// Track custom events
TraceForge.track("click", { button: "checkout" });

// Identify user with unique ID and properties (e.g. name, email)
TraceForge.identify("usr_1001", {
  name: "Alex Mercer",
  email: "alex@example.com",
  role: "admin",
});

// Reset user identity on logout
TraceForge.reset();
```
