import { toast } from "@/hooks/use-toast";
import { useCallback, useEffect, useState } from "react";
import { updatePurchase } from "../services/purchaseService";
import type { PurchaseDetail } from "../types/PurchaseDetail";
import { debugPurchaseData } from "../utils/debugPurchase";
import type { FormData } from "./usePurchaseForm";

export function usePurchaseEdit(initialData?: PurchaseDetail) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fecha: "",
    nro_comprobante: "",
    nro_comprobante2: "",
    id_proveedor: null,
    tipo_compra: "",
    forma_compra: "",
    comentario: "",
    usuario: 1, // ID por defecto
    sucursal: 1, // ID por defecto
    detalles: [],
    id_responsable: 1, // ID por defecto
  });

  // Poblar formulario con datos existentes
  useEffect(() => {
    if (initialData) {
      setFormData({
        fecha: initialData.fecha ? initialData.fecha.split('T')[0] : "",
        // El esquema tiene 'nro' en lugar de 'nro_comprobante'
        nro_comprobante: (initialData as any).nro || "",
        // No existe en el esquema de detalle de compra, se deja vacío
        nro_comprobante2: "",
        id_proveedor: initialData.proveedor?.id || null,
        tipo_compra: initialData.tipo_compra || "",
        forma_compra: initialData.forma_compra || "",
        // No existe 'comentarios' en el esquema, mantener vacío
        comentario: "",
        // El detalle de compra no incluye usuario ni sucursal, mantener por defecto
        usuario: 1, // Valor por defecto si no existe
        sucursal: 1, // Valor por defecto si no existe
        detalles: initialData.detalles || [],
        id_responsable: initialData.responsable?.id || 1, // Valor por defecto si no existe
      });
    }
  }, [initialData]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((field: keyof FormData, value: any): string => {
    if (["tipo_compra", "forma_compra", "id_proveedor"].includes(field)) {
      if (!value || (Array.isArray(value) ? value.length === 0 : value === 0)) {
        return "Este campo es requerido.";
      }
    }
    if (field === "fecha" && !value) return "La fecha es requerida.";
    if (field === "nro_comprobante" && !value) return "El número de comprobante es requerido.";
    return "";
  }, []);

  const validateAll = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    (Object.keys(formData) as (keyof FormData)[]).forEach(f => {
      const err = validateField(f, formData[f]);
      if (err) newErrors[f] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  const handleChange = useCallback((field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors(e => ({ ...e, [field]: validateField(field, value) }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((field: keyof FormData) => {
    setTouched(t => ({ ...t, [field]: true }));
    setErrors(e => ({ ...e, [field]: validateField(field, formData[field]) }));
  }, [formData, validateField]);

  const handleSubmit = useCallback(async (purchaseId: number) => {
    setTouched(Object.keys(formData).reduce((a, k) => ({ ...a, [k]: true }), {} as Record<string, boolean>));

    if (!validateAll()) {
      toast({
        title: "Error en el formulario",
        description: "Por favor, corrige los errores antes de continuar.",
        variant: "destructive"
      });
      return false;
    }

    setIsLoading(true);
    try {
      // Transformar los datos para el servidor
      const dataToSend = {
        ...formData,
        // Asegurar que los campos requeridos tengan valores
        usuario: formData.usuario || 1,
        sucursal: formData.sucursal || 1,
        id_responsable: formData.id_responsable || 1,
        // Transformar detalles para el servidor - usar estructura original
        detalles: formData.detalles.map(detalle => {
          // Si es un detalle existente, preservar estructura original
          if (detalle.id) {
            return {
              id_detalle_compra: detalle.id,
              id_producto: detalle.id_producto || detalle.producto.id.toString(),
              producto: detalle.producto,
              cantidad: parseInt(String(detalle.cantidad), 10),
              costo: Number(detalle.costo),
              inc_p_venta: Number(detalle.inc_precio_venta || detalle.inc_p_venta),
              precio_venta: Number(detalle.precio_venta),
              inc_p_venta_alt: Number(detalle.inc_precio_venta_alt || detalle.inc_p_venta_alt),
              precio_venta_alt: Number(detalle.precio_venta_alt),
              moneda: detalle.moneda || 'BOB ',
              fecha_mod_precio: detalle.fecha_mod_precio || new Date().toISOString()
            };
          } else {
            // Para detalles nuevos, usar estructura simplificada
            const cantidad = typeof detalle.cantidad === 'string' ? parseFloat(detalle.cantidad) : detalle.cantidad;
            const costo = typeof detalle.costo === 'string' ? parseFloat(detalle.costo) : detalle.costo;
            const incPrecioVenta = detalle.inc_p_venta || (typeof detalle.inc_precio_venta === 'string' ? parseFloat(detalle.inc_precio_venta) : detalle.inc_precio_venta);
            const precioVenta = typeof detalle.precio_venta === 'string' ? parseFloat(detalle.precio_venta) : detalle.precio_venta;
            const incPrecioVentaAlt = detalle.inc_p_venta_alt || (typeof detalle.inc_precio_venta_alt === 'string' ? parseFloat(detalle.inc_precio_venta_alt) : detalle.inc_precio_venta_alt);
            const precioVentaAlt = typeof detalle.precio_venta_alt === 'string' ? parseFloat(detalle.precio_venta_alt) : detalle.precio_venta_alt;

            return {
              id_producto: detalle.producto?.id || parseInt(detalle.id_producto || '0'),
              cantidad: Number(cantidad),
              costo: Number(costo),
              inc_precio_venta: Number(incPrecioVenta),
              precio_venta: Number(precioVenta),
              inc_precio_venta_alt: Number(incPrecioVentaAlt),
              precio_venta_alt: Number(precioVentaAlt),
              moneda: detalle.moneda || 'BOB ',
            };
          }
        })
      };

      debugPurchaseData(dataToSend, 'ANTES DE ENVIAR AL SERVIDOR');

      await updatePurchase(purchaseId, dataToSend);
      toast({
        title: "Compra actualizada",
        description: "La compra se ha actualizado correctamente.",
      });
      return true;
    } catch (error) {
      console.error('Error al actualizar:', error);
      toast({
        title: "Error al actualizar",
        description: "No se pudo actualizar la compra. Inténtalo de nuevo.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateAll]);

  return {
    formData,
    errors,
    isLoading,
    handleChange,
    handleBlur,
    handleSubmit,
    setFormData,
  };
}
