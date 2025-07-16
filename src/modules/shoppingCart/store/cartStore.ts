// src/modules/cart/store/cartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartState } from "../types/cart.types";

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => {
                const existing = get().items.find(i => i.product.id === item.product.id);
                if (existing) {
                    set({
                        items: get().items.map(i =>
                            i.product.id === item.product.id
                                ? { ...i, quantity: i.quantity + item.quantity }
                                : i
                        ),
                    });
                } else {
                    set({ items: [...get().items, item] });
                }
            },
            removeItem: (productId) => {
                set({ items: get().items.filter(i => i.product.id !== productId) });
            },
            updateItem: (productId, updates) => {
                set({
                    items: get().items.map(i =>
                        i.product.id === productId ? { ...i, ...updates } : i
                    ),
                });
            },
            clearCart: () => set({ items: [] }),


            
            updateQuantity: (id, quantity) =>
                set({
                    items: get().items.map((item) =>
                        item.product.id === id ? { ...item, quantity } : item
                    ),
                }),
            updatePrice: (id, price) =>
                set({
                    items: get().items.map((item) =>
                        item.product.id === id ? { ...item, customPrice: price } : item
                    ),
                }),
            updateDiscount: (id, discount) =>
                set({
                    items: get().items.map((item) =>
                        item.product.id === id ? { ...item, discount } : item
                    ),
                }),
            updateNotes: (id, notes) =>
                set({
                    items: get().items.map((item) =>
                        item.product.id === id ? { ...item, notes } : item
                    ),
                }),
            clear: () => set({ items: [] }),
        }),
        {
            name: "cart-storage", // Nombre para localStorage
        }
    )
);
