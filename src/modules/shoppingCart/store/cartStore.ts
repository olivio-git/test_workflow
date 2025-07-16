// src/modules/cart/store/cartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartState } from "../types/cart.types";

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            discountAmount: 0,
            discountPercent: 0,

            addItem: (item) => {
                const existing = get().items.find(i => i.product.id === item.product.id)
                if (existing) {
                    set({
                        items: get().items.map(i =>
                            i.product.id === item.product.id
                                ? { ...i, quantity: i.quantity + item.quantity }
                                : i
                        )
                    })
                } else {
                    set({ items: [...get().items, item] })
                }
            },

            removeItem: (productId) => {
                set({ items: get().items.filter(i => i.product.id !== productId) })
            },

            updateQuantity: (productId, quantity) => {
                if (quantity < 1) return;
                set({
                    items: get().items.map(i =>
                        i.product.id === productId ? { ...i, quantity } : i
                    )
                })
            },

            updateCustomPrice: (productId, price) => {
                set({
                    items: get().items.map(i =>
                        i.product.id === productId ? { ...i, customPrice: price, customSubtotal: undefined } : i
                    )
                })
            },

            updateCustomSubtotal: (productId, subtotal) => {
                const item = get().items.find(i => i.product.id === productId)
                if (!item || item.quantity < 1) return

                const newPrice = item.quantity > 0 ? subtotal / item.quantity : 0

                set({
                    items: get().items.map(i =>
                        i.product.id === productId
                            ? { ...i, customSubtotal: subtotal, customPrice: newPrice }
                            : i
                    )
                })
            },

            clearCart: () => set({ items: [], discountAmount: undefined, discountPercent: undefined }),

            setDiscountAmount: (amount) => {
                const subtotal = get().getCartSubtotal()
                const validAmount = Math.max(0, amount)
                const percent = subtotal > 0 ? (validAmount / subtotal) * 100 : 0
                set({ discountAmount: validAmount, discountPercent: percent })
            },

            setDiscountPercent: (percent) => {
                const subtotal = get().getCartSubtotal()
                const validPercent = Math.min(Math.max(0, percent), 100)
                const amount = (validPercent / 100) * subtotal
                set({ discountPercent: validPercent, discountAmount: amount })
            },

            getItemSubtotal: (productId) => {
                const item = get().items.find(i => i.product.id === productId)
                if (!item) return 0

                return item.customSubtotal ?? (item.customPrice ?? parseFloat(item.product.precio_venta)) * item.quantity
            },

            getCartSubtotal: () => {
                return calculateSubtotal(get().items)
            },

            getCartTotal: () => {
                const subtotal = get().getCartSubtotal()
                const { discountAmount, discountPercent } = get()

                if (discountAmount !== undefined) return subtotal - discountAmount
                if (discountPercent !== undefined) return subtotal * (1 - discountPercent / 100)

                return subtotal
            }
        }),
        {
            name: "cart-storage"
        }
    )
);

const calculateSubtotal = (items: CartItem[]) => {
    return items.reduce((sum, item) => {
        const subtotal = item.customSubtotal ?? (item.customPrice ?? parseFloat(item.product.precio_venta)) * item.quantity
        return sum + subtotal
    }, 0)
}
