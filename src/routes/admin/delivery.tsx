import { createFileRoute } from "@tanstack/react-router";
import AdminDelivery from "@/pages/admin/Delivery";

export const Route = createFileRoute("/admin/delivery")({
  component: () => <AdminDelivery />,
});