import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, Map, Plus, Bike, Users, Clock, Check, AlertTriangle, Search, Filter, Pencil, User, Phone, Circle } from "lucide-react";
import useAdmin from "@/store/admin";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMemo, useState } from "react";

const stats = [
  { l: "Active Deliveries", v: "28", d: "+8", i: Bike, c: "text-blue-600 bg-blue-50" },
  { l: "Riders Online", v: "6", d: "+2", i: Users, c: "text-emerald-600 bg-emerald-50" },
  { l: "Avg. Delivery Time", v: "18 min", d: "-3 min", i: Clock, c: "text-amber-600 bg-amber-50" },
  { l: "Delivered Today", v: "142", d: "+18%", i: Check, c: "text-emerald-600 bg-emerald-50" },
  { l: "Delayed Orders", v: "3", d: "+1", i: AlertTriangle, c: "text-red-600 bg-red-50" },
];

const tabs = [{ l: "All", c: 28 }, { l: "Packed & Ready", c: 9 }, { l: "Out for Delivery", c: 15 }, { l: "Delayed", c: 3 }, { l: "Unassigned", c: 4 }];

const zones = [
  { name: "Zone 1 — Island", desc: "Victoria Island, Ikoyi, Lekki", fee: 500 },
  { name: "Zone 2 — Mainland", desc: "Surulere, Yaba, Ikeja", fee: 800 },
  { name: "Zone 3 — Suburbs", desc: "Ojota, Gbagada, Agege", fee: 1200 },
  { name: "Zone 4 — Outskirts", desc: "Badagry, Ajah, Epe", fee: 2000 },
  { name: "Pickup (Free)", desc: "Collect at MaysChills HQ", fee: 0 },
];

const statusColor: Record<string, string> = {
  "On Delivery": "bg-orange-100 text-orange-700",
  "Delayed": "bg-red-100 text-red-700",
  "Available": "bg-emerald-100 text-emerald-700",
  "Offline": "bg-slate-100 text-slate-700",
};

const statusDotColor: Record<string, string> = {
  "Available": "bg-emerald-500",
  "On Delivery": "bg-orange-500",
  "Delayed": "bg-red-500",
  "Offline": "bg-slate-400",
};

export default function AdminDelivery() {
  const riders = useAdmin((s) => s.riders);
  const orders = useAdmin((s) => s.orders);
  const addRider = useAdmin((s) => s.addRider);
  const [addOpen, setAddOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("Available");
  const [search, setSearch] = useState("");

  const visibleRiders = useMemo(() => riders.filter((r) => `${r.name} ${r.phone}`.toLowerCase().includes(search.toLowerCase())), [riders, search]);
  const visibleOrders = useMemo(() => orders.filter((o) => `${o.customer} ${o.id} ${o.rider ?? ""}`.toLowerCase().includes(search.toLowerCase())), [orders, search]);

  const submitAdd = () => {
    if (!name.trim()) return;
    addRider({ name: name.trim(), phone: phone.trim() || "+234 000 000 0000", deliveries: 0, status });
    setName("");
    setPhone("");
    setStatus("Available");
    setAddOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><h1 className="text-2xl font-bold">Delivery Management</h1><p className="text-sm text-muted-foreground">Monday, 20 January 2025 · {orders.length} active deliveries · {riders.filter((r) => r.status === "Available" || r.status === "On Delivery").length} riders online</p></div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon"><Bell className="h-4 w-4" /></Button>
          <Sheet open={mapOpen} onOpenChange={setMapOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2"><Map className="h-4 w-4" /> Full Map View</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh]">
              <SheetHeader><SheetTitle>Full Delivery Map</SheetTitle></SheetHeader>
              <div className="p-4 h-full">
                <div className="h-full bg-gradient-to-br from-emerald-100 via-emerald-50 to-blue-50 rounded-lg" />
              </div>
            </SheetContent>
          </Sheet>
          <Sheet open={addOpen} onOpenChange={setAddOpen}>
            <SheetTrigger asChild>
              <Button className="gap-2 rounded-full"><Plus className="h-4 w-4" /> Add Rider</Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[460px] p-0">
              {/* Header */}
              <div className="border-b px-6 py-5">
                <SheetHeader className="space-y-1.5 p-0">
                  <SheetTitle className="text-xl font-bold tracking-tight">Add New Rider</SheetTitle>
                  <p className="text-sm text-muted-foreground">Onboard a new delivery rider to your fleet</p>
                </SheetHeader>
              </div>

              {/* Body */}
              <div className="px-6 py-6 space-y-7">
                {/* Avatar preview */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <div className="grid h-20 w-20 rounded-full bg-gradient-to-br from-brand to-brand/80 text-brand-foreground place-items-center text-2xl font-bold shadow-lg shadow-brand/20 ring-4 ring-background">
                      {name.trim() ? name[0].toUpperCase() : <User className="h-8 w-8" />}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-[3px] border-background ${statusDotColor[status]}`} />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-sm">{name.trim() || "Rider Name"}</p>
                    <p className="text-xs text-muted-foreground">{status}</p>
                  </div>
                </div>

                {/* Form fields */}
                <div className="space-y-5">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="rider-name" className="text-sm font-medium flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      Full Name
                    </Label>
                    <div className="relative">
                      <Input
                        id="rider-name"
                        placeholder="e.g. John Doe"
                        value={name}
                        onChange={(e: any) => setName(e.target.value)}
                        className="h-11 pl-10 text-sm focus-visible:ring-brand"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-[11px] text-muted-foreground">This is how the rider will appear in the system.</p>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="rider-phone" className="text-sm font-medium flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Input
                        id="rider-phone"
                        placeholder="+234 800 000 0000"
                        value={phone}
                        onChange={(e: any) => setPhone(e.target.value)}
                        className="h-11 pl-10 text-sm focus-visible:ring-brand"
                      />
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-[11px] text-muted-foreground">Used for dispatch communication and tracking.</p>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="rider-status" className="text-sm font-medium flex items-center gap-1.5">
                      <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                      Initial Status
                    </Label>
                    <div className="relative">
                      <select
                        id="rider-status"
                        className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 appearance-none cursor-pointer"
                        value={status}
                        onChange={(e: any) => setStatus(e.target.value)}
                      >
                        <option value="Available">🟢 Available</option>
                        <option value="On Delivery">🟠 On Delivery</option>
                        <option value="Delayed">🔴 Delayed</option>
                        <option value="Offline">⚫ Offline</option>
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-1">
                      {["Available", "On Delivery", "Delayed", "Offline"].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setStatus(s)}
                          className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all border ${
                            status === s
                              ? "border-brand bg-brand/10 text-brand shadow-sm"
                              : "border-transparent bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${statusDotColor[s]}`} />
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Info card */}
                <div className="rounded-xl border bg-accent/30 p-4 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rider Summary</p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground">Deliveries</span>
                      <p className="font-bold text-sm">0</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status</span>
                      <p className="font-bold text-sm flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${statusDotColor[status]}`} />
                        {status}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone</span>
                      <p className="font-bold text-sm truncate">{phone.trim() || "—"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Name</span>
                      <p className="font-bold text-sm truncate">{name.trim() || "—"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t px-6 py-4 flex items-center justify-between gap-3 bg-muted/30">
                <Button variant="ghost" size="sm" onClick={() => setAddOpen(false)} className="text-muted-foreground">
                  Cancel
                </Button>
                <div className="flex items-center gap-2">
                  <p className="text-[11px] text-muted-foreground hidden sm:block">
                    {!name.trim() ? "Enter rider name to continue" : "Ready to onboard"}
                  </p>
                  <Button
                    onClick={submitAdd}
                    disabled={!name.trim()}
                    className="gap-2 rounded-full"
                  >
                    <Plus className="h-4 w-4" />
                    Add Rider
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.l} className="rounded-2xl border bg-card p-4">
            <div className="flex justify-between"><div className={`grid h-10 w-10 rounded-xl place-items-center ${s.c}`}><s.i className="h-4 w-4" /></div><Badge className="border-0 text-[10px] bg-emerald-50 text-emerald-700">{s.d}</Badge></div>
            <div className="mt-3 text-2xl font-bold">{s.v}</div>
            <div className="text-xs text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-card p-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2 flex-1">
          {tabs.map((t, i) => (
            <button key={t.l} className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium border ${i === 0 ? "bg-brand text-brand-foreground border-brand" : "hover:border-brand"}`}>{t.l} <Badge variant="secondary" className="h-4 text-[10px]">{t.c}</Badge></button>
          ))}
        </div>
        <div className="relative"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" /><Input placeholder="Search order or rider..." className="pl-8 h-9 w-56" value={search} onChange={(e: any) => setSearch(e.target.value)} /></div>
        <Button variant="outline" size="sm" className="gap-1">📍 All Zones</Button>
        <Button variant="outline" size="sm" className="gap-1"><Filter className="h-3.5 w-3.5" /> Filters</Button>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card overflow-hidden">
            <div className="p-4 flex flex-wrap items-center justify-between gap-3"><h3 className="font-bold flex items-center gap-2">● <span>Live Delivery Map</span> <Badge className="bg-accent-orange text-white border-0">LIVE</Badge></h3>
              <div className="flex gap-2"><Button size="sm" variant="outline">📍 Map View</Button><Button size="sm" variant="outline"><Clock className="h-3.5 w-3.5 mr-1" /> Auto-refresh: 30s</Button></div>
            </div>
            <div className="relative h-80 bg-gradient-to-br from-emerald-100 via-emerald-50 to-blue-50">
              <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 600 300"><path d="M0,150 Q150,100 300,150 T600,150" stroke="oklch(0.5 0.1 152)" strokeWidth="2" fill="none" /><path d="M0,50 Q200,100 400,50 T600,80" stroke="oklch(0.5 0.1 152)" strokeWidth="2" fill="none" /><path d="M100,250 L500,200" stroke="oklch(0.5 0.1 152)" strokeWidth="2" fill="none" /></svg>
              {visibleRiders.slice(0, 5).map((r, idx) => (
                <div key={r.name} className="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center" style={{ left: ["15%", "35%", "55%", "70%", "75%"][idx], top: ["30%", "50%", "40%", "45%", "65%"][idx] }}>
                  <div className="grid h-9 w-9 rounded-full bg-white shadow-md place-items-center"><div className="h-7 w-7 rounded-full bg-brand text-brand-foreground grid place-items-center text-xs font-bold">{r.name[0]}</div></div>
                  <Badge className="mt-1 bg-foreground text-background border-0 text-[10px]">{r.name}</Badge>
                </div>
              ))}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"><div className="grid h-10 w-10 rounded-full bg-brand text-brand-foreground place-items-center text-xs font-bold">HQ</div><Badge className="mt-1 bg-brand text-brand-foreground border-0">MaysChills HQ</Badge></div>
            </div>
            <div className="px-4 py-3 flex flex-wrap gap-4 text-xs text-muted-foreground border-t"><span>● Out for Delivery</span><span>● Store HQ</span><span>● Customer Destination</span><span>● Available Rider</span></div>
          </div>

          <div className="rounded-2xl border bg-card overflow-hidden">
            <div className="p-4 flex justify-between items-center"><h3 className="font-bold flex items-center gap-2"><Bike className="h-4 w-4 text-brand" /> Active Deliveries <span className="text-muted-foreground text-xs font-normal">· {visibleOrders.length} ongoing</span></h3><Button size="sm" variant="outline">Sort: ETA</Button></div>
            <div className="divide-y">
              {visibleOrders.slice(0, 5).map((o) => (
                <div key={o.id} className="p-4 grid grid-cols-[auto_1fr_auto_auto] gap-3 items-center">
                  <div className="grid h-10 w-10 rounded-full bg-brand text-brand-foreground place-items-center text-xs font-bold">{(o.rider ?? "?")[0]}</div>
                  <div>
                    <div className="flex items-center gap-2"><span className="font-mono font-semibold text-brand text-sm">{o.id}</span><span className="text-xs text-muted-foreground">{o.rider ?? "Unassigned"}</span></div>
                    <div className="font-medium text-sm">{o.customer}</div>
                    <div className="text-xs text-muted-foreground">14 Adeola Odeku, VI · 2.1 km</div>
                  </div>
                  <div className="text-xs">📦 {o.itemCount} items</div>
                  <div className="text-right"><div className="text-xs font-semibold">ETA 7 min</div><Badge className="bg-orange-100 text-orange-700 border-0 text-[10px]">{o.status}</Badge></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border bg-card overflow-hidden">
            <div className="p-4 flex justify-between items-center"><h3 className="font-bold flex items-center gap-2"><Users className="h-4 w-4 text-brand" /> Riders <Badge variant="secondary" className="text-[10px]">{riders.filter((r) => r.status === "Available" || r.status === "On Delivery").length} Online</Badge></h3><Button size="icon" variant="outline" className="h-7 w-7"><Plus className="h-3.5 w-3.5" /></Button></div>
            <div className="divide-y">
              {visibleRiders.slice(0, 4).map((r) => (
                <div key={r.name} className="p-3 flex items-center gap-3">
                  <div className="relative"><div className="grid h-9 w-9 rounded-full bg-brand text-brand-foreground place-items-center text-xs font-bold">{r.name[0]}</div><div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${r.status === "Available" ? "bg-emerald-500" : r.status === "Offline" ? "bg-slate-400" : "bg-orange-500"}`} /></div>
                  <div className="flex-1 min-w-0"><div className="font-semibold text-sm truncate">{r.name}</div><div className="text-xs text-muted-foreground">{r.phone}</div></div>
                  <div className="text-right"><div className="text-xs text-muted-foreground">{r.deliveries} deliveries</div><Badge className={`text-[10px] border-0 ${statusColor[r.status]}`}>{r.status}</Badge></div>
                </div>
              ))}
            </div>
            {visibleRiders.length > 4 ? (
              <div className="border-t bg-secondary/30 p-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-center gap-2 rounded-full">
                      <Users className="h-4 w-4" /> See more riders
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>All riders</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-2">
                      {visibleRiders.map((r) => (
                        <div key={`${r.name}-${r.phone}`} className="flex items-center justify-between rounded-xl border bg-background p-3 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="relative"><div className="grid h-10 w-10 rounded-full bg-brand text-brand-foreground place-items-center text-sm font-bold">{r.name[0]}</div><div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background ${r.status === "Available" ? "bg-emerald-500" : r.status === "Offline" ? "bg-slate-400" : "bg-orange-500"}`} /></div>
                            <div>
                              <div className="font-semibold">{r.name}</div>
                              <div className="text-sm text-muted-foreground">{r.phone}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">{r.deliveries} deliveries</div>
                            <Badge className={`mt-1 border-0 text-[10px] ${statusColor[r.status]}`}>{r.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : null}
          </div>
          <div className="rounded-2xl border bg-card overflow-hidden">
            <div className="p-4 flex justify-between items-center"><h3 className="font-bold flex items-center gap-2">📍 Delivery Fee Zones</h3><Button size="sm" variant="outline" className="gap-1"><Pencil className="h-3 w-3" /> Edit Zones</Button></div>
            <div className="divide-y">
              {zones.map((z) => (
                <div key={z.name} className="p-3 flex items-center justify-between gap-2">
                  <div><div className="font-semibold text-sm">{z.name}</div><div className="text-xs text-muted-foreground">{z.desc}</div></div>
                  <div className="font-bold text-brand">₦{z.fee.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}