import type z from "zod";
import type { CartProductSchema } from "../schemas/cartProduct.schema";

export type CartProduct = z.infer<typeof CartProductSchema>


export type CartItem = {
    product: CartProduct;
    quantity: number;
    customPrice: number;
    customSubtotal: number;
    customDescription: string;
    customBrand: string | null;
};

export interface CartOperationResult {
    success: boolean;
    error?: 'NO_STOCK' | 'INSUFFICIENT_STOCK' | 'ITEM_NOT_FOUND' | 'UNKNOWN_ERROR';
    message: string;
}

export interface CartValidationIssue {
    productId: number;
    productName: string;
    currentQuantity: number;
    availableStock: number;
    issue: 'NO_STOCK' | 'QUANTITY_EXCEEDS_STOCK';
}

export interface CartValidationResult {
    isValid: boolean;
    issues: CartValidationIssue[];
}

export interface CanAddProductResult {
    canAdd: boolean;
    reason?: 'PRODUCT_NOT_FOUND' | 'NO_STOCK' | 'INSUFFICIENT_STOCK';
    available?: number;
}

type DiscountMode = 'amount' | 'percent' | null

export type CartState = {
    items: CartItem[];
    discountAmount: number
    discountPercent: number
    discountMode: DiscountMode

    addItem: (item: CartProduct) => CartOperationResult
    removeItem: (productId: number) => void
    updateQuantity: (productId: number, quantity: number) => CartOperationResult
    updateCustomPrice: (productId: number, price: number) => void
    updateCustomSubtotal: (productId: number, subtotal: number) => void
    updateCustomDescription: (productId: number, description: string) => void
    updateCustomBrand: (productId: number, brand: string) => void
    clearCart: () => void

    setDiscountAmount: (amount: number) => void
    setDiscountPercent: (percent: number) => void
    recalculateDiscount: () => void;

    getItemSubtotal: (productId: number) => number
    getCartSubtotal: () => number
    getCartTotal: () => number
    getCartCount: () => number;
    getDiscountAmount: () => number;
    isItemInCart: (productId: number) => boolean;
    getItemQuantity: (productId: number) => number;

    validateCart: () => CartValidationResult;
    canAddProduct: (productId: number, quantityToAdd?: number) => CanAddProductResult;
};

export interface CartSummary {
    itemCount: number;
    subtotal: number;
    discount: number;
    total: number;
    itemsLength: number;
}

export interface StoreItem {
    items: CartItem[];
    discountAmount: number
    discountPercent: number
    discountMode: DiscountMode
}