import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { CartItem, CartState } from "../types/cart.types";
import { CART_CONSTANTS } from "../constants/cart.constants";
import { createStore } from "zustand";

// Tipo para el store con middleware
export type CartStore = ReturnType<typeof createCartStore>;
export const createCartStore = (user: string) => {
    return createStore<CartState>()(
        devtools(
            persist(
                (set, get) => ({
                    items: [],
                    discountAmount: 0,
                    discountPercent: 0,

                    addItem: (product) => {
                        const existing = get().items.find((i) => i.product.id === product.id);
                        const basePrice = product.precio_venta;
                        const quantity = 1;
                        const subtotal = calculateSubtotalByItem(basePrice, quantity);

                        if (existing) {
                            const updatedQuantity = existing.quantity + 1;
                            const updatedSubtotal = calculateSubtotalByItem(
                                existing.customPrice ?? basePrice,
                                updatedQuantity
                            );

                            set({
                                items: get().items.map((i) =>
                                    i.product.id === product.id
                                        ? {
                                            ...i,
                                            quantity: updatedQuantity,
                                            customSubtotal: updatedSubtotal,
                                        }
                                        : i
                                ),
                            });
                        } else {
                            const newItem: CartItem = {
                                product,
                                quantity,
                                customPrice: basePrice,
                                customSubtotal: subtotal,
                            };

                            set({ items: [...get().items, newItem] });
                        }
                    },

                    removeItem: (productId) => {
                        set({ items: get().items.filter(i => i.product.id !== productId) })
                    },

                    updateQuantity: (productId, quantity) => {
                        if (quantity < 1) return;
                        set({
                            items: get().items.map((i) =>
                                i.product.id === productId
                                    ? {
                                        ...i,
                                        quantity,
                                        customSubtotal: calculateSubtotalByItem(
                                            i.customPrice ?? i.product.precio_venta,
                                            quantity
                                        ),
                                    }
                                    : i
                            ),
                        });
                    },

                    updateCustomPrice: (productId, price) => {
                        set({
                            items: get().items.map((i) =>
                                i.product.id === productId
                                    ? {
                                        ...i,
                                        customPrice: price,
                                        customSubtotal: calculateSubtotalByItem(price, i.quantity),
                                    }
                                    : i
                            ),
                        });
                    },

                    updateCustomSubtotal: (productId, subtotal) => {
                        const item = get().items.find(i => i.product.id === productId)
                        if (!item || item.quantity < 1) return

                        set({
                            items: get().items.map((i) =>
                                i.product.id === productId
                                    ? {
                                        ...i,
                                        customSubtotal: subtotal,
                                        customPrice: calculateSubtotalByItem(subtotal / i.quantity, 1),
                                    }
                                    : i
                            ),
                        });
                    },

                    clearCart: () => set({ items: [], discountAmount: 0, discountPercent: 0 }),

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
                        const item = get().items.find((i) => i.product.id === productId);
                        return item ? item.customSubtotal : 0;
                    },

                    getCartSubtotal: () => {
                        return calculateSubtotal(get().items)
                    },

                    getCartTotal: () => {
                        const subtotal = get().getCartSubtotal()
                        const { discountAmount, discountPercent } = get()

                        if (discountAmount && discountAmount > 0) {
                            return Math.max(0, subtotal - discountAmount);
                        }
                        if (discountPercent && discountPercent > 0) {
                            return Math.max(0, subtotal * (1 - discountPercent / 100));
                        }

                        return subtotal
                    },

                    getCartCount: () => {
                        return get().items.reduce((count, item) => count + item.quantity, 0);
                    },

                    getDiscountAmount: () => {
                        const { discountAmount, discountPercent } = get();
                        if (!discountAmount) return 0;

                        const subtotal = get().getCartSubtotal();
                        return calculateDiscountAmount(subtotal, { amount: discountAmount, percent: discountPercent });
                    },

                    isItemInCart: (productId: number) => {
                        return get().items.some(item => item.product.id === productId);
                    },

                    getItemQuantity: (productId: number) => {
                        const item = get().items.find(i => i.product.id === productId);
                        return item ? item.quantity : 0;
                    },
                }),
                {
                    name: `${CART_CONSTANTS.STORAGE_PREFIX}${user}`,
                    storage: createJSONStorage(() => sessionStorage),
                    partialize: (state) => ({
                        items: state.items,
                        discountAmount: state.discountAmount,
                        discountPercent: state.discountPercent
                    }),
                }
            ),
            {
                name: `cart-storage-${user}`
            }
        )
    )
}

export const calculateSubtotal = (items: CartItem[]) => {
    return items.reduce((sum, item) => {
        const subtotal = calculateSubtotalByItem(item.customPrice, item.quantity)
        return sum + subtotal
    }, 0)
}

export const calculateSubtotalByItem = (price: number, qty: number) =>
    Number((price * qty).toFixed(2));

export const calculateDiscountAmount = (
    subtotal: number,
    discount: { amount?: number; percent?: number }
): number => {
    if (discount.amount) {
        return Math.min(discount.amount, subtotal);
    }

    if (discount.percent) {
        return (discount.percent / 100) * subtotal;
    }

    return 0;
};