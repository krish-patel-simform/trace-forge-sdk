const USER_ID_KEY = '__tf_user_id__';
const USER_TRAITS_KEY = '__tf_user_traits__';

export interface UserTraits {
  /**
   * The display name of the user. **Required** — shown in the TraceForge dashboard.
   */
  name: string;
  /**
   * Optional email address of the user.
   */
  email?: string;
  /**
   * Any additional custom properties to associate with this user.
   */
  [key: string]: unknown;
}

/**
 * Manages user identification and persistence for the TraceForge SDK.
 *
 * Uses `localStorage` with fallback to `sessionStorage` or in-memory state.
 */
export class User {
  private static inMemoryUserId: string | null = null;
  private static inMemoryTraits: UserTraits | null = null;

  /**
   * Get the current identified user ID, or null if unidentified.
   */
  static getId(): string | null {
    try {
      return localStorage.getItem(USER_ID_KEY) || sessionStorage.getItem(USER_ID_KEY) || this.inMemoryUserId;
    } catch {
      return this.inMemoryUserId;
    }
  }

  /**
   * Get the current user traits.
   */
  static getTraits(): UserTraits | null {
    try {
      const stored = localStorage.getItem(USER_TRAITS_KEY) || sessionStorage.getItem(USER_TRAITS_KEY);
      if (stored) {
        return JSON.parse(stored) as UserTraits;
      }
      return this.inMemoryTraits;
    } catch {
      return this.inMemoryTraits;
    }
  }

  /**
   * Store user ID and traits.
   *
   * @param userId - Unique identifier for the user.
   * @param traits - User properties including the required `name`.
   */
  static identify(userId: string, traits: UserTraits): void {
    this.inMemoryUserId = userId;
    this.inMemoryTraits = { ...traits };

    try {
      localStorage.setItem(USER_ID_KEY, userId);
      localStorage.setItem(USER_TRAITS_KEY, JSON.stringify(traits));
    } catch {
      try {
        sessionStorage.setItem(USER_ID_KEY, userId);
        sessionStorage.setItem(USER_TRAITS_KEY, JSON.stringify(traits));
      } catch {
        // Fall back to in-memory state only
      }
    }
  }

  /**
   * Clear identified user state (e.g., on logout).
   */
  static clear(): void {
    this.inMemoryUserId = null;
    this.inMemoryTraits = null;

    try {
      localStorage.removeItem(USER_ID_KEY);
      localStorage.removeItem(USER_TRAITS_KEY);
    } catch {
      // Ignore storage clear errors
    }

    try {
      sessionStorage.removeItem(USER_ID_KEY);
      sessionStorage.removeItem(USER_TRAITS_KEY);
    } catch {
      // Ignore storage clear errors
    }
  }
}
