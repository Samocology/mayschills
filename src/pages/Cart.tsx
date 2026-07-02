'use client';

import { Link } from "@tanstack/react-router";
import { useCart } from "@/store";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { ngn } from "@/data/products";

export default function Cart() {
  const items = useCart((s) => s.items);
  const update = useCart((s) => s.update);
  const remove = useCart((s) => s.remove);
  const subtotal = items.reduce((a, i) => a + i.unitPrice * i.qty, 0);
  const delivery = subtotal > 0 ? 800 : 0;
  const total = subtotal + delivery;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md py-20 px-4 text-center">
        <div className="mx-auto h-24 w-24 rounded-full bg-brand-soft grid place-items-center mb-4"><ShoppingBag className="h-10 w-10 text-brand" /></div>
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground mt-2">Add some fresh goodness to get started.</p>
        <Link to="/shop"><Button className="mt-6 rounded-full">Browse Shop</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 lg:px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart <span className="text-muted-foreground text-base font-medium">({items.length} items)</span></h1>
      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-3">
          {items.map(i => (
            <div key={i.id} className="flex gap-4 rounded-2xl border bg-card p-4">
              <img src={i.product.image} alt="" className="h-24 w-24 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <div>
                    <Link to="/product-detail" search={{ slug: i.product.slug }} className="font-semibold hover:text-brand">{i.product.name}</Link>
                    <div className="text-xs text-muted-foreground">{i.size && `${i.size} · `}{i.toppings && i.toppings.length > 0 ? i.toppings.join(", ") : "No extras"}</div>
                  </div>
                  <div className="text-right shrink-0"><div className="font-bold text-brand">{ngn(i.unitPrice * i.qty)}</div><div className="text-xs text-muted-foreground">{ngn(i.unitPrice)} each</div></div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 rounded-full border p-0.5">
                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={() => update(i.id, i.qty-1)}><Minus className="h-3 w-3" /></Button>
                    <span className="w-6 text-center text-sm font-semibold">{i.qty}</span>
                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={() => update(i.id, i.qty+1)}><Plus className="h-3 w-3" /></Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive gap-1.5" onClick={() => remove(i.id)}><Trash2 className="h-4 w-4" /> Remove</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <aside className="lg:sticky lg:top-20 h-fit rounded-2xl border bg-card p-6 space-y-3">
          <h2 className="font-bold text-lg">Order Summary</h2>
          <div className="flex justify-between text-sm"><span>Subtotal</span><span className="font-semibold">{ngn(subtotal)}</span></div>
          <div className="flex justify-between text-sm"><span>Delivery</span><span className="font-semibold">{ngn(delivery)}</span></div>
          <div className="flex justify-between text-sm"><span>VAT (7.5%)</span><span className="font-semibold">{ngn(Math.round(subtotal*0.075))}</span></div>
          <div className="border-t pt-3 flex justify-between"><span className="font-bold">Total</span><span className="font-extrabold text-xl text-brand">{ngn(total + Math.round(subtotal*0.075))}</span></div>
          <Link to="/checkout"><Button className="w-full rounded-full gap-2 h-11">Proceed to Checkout <ArrowRight className="h-4 w-4" /></Button></Link>
          <Link to="/shop"><Button variant="outline" className="w-full rounded-full">Continue Shopping</Button></Link>
        </aside>
      </div>
    </div>
  );
}
