import type { ProductGet } from "@/modules/products/types/ProductGet";
import { useCartStore } from "./useCartStore";
import type { CartSummary } from "../types/cart.types";
import { useStore } from "zustand";

export const useCartWithUtils = (userId: string) => {
    const cartStore = useCartStore(userId);
    const state = useStore(cartStore, (state) => state)

    const incrementQuantity = (productId: number) => {
        const currentQuantity = state.getItemQuantity(productId);
        state.updateQuantity(productId, currentQuantity + 1);
    };

    const decrementQuantity = (productId: number) => {
        const currentQuantity = state.getItemQuantity(productId);
        if (currentQuantity > 1) {
            state.updateQuantity(productId, currentQuantity - 1);
        } else {
            state.removeItem(productId);
        }
    };

    const addMultipleItems = (products: ProductGet[]) => {
        products.forEach(product => {
            state.addItem(product);
        });
    };

    const getCartSummary = (): CartSummary => {
        return {
            itemCount: state.getCartCount(),
            subtotal: state.getCartSubtotal(),
            discount: state.getDiscountAmount(),
            total: state.getCartTotal(),
            itemsLength: state.items.length
        };
    };

    return {
        ...state,
        incrementQuantity,
        decrementQuantity,
        addMultipleItems,
        getCartSummary,
        useCartStore: cartStore
    };
};
