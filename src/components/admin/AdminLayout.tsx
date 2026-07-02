'use client';

import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Leaf, LayoutDashboard, ShoppingBag, Package, Bike, Users, BarChart3, Tag, Settings, Bell, Search, LogOut, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type NavItem = { to: string; icon: typeof LayoutDashboard; label: string; badge?: string; count?: number };
const navSections: { title: string; items: NavItem[] }[] = [
  { title: "Overview", items: [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/analytics", icon: BarChart3, label: "Analytics", badge: "New" },
  ]},
  { title: "Orders", items: [
    { to: "/admin/orders", icon: ShoppingBag, label: "All Orders", count: 12 },
    { to: "/admin/delivery", icon: Bike, label: "Delivery" },
  ]},
  { title: "Catalog", items: [
    { to: "/admin/products", icon: Package, label: "Products" },
  ]},
  { title: "Management", items: [
    { to: "/admin/customers", icon: Users, label: "Customers" },
    { to: "/admin/settings", icon: Settings, label: "Settings" },
  ]},
];

function SidebarContent() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin" || location.pathname === "/admin/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-5 py-5 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-sidebar-primary"><Leaf className="h-5 w-5 text-sidebar-primary-foreground" /></div>
          <span className="text-lg font-bold">MaysChills</span>
          <Badge className="bg-accent-orange text-white border-0 text-[10px] px-2">Admin</Badge>
        </Link>
      </div>
      <nav className="flex-1 px-3 overflow-auto">
        {navSections.map(section => (
          <div key={section.title} className="mb-4">
            <div className="px-3 mb-2 text-[10px] font-bold tracking-widest text-sidebar-foreground/50">{section.title.toUpperCase()}</div>
            {section.items.map(it => (
              <Link key={it.to} to={it.to} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive(it.to) ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent"}`}>
                <it.icon className="h-4 w-4" />
                <span className="flex-1">{it.label}</span>
                {it.badge && <Badge className="bg-emerald-500 text-white border-0 h-5 text-[10px]">{it.badge}</Badge>}
                {it.count && <Badge className="bg-accent-orange text-white border-0 h-5 text-[10px]">{it.count}</Badge>}
              </Link>
            ))}
          </div>
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg p-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-sidebar-accent text-sm font-bold">CO</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">Chidi Okafor</div>
            <div className="text-xs text-sidebar-foreground/60">Super Admin</div>
          </div>
          <Link to="/"><Button variant="ghost" size="icon" className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"><LogOut className="h-4 w-4" /></Button></Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-secondary/30">
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 border-r"><SidebarContent /></aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden"><ChevronLeft className="h-4 w-4 rotate-180" /></Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64"><SidebarContent /></SheetContent>
            </Sheet>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search orders, customers, products..." className="pl-9 h-9 bg-secondary/50 border-0" />
            </div>
            <Button variant="outline" size="icon" className="relative"><Bell className="h-4 w-4" /><span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-accent-orange text-[10px] font-bold text-white">3</span></Button>
            <Link to="/"><Button variant="outline" size="sm">View Store</Button></Link>
          </div>
        </header>
        <main className="p-4 lg:p-6"><Outlet /></main>
      </div>
    </div>
  );
}