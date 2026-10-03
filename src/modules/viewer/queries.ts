import { queryOptions } from "@tanstack/react-query";
import { getNavViewer } from "../../../server/actions/viewer/get-nav-viewer";

export const viewerKeys = {
  nav: ["user-nav"] as const,
};

export const navViewerQueryOptions = queryOptions({
  queryKey: viewerKeys.nav,
  queryFn: () => getNavViewer(),
  // Login and sign-out invalidate this key, so it can stay fresh for a while.
  staleTime: 5 * 60 * 1000,
});
