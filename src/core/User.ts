const USER_ID_KEY = '__tf_user_id__';
const USER_TRAITS_KEY = '__tf_user_traits__';

export interface UserTraits {
  name?: string;
  email?: string;
  [key: string]: unknown;
}

/**
 * Manages user identification and persistence for the TraceForge SDK.
 *
 * Uses `localStorage` with fallback to `sessionStorage` or in-memory state.
 */
export class User {
  private static inMemoryUserId: string | null = null;
  private static inMemoryTraits: UserTraits = {};

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
  static getTraits(): UserTraits {
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
   * Store user ID and optional traits.
   *
   * @param userId - Unique identifier for the user.
   * @param traits - Optional user properties (e.g. name, email).
   */
  static identify(userId: string, traits: UserTraits = {}): void {
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
    this.inMemoryTraits = {};

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
