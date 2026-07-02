import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function AdminSettings() {
  const [storeName, setStoreName] = useState("MaysChills");
  const [supportEmail, setSupportEmail] = useState("hello@mayschills.com");
  const [deliveryFee, setDeliveryFee] = useState("500");
  const [autoAssignRider, setAutoAssignRider] = useState(true);
  const [liveTracking, setLiveTracking] = useState(true);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="mt-2 text-sm text-muted-foreground">Fine-tune your storefront, delivery rules, and business alerts from one polished place.</p>
        </div>
        <Button className="rounded-full">Save all changes</Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border bg-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Store profile</h2>
              <p className="mt-1 text-sm text-muted-foreground">Keep public details and support channels current.</p>
            </div>
            <Badge className="border-0 bg-emerald-50 text-emerald-700">Live</Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Store name</label>
              <Input className="mt-2" value={storeName} onChange={(e: any) => setStoreName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Support email</label>
              <Input className="mt-2" value={supportEmail} onChange={(e: any) => setSupportEmail(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Store description</label>
            <textarea className="mt-2 min-h-24 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm" defaultValue="Fresh smoothies, detox plans, and wellness bundles delivered fast across Lagos." />
          </div>
        </div>

        <div className="rounded-3xl border bg-card p-6 space-y-5">
          <div>
            <h2 className="font-semibold">Delivery preferences</h2>
            <p className="mt-1 text-sm text-muted-foreground">Set defaults that keep operations smooth and predictable.</p>
          </div>

          <div>
            <label className="text-sm font-medium">Base delivery fee</label>
            <Input className="mt-2" value={deliveryFee} onChange={(e: any) => setDeliveryFee(e.target.value)} />
          </div>

          <div className="space-y-3">
            <SettingRow label="Auto-assign rider" description="Match the next available rider automatically" checked={autoAssignRider} onCheckedChange={setAutoAssignRider} />
            <SettingRow label="Live tracking" description="Expose real-time rider positions to customers" checked={liveTracking} onCheckedChange={setLiveTracking} />
            <SettingRow label="Order notifications" description="Alert staff when a fresh order lands" checked={orderNotifications} onCheckedChange={setOrderNotifications} />
            <SettingRow label="Low stock alerts" description="Notify you before inventory runs low" checked={lowStockAlerts} onCheckedChange={setLowStockAlerts} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {['Paystack', 'Flutterwave', 'Stripe'].map((provider) => (
          <div key={provider} className="rounded-2xl border bg-card p-4">
            <div className="font-medium">{provider}</div>
            <div className="mt-1 text-sm text-muted-foreground">Enabled · Production ready</div>
            <div className="mt-4 h-2 rounded-full bg-secondary">
              <div className="h-2 w-3/4 rounded-full bg-brand" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingRow({ label, description, checked, onCheckedChange }: { label: string; description: string; checked: boolean; onCheckedChange: (value: boolean) => void }) {
  return (
    <div className="flex items-start justify-between rounded-xl border p-3">
      <div>
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
