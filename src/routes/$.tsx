import { createFileRoute, redirect } from "@tanstack/react-router";

// Any unknown URL (including the old /auth page that no longer exists) lands on
// the catalog instead of a dead end.
export const Route = createFileRoute("/$")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
