import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/data/products";

export type CartItem = {
  id: string;
  product: Product;
  qty: number;
  size?: string;
  toppings?: string[];
  unitPrice: number;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "id">) => void;
  remove: (id: string) => void;
  update: (id: string, qty: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((s) => {
          const id = `${item.product.id}-${item.size ?? ""}-${(item.toppings ?? []).join("|")}`;
          const existing = s.items.find((i) => i.id === id);
          if (existing) {
            return { items: s.items.map((i) => (i.id === id ? { ...i, qty: i.qty + item.qty } : i)) };
          }
          return { items: [...s.items, { ...item, id }] };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      update: (id, qty) =>
        set((s) => ({ items: qty <= 0 ? s.items.filter((i) => i.id !== id) : s.items.map((i) => (i.id === id ? { ...i, qty } : i)) })),
      clear: () => set({ items: [] }),
    }),
    { name: "mayschills-cart" }
  )
);

type WishlistState = {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
};
export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id] })),
      has: (id) => get().ids.includes(id),
    }),
    { name: "mayschills-wishlist" }
  )
);

type AuthUser = { name: string; email: string };
type AuthState = {
  user: AuthUser | null;
  signIn: (email: string) => void;
  signUp: (name: string, email: string) => void;
  signOut: () => void;
};
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      signIn: (email) => set({ user: { name: email.split("@")[0].replace(/\b\w/g, c => c.toUpperCase()), email } }),
      signUp: (name, email) => set({ user: { name, email } }),
      signOut: () => set({ user: null }),
    }),
    { name: "mayschills-auth" }
  )
);
