import { createFileRoute } from "@tanstack/react-router";
import SignIn from "@/pages/SignIn";

export const Route = createFileRoute("/(customer)/signin")({
  component: () => <SignIn />,
});