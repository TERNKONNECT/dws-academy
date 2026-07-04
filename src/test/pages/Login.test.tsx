import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "@/pages/Login";
import { useAuthStore } from "@/stores/authStore";

type AuthStoreState = ReturnType<typeof useAuthStore.getState>;
const mockLogin = () => vi.fn<AuthStoreState["login"]>();

const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => navigateMock };
});

beforeEach(() => {
  navigateMock.mockClear();
  useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
});

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );
}

describe("Login page", () => {
  it("does not submit when email/password are missing", () => {
    const loginSpy = mockLogin();
    useAuthStore.setState({ login: loginSpy });

    renderLogin();
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(loginSpy).not.toHaveBeenCalled();
  });

  it("logs in and redirects a regular user to the homepage", async () => {
    const loginSpy = mockLogin().mockResolvedValue({ role: "user" } as Awaited<
      ReturnType<AuthStoreState["login"]>
    >);
    useAuthStore.setState({ login: loginSpy });

    renderLogin();
    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: "ada@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => expect(loginSpy).toHaveBeenCalledWith("ada@example.com", "password123"));
    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith("/"));
  });

  it("redirects an admin to the dashboard", async () => {
    const loginSpy = mockLogin().mockResolvedValue({ role: "admin" } as Awaited<
      ReturnType<AuthStoreState["login"]>
    >);
    useAuthStore.setState({ login: loginSpy });

    renderLogin();
    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: "admin@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith("/dashboard"));
  });

  it("redirects to email verification when login fails with EMAIL_NOT_VERIFIED", async () => {
    const error = Object.assign(new Error("Please verify your email"), {
      code: "EMAIL_NOT_VERIFIED",
    });
    const loginSpy = mockLogin().mockRejectedValue(error);
    useAuthStore.setState({ login: loginSpy });

    renderLogin();
    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: "unverified@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(
        "/verify-email?email=unverified%40example.com",
      ),
    );
  });
});
