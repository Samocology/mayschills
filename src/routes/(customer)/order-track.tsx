import { createFileRoute } from "@tanstack/react-router";
import OrderTrack from "@/pages/OrderTrack";

export const Route = createFileRoute("/(customer)/order-track")({
  component: () => <OrderTrack />,
});