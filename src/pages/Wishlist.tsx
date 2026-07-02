'use client';

import { Link } from "@tanstack/react-router";
import { useWishlist } from "@/store";
import { products } from "@/data/products";
import ProductCard from "@/components/customer/ProductCard";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Wishlist() {
  const ids = useWishlist((s) => s.ids);
  const items = products.filter(p => ids.includes(p.id));
  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-6 py-8">
      <div className="flex items-center gap-3 mb-6"><div className="grid h-10 w-10 rounded-full bg-accent-orange/10 place-items-center"><Heart className="h-5 w-5 text-accent-orange fill-accent-orange" /></div><div><h1 className="text-2xl font-bold">Your Wishlist</h1><p className="text-sm text-muted-foreground">{items.length} {items.length === 1 ? "item" : "items"} saved for later</p></div></div>
      {items.length === 0 ? (
        <div className="py-20 text-center"><Heart className="h-16 w-16 mx-auto text-muted-foreground/40" /><h2 className="mt-4 text-xl font-bold">No favourites yet</h2><p className="text-muted-foreground mt-1">Tap the heart on any product to save it for later.</p><Link to="/shop"><Button className="mt-6 rounded-full">Browse Shop</Button></Link></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">{items.map(p => <ProductCard key={p.id} product={p} />)}</div>
      )}
    </div>
  );
}
