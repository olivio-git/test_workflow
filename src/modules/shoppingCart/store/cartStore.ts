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
                    discountMode: null,

                    addItem: (product) => {
                        const existing = get().items.find((i) => i.product.id === product.id);
                        const basePrice = product.precio_venta;

                        // Validar stock disponible
                        if (!product.stock_actual || product.stock_actual <= 0) {
                            return {
                                success: false,
                                error: 'NO_STOCK',
                                message: `${product.descripcion} no tiene stock disponible`
                            };
                        }

                        if (existing) {
                            const newQuantity = existing.quantity + 1;

                            // Validar que no exceda el stock
                            if (newQuantity > product.stock_actual) {
                                return {
                                    success: false,
                                    error: 'INSUFFICIENT_STOCK',
                                    message: `Solo hay ${product.stock_actual} unidades disponibles de ${product.descripcion}`
                                };
                            }

                            const updatedSubtotal = calculateSubtotalByItem(
                                existing.customPrice ?? basePrice,
                                newQuantity
                            );

                            set({
                                items: get().items.map((i) =>
                                    i.product.id === product.id
                                        ? {
                                            ...i,
                                            quantity: newQuantity,
                                            customSubtotal: updatedSubtotal,
                                        }
                                        : i
                                ),
                            });
                        } else {
                            const quantity = 1;
                            const subtotal = calculateSubtotalByItem(basePrice, quantity);
                            const newItem: CartItem = {
                                product,
                                quantity,
                                customPrice: basePrice,
                                customSubtotal: subtotal,
                            };

                            set({ items: [...get().items, newItem] });
                        }

                        get().recalculateDiscount();
                        return {
                            success: true,
                            message: `${product.descripcion} agregado al carrito`
                        };
                    },

                    removeItem: (productId) => {
                        set({ items: get().items.filter(i => i.product.id !== productId) })
                        get().recalculateDiscount();
                    },

                    updateQuantity: (productId, quantity) => {
                        if (quantity < 1) return { success: false, message: 'La cantidad debe ser de 1 o mas productos' };
                        const item = get().items.find(i => i.product.id === productId);
                        if (!item) {
                            return {
                                success: false,
                                error: 'ITEM_NOT_FOUND',
                                message: 'Producto no encontrado en el carrito'
                            };
                        }

                        // Validar stock
                        if (quantity > item.product.stock_actual) {
                            return {
                                success: false,
                                error: 'INSUFFICIENT_STOCK',
                                message: `Solo hay ${item.product.stock_actual} unidades disponibles de ${item.product.descripcion}`
                            };
                        }

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

                        get().recalculateDiscount();
                        return {
                            success: true,
                            message: 'Cantidad actualizada correctamente'
                        };
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
                        get().recalculateDiscount();
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
                        get().recalculateDiscount();
                    },

                    clearCart: () => set({ items: [], discountAmount: 0, discountPercent: 0, discountMode: null }),

                    setDiscountAmount: (amount) => {
                        const subtotal = get().getCartSubtotal()
                        const validAmount = Math.min(Math.max(0, amount), subtotal);
                        const percent = subtotal > 0 ? (validAmount / subtotal) * 100 : 0;

                        set({
                            discountAmount: validAmount,
                            discountPercent: percent,
                            discountMode: 'amount'
                        });
                    },

                    setDiscountPercent: (percent) => {
                        const subtotal = get().getCartSubtotal()
                        const validPercent = Math.min(Math.max(0, percent), 100);
                        const amount = (validPercent / 100) * subtotal;

                        set({
                            discountPercent: validPercent,
                            discountAmount: amount,
                            discountMode: 'percent'
                        });
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
                    recalculateDiscount: () => {
                        const state = get();
                        const { discountMode, discountAmount, discountPercent } = state;
                        const newSubtotal = calculateSubtotal(state.items);

                        // Solo recalcular si hay un descuento activo
                        if (discountMode === null || (discountAmount === 0 && discountPercent === 0)) {
                            return;
                        }

                        if (discountMode === 'percent') {
                            // Si se editó el porcentaje, mantenerlo y recalcular el monto
                            const newAmount = (discountPercent / 100) * newSubtotal;
                            set({
                                discountAmount: newAmount
                            });
                        } else if (discountMode === 'amount') {
                            // Si se editó el monto, mantenerlo pero validar que no sea mayor al subtotal
                            const validAmount = Math.min(discountAmount, newSubtotal);
                            const newPercent = newSubtotal > 0 ? (validAmount / newSubtotal) * 100 : 0;
                            set({
                                discountAmount: validAmount,
                                discountPercent: newPercent
                            });
                        }
                    },
                    validateCart: () => {
                        const issues = get().items.filter(item => {
                            return !item.product.stock_actual ||
                                item.product.stock_actual <= 0 ||
                                item.quantity > item.product.stock_actual;
                        });

                        return {
                            isValid: issues.length === 0,
                            issues: issues.map(item => ({
                                productId: item.product.id,
                                productName: item.product.descripcion,
                                currentQuantity: item.quantity,
                                availableStock: item.product.stock_actual || 0,
                                issue: !item.product.stock_actual || item.product.stock_actual <= 0
                                    ? 'NO_STOCK'
                                    : 'QUANTITY_EXCEEDS_STOCK'
                            }))
                        };
                    },
                    canAddProduct: (productId: number, quantityToAdd: number = 1) => {
                        const product = get().items.find(i => i.product.id === productId)?.product;
                        if (!product) return { canAdd: false, reason: 'PRODUCT_NOT_FOUND' };

                        const currentQuantity = get().getItemQuantity(productId);
                        const totalQuantity = currentQuantity + quantityToAdd;

                        if (!product.stock_actual || product.stock_actual <= 0) {
                            return { canAdd: false, reason: 'NO_STOCK' };
                        }

                        if (totalQuantity > product.stock_actual) {
                            return {
                                canAdd: false,
                                reason: 'INSUFFICIENT_STOCK',
                                available: product.stock_actual - currentQuantity
                            };
                        }

                        return { canAdd: true };
                    },
                }),
                {
                    name: `${CART_CONSTANTS.STORAGE_PREFIX}${user}`,
                    storage: createJSONStorage(() => sessionStorage),
                    partialize: (state) => ({
                        items: state.items,
                        discountAmount: state.discountAmount,
                        discountPercent: state.discountPercent,
                        discountMode: state.discountMode
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