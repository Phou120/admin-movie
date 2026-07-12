/**
 * Extract a human-readable error message from a backend/Axios error.
 *
 * The backend returns errors as `{ statusCode, message, ... }`, so the real
 * message lives at `error.response.data.message`. class-validator errors return
 * `message` as a string array. Falls back to the provided default for network
 * errors or responses without a message.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  const message = (
    error as { response?: { data?: { message?: unknown } } }
  )?.response?.data?.message;

  if (Array.isArray(message)) {
    const joined = message.filter(Boolean).join(", ");
    return joined || fallback;
  }
  if (typeof message === "string" && message.trim()) {
    return message;
  }
  return fallback;
}
