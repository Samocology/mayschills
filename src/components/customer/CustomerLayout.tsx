'use client';

import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Leaf, Search, Heart, ShoppingCart, User, Home, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, useWishlist, useAuth } from "@/store";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

function Header() {
  const cartCount = useCart((s) => s.items.reduce((a, i) => a + i.qty, 0));
  const wishCount = useWishlist((s) => s.ids.length);
  const user = useAuth((s) => s.user);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 lg:px-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand">
            <Leaf className="h-5 w-5 text-brand-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight sm:text-xl">MaysChills</span>
        </Link>

        <nav className="hidden flex-1 justify-center md:flex">
          <div className="flex items-center gap-1 rounded-full border border-border/70 bg-background/80 px-1 py-1 shadow-sm">
            <Link to="/" className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isActive("/") ? "bg-brand text-brand-foreground shadow-sm" : "text-foreground/80 hover:text-foreground"}`}>Home</Link>
            <Link to="/shop" className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isActive("/shop") ? "bg-brand text-brand-foreground shadow-sm" : "text-foreground/80 hover:text-foreground"}`}>Shop</Link>
          </div>
        </nav>

        <div className="flex-1 md:hidden" />

        <div className="flex items-center gap-1">
          <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><Search className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="top" className="h-auto">
              <SheetHeader><SheetTitle>Search MaysChills</SheetTitle></SheetHeader>
              <div className="mt-4 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search smoothies, juices, salads..." className="pl-10 h-12" autoFocus />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Mango", "Detox", "Vegan", "Protein", "Berries", "Citrus"].map(t => (
                  <Badge key={t} variant="secondary" className="cursor-pointer">{t}</Badge>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {wishCount > 0 && <span className="absolute -top-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-accent-orange text-[10px] font-bold text-white">{wishCount}</span>}
            </Button>
          </Link>
          <Link to="/cart">
            <Button className="gap-2 rounded-full">
              <ShoppingCart className="h-4 w-4" /> <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && <span className="grid h-5 w-5 place-items-center rounded-full bg-accent-orange text-xs font-bold text-white">{cartCount}</span>}
            </Button>
          </Link>
          {user ? (
            <Link to="/profile" className="ml-1 hidden sm:flex items-center gap-2 rounded-full border px-2 py-1 pr-3 hover:bg-accent">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-brand text-brand-foreground text-xs font-bold">{user.name[0]}</div>
              <span className="text-sm font-medium">{user.name.split(" ")[0]}</span>
            </Link>
          ) : (
            <Link to="/signin" className="ml-1 hidden sm:block">
              <Button variant="outline" size="sm" className="gap-1.5"><User className="h-4 w-4" /> Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  const location = useLocation();
  const cartCount = useCart((s) => s.items.reduce((a, i) => a + i.qty, 0));
  const wishCount = useWishlist((s) => s.ids.length);
  const items = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/shop", icon: Store, label: "Shop" },
    { to: "/wishlist", icon: Heart, label: "Wishlist", count: wishCount },
    { to: "/cart", icon: ShoppingCart, label: "Cart", count: cartCount },
    { to: "/profile", icon: User, label: "Profile" },
  ];
  if (location.pathname.startsWith("/admin")) return null;
  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1 rounded-2xl bg-secondary/60 p-1.5">
        {items.map(({ to, icon: Icon, label, count }) => {
          const active = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
          return (
            <Link key={to} to={to} className="flex flex-col items-center gap-1 rounded-xl px-1 py-2 transition">
              <div className={`relative grid h-9 w-9 place-items-center rounded-full transition ${active ? "bg-brand text-brand-foreground shadow-sm" : "text-muted-foreground"}`}>
                <Icon className="h-4.5 w-4.5" />
                {count ? <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-accent-orange text-[10px] font-bold text-white">{count}</span> : null}
              </div>
              <span className={`text-[10px] font-semibold ${active ? "text-brand" : "text-muted-foreground"}`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand"><Leaf className="h-5 w-5 text-brand-foreground" /></div>
            <span className="text-xl font-bold">MaysChills</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Fresh juices, smoothies, salads & wraps — delivered cold across Lagos.</p>
        </div>
        {[
          { title: "Menu", items: ["Smoothies", "Juices", "Salads", "Wraps", "Bundles"] },
          { title: "Orders", items: ["Track Order", "Subscriptions", "Delivery Zones", "Returns"] },
          { title: "Company", items: ["About", "Careers", "Press", "Contact"] },
        ].map(col => (
          <div key={col.title}>
            <h4 className="font-semibold mb-3">{col.title}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">{col.items.map(i => <li key={i} className="hover:text-foreground cursor-pointer">{i}</li>)}</ul>
          </div>
        ))}
      </div>
      <div className="border-t py-6 text-center text-xs text-muted-foreground">© 2026 MaysChills. Fresh by nature.</div>
    </footer>
  );
}

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1 pb-24 md:pb-0"><Outlet /></main>
      <Footer />
      <MobileNav />
    </div>
  );
}