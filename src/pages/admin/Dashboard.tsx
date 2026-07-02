import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, TrendingUp, ShoppingBag, Users, Repeat, Eye, Bike, Tag } from "lucide-react";
import { orders, revenueData, salesByCategory } from "@/data/mock";
import { ngn, products } from "@/data/products";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMemo, useState } from "react";

const stats = [
  { label: "Total Revenue", value: "₦2.41M", delta: "+18.4%", up: true, icon: TrendingUp, color: "text-emerald-600 bg-emerald-50", sub: "vs last month: ₦2.03M" },
  { label: "Total Orders", value: "1,284", delta: "+9.2%", up: true, icon: ShoppingBag, color: "text-orange-600 bg-orange-50", sub: "Today: 47 orders · 12 pending" },
  { label: "Total Customers", value: "8,402", delta: "+23.1%", up: true, icon: Users, color: "text-blue-600 bg-blue-50", sub: "New this month: 346" },
  { label: "Active Subscriptions", value: "612", delta: "-2.8%", up: false, icon: Repeat, color: "text-amber-600 bg-amber-50", sub: "Renewing this week: 84" },
];

export default function Dashboard() {
  const [range, setRange] = useState<"7D" | "30D" | "90D" | "1Y">("30D");
  const [orderFilter, setOrderFilter] = useState("All");
  const [orderQuery, setOrderQuery] = useState("");

  const filteredOrders = useMemo(() => {
    const normalized = orderQuery.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesFilter = orderFilter === "All" || order.status === orderFilter;
      const matchesQuery = !normalized || `${order.id} ${order.customer} ${order.email}`.toLowerCase().includes(normalized);
      return matchesFilter && matchesQuery;
    });
  }, [orderFilter, orderQuery]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700 shadow-sm">
              <TrendingUp className="h-3.5 w-3.5" /> Live performance
            </div>
            <h1 className="mt-3 text-2xl font-bold">Good morning, Chidi</h1>
            <p className="mt-1 text-sm text-muted-foreground">Monday, 20 January 2025 · Your storefront is tracking ahead of plan.</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white/80 px-4 py-3 text-right shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Today’s target</div>
            <div className="mt-1 text-xl font-bold text-brand">92% on target</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl border bg-card p-5">
            <div className="flex justify-between items-start">
              <div className={`grid h-10 w-10 rounded-xl place-items-center ${s.color}`}><s.icon className="h-5 w-5" /></div>
              <Badge className={`border-0 ${s.up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{s.delta}</Badge>
            </div>
            <div className="mt-4 text-2xl md:text-3xl font-extrabold">{s.value}</div>
            <div className="text-xs font-medium text-muted-foreground">{s.label}</div>
            <div className="text-xs text-muted-foreground mt-3 pt-3 border-t">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="rounded-2xl border bg-card p-5">
          <div className="flex justify-between mb-4"><div><h3 className="font-bold flex items-center gap-2"><TrendingUp className="h-4 w-4 text-brand" /> Revenue & Orders Overview</h3></div><div className="flex gap-1 bg-secondary rounded-full p-1">{["7D","30D","90D","1Y"].map((d) => <button key={d} onClick={() => setRange(d as any)} className={`text-xs px-3 py-1 rounded-full font-medium ${range === d ? "bg-white shadow" : "text-muted-foreground"}`}>{d}</button>)}</div></div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="rounded-xl bg-secondary/40 p-3"><div className="text-xl font-bold">₦2.41M</div><div className="text-xs text-muted-foreground">Revenue this month</div></div>
            <div className="rounded-xl bg-secondary/40 p-3"><div className="text-xl font-bold">1,284</div><div className="text-xs text-muted-foreground">Orders this month</div></div>
            <div className="rounded-xl bg-secondary/40 p-3"><div className="text-xl font-bold">₦1,878</div><div className="text-xs text-muted-foreground">Avg. order value</div></div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.5 0.15 152)" stopOpacity={0.4} /><stop offset="100%" stopColor="oklch(0.5 0.15 152)" stopOpacity={0} /></linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="oklch(0.45 0.13 152)" strokeWidth={2.5} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 text-xs text-muted-foreground"><span>● Previous period</span><span className="text-brand">● Revenue</span><span className="text-accent-orange">● {range} snapshot</span></div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border bg-card p-5">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Tag className="h-4 w-4 text-brand" /> Sales by Category</h3>
            <div className="space-y-3">
              {salesByCategory.map(c => (
                <div key={c.name}>
                  <div className="flex justify-between text-sm"><span>{c.name}</span><span className="font-semibold">{c.value}%</span></div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden mt-1"><div className="h-full rounded-full" style={{ width: `${c.value*1.5}%`, background: c.color }} /></div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <div className="flex justify-between mb-3"><h3 className="font-bold">Top Products</h3><a className="text-xs text-brand font-semibold">View all</a></div>
            <div className="space-y-3">
              {products.slice(0,4).map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="text-xs font-bold text-muted-foreground w-3">{i+1}</div>
                  <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0"><div className="font-medium text-sm truncate">{p.name}</div><div className="text-xs text-muted-foreground">{p.sold} sold · {p.rating}</div></div>
                  <div className="font-bold text-sm text-brand">{ngn(p.sold * 1100)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="p-5 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-bold">Recent Orders</h3>
          <div className="flex flex-wrap gap-2">
            {["All", "Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"].map((s) => <button key={s} onClick={() => setOrderFilter(s)} className={`rounded-full px-3 py-1 text-xs font-medium ${orderFilter === s ? "bg-brand text-brand-foreground" : "bg-secondary/60 text-muted-foreground"}`}>{s}</button>)}
            <div className="relative"><Search className="absolute left-2 top-1.5 h-3.5 w-3.5 text-muted-foreground" /><input value={orderQuery} onChange={(e) => setOrderQuery(e.target.value)} placeholder="Search orders..." className="h-7 rounded-full border pl-7 pr-3 text-xs bg-secondary/50 w-44" /></div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-secondary/50 text-xs uppercase tracking-wider"><tr>{["Order ID","Customer","Items","Amount","Status","Payment","Time","Action"].map(h => <th key={h} className="px-4 py-2.5 text-left font-semibold">{h}</th>)}</tr></thead>
            <tbody className="divide-y">
              {filteredOrders.slice(0,5).map(o => (
                <tr key={o.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3 font-mono text-brand font-semibold">{o.id}</td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="grid h-7 w-7 rounded-full bg-brand text-brand-foreground place-items-center text-[10px] font-bold">{o.customer[0]}</div><div><div className="font-medium">{o.customer}</div><div className="text-xs text-muted-foreground">{o.email}</div></div></div></td>
                  <td className="px-4 py-3">{o.itemCount} items</td>
                  <td className="px-4 py-3 font-bold">{ngn(o.amount)}</td>
                  <td className="px-4 py-3"><StatusPill status={o.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{o.payment}</td>
                  <td className="px-4 py-3 text-muted-foreground">{o.time}</td>
                  <td className="px-4 py-3"><Button size="icon" variant="ghost" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom panels */}
      <div className="grid md:grid-cols-3 gap-4">
        <Panel title="Delivery Overview" icon={Bike} action="Manage">
          {[["Active Riders",14],["Out for Delivery",8],["Avg. Delivery Time","23 min"],["On-time Rate","94.2%"],["Failed Deliveries",3]].map(([k,v]) => (
            <div key={k as string} className="flex justify-between py-1.5 text-sm border-b last:border-0"><span className="text-muted-foreground">{k as string}</span><span className="font-bold">{v}</span></div>
          ))}
        </Panel>
        <Panel title="Active Coupons" icon={Tag} action="+ New">
          {[["FLASH25","184 uses","25% off","Active"],["DETOX20","91 uses","20% off","Active"],["GOLD15","43 uses","15% off","Active"],["WELCOME10","620 uses","10% off","Expired"]].map((c) => (
            <div key={c[0]} className="flex items-center justify-between py-1.5 text-sm border-b last:border-0">
              <span className="font-mono font-bold text-brand">{c[0]}</span>
              <span className="text-xs text-muted-foreground">{c[1]}</span>
              <span className="text-xs">{c[2]}</span>
              <Badge variant={c[3]==="Active"?"default":"secondary"} className={c[3]==="Active"?"bg-emerald-100 text-emerald-700 border-0":""}>{c[3]}</Badge>
            </div>
          ))}
        </Panel>
        <Panel title="Subscription Plans" icon={Repeat} action="View all">
          {[["7-Day Detox","148 active subscribers","₦592K"],["14-Day Plan","284 active subscribers","₦1.82M"],["30-Day Healthy Plan","180 active subscribers","₦3.24M"]].map(p => (
            <div key={p[0]} className="py-2 border-b last:border-0 flex justify-between"><div><div className="font-semibold text-sm">{p[0]}</div><div className="text-xs text-muted-foreground">{p[1]}</div></div><div className="font-bold text-brand">{p[2]}</div></div>
          ))}
          <div className="mt-3 pt-3 border-t flex justify-between"><span className="font-bold text-sm">Recurring MRR</span><span className="font-extrabold text-brand">₦5.65M</span></div>
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, icon: Icon, action, children }: { title: string; icon: typeof Bike; action: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex justify-between mb-3"><h3 className="font-bold flex items-center gap-2"><Icon className="h-4 w-4 text-brand" /> {title}</h3><a className="text-xs text-brand font-semibold">{action}</a></div>
      <div>{children}</div>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const c: Record<string, string> = {
    "Out for Delivery": "bg-orange-100 text-orange-700",
    "Preparing": "bg-blue-100 text-blue-700",
    "Delivered": "bg-emerald-100 text-emerald-700",
    "Pending": "bg-amber-100 text-amber-700",
    "Cancelled": "bg-red-100 text-red-700",
    "Packed": "bg-purple-100 text-purple-700",
  };
  return <Badge className={`border-0 ${c[status] ?? "bg-secondary"}`}>● {status}</Badge>;
}
