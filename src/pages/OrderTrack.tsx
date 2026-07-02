'use client';

import { Link, useLocation } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bike, Check, Clock, Headphones, MapPin, MessageCircle, Package, Phone, X } from "lucide-react";

export default function OrderTrack() {
  const loc = useLocation();
  const sp = typeof window !== "undefined" ? new URLSearchParams(loc.search) : new URLSearchParams("");
  const id = sp.get("id") ?? "";
  const stages = [
    { label: "Order Confirmed", time: "11:42 AM · 18 mins ago", desc: "Your order was received and payment confirmed", done: true },
    { label: "Preparing Your Order", time: "11:47 AM · 13 mins ago", desc: "Our team started blending your smoothies and juices", done: true },
    { label: "Packed & Ready", time: "11:58 AM · 2 mins ago", desc: "Your order has been packed in eco-friendly insulated bags", done: true },
    { label: "Out for Delivery", time: "12:00 PM · Just now", desc: "Emeka (4.9) picked up your order and is heading to you", current: true, live: true },
    { label: "Delivered", time: "Estimated by 1:05 PM", desc: "You'll receive a notification when your order arrives", done: false },
  ];
  return (
    <div className="mx-auto max-w-6xl px-4 lg:px-6 py-8">
      <nav className="text-sm text-muted-foreground mb-6"><Link to="/" className="hover:text-foreground">Home</Link> / <Link to="/profile" search={{ tab: "orders" }} className="hover:text-foreground">Orders</Link> / <span className="text-foreground">Order #{id}</span></nav>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex flex-wrap items-center gap-3">Track Your Order <Badge variant="outline" className="font-mono">#{id}</Badge></h1>
          <p className="text-sm text-muted-foreground mt-1">Placed Monday, 20 Jan 2025 at 11:42 AM · Estimated arrival in <span className="text-brand font-semibold">18 minutes</span></p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Headphones className="h-4 w-4" /> Contact Support</Button>
          <Button className="gap-2 rounded-full">↻ Reorder</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-6">
          <div className="brand-gradient rounded-2xl p-6 text-white flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-white/15"><Bike className="h-7 w-7" /></div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-widest opacity-80">Current Status</div>
              <div className="text-2xl font-bold">Out for Delivery</div>
              <div className="text-sm text-white/85">Emeka is on his way — 2.4 km from your location. Stay close!</div>
            </div>
            <div className="text-right shrink-0"><div className="text-xs opacity-80">Arriving in</div><div className="text-3xl font-extrabold">18 min</div><div className="text-xs opacity-80">By 1:05 PM</div></div>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <div className="flex justify-between mb-4"><h3 className="font-bold flex items-center gap-2"><Package className="h-4 w-4" /> Order Progress</h3><span className="text-xs text-muted-foreground">Live updates · Refreshed just now</span></div>
            <ol className="relative space-y-6 pl-8">
              <div className="absolute left-3 top-1.5 bottom-1.5 w-px bg-border" />
              {stages.map((s) => (
                <li key={s.label} className="relative">
                  <div className={`absolute -left-8 grid h-6 w-6 place-items-center rounded-full ${s.current ? "bg-accent-orange text-white" : s.done ? "bg-brand text-brand-foreground" : "bg-secondary border-2 border-border"}`}>
                    {s.current ? <Bike className="h-3.5 w-3.5" /> : s.done ? <Check className="h-3.5 w-3.5" /> : null}
                  </div>
                  <div className={`font-semibold ${s.current ? "text-accent-orange" : ""}`}>{s.label}</div>
                  <div className="text-sm text-muted-foreground">{s.desc}</div>
                  <div className="text-xs text-brand mt-0.5">{s.time}</div>
                  {s.live && <Badge className="mt-1 bg-accent-orange text-white border-0 text-[10px]">● Live · 2.4 km away · ETA 18 min</Badge>}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border bg-card overflow-hidden">
            <div className="p-5 flex items-center justify-between"><h3 className="font-bold flex items-center gap-2"><MapPin className="h-4 w-4" /> Live Driver Tracking</h3><Badge className="bg-emerald-500 text-white border-0 text-[10px]">● Live</Badge></div>
            <div className="relative h-64 bg-gradient-to-br from-emerald-100 via-stone-100 to-blue-100">
              <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 400 200" preserveAspectRatio="none"><path d="M 0 100 Q 100 80 200 120 T 400 100" stroke="oklch(0.7 0.18 45)" strokeWidth="3" fill="none" /></svg>
              <div className="absolute left-1/4 top-1/2 -translate-y-1/2"><Badge className="bg-accent-orange text-white border-0">Emeka</Badge></div>
              <div className="absolute right-1/4 top-1/2 -translate-y-1/2"><Badge className="bg-brand text-brand-foreground border-0">Your Location</Badge></div>
            </div>
            <div className="px-5 py-3 flex justify-between text-xs text-muted-foreground border-t"><span>● MaysChills Kitchen</span><span>● Banana Island</span></div>
            <div className="p-4 border-t flex items-center gap-3">
              <div className="grid h-10 w-10 rounded-full bg-brand text-brand-foreground place-items-center font-bold">E</div>
              <div className="flex-1"><div className="font-semibold text-sm">Emeka Chukwu</div><div className="text-xs text-muted-foreground">4.9 · Honda CB 2021 · KJA-441-XY</div></div>
              <Button size="icon" variant="outline" className="h-9 w-9 rounded-full"><MessageCircle className="h-4 w-4" /></Button>
              <Button size="icon" className="h-9 w-9 rounded-full"><Phone className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border bg-card p-5">
            <div className="flex justify-between mb-3"><h3 className="font-bold flex items-center gap-2"><Package className="h-4 w-4" /> Order Summary</h3><Badge className="bg-success text-success-foreground border-0">Paid</Badge></div>
            {["Mango Bliss Smoothie ×2", "Green Detox Smoothie ×1", "Watermelon Breeze ×1"].map((it, i) => (
              <div key={i} className="flex justify-between text-sm py-1.5"><span>{it}</span><span className="font-semibold">{["₦5,700","₦4,150","₦1,500"][i]}</span></div>
            ))}
            <div className="border-t pt-3 mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₦11,350</span></div>
              <div className="flex justify-between text-brand"><span>Coupon (DETOX20)</span><span>-₦1,135</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>₦800</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">VAT (7.5%)</span><span>₦764</span></div>
            </div>
            <div className="flex justify-between mt-3 pt-3 border-t"><span className="font-bold">Total Paid</span><span className="text-xl font-extrabold text-brand">₦11,779</span></div>
          </div>
          <div className="rounded-2xl border bg-card p-5 space-y-3">
            <h4 className="font-semibold text-sm">Need help with this order?</h4>
            {[
              { i: MessageCircle, t: "Live Chat", d: "Avg response under 2 min" },
              { i: Phone, t: "Call Us", d: "+234 800 SIP FRESH" },
              { i: X, t: "Cancel Order", d: "Only if not yet picked up" },
            ].map(b => (
              <button key={b.t} className="w-full flex items-center gap-3 rounded-lg border p-3 hover:bg-secondary text-left">
                <div className="grid h-9 w-9 rounded-full bg-brand-soft place-items-center"><b.i className="h-4 w-4 text-brand" /></div>
                <div><div className="font-semibold text-sm">{b.t}</div><div className="text-xs text-muted-foreground">{b.d}</div></div>
              </button>
            ))}
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <div className="flex items-center gap-2 text-sm font-semibold mb-2"><Clock className="h-4 w-4" /> Notifications</div>
            <div className="text-xs text-muted-foreground">You'll be notified when your order is out for delivery and when it arrives.</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
