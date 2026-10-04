import { isServer, QueryClient } from "@tanstack/react-query";
import { ActionError } from "@/utils/action-result";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
        // Retry network/server hiccups once. An ActionError is a deliberate
        // answer (unauthorised, not found), so retrying can't change it.
        retry: (failureCount, error) =>
          !(error instanceof ActionError) && failureCount < 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

// A fresh client per server render, so one request's cache can never be
// served to another user; a single long-lived client in the browser.
export function getQueryClient() {
  if (isServer) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
