'use client';

import { useMemo, useState, useEffect } from "react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { categories, products } from "@/data/products";
import ProductCard from "@/components/customer/ProductCard";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Shop() {
  const search = useSearch({ from: "/(customer)/shop" }) as { cat?: string | undefined };
  const navigate = useNavigate();
  const initial = typeof search.cat === 'string' ? search.cat : "all";
  const [cat, setCat] = useState(initial);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("popular");
  const [price, setPrice] = useState<number[]>([500, 20000]);

  const updateSearch = (newCat: string) => {
    navigate({ to: "/shop", search: { cat: newCat === "all" ? undefined : newCat } });
  };

  const filtered = useMemo(() => {
    let list = [...products];
    if (cat !== "all") list = list.filter(p => p.category === cat);
    if (q) list = list.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
    list = list.filter(p => p.price >= price[0] && p.price <= price[1]);
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "popular") list.sort((a, b) => b.sold - a.sold);
    return list;
  }, [cat, q, price, sort]);

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <div className="text-[10px] font-bold tracking-widest text-muted-foreground mb-3">CATEGORIES</div>
        <div className="space-y-1">
          {categories.map(c => (
            <button key={c.value} onClick={() => { setCat(c.value); updateSearch(c.value); }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${cat === c.value ? "bg-brand-soft text-brand font-semibold" : "hover:bg-secondary"}`}>
              <span>{c.name}</span><Badge variant="secondary">{c.count}</Badge>
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="text-[10px] font-bold tracking-widest text-muted-foreground mb-3">PRICE RANGE</div>
        <Slider value={price} onValueChange={setPrice} min={500} max={20000} step={100} />
        <div className="mt-3 flex justify-between text-xs text-muted-foreground"><span>₦{price[0].toLocaleString()}</span><span>₦{price[1].toLocaleString()}</span></div>
      </div>
      <div>
        <div className="text-[10px] font-bold tracking-widest text-muted-foreground mb-3">DIETARY</div>
        <div className="flex flex-wrap gap-2">{["Vegan","Gluten-Free","Sugar-Free","High Protein","Keto"].map(d => <label key={d} className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs cursor-pointer hover:border-brand"><Checkbox /> {d}</label>)}</div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-6 py-8">
      {/* Sale banner */}
      <div className="brand-gradient rounded-2xl p-6 md:p-8 mb-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">New Year Detox Sale — Up to 20% off all Smoothie Packs!</h2>
          <p className="text-white/85 text-sm mt-1">Limited time offer. Use code <span className="font-bold bg-white/20 rounded px-2 py-0.5">FRESH2025</span> at checkout.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-white/15 border-white/20 text-white">Ends Jan 15</Badge>
          <Button className="bg-accent-orange hover:bg-accent-orange/90 rounded-full gap-2">Shop Sale <ArrowRight className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="hidden lg:block"><FilterPanel /></aside>
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex flex-wrap gap-2 flex-1">
              {categories.map(c => (
                <button key={c.value} onClick={() => { setCat(c.value); updateSearch(c.value); }}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium border transition ${cat === c.value ? "bg-brand text-brand-foreground border-brand" : "bg-card hover:border-brand"}`}>
                  {c.name === "All Items" ? "All" : c.name}
                </button>
              ))}
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden gap-1.5"><SlidersHorizontal className="h-4 w-4" /> Filters</Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-auto">
                <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                <div className="mt-6"><FilterPanel /></div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search smoothies, juices, salads..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
            </div>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Sort: Popular</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground">{filtered.length} products found</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">{filtered.map(p => <ProductCard key={p.id} product={p} />)}</div>
          {filtered.length === 0 && <div className="py-20 text-center text-muted-foreground">No products match those filters.</div>}
        </div>
      </div>
    </div>
  );
}
