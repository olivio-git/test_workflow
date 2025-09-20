import { useState, useCallback, useEffect, useMemo } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import type { SaleUpdateDetailUI, SaleUpdateForm } from '../types/saleUpdate.type';
import type { ProductGet } from '@/modules/products/types/ProductGet';
import { showErrorToast, showSuccessToast } from '@/hooks/use-toast-enhanced';

export type DiscountType = 'percentage' | 'amount';

interface UseSaleProductDetailsProps {
    formMethods: UseFormReturn<SaleUpdateForm>;
}

interface UseSaleProductDetailsReturn {
    // Estados
    discountType: DiscountType;
    globalDiscount: number;

    // Funciones principales
    addProduct: (product: ProductGet | ProductGet[]) => void;
    removeProduct: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    updatePrice: (productId: number, price: number) => void;
    applyGlobalDiscount: (discount: number, type: DiscountType) => void;
    clearGlobalDiscount: () => void;
    updateCustomSubtotal: (productId: number, customSubtotal: number) => void;

    // Funciones de cálculo
    calculateSubtotal: (detail: SaleUpdateDetailUI) => number;
    calculateTotal: () => number;
    calculateTotalDiscount: () => number;
    getDiscountPercentage: () => number
    calculateTotalBeforeDiscount: () => number

    // Setters
    setDiscountType: (type: DiscountType) => void;
    setGlobalDiscount: (discount: number) => void;
}

const useSaleProductDetailsWithForm = ({ formMethods }: UseSaleProductDetailsProps): UseSaleProductDetailsReturn => {
    const { setValue, getValues, watch } = formMethods;
    const [discountType, setDiscountType] = useState<DiscountType>('percentage');
    const [globalDiscount, setGlobalDiscount] = useState<number>(0);
    const [hasDiscount, setHasDiscount] = useState<boolean>(false)

    const watchedDetalles = watch("detalles");
    const products = useMemo(() => watchedDetalles || [], [watchedDetalles]);

    useEffect(() => {
        if (products.length <= 0) return

        const existingDiscount = products.find((p) => p.descuento > 0)
        if (existingDiscount) {
            setHasDiscount(true)
        }
    }, [products])

    // Agregar producto(s)
    const addProduct = useCallback((input: ProductGet | ProductGet[]) => {
        const productsToAdd = Array.isArray(input) ? input : [input];
        const currentProducts = getValues("detalles") || [];
        const updated = [...currentProducts];
        let addedCount = 0;
        let skippedCount = 0;

        // Buscar si ya existe algún producto con descuento para aplicar el mismo porcentaje
        const productWithDiscount = currentProducts.find(p => p.descuento > 0 && p.porcentaje_descuento > 0);
        const existingDiscountPercentage = productWithDiscount?.porcentaje_descuento ?? 0;

        productsToAdd.forEach((product) => {
            const existingIndex = updated.findIndex(d => d.producto?.id === product.id);

            if (existingIndex !== -1) {
                // Ya existe, aumentar cantidad en 1 si hay stock disponible
                const item = updated[existingIndex]
                const currentQuantity = updated[existingIndex].cantidad;
                const newQuantity = currentQuantity + 1;
                const newDiscount = (newQuantity * item.precio) * (item.porcentaje_descuento / 100)

                if (product.stock_actual !== undefined && newQuantity > product.stock_actual) {
                    skippedCount++;
                    return;
                }

                updated[existingIndex] = {
                    ...updated[existingIndex],
                    cantidad: newQuantity,
                    descuento: newDiscount
                };
                addedCount++;
            } else {
                if (product.stock_actual !== undefined && product.stock_actual < 1) {
                    skippedCount++;
                    return;
                }

                // Calcular descuento para el nuevo producto si hay descuento existente
                let porcentaje_descuento = 0;
                let descuento = 0;

                if (hasDiscount && existingDiscountPercentage > 0) {
                    porcentaje_descuento = existingDiscountPercentage;
                    // Calcular el descuento en base al precio del producto y el porcentaje existente
                    const subtotal = 1 * product.precio_venta; // cantidad inicial = 1
                    descuento = subtotal * (existingDiscountPercentage / 100);
                }

                const newDetail: SaleUpdateDetailUI = {
                    id_producto: product.id,
                    cantidad: 1,
                    descuento: descuento,
                    porcentaje_descuento: porcentaje_descuento,
                    id_detalle_venta: null,
                    precio: product.precio_venta,
                    producto: {
                        id: product.id,
                        categoria: product.categoria ?? null,
                        codigo_oem: product.codigo_oem ?? null,
                        codigo_upc: product.codigo_upc ?? null,
                        descripcion: product.descripcion,
                        marca: product.marca ?? "",
                        precio_venta: product.precio_venta
                    }
                };

                updated.push(newDetail);
                addedCount++;
            }
        });

        setValue("detalles", updated);
        showToastSummary(input, addedCount, skippedCount, productsToAdd);
    }, [setValue, getValues, hasDiscount]);

    // Quitar producto
    const removeProduct = useCallback((productId: number) => {
        const currentProducts = getValues("detalles") || [];

        if (currentProducts.length <= 1) {
            showErrorToast({
                title: "No se puede eliminar",
                description: "Debe haber al menos un producto en la venta",
                duration: 3000
            });
            return;
        }

        const updated = currentProducts.filter(detail => detail.producto?.id !== productId);
        setValue("detalles", updated);
    }, [setValue, getValues]);

    // Actualizar cantidad
    const updateQuantity = useCallback((productId: number, quantity: number) => {
        if (quantity < 1) {
            showErrorToast({
                title: "Cantidad inválida",
                description: "La cantidad debe ser mayor a 0",
                duration: 3000
            });
            return;
        }

        const currentProducts = getValues("detalles") || [];
        const updated = currentProducts.map(detail => {
            if (detail.producto?.id === productId) {
                // Recalcular descuento si hay porcentaje aplicado
                let newDiscount = detail.descuento;
                if (detail.porcentaje_descuento > 0) {
                    const subtotal = quantity * detail.precio;
                    newDiscount = subtotal * (detail.porcentaje_descuento / 100);
                }

                return {
                    ...detail,
                    cantidad: quantity,
                    descuento: newDiscount
                };
            }
            return detail;
        });

        setValue("detalles", updated);
    }, [setValue, getValues]);

    // Actualizar cantidad
    const updateCustomSubtotal = useCallback((productId: number, customSubtotal: number) => {
        if (customSubtotal < 1) {
            showErrorToast({
                title: "Monto inválida",
                description: "El monto debe ser mayor a 0",
                duration: 3000
            });
            return;
        }

        const currentProducts = getValues("detalles") || [];
        const updated = currentProducts.map(detail => {
            if (detail.producto?.id === productId) {
                // Recalcular precio
                const newPrice = customSubtotal / detail.cantidad
                let newDiscount = 0
                if (detail.porcentaje_descuento > 0) {
                    newDiscount = customSubtotal * (detail.porcentaje_descuento / 100);
                }

                return {
                    ...detail,
                    precio: newPrice,
                    descuento: newDiscount
                };
            }
            return detail;
        });

        setValue("detalles", updated);
    }, [setValue, getValues]);

    // Actualizar precio
    const updatePrice = useCallback((productId: number, price: number) => {
        if (price < 0) {
            showErrorToast({
                title: "Precio inválido",
                description: "El precio no puede ser negativo",
                duration: 3000
            });
            return;
        }

        const currentProducts = getValues("detalles") || [];
        const updated = currentProducts.map(detail => {
            if (detail.producto?.id === productId) {
                // Recalcular descuento si hay porcentaje aplicado
                let newDiscount = detail.descuento;
                if (detail.porcentaje_descuento > 0) {
                    const subtotal = detail.cantidad * price;
                    newDiscount = subtotal * (detail.porcentaje_descuento / 100);
                }

                return {
                    ...detail,
                    precio: price,
                    descuento: newDiscount
                };
            }
            return detail;
        });

        setValue("detalles", updated);
    }, [setValue, getValues]);

    // Aplicar descuento global
    const applyGlobalDiscount = useCallback((discount: number, type: DiscountType) => {
        if (discount < 0) {
            showErrorToast({
                title: "Descuento inválido",
                description: "El descuento no puede ser negativo",
                duration: 3000
            });
            return;
        }

        const currentProducts = getValues("detalles") || [];

        if (currentProducts.length === 0) {
            showErrorToast({
                title: "Sin productos",
                description: "No hay productos para aplicar descuento",
                duration: 3000
            });
            return;
        }

        let updated: SaleUpdateDetailUI[];

        if (type === 'percentage') {
            if (discount > 100) {
                showErrorToast({
                    title: "Descuento inválido",
                    description: "El descuento porcentual no puede ser mayor a 100%",
                    duration: 3000
                });
                return;
            }

            // Aplicar el mismo porcentaje a todos los productos
            updated = currentProducts.map(detail => {
                const subtotal = detail.cantidad * detail.precio;
                const discountAmount = subtotal * (discount / 100);

                return {
                    ...detail,
                    porcentaje_descuento: discount,
                    descuento: discountAmount
                };
            });
        } else {
            // type === 'amount'
            // Calcular el total sin descuentos
            const totalWithoutDiscount = currentProducts.reduce((acc, detail) => {
                return acc + (detail.cantidad * detail.precio);
            }, 0);

            if (discount > totalWithoutDiscount) {
                showErrorToast({
                    title: "Descuento inválido",
                    description: "El descuento no puede ser mayor al total de la venta",
                    duration: 3000
                });
                return;
            }

            // Calcular el porcentaje equivalente
            const discountPercentage = (discount / totalWithoutDiscount) * 100;

            // Aplicar el porcentaje calculado a todos los productos
            updated = currentProducts.map(detail => {
                const subtotal = detail.cantidad * detail.precio;
                const discountAmount = subtotal * (discountPercentage / 100);

                return {
                    ...detail,
                    porcentaje_descuento: discountPercentage,
                    descuento: discountAmount
                };
            });
        }

        setValue("detalles", updated);
        setDiscountType(type);
        setGlobalDiscount(discount);
    }, [setValue, getValues]);

    // Limpiar descuento global
    const clearGlobalDiscount = useCallback(() => {
        const currentProducts = getValues("detalles") || [];

        const updated = currentProducts.map(detail => ({
            ...detail,
            porcentaje_descuento: 0,
            descuento: 0
        }));

        setValue("detalles", updated);
        setGlobalDiscount(0);
    }, [setValue, getValues]);

    // Calcular subtotal de un producto
    const calculateSubtotal = useCallback((detail: SaleUpdateDetailUI): number => {
        const subtotal = detail.cantidad * detail.precio;
        return subtotal - detail.descuento;
    }, []);

    // Calcular total de la venta
    const calculateTotal = useCallback((): number => {
        return products.reduce((acc, detail) => {
            return acc + calculateSubtotal(detail);
        }, 0);
    }, [products, calculateSubtotal]);

    // Calcular total de descuentos
    const calculateTotalDiscount = useCallback((): number => {
        return products.reduce((acc, detail) => {
            return acc + detail.descuento;
        }, 0);
    }, [products]);

    const getDiscountPercentage = useCallback((): number => {
        return products.find((p) => p.porcentaje_descuento > 0)?.porcentaje_descuento ?? 0
    }, [products])

    const calculateTotalBeforeDiscount = useCallback((): number => {
        return products.reduce((total, detail) => {
            return total + (detail.cantidad * detail.precio)
        }, 0)
    }, [products])

    // Función auxiliar para mostrar toast de resumen
    const showToastSummary = (
        input: ProductGet | ProductGet[],
        addedCount: number,
        skippedCount: number,
        products: ProductGet[]
    ) => {
        if (Array.isArray(input)) {
            if (addedCount > 0) {
                showSuccessToast({
                    title: "Productos agregados",
                    description: `${addedCount} producto(s) agregados correctamente`,
                    duration: 3000
                });
            }
            if (skippedCount > 0) {
                showErrorToast({
                    title: "Stock insuficiente",
                    description: `${skippedCount} producto(s) no agregados por stock insuficiente`,
                    duration: 5000
                });
            }
        } else {
            if (addedCount > 0) {
                showSuccessToast({
                    title: "Producto agregado",
                    description: `${products[0].descripcion} agregado correctamente`,
                    duration: 3000
                });
            }
            if (skippedCount > 0) {
                showErrorToast({
                    title: "Stock insuficiente",
                    description: `No hay stock disponible para ${products[0].descripcion}`,
                    duration: 5000
                });
            }
        }
    };

    return {
        // Estados
        discountType,
        globalDiscount,

        // Funciones principales
        addProduct,
        removeProduct,
        updateQuantity,
        updatePrice,
        applyGlobalDiscount,
        clearGlobalDiscount,
        updateCustomSubtotal,

        // Funciones de cálculo
        calculateSubtotal,
        calculateTotal,
        calculateTotalDiscount,
        getDiscountPercentage,
        calculateTotalBeforeDiscount,

        // Setters
        setDiscountType,
        setGlobalDiscount,
    };
};
export default useSaleProductDetailsWithForm