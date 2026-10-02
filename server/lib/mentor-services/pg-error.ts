type PgError = { code?: string; constraint_name?: string };

// Drizzle wraps driver errors in DrizzleQueryError; the postgres-js error
// (with the SQLSTATE code) is on `cause`.
export function getPgError(error: unknown): PgError | null {
  if (typeof error !== "object" || error === null) return null;
  const candidate = (
    "cause" in error && typeof error.cause === "object" && error.cause !== null
      ? error.cause
      : error
  ) as PgError;
  return typeof candidate.code === "string" ? candidate : null;
}

export function isUniqueViolation(error: unknown, constraint?: string) {
  const pgError = getPgError(error);
  return (
    pgError?.code === "23505" &&
    (!constraint || pgError.constraint_name === constraint)
  );
}
