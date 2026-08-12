/**
 * One place that knows where the session lives.
 *
 * The token used to be kept in two places at once — `localStorage.lms_token` and the
 * Zustand `lms-auth` blob — and the three API clients cleared different subsets of
 * them on a 401. After an axios 401 the app would rehydrate as "signed in" with no
 * usable token and loop. Everything now reads and clears through here.
 */

export const AUTH_STORAGE_KEY = "lms-auth";
const LEGACY_TOKEN_KEY = "lms_token";
const LEGACY_USER_KEY = "lms_user";
const ENROLLMENT_KEY_PREFIX = "lms-enrollment-";

export function getToken(): string | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.state?.token) return parsed.state.token as string;
    }
  } catch {
    // Corrupt blob — fall through to the legacy key, then to signed-out.
  }
  return localStorage.getItem(LEGACY_TOKEN_KEY);
}

export function getPersistedUserId(): string | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.state?.user?.id) return parsed.state.user.id as string;
    }
  } catch {
    // Ignore and fall through.
  }
  try {
    const user = JSON.parse(localStorage.getItem(LEGACY_USER_KEY) || "{}");
    return user?.id ?? null;
  } catch {
    return null;
  }
}

export function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Removes every trace of the session. Called from `logout()` and from the 401
 * handlers, so all paths leave storage in the same state.
 */
export function clearSession() {
  const enrollmentKeys: string[] = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key?.startsWith(ENROLLMENT_KEY_PREFIX)) enrollmentKeys.push(key);
  }

  [
    AUTH_STORAGE_KEY,
    LEGACY_TOKEN_KEY,
    LEGACY_USER_KEY,
    ...enrollmentKeys,
  ].forEach((key) => localStorage.removeItem(key));
}

/** Shared 401 response: wipe the session and send the visitor to sign in. */
export function handleUnauthorized() {
  clearSession();
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}
