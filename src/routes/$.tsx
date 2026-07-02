import { createFileRoute } from "@tanstack/react-router";
// SPA mount handled in __root.tsx. This splat exists only to satisfy
// TanStack's route tree for arbitrary client-routed URLs.
export const Route = createFileRoute("/$")({
  component: () => null,
});
