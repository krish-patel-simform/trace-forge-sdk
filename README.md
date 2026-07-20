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
TraceForge.track("click", { button: "checkout" });
```
