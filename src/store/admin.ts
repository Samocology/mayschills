import { create } from "zustand";
import { persist } from "zustand/middleware";
import { orders as mockOrders } from "@/data/mock";
import { riders as mockRiders } from "@/data/mock";
import { customers as mockCustomers } from "@/data/mock";
import { products as mockProducts } from "@/data/products";

export type Order = (typeof mockOrders)[number];
export type Rider = (typeof mockRiders)[number];
export type Product = (typeof mockProducts)[number];
export type Customer = (typeof mockCustomers)[number];

type AdminState = {
  orders: Order[];
  riders: Rider[];
  products: Product[];
  customers: Customer[];
  addOrder: (o: Order) => void;
  addRider: (r: Rider) => void;
  addProduct: (p: Product) => void;
  editProduct: (id: string, changes: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  editCustomer: (email: string, changes: Partial<Customer>) => void;
};

export const useAdmin = create<AdminState>()(
  persist(
    (set) => ({
      orders: mockOrders.slice(),
      riders: mockRiders.slice(),
      products: mockProducts.slice(),
      customers: mockCustomers.slice(),
      addOrder: (o) => set((s) => {
        const orders = [o, ...s.orders];
        const customerIndex = s.customers.findIndex((c) => c.email === o.email);
        const customers = s.customers.slice();
        if (customerIndex === -1) {
          customers.unshift({ name: o.customer, email: o.email, phone: "", orders: 1, spent: o.amount, joined: "Today", status: o.amount >= 0 ? "Active" : "New", lastOrder: "Today" } as any);
        } else {
          const c = { ...customers[customerIndex] } as any;
          c.orders = (c.orders ?? 0) + 1;
          c.spent = (c.spent ?? 0) + o.amount;
          c.lastOrder = "Today";
          if (c.orders >= 20) c.status = "VIP";
          else if (c.orders < 5) c.status = "New";
          else c.status = "Active";
          customers[customerIndex] = c;
        }
        return { orders, customers } as any;
      }),
      addRider: (r) => set((s) => ({ riders: [r, ...s.riders] })),
      addProduct: (p) => set((s) => ({ products: [p, ...s.products] })),
      editProduct: (id, changes) => set((s) => ({ products: s.products.map((p) => (p.id === id ? { ...p, ...changes } : p)) })),
      deleteProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
      editCustomer: (email, changes) => set((s) => ({ customers: s.customers.map((customer) => (customer.email === email ? { ...customer, ...changes } : customer)) })),
    }),
    { name: "mayschills-admin" }
  )
);

export default useAdmin;
