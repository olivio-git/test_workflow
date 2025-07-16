import type { ProductGet } from "@/modules/products/types/ProductGet";

export type CartItem = {
    product: ProductGet;
    quantity: number;
    customPrice?: number;
    discount?: number;
    notes?: string
};

export type CartState = {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (productId: number) => void;
    updateItem: (productId: number, updates: Partial<CartItem>) => void;
    clearCart: () => void;
    updateQuantity: (productId: number, quantity: number) => void
    updatePrice: (productId: number, price: number) => void
    updateDiscount: (productId: number, discount: number) => void
    updateNotes: (productId: number, notes: string) => void
    clear: () => void
};