// Validates a post-login "next" target. Only same-origin relative paths are
// allowed ("/mentors/x"), so it can't be used as an open redirect
// ("//evil.com", "/\evil.com", "https://evil.com", "javascript:...").
export function safeNext(value: unknown): string | null {
  if (typeof value !== "string" || !value.startsWith("/")) return null;
  if (value.startsWith("//") || value.startsWith("/\\")) return null;
  try {
    const base = "http://local.invalid";
    const url = new URL(value, base);
    if (url.origin !== base) return null;
    const path = `${url.pathname}${url.search}${url.hash}`;
    // Normalising can produce a protocol-relative path ("/..//evil.com").
    if (path.startsWith("//") || path.startsWith("/\\")) return null;
    // Never bounce back into the auth pages themselves.
    if (/^\/(login|sign-up)(\/|\?|#|$)/.test(path)) return null;
    return path;
  } catch {
    return null;
  }
}
