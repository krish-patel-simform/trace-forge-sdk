const SESSION_KEY = '__tf_session_id__';

/**
 * Manages a lightweight session identifier for the current browser tab.
 *
 * Uses `sessionStorage` so the ID is:
 *  - Unique per tab (two tabs = two sessions, matching standard analytics semantics)
 *  - Automatically discarded when the tab is closed
 *  - Stable across page navigations and SPA route changes within the same tab
 */
export const Session = {
  /**
   * Returns the current sessionId, creating one if it does not yet exist.
   */
  getId(): string {
    try {
      let id = sessionStorage.getItem(SESSION_KEY);
      if (!id) {
        id = crypto.randomUUID();
        sessionStorage.setItem(SESSION_KEY, id);
      }
      return id;
    } catch {
      // sessionStorage may be unavailable (e.g. in private mode on some browsers).
      // Fall back to an in-memory ID for the lifetime of the page.
      return crypto.randomUUID();
    }
  },
};
