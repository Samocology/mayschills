import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Download, Plus, Eye, Pencil, Filter, MapPin, ShoppingBag, Clock, Bike, Check, X } from "lucide-react";
import useAdmin from "@/store/admin";
import { ngn } from "@/data/products";
import { StatusPill } from "./Dashboard";

const tabs = [
  { label: "All Orders", count: 1284 },
  { label: "Pending", count: 47 },
  { label: "Preparing", count: 32 },
  { label: "Out for Delivery", count: 28 },
  { label: "Delivered", count: 1194 },
  { label: "Cancelled", count: 15 },
];

const stats = [
  { l: "Total Orders", v: "1,284", d: "+9.2%", up: true, i: ShoppingBag, c: "text-blue-600 bg-blue-50" },
  { l: "Pending", v: "47", d: "+4", up: true, i: Clock, c: "text-amber-600 bg-amber-50" },
  { l: "Out for Delivery", v: "28", d: "+8", up: true, i: Bike, c: "text-orange-600 bg-orange-50" },
  { l: "Delivered", v: "1,194", d: "+18%", up: true, i: Check, c: "text-emerald-600 bg-emerald-50" },
  { l: "Cancelled", v: "15", d: "-2", up: false, i: X, c: "text-red-600 bg-red-50" },
];

export default function Orders() {
  const orders = useAdmin((s) => s.orders);
  const [selected, setSelected] = useState<string[]>([orders[0]?.id, orders[1]?.id, orders[4]?.id].filter(Boolean) as string[]);
  const [activeTab, setActiveTab] = useState(0);
  const allSelected = selected.length === orders.length;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground">Monday, 20 January 2025 · {orders.length} total orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export CSV</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {stats.map(s => (
          <div key={s.l} className="rounded-2xl border bg-card p-4">
            <div className="flex justify-between"><div className={`grid h-9 w-9 rounded-xl place-items-center ${s.c}`}><s.i className="h-4 w-4" /></div><Badge className={`border-0 text-[10px] ${s.up?"bg-emerald-50 text-emerald-700":"bg-red-50 text-red-700"}`}>{s.d}</Badge></div>
            <div className="mt-3 text-2xl font-bold">{s.v}</div>
            <div className="text-xs text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="rounded-xl border-2 border-brand bg-brand-soft p-3 flex flex-wrap items-center gap-3">
          <span className="font-semibold text-brand">{selected.length} orders selected</span>
          <Button size="sm" variant="outline" className="gap-1.5"><Check className="h-3.5 w-3.5" /> Mark Delivered</Button>
          <Button size="sm" variant="outline" className="gap-1.5"><Bike className="h-3.5 w-3.5" /> Assign Rider</Button>
          <Button size="sm" variant="outline" className="gap-1.5">🧾 Print Receipts</Button>
          <Button size="sm" variant="outline" className="gap-1.5 text-destructive"><X className="h-3.5 w-3.5" /> Cancel Orders</Button>
        </div>
      )}

      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="p-4 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2 flex-1">
            {tabs.map((t, i) => (
              <button key={t.label} onClick={() => setActiveTab(i)} className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium border ${activeTab===i?"bg-brand text-brand-foreground border-brand":"hover:border-brand"}`}>
                {t.label} <Badge variant="secondary" className="h-4 text-[10px]">{t.count}</Badge>
              </button>
            ))}
          </div>
          <div className="relative"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" /><Input placeholder="Search by order ID, name..." className="pl-8 h-9 w-56" /></div>
          <Button variant="outline" size="sm" className="gap-1"><Filter className="h-3.5 w-3.5" /> Today</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1100px]">
            <thead className="bg-secondary/50 text-xs uppercase tracking-wider"><tr>
              <th className="px-3 py-3"><Checkbox checked={allSelected} onCheckedChange={(c) => setSelected(c ? orders.map(o => o.id) : [])} /></th>
              {["Order ID","Customer","Items","Amount","Status","Delivery","Rider","Time","Actions"].map(h => <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y">
              {orders.map(o => {
                const isSel = selected.includes(o.id);
                return (
                  <tr key={o.id} className={isSel ? "bg-brand-soft/40" : "hover:bg-secondary/30"}>
                    <td className="px-3 py-3"><Checkbox checked={isSel} onCheckedChange={(c) => setSelected(c ? [...selected, o.id] : selected.filter(i => i !== o.id))} /></td>
                    <td className="px-4 py-3"><div className="font-mono font-semibold text-brand">{o.id}</div><div className="text-xs text-muted-foreground">{o.date}, {o.time}</div></td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="grid h-7 w-7 rounded-full bg-brand text-brand-foreground place-items-center text-[10px] font-bold">{o.customer[0]}</div><div><div className="font-medium">{o.customer}</div><div className="text-xs text-muted-foreground">{o.email}</div></div></div></td>
                    <td className="px-4 py-3 text-xs"><div>{o.items.join(", ")}</div><div className="text-muted-foreground mt-0.5">{o.itemCount} items</div></td>
                    <td className="px-4 py-3"><div className="font-bold">{ngn(o.amount)}</div><div className="text-xs text-muted-foreground">{o.payment}</div></td>
                    <td className="px-4 py-3"><StatusPill status={o.status} /></td>
                    <td className="px-4 py-3 text-xs"><div className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3" /> {o.deliveryType}</div></td>
                    <td className="px-4 py-3">{o.rider ? <div className="flex items-center gap-1.5"><div className="grid h-6 w-6 rounded-full bg-secondary place-items-center text-[10px] font-bold">{o.rider[0]}</div>{o.rider}</div> : <span className="text-xs text-muted-foreground">—</span>}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{o.time}</td>
                    <td className="px-4 py-3"><div className="flex gap-1"><Button size="icon" variant="ghost" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button><Button size="icon" variant="ghost" className="h-7 w-7"><Pencil className="h-3.5 w-3.5" /></Button></div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-t">
          <div className="text-xs text-muted-foreground">Showing 1–10 of 1,284 orders</div>
          <div className="flex gap-1">{["‹","1","2","3","4","5","...","129","›"].map(p => <button key={p} className={`min-w-7 h-7 rounded-md text-xs font-semibold ${p==="1"?"bg-brand text-brand-foreground":"hover:bg-secondary"}`}>{p}</button>)}</div>
        </div>
      </div>
    </div>
  );
}
