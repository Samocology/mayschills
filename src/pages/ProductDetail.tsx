'use client';

import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { getProduct, ngn, products } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Bookmark, Star, ShoppingCart, Zap, Minus, Plus, ShieldCheck, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useCart, useWishlist } from "@/store";
import ProductCard from "@/components/customer/ProductCard";
import { toast } from "sonner";

type ProductSearch = {
  slug: string;
};

export default function ProductDetail() {
  const search = useSearch({ from: "/(customer)/product-detail" }) as { slug: string };
  const { slug } = search;
  const product = getProduct(slug);
  const nav = useNavigate();
  const add = useCart((s) => s.add);
  const wished = useWishlist((s) => product ? s.ids.includes(product.id) : false);
  const toggleWish = useWishlist((s) => s.toggle);
  const [size, setSize] = useState(1);
  const [toppings, setToppings] = useState<number[]>([0, 4]);
  const [qty, setQty] = useState(2);
  const [gallery, setGallery] = useState(0);

  if (!product) return <div className="p-20 text-center">Product not found. <Link to="/shop" className="text-brand">Back to shop</Link></div>;

  const selectedSize = product.sizes?.[size];
  const unitPrice = (selectedSize?.price ?? product.price) + toppings.reduce((a, i) => a + (product.toppings?.[i]?.price ?? 0), 0);
  const galleryImgs = product.gallery ?? [product.image];
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-6 py-6">
      <nav className="text-sm text-muted-foreground mb-6"><Link to="/" className="hover:text-foreground">Home</Link> / <Link to="/shop" className="hover:text-foreground">{product.category}</Link> / <span className="text-foreground">{product.name}</span></nav>

      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary border">
            <img src={galleryImgs[gallery]} alt={product.name} className="h-full w-full object-cover" />
            {product.badge && <Badge className="absolute top-4 left-4 bg-accent-orange text-white border-0">{product.badge}</Badge>}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {galleryImgs.map((g, i) => (
              <button key={i} onClick={() => setGallery(i)} className={`aspect-square rounded-lg overflow-hidden border-2 ${gallery === i ? "border-brand" : "border-transparent"}`}>
                <img src={g} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <button onClick={() => toggleWish(product.id)} className={`rounded-lg border py-2.5 text-sm font-medium flex items-center justify-center gap-2 ${wished ? "bg-accent-orange/10 border-accent-orange text-accent-orange" : ""}`}>
              <Heart className={`h-4 w-4 ${wished ? "fill-current" : ""}`} /> {wished ? "Favourited" : "Favourite"}
            </button>
            <button className="rounded-lg border py-2.5 text-sm font-medium flex items-center justify-center gap-2"><Share2 className="h-4 w-4" /> Share</button>
            <button className="rounded-lg border py-2.5 text-sm font-medium flex items-center justify-center gap-2"><Bookmark className="h-4 w-4" /> Save</button>
          </div>
        </div>

        <div>
          <div className="flex gap-2 mb-3">
            <Badge variant="secondary" className="text-brand">{product.category}</Badge>
            {product.stock === "In Stock" && <Badge className="bg-success text-success-foreground border-0">● In Stock</Badge>}
            {product.stock === "Low Stock" && <Badge className="bg-warning text-warning-foreground border-0">● Low Stock</Badge>}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <div className="flex text-amber-400">{Array.from({length:5}).map((_,i)=><Star key={i} className={`h-4 w-4 ${i<Math.round(product.rating)?"fill-current":""}`} />)}</div>
            <span className="font-semibold">{product.rating}</span><span className="text-muted-foreground">{product.reviews} reviews</span><span className="text-muted-foreground">• {product.sold} sold this week</span>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <div className="text-3xl font-extrabold text-brand">{ngn(unitPrice)}</div>
            {product.originalPrice && <><div className="text-lg text-muted-foreground line-through">{ngn(product.originalPrice)}</div><Badge className="bg-accent-orange text-white border-0">Save {Math.round((1 - product.price/product.originalPrice)*100)}%</Badge></>}
          </div>
          <p className="mt-4 text-muted-foreground leading-relaxed">{product.description}</p>

          {product.sizes && (
            <div className="mt-6">
              <div className="text-sm font-semibold mb-2">Select Size <span className="text-muted-foreground font-normal">— {product.sizes[size].label} selected</span></div>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((s, i) => (
                  <button key={i} onClick={() => setSize(i)} className={`rounded-xl border p-3 text-left transition ${size === i ? "border-brand bg-brand-soft" : "hover:border-foreground/30"}`}>
                    <div className="text-sm font-bold">{s.label}</div>
                    <div className="text-[10px] text-muted-foreground">{s.volume}</div>
                    <div className="text-sm font-semibold mt-1">{ngn(s.price)}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.toppings && (
            <div className="mt-6">
              <div className="text-sm font-semibold mb-2">Extra Toppings <span className="text-muted-foreground font-normal">— optional</span></div>
              <div className="grid grid-cols-3 gap-2">
                {product.toppings.map((t, i) => {
                  const on = toppings.includes(i);
                  return (
                    <button key={i} onClick={() => setToppings(on ? toppings.filter(x => x !== i) : [...toppings, i])}
                      className={`rounded-lg border p-2.5 flex items-center justify-between gap-2 text-xs transition ${on ? "border-brand bg-brand-soft" : "hover:border-foreground/30"}`}>
                      <span className="flex items-center gap-1.5">{on && <Check className="h-3 w-3 text-brand" />}{t.label}</span>
                      <span className="text-muted-foreground">+₦{t.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6">
            <div className="text-sm font-semibold mb-2">Quantity</div>
            <div className="flex items-center gap-2 w-32 rounded-full border p-1">
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => setQty(Math.max(1, qty-1))}><Minus className="h-3 w-3" /></Button>
              <div className="flex-1 text-center font-semibold">{qty}</div>
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => setQty(qty+1)}><Plus className="h-3 w-3" /></Button>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Button size="lg" className="w-full rounded-full gap-2 h-12" onClick={() => { add({ product, qty, size: selectedSize?.label, toppings: toppings.map(i => product.toppings![i].label), unitPrice }); toast.success(`${qty} × ${product.name} added`); }}>
              <ShoppingCart className="h-4 w-4" /> Add to Cart — {ngn(unitPrice * qty)}
            </Button>
            <Button size="lg" className="w-full rounded-full gap-2 h-12 bg-accent-orange hover:bg-accent-orange/90 text-white" onClick={() => { add({ product, qty, size: selectedSize?.label, toppings: toppings.map(i => product.toppings![i].label), unitPrice }); nav({ to: "/checkout" }); }}>
              <Zap className="h-4 w-4" /> Buy Now
            </Button>
            <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1"><ShieldCheck className="h-3 w-3" /> Secure payment · Free delivery on orders over ₦5,000</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="ingredients" className="mt-12">
        <TabsList className="bg-transparent border-b w-full justify-start rounded-none h-auto p-0">
          <TabsTrigger value="ingredients" className="data-[state=active]:border-brand data-[state=active]:text-brand border-b-2 border-transparent rounded-none">Ingredients & Nutrition</TabsTrigger>
          <TabsTrigger value="reviews" className="data-[state=active]:border-brand data-[state=active]:text-brand border-b-2 border-transparent rounded-none">Reviews ({product.reviews})</TabsTrigger>
          <TabsTrigger value="related" className="data-[state=active]:border-brand data-[state=active]:text-brand border-b-2 border-transparent rounded-none">You May Also Like</TabsTrigger>
        </TabsList>

        <TabsContent value="ingredients" className="mt-6 grid lg:grid-cols-2 gap-8">
          {product.ingredients && (
            <div>
              <h3 className="font-bold text-lg mb-4">What's Inside</h3>
              <div className="space-y-3">
                {product.ingredients.map(i => (
                  <div key={i.name} className="flex justify-between items-center rounded-xl border bg-card p-4">
                    <div><div className="font-semibold">{i.name}</div><div className="text-xs text-muted-foreground">{i.note}</div></div>
                    <div className="text-brand font-bold">{i.amount}</div>
                  </div>
                ))}
              </div>
              {product.dietary && <div className="mt-4 rounded-xl bg-brand-soft p-4 flex flex-wrap gap-3 text-sm font-medium text-brand">{product.dietary.map(d => <span key={d}>✓ {d}</span>)}</div>}
            </div>
          )}
          {product.nutrition && (
            <div>
              <h3 className="font-bold text-lg mb-4">Nutrition Facts</h3>
              <div className="rounded-xl border overflow-hidden">
                <div className="bg-brand text-brand-foreground p-3 font-semibold">Nutrition Facts — {selectedSize?.label} ({selectedSize?.volume}) <span className="float-right text-xs opacity-80">Per serving</span></div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between"><span>Calories</span><span className="text-2xl font-extrabold text-brand">{product.nutrition.calories} <span className="text-xs">kcal</span></span></div>
                  <NutRow label="Total Fat" value={product.nutrition.fat} pct={11} color="bg-amber-500" />
                  <NutRow label="Total Carbs" value={product.nutrition.carbs} pct={17} color="bg-emerald-500" />
                  <NutRow label="Dietary Fibre" value={product.nutrition.fibre} pct={22} color="bg-emerald-600" />
                  <NutRow label="Sugars" value={product.nutrition.sugars} pct={45} color="bg-accent-orange" />
                  <NutRow label="Protein" value={product.nutrition.protein} pct={10} color="bg-purple-500" />
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="grid md:grid-cols-[200px_1fr] gap-6 rounded-2xl border p-6">
            <div className="text-center">
              <div className="text-5xl font-extrabold">{product.rating}</div>
              <div className="flex justify-center text-amber-400 my-1">{Array.from({length:5}).map((_,i)=><Star key={i} className="h-4 w-4 fill-current" />)}</div>
              <div className="text-sm text-muted-foreground">{product.reviews} reviews</div>
            </div>
            <div className="space-y-1.5">
              {[5,4,3,2,1].map(n => (
                <div key={n} className="flex items-center gap-3 text-sm">
                  <span className="w-3">{n}</span>
                  <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden"><div className="h-full bg-amber-400" style={{width:`${[80,15,3,1,1][5-n]}%`}} /></div>
                  <span className="w-8 text-right text-muted-foreground">{[199,29,10,3,2][5-n]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {[
              { name: "Bisi Adeyemo", time: "2 days ago", text: "Absolutely divine! The mango flavour is so real and fresh. I order this every single morning now — it's become my ritual. The chia seeds add such a great texture too!" },
              { name: "Kelechi Nwosu", time: "5 days ago", text: "Best smoothie I've ever had. Tried the large size and it kept me full all morning. The packaging is eco-friendly and arrived super cold. 10/10 would recommend!" },
              { name: "Ngozi Obi", time: "1 week ago", text: "Really good smoothie. Very fresh and you can taste the natural ingredients. Delivery was right on time. Would've given 5 stars but I wish the honey drizzle was a bit more generous!" },
            ].map(r => (
              <div key={r.name} className="rounded-xl border p-5">
                <div className="flex text-amber-400 mb-2">{Array.from({length:5}).map((_,i)=><Star key={i} className="h-3.5 w-3.5 fill-current" />)}</div>
                <p className="text-sm">{`"${r.text}"`}</p>
                <div className="mt-4 flex items-center gap-2"><div className="grid h-8 w-8 rounded-full bg-brand text-brand-foreground text-xs font-bold place-items-center">{r.name[0]}</div><div className="text-xs"><div className="font-semibold">{r.name}</div><div className="text-muted-foreground">{r.time} · Verified Purchase</div></div></div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="related" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{related.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NutRow({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm"><span>{label}</span><span className="font-semibold">{value} <span className="text-xs text-muted-foreground">{pct}% DV</span></span></div>
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden"><div className={`h-full ${color}`} style={{width:`${pct*4}%`}} /></div>
    </div>
  );
}
