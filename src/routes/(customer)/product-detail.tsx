import { createFileRoute } from "@tanstack/react-router";
import ProductDetail from "@/pages/ProductDetail";

type ProductSearch = {
  slug: string;
};

export const Route = createFileRoute("/(customer)/product-detail")({
  validateSearch: (search: Record<string, unknown>): ProductSearch => ({
    slug: search.slug as string,
  }),
  component: () => <ProductDetail />,
});
