import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  // The old sign-in page is gone: its URL must be handled by the catch-all route
  // that sends visitors to the catalog, never by the not-found fallback.
  it("sends the old /auth URL to the catch-all route instead of not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/auth");

    expect(matches.at(-1)?.routeId).toBe("/$");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
});
