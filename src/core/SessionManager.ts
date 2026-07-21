const SESSION_KEY = 'tf_session_id';
const SESSION_EXPIRY_KEY = 'tf_session_expiry';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export class SessionManager {
  static getSessionId(): string {
    let sessionId = localStorage.getItem(SESSION_KEY);
    const expiry = localStorage.getItem(SESSION_EXPIRY_KEY);

    const now = Date.now();

    if (!sessionId || !expiry || now > parseInt(expiry, 10)) {
      sessionId = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, sessionId);
    }

    this.refreshSession();
    return sessionId;
  }

  static refreshSession(): void {
    const expiry = Date.now() + SESSION_TIMEOUT_MS;
    localStorage.setItem(SESSION_EXPIRY_KEY, expiry.toString());
  }
}
