import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Narrows a caught value to a readable message.
 *
 * `catch (err: any)` used to be the house style, which silently switched off type
 * checking for whatever came next. Catch clauses are `unknown` now and go through
 * here instead. Axios errors carry the server's message in `response.data.error`,
 * so that is preferred over the generic HTTP status text.
 */
export function errorMessage(err: unknown, fallback = "Something went wrong"): string {
  if (typeof err === "string") return err;

  if (err && typeof err === "object") {
    const axiosError = err as { response?: { data?: { error?: unknown } } };
    const serverError = axiosError.response?.data?.error;
    if (typeof serverError === "string" && serverError) return serverError;

    const message = (err as { message?: unknown }).message;
    if (typeof message === "string" && message) return message;
  }

  return fallback;
}

/** Reads a named field off a caught value without reaching for `any`. */
export function errorField(err: unknown, field: string): string | undefined {
  if (err && typeof err === "object") {
    const value = (err as Record<string, unknown>)[field];
    if (typeof value === "string") return value;
  }
  return undefined;
}
