"use client";

import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Package, MapPin, CreditCard, Truck, LogOut, Heart, Settings, Plus, Check, Star } from "lucide-react";
import { useAuth } from "@/store";
import { ngn } from "@/data/products";

const tabs = [
  { v: "profile", label: "Profile", icon: User },
  { v: "orders", label: "Track Orders", icon: Truck },
  { v: "history", label: "Order History", icon: Package },
  { v: "addresses", label: "Addresses", icon: MapPin },
  { v: "payments", label: "Payment", icon: CreditCard },
  { v: "settings", label: "Settings", icon: Settings },
];

export default function Profile() {
  const loc = useLocation();
  const sp = typeof window !== "undefined" ? new URLSearchParams(loc.search) : new URLSearchParams("");
  const tab = sp.get("tab") ?? "profile";
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);
  const nav = useNavigate();
  const active = tab;

  if (!user) {
    return (
      <div className="mx-auto max-w-md py-20 px-4 text-center">
        <h1 className="text-2xl font-bold">You're not signed in</h1>
        <p className="text-muted-foreground mt-2">Sign in to see your profile, orders and saved addresses.</p>
        <Link to="/signin"><Button className="mt-6 rounded-full">Sign In</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 lg:px-6 py-8">
      <div className="mb-6 flex items-center gap-4">
        <div className="grid h-16 w-16 rounded-full bg-brand text-brand-foreground place-items-center text-2xl font-bold">{user.name[0]}</div>
        <div className="flex-1"><h1 className="text-2xl font-bold">{user.name}</h1><p className="text-sm text-muted-foreground">{user.email}</p></div>
        <Badge className="bg-amber-500 text-white border-0">Gold Member</Badge>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        <aside className="rounded-2xl border bg-card p-3 h-fit">
          {tabs.map(t => (
            <Link key={t.v} to="/profile" search={{ tab: t.v }} className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium ${active === t.v ? "bg-brand-soft text-brand" : "hover:bg-secondary"}`}>
              <t.icon className="h-4 w-4" /> {t.label}
            </Link>
          ))}
          <Link to="/wishlist" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-secondary"><Heart className="h-4 w-4" /> Wishlist</Link>
          <button onClick={() => { signOut(); nav({ to: "/" }); }} className="w-full flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10"><LogOut className="h-4 w-4" /> Sign Out</button>
        </aside>

        <div>
          {active === "profile" && <ProfileTab name={user.name} email={user.email} />}
          {active === "orders" && <TrackTab />}
          {active === "history" && <HistoryTab />}
          {active === "addresses" && <AddressesTab />}
          {active === "payments" && <PaymentsTab />}
          {active === "settings" && <SettingsTab />}
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ name, email }: { name: string; email: string }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-6">
        <h3 className="font-bold mb-4">Personal Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div><Label className="mb-1.5 block">Full name</Label><Input defaultValue={name} /></div>
          <div><Label className="mb-1.5 block">Email</Label><Input defaultValue={email} /></div>
          <div><Label className="mb-1.5 block">Phone</Label><Input defaultValue="+234 801 234 5678" /></div>
          <div><Label className="mb-1.5 block">Date of Birth</Label><Input type="date" defaultValue="1995-04-12" /></div>
        </div>
        <Button className="mt-4 rounded-full">Save Changes</Button>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { l: "Total Orders", v: "28", i: Package },
          { l: "Total Spent", v: ngn(412500), i: CreditCard },
          { l: "Loyalty Points", v: "1,250", i: Star },
        ].map(s => (
          <div key={s.l} className="rounded-2xl border bg-card p-5 flex items-center gap-3"><div className="grid h-12 w-12 rounded-full bg-brand-soft place-items-center"><s.i className="h-5 w-5 text-brand" /></div><div><div className="text-xs text-muted-foreground">{s.l}</div><div className="text-xl font-bold">{s.v}</div></div></div>
        ))}
      </div>
    </div>
  );
}

function TrackTab() {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <h3 className="font-bold mb-4">Currently Tracking</h3>
      <Link to="/order-track" search={{ id: "SFR-20491" }} className="flex items-center gap-4 rounded-xl border p-4 hover:border-brand">
        <div className="grid h-12 w-12 rounded-full bg-accent-orange/10 place-items-center"><Truck className="h-5 w-5 text-accent-orange" /></div>
        <div className="flex-1"><div className="font-semibold">Order #SFR-20491</div><div className="text-sm text-muted-foreground">3 items · Out for delivery · ETA 18 min</div></div>
        <Badge className="bg-accent-orange text-white border-0">Live</Badge>
      </Link>
    </div>
  );
}

function HistoryTab() {
  const hist = [
    { id: "SFR-20486", date: "Jan 19", items: "Pineapple Punch × 3", total: 8850, status: "Delivered" },
    { id: "SFR-20480", date: "Jan 17", items: "Mango Bliss × 2, Detox", total: 7600, status: "Delivered" },
    { id: "SFR-20471", date: "Jan 12", items: "Caesar Power Salad", total: 2400, status: "Delivered" },
    { id: "SFR-20465", date: "Jan 8", items: "7-Day Detox Bundle", total: 18500, status: "Delivered" },
    { id: "SFR-20460", date: "Jan 3", items: "Watermelon × 4", total: 4800, status: "Cancelled" },
  ];
  return (
    <div className="rounded-2xl border bg-card divide-y">
      <div className="p-5"><h3 className="font-bold">Order History</h3></div>
      {hist.map(h => (
        <div key={h.id} className="p-5 grid grid-cols-[1fr_auto] gap-3">
          <div><div className="font-semibold">#{h.id} · {h.date}</div><div className="text-sm text-muted-foreground">{h.items}</div></div>
          <div className="text-right"><div className="font-bold text-brand">{ngn(h.total)}</div><Badge variant={h.status === "Delivered" ? "secondary" : "destructive"} className="text-[10px]">{h.status}</Badge></div>
          <div className="col-span-2 flex gap-2"><Button size="sm" variant="outline">View Details</Button><Button size="sm" variant="outline">Reorder</Button><Button size="sm" variant="ghost">Leave Review</Button></div>
        </div>
      ))}
    </div>
  );
}

function AddressesTab() {
  const addrs = [
    { label: "Home", name: "Amara Okafor", line: "14 Banana Island Road, Apt 3B", city: "Lagos, Lagos State", phone: "+234 801 234 5678", default: true },
    { label: "Office", name: "Amara Okafor", line: "23 Adeola Odeku Street, Floor 5", city: "Victoria Island, Lagos", phone: "+234 801 234 5678" },
  ];
  return (
    <div className="space-y-4">
      <div className="flex justify-between"><h3 className="font-bold">Saved Addresses</h3><Button size="sm" className="rounded-full gap-1"><Plus className="h-4 w-4" /> Add Address</Button></div>
      <div className="grid md:grid-cols-2 gap-4">
        {addrs.map(a => (
          <div key={a.label} className="rounded-2xl border bg-card p-5">
            <div className="flex justify-between mb-2"><Badge variant="secondary">{a.label}</Badge>{a.default && <Badge className="bg-brand text-brand-foreground border-0 text-[10px]">Default</Badge>}</div>
            <div className="font-semibold">{a.name}</div>
            <div className="text-sm text-muted-foreground">{a.line}</div>
            <div className="text-sm text-muted-foreground">{a.city}</div>
            <div className="text-sm text-muted-foreground mt-1">{a.phone}</div>
            <div className="mt-3 flex gap-2"><Button size="sm" variant="outline">Edit</Button><Button size="sm" variant="ghost" className="text-destructive">Remove</Button></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentsTab() {
  const cards = [
    { brand: "VISA", last: "4242", exp: "08/27", name: "Amara Okafor", default: true, gradient: "brand-gradient" },
    { brand: "MASTERCARD", last: "9901", exp: "11/26", name: "Amara Okafor", gradient: "" },
  ];
  return (
    <div className="space-y-4">
      <div className="flex justify-between"><h3 className="font-bold">Saved Payment Methods</h3><Button size="sm" className="rounded-full gap-1"><Plus className="h-4 w-4" /> Add Card</Button></div>
      <div className="grid md:grid-cols-2 gap-5">
        {cards.map((c, i) => (
          <div key={c.last} className={`relative aspect-[1.586/1] rounded-2xl p-5 text-white overflow-hidden ${c.gradient || "bg-gradient-to-br from-slate-700 via-slate-900 to-black"}`}>
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -right-20 bottom-0 h-32 w-32 rounded-full bg-amber-300/30" />
            <div className="flex justify-between items-start">
              <div className="text-[10px] font-semibold tracking-widest opacity-80">MAYSCHILLS BANK</div>
              {c.default && <Badge className="bg-white/20 border-0 text-white text-[10px]">Default</Badge>}
            </div>
            <div className="mt-4 grid h-9 w-12 rounded-md bg-gradient-to-br from-amber-200 to-amber-500" />
            <div className="mt-3 text-lg md:text-xl font-mono tracking-widest">•••• •••• •••• {c.last}</div>
            <div className="mt-3 flex justify-between text-xs items-end">
              <div><div className="opacity-70 text-[10px]">CARDHOLDER</div><div className="font-semibold tracking-wider">{c.name.toUpperCase()}</div></div>
              <div><div className="opacity-70 text-[10px]">EXPIRES</div><div className="font-semibold">{c.exp}</div></div>
              <div className="text-base font-bold italic">{c.brand}</div>
            </div>
            <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 hover:opacity-100">
              <Button size="sm" variant="secondary" className="h-7 text-xs">Edit</Button>
            </div>
            {i === 0 && <div className="absolute top-3 right-3 text-[10px] opacity-60">DEBIT</div>}
          </div>
        ))}
      </div>
      <div className="rounded-2xl border bg-card p-5">
        <h4 className="font-semibold mb-3">Wallet Balance</h4>
        <div className="flex items-center justify-between">
          <div><div className="text-3xl font-extrabold text-brand">₦4,500</div><div className="text-xs text-muted-foreground">Earn ₦50 cashback on every order</div></div>
          <Button variant="outline" className="rounded-full">Top up</Button>
        </div>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-card p-6 space-y-3">
        <h3 className="font-bold">Notifications</h3>
        {["Order updates via SMS", "Promotional emails", "Subscription reminders", "New product launches"].map(s => (
          <label key={s} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary cursor-pointer">
            <span className="text-sm">{s}</span>
            <input type="checkbox" defaultChecked className="h-5 w-9 appearance-none rounded-full bg-secondary checked:bg-brand relative cursor-pointer transition" />
          </label>
        ))}
      </div>
      <div className="rounded-2xl border bg-card p-6">
        <h3 className="font-bold mb-3">Shipping Preferences</h3>
        <div className="space-y-2">
          {["Leave at door", "Hand to recipient", "Eco-friendly packaging", "Contactless delivery"].map(p => (
            <label key={p} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-brand" /> {p}</label>
          ))}
        </div>
      </div>
    </div>
  );
}
