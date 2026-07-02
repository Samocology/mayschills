import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Search, Download, Users, Star, UserPlus, Crown, Mail, Phone, Eye, Pencil, MoreHorizontal, TrendingUp, MapPin, Calendar, ShoppingBag, CreditCard, Clock, Shield, X, Sparkles, User, MessageSquare, Award } from "lucide-react";
import useAdmin, { type Customer } from "@/store/admin";
import { ngn } from "@/data/products";
import { useMemo, useState, useEffect } from "react";

const stats = [
  { l: "Total Customers", v: "8,402", d: "+23.1%", i: Users, c: "text-blue-600 bg-blue-50" },
  { l: "New This Month", v: "346", d: "+12%", i: UserPlus, c: "text-emerald-600 bg-emerald-50" },
  { l: "VIP Members", v: "248", d: "+8", i: Crown, c: "text-amber-600 bg-amber-50" },
  { l: "Avg. Lifetime Value", v: "₦96K", d: "+14%", i: Star, c: "text-purple-600 bg-purple-50" },
];

const statusColor: Record<string, string> = {
  VIP: "bg-amber-100 text-amber-700 border-amber-200",
  Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  New: "bg-blue-100 text-blue-700 border-blue-200",
  Inactive: "bg-slate-100 text-slate-700 border-slate-200",
};

const statusDotColor: Record<string, string> = {
  VIP: "bg-amber-500",
  Active: "bg-emerald-500",
  New: "bg-blue-500",
  Inactive: "bg-slate-400",
};

export default function Customers() {
  const customers = useAdmin((s) => s.customers);
  const editCustomer = useAdmin((s) => s.editCustomer);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [draftCustomer, setDraftCustomer] = useState<Customer | null>(null);
  const [actionsOpen, setActionsOpen] = useState(false);

  // Keep selectedCustomer in sync with the store when viewing
  useEffect(() => {
    if (viewOpen && selectedCustomer) {
      const updated = customers.find(c => c.email === selectedCustomer.email);
      if (updated) {
        setSelectedCustomer(updated);
      }
    }
  }, [customers, viewOpen, selectedCustomer]);

  // Keep draft customer in sync when editing
  useEffect(() => {
    if (editOpen && selectedCustomer && draftCustomer) {
      const updated = customers.find(c => c.email === selectedCustomer.email);
      if (updated) {
        setSelectedCustomer(updated);
        // Only update draft if the status changed externally
        if (updated.status !== draftCustomer.status && !draftCustomer.status) {
          setDraftCustomer({ ...updated });
        }
      }
    }
  }, [customers, editOpen, selectedCustomer]);

  const filteredCustomers = useMemo(() => {
    const normalized = query.toLowerCase();
    return customers.filter((customer) => {
      const derivedStatus = customer.orders >= 20 ? "VIP" : customer.orders < 5 ? "New" : "Active";
      const matchesTab = activeTab === "All" || derivedStatus === activeTab || (activeTab === "Inactive" && customer.orders === 0);
      const matchesQuery = !normalized || `${customer.name} ${customer.email} ${customer.phone}`.toLowerCase().includes(normalized);
      return matchesTab && matchesQuery;
    });
  }, [activeTab, customers, query]);

  const openCustomerView = (customer: Customer) => {
    // Always get the latest data from the store
    const latest = customers.find(c => c.email === customer.email) || customer;
    setSelectedCustomer(latest);
    setViewOpen(true);
  };

  const openCustomerEdit = (customer: Customer) => {
    const latest = customers.find(c => c.email === customer.email) || customer;
    setSelectedCustomer(latest);
    setDraftCustomer({ ...latest });
    setEditOpen(true);
  };

  const openCustomerActions = (customer: Customer) => {
    const latest = customers.find(c => c.email === customer.email) || customer;
    setSelectedCustomer(latest);
    setActionsOpen(true);
  };

  const saveCustomer = () => {
    if (!selectedCustomer || !draftCustomer) return;
    editCustomer(selectedCustomer.email, {
      name: draftCustomer.name,
      phone: draftCustomer.phone,
      status: draftCustomer.status,
    });
    // Update selected customer immediately
    setSelectedCustomer(prev => prev ? { ...prev, ...draftCustomer } : prev);
    setEditOpen(false);
    setDraftCustomer(null);
  };

  const setQuickStatus = (status: string) => {
    if (!selectedCustomer) return;
    editCustomer(selectedCustomer.email, { status: status as any });
    // Update selected customer immediately
    setSelectedCustomer(prev => prev ? { ...prev, status: status as any } : prev);
    setActionsOpen(false);
  };

  const getStatus = (customer: Customer) => {
    if (customer.status && customer.status !== "Active") return customer.status;
    return customer.orders >= 20 ? "VIP" : customer.orders < 5 ? "New" : "Active";
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Customers</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">{customers.length} customers · 346 new this month</p>
        </div>
        <div className="flex gap-1.5 sm:gap-2">
          <Button variant="outline" className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Export
          </Button>
          <Button className="gap-1.5 sm:gap-2 rounded-full text-xs sm:text-sm">
            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> View Users
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => (
          <div key={s.l} className="rounded-2xl border bg-card p-3 sm:p-5">
            <div className="flex justify-between">
              <div className={`grid h-8 w-8 sm:h-10 sm:w-10 rounded-xl place-items-center ${s.c}`}>
                <s.i className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <Badge className="border-0 text-[10px] bg-emerald-50 text-emerald-700">
                <TrendingUp className="h-2.5 w-2.5 mr-0.5" />{s.d}
              </Badge>
            </div>
            <div className="mt-2 sm:mt-4 text-2xl sm:text-3xl font-extrabold">{s.v}</div>
            <div className="text-[11px] sm:text-xs text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="p-3 sm:p-4 flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex flex-wrap gap-1.5 sm:gap-2 flex-1">
            {[{ l: "All", c: customers.length }, { l: "VIP", c: customers.filter((c) => c.orders >= 20).length }, { l: "Active", c: customers.filter((c) => c.orders >= 5 && c.orders < 20).length }, { l: "New", c: customers.filter((c) => c.orders < 5).length }, { l: "Inactive", c: 0 }].map((t) => (
              <button
                key={t.l}
                onClick={() => setActiveTab(t.l)}
                className={`flex items-center gap-1.5 sm:gap-2 rounded-full border px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium transition ${
                  activeTab === t.l 
                    ? "bg-brand text-brand-foreground border-brand shadow-sm" 
                    : "border-border hover:border-brand hover:bg-secondary/60"
                }`}
              >
                {t.l}
                <Badge variant="secondary" className={`h-3.5 sm:h-4 text-[10px] ${activeTab === t.l ? "bg-white/20 text-current" : ""}`}>
                  {t.c.toLocaleString()}
                </Badge>
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
            <Input 
              placeholder="Search customers..." 
              className="pl-7 sm:pl-8 h-8 sm:h-9 w-40 sm:w-56 text-xs sm:text-sm" 
              value={query} 
              onChange={(e: any) => setQuery(e.target.value)} 
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1000px]">
            <thead className="bg-secondary/50 text-[10px] sm:text-xs uppercase tracking-wider">
              <tr>
                {['Customer', 'Contact', 'Orders', 'Total Spent', 'Status', 'Joined', 'Last Order', 'Actions'].map((h) => (
                  <th key={h} className="px-3 sm:px-4 py-2 sm:py-3 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCustomers.map((c) => {
                const status = getStatus(c);
                return (
                  <tr key={c.email} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-3 sm:px-4 py-2 sm:py-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="relative flex-shrink-0">
                          <div className="grid h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-brand to-brand/80 text-brand-foreground place-items-center text-xs font-bold">
                            {c.name[0]}
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card ${statusDotColor[status]}`} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs sm:text-sm truncate">{c.name}</div>
                          <div className="text-[10px] sm:text-xs text-muted-foreground truncate">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3">
                      <div className="flex flex-col gap-0.5 text-[10px] sm:text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{c.email}</span>
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Phone className="h-3 w-3 flex-shrink-0" />
                          {c.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3">
                      <div className="font-bold text-base sm:text-lg">{c.orders}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">orders</div>
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3">
                      <div className="font-bold text-brand text-sm sm:text-base">{ngn(c.spent)}</div>
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3">
                      <Badge className={`border ${statusColor[status]} text-[10px] sm:text-xs`}>
                        {status === "VIP" && <Crown className="h-3 w-3 mr-1" />}
                        {status}
                      </Badge>
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-muted-foreground text-[10px] sm:text-sm">{c.joined}</td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-muted-foreground text-[10px] sm:text-sm">{c.lastOrder}</td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3">
                      <div className="flex gap-0.5 sm:gap-1">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-7 w-7 hover:bg-blue-50 hover:text-blue-600" 
                          onClick={() => openCustomerView(c)} 
                          title="View details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-7 w-7 hover:bg-amber-50 hover:text-amber-600" 
                          onClick={() => openCustomerEdit(c)} 
                          title="Edit customer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-7 w-7 hover:bg-purple-50 hover:text-purple-600" 
                          onClick={() => openCustomerActions(c)} 
                          title="Quick actions"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="p-3 sm:p-4 flex flex-wrap justify-between items-center gap-3 border-t">
          <div className="text-[10px] sm:text-xs text-muted-foreground">
            Showing {filteredCustomers.length} of {customers.length} customers
          </div>
          <div className="flex gap-0.5 sm:gap-1">
            {["‹", "1", "2", "3", "...", "1051", "›"].map((p) => (
              <button key={p} className={`min-w-6 sm:min-w-7 h-6 sm:h-7 rounded-md text-[10px] sm:text-xs font-semibold ${
                p === "1" ? "bg-brand text-brand-foreground" : "hover:bg-secondary"
              }`}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* VIEW CUSTOMER SHEET */}
      <Sheet open={viewOpen} onOpenChange={(open) => {
        if (!open) setViewOpen(false);
      }}>
        <SheetContent side="right" className="w-full sm:w-[460px] md:w-[480px] p-0 [&>button]:hidden">
          {/* Custom close button */}
          <button
            onClick={() => setViewOpen(false)}
            className="absolute top-4 right-4 z-50 grid h-8 w-8 rounded-full bg-background border shadow-sm place-items-center hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {selectedCustomer && (() => {
            const status = getStatus(selectedCustomer);
            return (
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="border-b px-4 sm:px-6 py-4 sm:py-5 shrink-0">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="grid h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br from-brand to-brand/80 text-brand-foreground place-items-center text-xl sm:text-2xl font-bold shadow-lg shadow-brand/20">
                        {selectedCustomer.name[0]}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-[3px] border-background ${statusDotColor[status]}`} />
                    </div>
                    <div className="min-w-0">
                      <SheetTitle className="text-lg sm:text-xl font-bold tracking-tight truncate">
                        {selectedCustomer.name}
                      </SheetTitle>
                      <Badge className={`mt-1 border ${statusColor[status]} text-[10px]`}>
                        {status === "VIP" && <Crown className="h-3 w-3 mr-1" />}
                        {status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5">
                  {/* Contact Info */}
                  <div className="rounded-2xl border bg-card p-4 sm:p-5 space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <User className="h-3.5 w-3.5" />
                      Contact Information
                    </h3>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="grid h-8 w-8 rounded-lg bg-blue-50 place-items-center flex-shrink-0">
                          <Mail className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] text-muted-foreground">Email</p>
                          <p className="font-medium text-xs sm:text-sm truncate">{selectedCustomer.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="grid h-8 w-8 rounded-lg bg-emerald-50 place-items-center flex-shrink-0">
                          <Phone className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">Phone</p>
                          <p className="font-medium text-xs sm:text-sm">{selectedCustomer.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="rounded-2xl border bg-card p-3 sm:p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="grid h-8 w-8 rounded-lg bg-brand/10 place-items-center">
                          <ShoppingBag className="h-4 w-4 text-brand" />
                        </div>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold">{selectedCustomer.orders}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">Total Orders</div>
                    </div>
                    <div className="rounded-2xl border bg-card p-3 sm:p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="grid h-8 w-8 rounded-lg bg-purple-50 place-items-center">
                          <CreditCard className="h-4 w-4 text-purple-600" />
                        </div>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-brand">
                        {ngn(selectedCustomer.spent)}
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">Lifetime Value</div>
                    </div>
                  </div>

                  {/* Activity Timeline */}
                  <div className="rounded-2xl border bg-card p-4 sm:p-5 space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" />
                      Activity
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-8 w-8 rounded-lg bg-emerald-50 place-items-center flex-shrink-0">
                          <ShoppingBag className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium">Last Order</p>
                          <p className="text-xs text-muted-foreground">{selectedCustomer.lastOrder}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="grid h-8 w-8 rounded-lg bg-blue-50 place-items-center flex-shrink-0">
                          <Calendar className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium">Member Since</p>
                          <p className="text-xs text-muted-foreground">{selectedCustomer.joined}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="rounded-2xl border bg-card p-4 sm:p-5 space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start gap-2 text-xs h-9"
                        onClick={() => {
                          setViewOpen(false);
                          setTimeout(() => openCustomerEdit(selectedCustomer), 100);
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit Profile
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start gap-2 text-xs h-9"
                        onClick={() => {
                          setViewOpen(false);
                          setTimeout(() => openCustomerActions(selectedCustomer), 100);
                        }}
                      >
                        <Shield className="h-3.5 w-3.5" />
                        Change Status
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </SheetContent>
      </Sheet>

      {/* EDIT CUSTOMER SHEET */}
      <Sheet open={editOpen} onOpenChange={(open) => {
        if (!open) {
          setEditOpen(false);
          setDraftCustomer(null);
        }
      }}>
        <SheetContent side="right" className="w-full sm:w-[460px] md:w-[480px] p-0 [&>button]:hidden">
          {/* Custom close button */}
          <button
            onClick={() => { setEditOpen(false); setDraftCustomer(null); }}
            className="absolute top-4 right-4 z-50 grid h-8 w-8 rounded-full bg-background border shadow-sm place-items-center hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {draftCustomer && (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="border-b px-4 sm:px-6 py-4 sm:py-5 shrink-0">
                <SheetHeader className="space-y-1 sm:space-y-1.5 p-0">
                  <SheetTitle className="text-lg sm:text-xl font-bold tracking-tight">Edit Customer</SheetTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground">Update customer information</p>
                </SheetHeader>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-6">
                {/* Avatar Preview */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <div className="grid h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br from-brand to-brand/80 text-brand-foreground place-items-center text-2xl sm:text-3xl font-bold shadow-lg shadow-brand/20">
                      {draftCustomer.name?.[0]?.toUpperCase() || <User className="h-8 w-8" />}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-[3px] border-background ${statusDotColor[draftCustomer.status || "Active"]}`} />
                  </div>
                  <p className="text-sm font-semibold">{draftCustomer.name || "Customer Name"}</p>
                </div>

                <div className="space-y-4 sm:space-y-5">
                  {/* Full Name */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="edit-customer-name" className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      Full Name
                    </Label>
                    <Input
                      id="edit-customer-name"
                      placeholder="Customer name"
                      value={draftCustomer.name}
                      onChange={(e: any) => setDraftCustomer((current) => current ? { ...current, name: e.target.value } : current)}
                      className="h-10 sm:h-11 text-sm focus-visible:ring-brand"
                    />
                  </div>

                  {/* Email (Read-only) */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="edit-customer-email" className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      Email Address
                    </Label>
                    <Input
                      id="edit-customer-email"
                      value={draftCustomer.email}
                      disabled
                      className="h-10 sm:h-11 text-sm bg-muted/50 cursor-not-allowed"
                    />
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground">Email cannot be changed.</p>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="edit-customer-phone" className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      Phone Number
                    </Label>
                    <Input
                      id="edit-customer-phone"
                      placeholder="Phone number"
                      value={draftCustomer.phone}
                      onChange={(e: any) => setDraftCustomer((current) => current ? { ...current, phone: e.target.value } : current)}
                      className="h-10 sm:h-11 text-sm focus-visible:ring-brand"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="edit-customer-status" className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                      Status
                    </Label>
                    <div className="relative">
                      <select
                        id="edit-customer-status"
                        className="flex h-10 sm:h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 appearance-none cursor-pointer"
                        value={draftCustomer.status || "Active"}
                        onChange={(e: any) => setDraftCustomer((current) => current ? { ...current, status: e.target.value } : current)}
                      >
                        <option value="VIP">👑 VIP</option>
                        <option value="Active">🟢 Active</option>
                        <option value="New">🔵 New</option>
                        <option value="Inactive">⚫ Inactive</option>
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {["VIP", "Active", "New", "Inactive"].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setDraftCustomer((current) => current ? { ...current, status: s } : current)}
                          className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] sm:text-[11px] font-medium transition-all border ${
                            (draftCustomer.status || "Active") === s
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

                {/* Stats Summary */}
                {selectedCustomer && (
                  <div className="rounded-xl border bg-accent/30 p-3 sm:p-4 space-y-2">
                    <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer Stats</p>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 text-[11px] sm:text-xs">
                      <div>
                        <span className="text-muted-foreground">Orders</span>
                        <p className="font-bold text-xs sm:text-sm">{selectedCustomer.orders}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Spent</span>
                        <p className="font-bold text-xs sm:text-sm">{ngn(selectedCustomer.spent)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Joined</span>
                        <p className="font-bold text-xs sm:text-sm">{selectedCustomer.joined}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Order</span>
                        <p className="font-bold text-xs sm:text-sm">{selectedCustomer.lastOrder}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 bg-muted/30 shrink-0">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => { setEditOpen(false); setDraftCustomer(null); }} 
                  className="text-muted-foreground text-xs sm:text-sm"
                >
                  Cancel
                </Button>
                <Button onClick={saveCustomer} className="gap-1.5 sm:gap-2 rounded-full text-xs sm:text-sm" size="sm">
                  <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* QUICK ACTIONS SHEET */}
      <Sheet open={actionsOpen} onOpenChange={(open) => {
        if (!open) setActionsOpen(false);
      }}>
        <SheetContent side="right" className="w-full sm:w-[420px] md:w-[440px] p-0 [&>button]:hidden">
          {/* Custom close button */}
          <button
            onClick={() => setActionsOpen(false)}
            className="absolute top-4 right-4 z-50 grid h-8 w-8 rounded-full bg-background border shadow-sm place-items-center hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {selectedCustomer && (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="border-b px-4 sm:px-6 py-4 sm:py-5 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 rounded-full bg-brand text-brand-foreground place-items-center text-sm font-bold flex-shrink-0">
                    {selectedCustomer.name[0]}
                  </div>
                  <div className="min-w-0">
                    <SheetTitle className="text-base sm:text-lg font-bold tracking-tight truncate">Quick Actions</SheetTitle>
                    <p className="text-xs text-muted-foreground truncate">{selectedCustomer.name}</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Change Status</p>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3 h-11 text-sm rounded-xl"
                    onClick={() => setQuickStatus("VIP")}
                  >
                    <div className="grid h-7 w-7 rounded-full bg-amber-100 place-items-center">
                      <Crown className="h-3.5 w-3.5 text-amber-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Mark as VIP</p>
                      <p className="text-[10px] text-muted-foreground">Premium customer status</p>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3 h-11 text-sm rounded-xl"
                    onClick={() => setQuickStatus("Active")}
                  >
                    <div className="grid h-7 w-7 rounded-full bg-emerald-100 place-items-center">
                      <Award className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Activate Account</p>
                      <p className="text-[10px] text-muted-foreground">Set status to active</p>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3 h-11 text-sm rounded-xl"
                    onClick={() => setQuickStatus("New")}
                  >
                    <div className="grid h-7 w-7 rounded-full bg-blue-100 place-items-center">
                      <UserPlus className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Move to New</p>
                      <p className="text-[10px] text-muted-foreground">Reset to new customer</p>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3 h-11 text-sm rounded-xl"
                    onClick={() => setQuickStatus("Inactive")}
                  >
                    <div className="grid h-7 w-7 rounded-full bg-slate-100 place-items-center">
                      <Shield className="h-3.5 w-3.5 text-slate-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Deactivate</p>
                      <p className="text-[10px] text-muted-foreground">Mark as inactive</p>
                    </div>
                  </Button>
                </div>

                {/* Customer Summary */}
                <div className="rounded-2xl border bg-accent/30 p-4 space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Summary</p>
                  <div className="grid grid-cols-2 gap-2 text-[11px] sm:text-xs">
                    <div>
                      <span className="text-muted-foreground">Orders</span>
                      <p className="font-bold text-xs sm:text-sm">{selectedCustomer.orders}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Spent</span>
                      <p className="font-bold text-xs sm:text-sm">{ngn(selectedCustomer.spent)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t px-4 sm:px-6 py-3 sm:py-4 bg-muted/30 shrink-0">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setActionsOpen(false)} 
                  className="w-full text-muted-foreground text-xs sm:text-sm rounded-full"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}