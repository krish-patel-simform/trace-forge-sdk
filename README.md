# TraceForge SDK

A lightweight, strongly-typed Browser SDK for the TraceForge analytics platform.

This SDK allows you to easily track page views, user clicks, scrolls, search queries, custom events, and identify users in your frontend applications. It also handles automatic session heartbeats and request batching.

## Installation

```bash
npm install trace-forge-sdk
# or
yarn add trace-forge-sdk
# or
pnpm add trace-forge-sdk
```

## Initialization

Before tracking any events, you must initialize the SDK with your project's API key. This should be done as early as possible in your application lifecycle (e.g., in `index.ts`, `App.tsx`, or `main.tsx`).

```typescript
import { TraceForge } from "trace-forge-sdk";

TraceForge.init({
  apiKey: "tf_your_api_key_here",
});
```

### Configuration Options (`TraceForgeConfig`)

- `apiKey` (`string`, **required**): Your project's API key. Used to authenticate requests.
- `projectKey` (`string`, optional): A short identifier included in every event payload. If omitted, the SDK derives it from the first 8 characters of your API key.

---

## Tracking API

### `trackPageView(pageName, payload?)`

Tracks a page view event. Call this on route changes in Single Page Applications (SPAs), or once on initial page load.

**Parameters:**

- `pageName` (`string`, **required**): The name or identifier of the page being viewed.
- `payload` (`Record<string, unknown>`, optional): Additional custom properties to attach to the event.

**Example:**

```typescript
TraceForge.trackPageView("Dashboard", {
  path: window.location.pathname,
  referrer: document.referrer,
});
```

### `track(eventName, properties?)`

Tracks a custom event. Use this for specific user interactions or business logic milestones that aren't covered by the built-in tracking methods.

**Parameters:**

- `eventName` (`string`, **required**): The name of the event. Must be alphanumeric + underscores, 1-100 characters.
- `properties` (`Record<string, unknown>`, optional): Key/value properties for the event.

**Example:**

```typescript
TraceForge.track("item_added_to_cart", {
  itemId: "prod_12345",
  price: 29.99,
  currency: "USD",
});
```

### `trackClick(elementName, properties?)`

Tracks an explicit button, link, or element click. It automatically sets the event type to `click`.

**Parameters:**

- `elementName` (`string`, **required**): The name or identifier of the element clicked.
- `properties` (`Record<string, unknown>`, optional): Additional properties to attach to the click event.

**Example:**

```typescript
document.getElementById("checkout-btn")?.addEventListener("click", () => {
  TraceForge.trackClick("checkout_button", { cart_value: 150 });
});
```

### `trackScroll(pageName, depth, properties?)`

Tracks scroll milestones (e.g., when a user scrolls to 25%, 50%, 75%, 100% of the page).

**Parameters:**

- `pageName` (`string`, **required**): The name or path of the page being scrolled.
- `depth` (`number`, **required**): Number between 0 and 100 representing percentage scrolled.
- `properties` (`Record<string, unknown>`, optional): Additional properties to attach.

**Example:**

```typescript
// Track when a user scrolls to 50% of the pricing page
TraceForge.trackScroll("/pricing", 50, { plan: "pro" });
```

### `trackSearch(query, properties?, delayMs?)`

Tracks a search query with a built-in debounce, ensuring you don't send tracking events on every single keystroke.

**Parameters:**

- `query` (`string`, **required**): The search query typed by the user. If the query is empty or whitespace, the event is ignored.
- `properties` (`Record<string, unknown>`, optional): Additional properties.
- `delayMs` (`number`, optional): Debounce delay in milliseconds. Defaults to `500`ms.

**Example:**

```typescript
// Call this directly inside an onChange handler; it automatically debounces
const handleSearchInput = (e) => {
  const query = e.target.value;
  TraceForge.trackSearch(query, { category: "electronics" });
};
```

---

## User Identification API

### `identify(userId, traits)`

Identifies a user with a unique user ID and assigns them traits. This is useful for tracking authenticated users across sessions.

**Parameters:**

- `userId` (`string`, **required**): Unique identifier for the user (e.g., database ID, email, username).
- `traits` (`UserTraits`, **required**): User properties. The `name` field is **required** and is displayed in the TraceForge dashboard.

**Example:**

```typescript
TraceForge.identify("usr_1001", {
  name: "Alex Mercer", // required
  email: "alex@example.com", // optional
  role: "admin", // optional
  plan: "premium", // optional
});
```

### `getUserId()`

Gets the current identified user ID from local storage.

**Returns:**

- `string | null`: The user ID if identified, or `null` if the user is unidentified (anonymous).

**Example:**

```typescript
const userId = TraceForge.getUserId();
if (userId) {
  console.log("Current user:", userId);
}
```

### `reset()`

Resets the current user identity. Call this when a user logs out of your application to clear their tracked identity and generate a new anonymous session.

**Example:**

```typescript
function handleLogout() {
  TraceForge.reset();
  // ... proceed with application logout logic
}
```

---

## Lifecycle Methods

### `shutdown()`

Shuts down the SDK, stopping the automatic background heartbeats and cleaning up resources. Useful if you need to dynamically disable tracking.

**Example:**

```typescript
TraceForge.shutdown();
```

---

## Development & Building

If you are contributing to the SDK or building it from source:

```bash
npm install
npm run build
```

This will compile the TypeScript code into the `dist` directory, making it ready to be imported by other projects.
