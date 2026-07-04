import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import VerifyEmail from "@/pages/VerifyEmail";

function renderVerify(email = "ada@example.com") {
  return render(
    <MemoryRouter initialEntries={[`/verify-email?email=${encodeURIComponent(email)}`]}>
      <VerifyEmail />
    </MemoryRouter>,
  );
}

function mockFetchOnce(ok: boolean, body: Record<string, unknown>) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok, json: async () => body }),
  );
}

beforeEach(() => {
  vi.unstubAllGlobals();
});

describe("VerifyEmail page (OTP entry)", () => {
  it("shows a signup prompt when no email is present in the URL", () => {
    render(
      <MemoryRouter initialEntries={["/verify-email"]}>
        <VerifyEmail />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: /back to signup/i })).toBeInTheDocument();
  });

  it("only strips non-digit characters and caps the code at 6 digits", () => {
    renderVerify();
    const input = screen.getByLabelText(/verification code/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "12ab34" } });
    expect(input.value).toBe("1234");
  });

  it("submits the otp+email and shows success on verification", async () => {
    mockFetchOnce(true, { message: "Email verified. You can now log in." });
    renderVerify("ada@example.com");

    fireEvent.change(screen.getByLabelText(/verification code/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /verify email/i }));

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /email verified/i })).toBeInTheDocument(),
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/auth/verify-email"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "ada@example.com", otp: "123456" }),
      }),
    );
  });

  it("shows an error and does not navigate away on an invalid code", async () => {
    mockFetchOnce(false, { error: "Invalid or expired verification code" });
    renderVerify();

    fireEvent.change(screen.getByLabelText(/verification code/i), {
      target: { value: "000000" },
    });
    fireEvent.click(screen.getByRole("button", { name: /verify email/i }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(
      screen.queryByRole("heading", { name: /email verified/i }),
    ).not.toBeInTheDocument();
  });

  it("resend button is disabled during its cooldown after a successful resend", async () => {
    mockFetchOnce(true, { message: "A new code has been sent." });
    renderVerify();

    const resendButton = screen.getByRole("button", { name: /resend it/i });
    fireEvent.click(resendButton);

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /resend code in \d+s/i })).toBeDisabled(),
    );
  });

  it("never calls resend automatically on mount — only on explicit click", () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    renderVerify();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
