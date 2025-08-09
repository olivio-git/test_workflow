import { useCartStore } from "./useCartStore";
import type { CartProduct, CartSummary } from "../types/cart.types";
import { useStore } from "zustand";
import { showErrorToast, showInfoToast, showSuccessToast, showWarningToast } from "@/hooks/use-toast-enhanced";

export interface CartOperationResult {
    success: boolean;
    error?: string;
    message: string;
    data?: any;
}

export interface BulkAddResult {
    success: boolean;
    totalAdded: number;
    totalFailed: number;
    failedProducts: Array<{
        product: CartProduct;
        reason: string;
        message: string;
    }>;
    message: string;
}

export const useCartWithUtils = (user: string, branch: string) => {
    if (!user) user = "guest"
    const cartStore = useCartStore(`${user}-${branch}`);
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

    const addItemToCart = (product: CartProduct): CartOperationResult => {
        const result = state.addItem(product);

        if (result.success) {
            showSuccessToast({
                title: "Producto agregado",
                description: result.message,
                duration: 5000,
            })
        } else {
            showErrorToast({
                title: "No se pudo agregar producto",
                description: result.message,
                duration: 5000,
            });
        }

        return result;
    };

    const addMultipleItems = (products: CartProduct[]): BulkAddResult => {
        let totalAdded = 0;
        let totalFailed = 0;
        const failedProducts: BulkAddResult['failedProducts'] = [];

        products.forEach(product => {
            const result = state.addItem(product);

            if (result.success) {
                totalAdded++;
            } else {
                totalFailed++;
                failedProducts.push({
                    product,
                    reason: result.error || 'UNKNOWN_ERROR',
                    message: result.message
                });
            }
        });

        const bulkResult: BulkAddResult = {
            success: totalAdded > 0,
            totalAdded,
            totalFailed,
            failedProducts,
            message: `Se agregaron ${totalAdded} productos. ${totalFailed > 0 ? `${totalFailed} fallaron.` : ''}`
        };

        // Toast con resumen
        if (totalAdded > 0) {
            showSuccessToast({
                title: "Productos agregados",
                description: bulkResult.message,
                duration: 5000,
            });
        }

        // Toast con errores específicos si los hay
        if (totalFailed > 0) {
            const errorMessage = failedProducts.length === 1
                ? failedProducts[0].message
                : `${totalFailed} productos no se pudieron agregar por problemas de stock`;

            showErrorToast({
                title: "Algunos productos no se agregaron",
                description: errorMessage,
                duration: 5000,
            });
        }

        return bulkResult;
    };

    const addItemWithQuantity = (product: CartProduct, quantity: number): CartOperationResult => {
        const existingQuantity = state.getItemQuantity(product.id);
        const totalQuantity = existingQuantity + quantity;

        if (!product.stock_actual || product.stock_actual <= 0) {
            const result = {
                success: false,
                error: 'NO_STOCK',
                message: `${product.descripcion} no tiene stock disponible`
            };

            showErrorToast({
                title: "Sin stock",
                description: result.message,
                duration: 5000,
            });

            return result;
        }

        if (totalQuantity > product.stock_actual) {
            const available = product.stock_actual - existingQuantity;
            const result = {
                success: false,
                error: 'INSUFFICIENT_STOCK',
                message: `Solo hay ${available} unidades adicionales disponibles de ${product.descripcion}`
            };

            showErrorToast({
                title: "Stock insuficiente",
                description: result.message,
                duration: 5000,
            });

            return result;
        }

        let addedCount = 0;
        for (let i = 0; i < quantity; i++) {
            const result = state.addItem(product);
            if (result.success) {
                addedCount++;
            } else {
                break; // Si falla uno, parar
            }
        }

        const result = {
            success: addedCount === quantity,
            message: `Se agregaron ${addedCount} de ${quantity} unidades de ${product.descripcion}`
        };

        {
            addedCount === quantity ? (
                showSuccessToast({
                    title: "Productos agregados",
                    description: result.message,
                    duration: 5000
                })
            ) : (
                showWarningToast({
                    title: "Agregado parcial",
                    description: result.message,
                    duration: 5000
                })
            )
        }

        return result;
    };

    const validateCartWithToast = () => {
        const validation = state.validateCart();

        if (!validation.isValid) {
            const issueMessages = validation.issues.map(issue =>
                `${issue.productName}: ${issue.issue === 'NO_STOCK' ? 'Sin stock' : `Cantidad ${issue.currentQuantity} > Stock ${issue.availableStock}`}`
            );

            showErrorToast({
                title: "Problemas en el carrito",
                description: issueMessages.join(', '),
                duration: 5000
            });
        }

        return validation;
    };

    const removeOutOfStockItems = (): CartOperationResult => {
        const validation = state.validateCart();
        const outOfStockItems = validation.issues.filter(issue => issue.issue === 'NO_STOCK');

        outOfStockItems.forEach(issue => {
            state.removeItem(issue.productId);
        });

        if (outOfStockItems.length > 0) {
            showInfoToast({
                title: "Productos removidos",
                description: `Se removieron ${outOfStockItems.length} productos sin stock`,
                duration: 5000
            });
        }

        return {
            success: true,
            message: `Se removieron ${outOfStockItems.length} productos sin stock`
        };
    };

    const adjustQuantitiesToStock = (): CartOperationResult => {
        const validation = state.validateCart();
        const quantityIssues = validation.issues.filter(issue => issue.issue === 'QUANTITY_EXCEEDS_STOCK');

        let adjustedCount = 0;
        quantityIssues.forEach(issue => {
            const result = state.updateQuantity(issue.productId, issue.availableStock);
            if (result.success) {
                adjustedCount++;
            }
        });

        if (adjustedCount > 0) {
            showInfoToast({
                title: "Cantidades ajustadas",
                description: `Se ajustaron las cantidades de ${adjustedCount} productos según el stock disponible`,
                duration: 5000
            });
        }

        return {
            success: true,
            message: `Se ajustaron ${adjustedCount} productos`
        };
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
        // Estado original
        ...state,

        // Métodos con utilidades
        incrementQuantity,
        decrementQuantity,
        addItemToCart,
        addMultipleItems,
        addItemWithQuantity,
        validateCartWithToast,
        removeOutOfStockItems,
        adjustQuantitiesToStock,
        getCartSummary,

        // Store reference
        useCartStore: cartStore
    };
};
