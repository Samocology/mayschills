'use client';

import { Link } from "@tanstack/react-router";
import { Heart, Plus, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart, useWishlist } from "@/store";
import { ngn, type Product } from "@/data/products";
import { toast } from "sonner";

const badgeColor: Record<string, string> = {
  "Best Seller": "bg-accent-orange text-white",
  "New": "bg-brand text-brand-foreground",
  "Popular": "bg-blue-500 text-white",
  "Vegan": "bg-emerald-500 text-white",
  "20% Off": "bg-accent-orange text-white",
  "Bundle": "bg-amber-500 text-white",
};

export default function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const wished = useWishlist((s) => s.ids.includes(product.id));
  const toggleWish = useWishlist((s) => s.toggle);

  return (
    <div className="group rounded-2xl bg-card overflow-hidden border card-elevated hover:shadow-lg transition">
      <Link to="/product-detail" search={{ slug: product.slug }} className="block relative aspect-square overflow-hidden bg-secondary">
        <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition" />
        {product.badge && <Badge className={`absolute top-3 left-3 border-0 ${badgeColor[product.badge]}`}>{product.badge}</Badge>}
        <button onClick={(e) => { e.preventDefault(); toggleWish(product.id); }}
          className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 backdrop-blur hover:bg-white">
          <Heart className={`h-4 w-4 ${wished ? "fill-accent-orange text-accent-orange" : "text-foreground/60"}`} />
        </button>
      </Link>
      <div className="p-4 space-y-2">
        <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">{product.category}</div>
        <Link to="/product-detail" search={{ slug: product.slug }}><h3 className="font-semibold leading-tight line-clamp-1 hover:text-brand">{product.name}</h3></Link>
        <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">{product.shortDescription}</p>
        <div className="flex items-center gap-1 text-xs">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="font-semibold">{product.rating}</span>
          <span className="text-muted-foreground">({product.reviews})</span>
        </div>
        <div className="flex items-end justify-between pt-1">
          <div>
            <div className="text-[10px] text-muted-foreground">From</div>
            <div className="text-lg font-bold text-brand">{ngn(product.price)}</div>
          </div>
          <Button size="sm" className="gap-1 rounded-full" onClick={() => { add({ product, qty: 1, unitPrice: product.price }); toast.success(`${product.name} added to cart`); }}>
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        </div>
      </div>
    </div>
  );
}
