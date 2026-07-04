import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore } from "@/stores/authStore";
import type { User } from "@/types";

interface MockFetchResult {
  ok?: boolean;
  body?: unknown;
}

function mockFetchResponses(handler: (url: string, init?: RequestInit) => MockFetchResult) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      const result = handler(url, init);
      return {
        ok: result.ok ?? true,
        json: async () => result.body ?? {},
      } as Response;
    }),
  );
}

beforeEach(() => {
  localStorage.clear();
  useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
  vi.unstubAllGlobals();
});

describe("authStore.login", () => {
  it("stores the token/user and marks the user authenticated on success", async () => {
    mockFetchResponses((url) => {
      if (url.includes("/api/auth/login")) {
        return {
          ok: true,
          body: {
            token: "jwt-token-123",
            user: { id: "u1", name: "Ada", email: "ada@example.com", role: "user" },
          },
        };
      }
      // enrollment refresh triggered as a side effect of login for role "user"
      return { ok: true, body: [] };
    });

    const user = await useAuthStore.getState().login("ada@example.com", "password123");

    expect(user.email).toBe("ada@example.com");
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().token).toBe("jwt-token-123");
    expect(localStorage.getItem("lms_token")).toBe("jwt-token-123");
  });

  it("throws with the server's error message on invalid credentials", async () => {
    mockFetchResponses(() => ({ ok: false, body: { error: "Invalid email or password" } }));

    await expect(
      useAuthStore.getState().login("ada@example.com", "wrong-password"),
    ).rejects.toThrow("Invalid email or password");
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it("propagates the EMAIL_NOT_VERIFIED error code so the UI can redirect to verification", async () => {
    mockFetchResponses(() => ({
      ok: false,
      body: { error: "Please verify your email before logging in.", code: "EMAIL_NOT_VERIFIED" },
    }));

    try {
      await useAuthStore.getState().login("ada@example.com", "password123");
      expect.unreachable("login should have thrown");
    } catch (err) {
      expect((err as Error & { code?: string }).code).toBe("EMAIL_NOT_VERIFIED");
    }
  });
});

describe("authStore.signup", () => {
  it("returns the server's confirmation message without logging the user in", async () => {
    mockFetchResponses(() => ({
      ok: true,
      body: { message: "Account created. Check your email for a verification code." },
    }));

    const message = await useAuthStore.getState().signup("Ada", "ada@example.com", "password123");
    expect(message).toMatch(/verification code/i);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it("throws on a duplicate-email signup error", async () => {
    mockFetchResponses(() => ({ ok: false, body: { error: "Email already in use" } }));
    await expect(
      useAuthStore.getState().signup("Ada", "ada@example.com", "password123"),
    ).rejects.toThrow("Email already in use");
  });
});

describe("authStore.logout", () => {
  it("clears user/token state and localStorage", () => {
    const user: User = {
      id: "u1",
      name: "Ada",
      email: "ada@example.com",
      role: "user",
      joinedAt: "2026-01-01T00:00:00Z",
    };
    useAuthStore.setState({ user, token: "jwt-token-123", isAuthenticated: true });
    localStorage.setItem("lms_token", "jwt-token-123");
    localStorage.setItem("lms_user", "{}");

    useAuthStore.getState().logout();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
    expect(localStorage.getItem("lms_token")).toBeNull();
  });
});
