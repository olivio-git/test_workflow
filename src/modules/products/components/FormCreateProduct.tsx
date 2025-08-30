import { useState, useEffect } from "react";
import { Package, Wand2, Save } from "lucide-react";
import { Label } from "@/components/atoms/label";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { apiConstructor } from "../services/api";
import { ComboboxSelect } from "@/components/common/SelectCombobox";
import { showErrorToast, showSuccessToast } from "@/hooks/use-toast-enhanced";
import { useCategoriesWithSubcategories } from "@/modules/shared/hooks/useCategories";
import type { CategoriesWithSubcategories } from "@/modules/shared/types/category.types";
import { useCommonBrands } from "@/modules/shared/hooks/useCommonBrands";
import { useCommonVehicleBrands } from "@/modules/shared/hooks/useCommonVehicleBrands";
import { useCommonOrigins } from "@/modules/shared/hooks/useCommonOrigins";
import { useCommonMeasurements } from "@/modules/shared/hooks/useCommonMeasurements";
import { useCommonSubcategories } from "@/modules/shared/hooks/useCommonSubcategories";

interface FormData {
  descripcion: string;
  id_categoria: number;
  id_subcategoria: string;
  descripcion_alt: string;
  codigo_oem: string;
  codigo_upc: string;
  modelo: string;
  medida: string;
  nro_motor: string;
  costo_referencia: number;
  stock_minimo: number;
  precio_venta: number;
  precio_venta_alt: number;
  id_marca: number;
  id_procedencia: number;
  id_marca_vehiculo: number;
  id_unidad: number;
}

interface FormErrors {
  [key: string]: string;
}

interface FormTouched {
  [key: string]: boolean;
}

const FormCreateProduct: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [allCategorys, setAllCategorys] = useState<CategoriesWithSubcategories | null>(null);

  const { data: categorys } = useCategoriesWithSubcategories()

  const { data: brands } = useCommonBrands()

  const { data: vehicleBrands } = useCommonVehicleBrands()

  const { data: procedencia } = useCommonOrigins()

  const { data: unidades } = useCommonMeasurements()

  useEffect(() => {
    if (categorys) {
      setAllCategorys(categorys);
    }
  }, [categorys]);

  const [formData, setFormData] = useState<FormData>({
    descripcion: "",
    id_categoria: 0,
    id_subcategoria: "",
    descripcion_alt: "",
    codigo_oem: "",
    codigo_upc: "",
    modelo: "",
    medida: "",
    nro_motor: "",
    costo_referencia: 0,
    stock_minimo: 0,
    precio_venta: 0,
    precio_venta_alt: 0,
    id_marca: 0,
    id_procedencia: 0,
    id_marca_vehiculo: 0,
    id_unidad: 0,
  });

  const {
    data: subcategorias,
    refetch: fetchSubcategories
  } = useCommonSubcategories({
    categoria: formData.id_categoria,
    enabled: !!formData.id_categoria
  })

  useEffect(() => {
    if (formData.id_categoria && formData.id_categoria !== 0) {
      fetchSubcategories();
      setFormData((prev) => ({ ...prev, id_subcategoria: "" }));
    }
  }, [formData.id_categoria, fetchSubcategories]);

  const validateField = (field: string, value: any): string => {
    let error = "";

    switch (field) {
      case "descripcion":
        if (!value || value.toString().trim() === "") {
          error = "La descripción es requerida";
        } else if (value.toString().length < 3) {
          error = "La descripción debe tener al menos 3 caracteres";
        }
        break;
      case "descripcion_alt":
        if (!value || value.toString().trim() === "") {
          error = "La descripción alt. es requerida";
        }
        break;
      case "id_categoria":
        if (!value || value === 0) {
          error = "El campo Categoría es requerido.";
        }
        break;
      case "id_subcategoria":
        if (!value || value.toString().trim() === "") {
          error = "El campo Subcategoría es requerido.";
        }
        break;
      case "codigo_upc":
        if (!value || value.toString().trim() === "") {
          error = "El campo código UPC es requerido.";
        }
        break;
      case "precio_venta":
        if (!value || value === "" || value === 0) {
          error = "El precio es requerido";
        } else if (parseFloat(value) <= 0) {
          error = "El precio debe ser mayor a 0";
        }
        break;
      case "precio_venta_alt":
        if (!value || value === "" || value === 0) {
          error = "El precio alt. es requerido";
        } else if (parseFloat(value) <= 0) {
          error = "El precio alt. debe ser mayor a 0";
        }
        break;
      case "id_marca":
        if (!value || value === 0) {
          error = "El campo Marca es requerido.";
        }
        break;
      case "id_procedencia":
        if (!value || value === 0) {
          error = "El campo Procedencia es requerido.";
        }
        break;
      case "id_unidad":
        if (!value || value === 0) {
          error = "El campo Unidad de Medida es requerido.";
        }
        break;
      case "costo_referencia":
        if (!value || value === "" || value === 0) {
          error = "El Costo de referencia es requerido";
        } else if (parseFloat(value) <= 0) {
          error = "El Costo de referencia debe ser mayor a 0";
        }
        break;
      case "id_marca_vehiculo":
        if (!value || value === 0) {
          error = "El campo Marca Vehículo es requerido.";
        }
        break;
      case "stock_minimo":
        if (!value || value === "" || value === 0) {
          error = "El campo stock mínimo es requerido";
        } else if (parseFloat(value) <= 0) {
          error = "El campo stock mínimo debe ser mayor que 0.";
        }
        break;
    }
    return error;
  };

  const validateAllFields = (): boolean => {
    const newErrors: FormErrors = {};
    const requiredFields: (keyof FormData)[] = [
      "descripcion",
      "id_categoria",
      "id_subcategoria",
      "codigo_upc",
      "precio_venta",
      "precio_venta_alt",
      "descripcion_alt",
      "id_marca",
      "id_procedencia",
      "id_unidad",
      "costo_referencia",
      "id_marca_vehiculo",
      "stock_minimo"
    ];

    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para singularizar la categoría
  const singularizeCategory = (categoryId: any) => {
    if (!categoryId || categoryId === 0) return "";

    const category = allCategorys?.find((cat) => cat.id === parseInt(categoryId));
    if (!category) return "";

    const categoryName = category.categoria;

    // Reglas básicas de singularización
    if (categoryName.endsWith('es')) {
      return categoryName.slice(0, -2); // Amortiguadores -> Amortiguador
    } else if (categoryName.endsWith('s')) {
      return categoryName.slice(0, -1); // Filtros -> Filtro
    }

    return categoryName;
  };

  // Función para obtener el nombre de la marca del vehículo
  const getVehicleBrandName = (brandId: any) => {
    if (!brandId || brandId === 0) return "";
    const brand = vehicleBrands?.find((b: any) => b.id === parseInt(brandId));
    return brand ? brand.marca_vehiculo : "";
  };

  // Función para generar la descripción automática
  const generateAutoDescription = () => {
    const parts = [
      singularizeCategory(formData.id_categoria),
      getVehicleBrandName(formData.id_marca_vehiculo),
      formData.nro_motor,
      formData.medida,
      formData.modelo,
      formData.descripcion_alt,
    ].filter(part => part && part.toString().trim() !== "");

    const description = parts.join(" ");
    return description;
  };

  // useEffect para actualizar la descripción automática
  useEffect(() => {
    const newDescription = generateAutoDescription();
    setFormData((prev) => ({
      ...prev,
      descripcion: newDescription
    }));
  }, [
    formData.id_categoria,
    formData.id_marca_vehiculo,
    formData.nro_motor,
    formData.medida,
    formData.modelo,
    formData.descripcion_alt,
    allCategorys,
    vehicleBrands
  ]);

  const handleFieldChange = (field: keyof FormData, value: any): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Validar inmediatamente después del cambio si el campo ya fue tocado
    if (touched[field]) {
      // Usar setTimeout para asegurar que el estado se actualice primero
      setTimeout(() => {
        const error = validateField(field, value);
        setErrors((prev) => ({ ...prev, [field]: error }));
      }, 0);
    }
  };

  const handleFieldBlur = (field: keyof FormData): void => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (): Promise<void> => {
    const allTouched: FormTouched = {};
    Object.keys(formData).forEach((field) => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    if (!validateAllFields()) {
      showErrorToast({
        title: "Errores en el formulario",
        description: "Por favor corrige los errores antes de continuar",
        duration: 5000
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiConstructor({ url: '/products', data: formData, method: "POST" });
      showSuccessToast({
        title: "Producto creado",
        description: `El producto ${formData.descripcion} ha sido creado exitosamente. Código: ${response?.codigo_interno}`,
        duration: 5000
      });
      resetForm();
    } catch (error) {
      showErrorToast({
        title: "Error",
        description: "No se pudo crear el producto",
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = (): void => {
    setFormData({
      descripcion: "",
      id_categoria: 0,
      id_subcategoria: "",
      descripcion_alt: "",
      codigo_oem: "",
      codigo_upc: "",
      modelo: "",
      medida: "",
      nro_motor: "",
      costo_referencia: 0,
      stock_minimo: 0,
      precio_venta: 0,
      precio_venta_alt: 0,
      id_marca: 0,
      id_procedencia: 0,
      id_marca_vehiculo: 0,
      id_unidad: 0,
    });
    setErrors({});
    setTouched({});
  };

  const getInputClassName = (field: string): string => {
    const baseClass = "h-8 text-sm";
    return errors[field]
      ? `${baseClass} border-red-500 focus:border-red-500 focus:ring-red-500`
      : baseClass;
  };

  const getSelectClassName = (field: string): string => {
    const baseClass = "h-8 text-sm";
    return errors[field]
      ? `${baseClass} border-red-500 focus:border-red-500`
      : baseClass;
  };

  return (
    <div className="w-full space-y-3">
      <div className="p-3 bg-white border border-gray-200 rounded-lg sm:p-4">
        <h2 className="flex items-center gap-2 mb-3 text-base font-semibold text-gray-900">
          <Package className="w-4 h-4" />
          Información Principal
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="h-16 flex flex-col">
            <Label className="text-xs font-medium text-gray-600 mb-1">
              Categoría *
            </Label>
            <ComboboxSelect
              value={formData.id_categoria}
              onChange={(value: any) => {
                handleFieldChange("id_categoria", value);
              }}
              options={(allCategorys || []).map(category => ({ id: category.id, categoria: category.categoria }))}
              optionTag={"categoria"}
              placeholder="Seleccionar categoría"
              searchPlaceholder="Buscar categorías..."
              className={getSelectClassName("id_categoria")}
            />
            <div className="h-4 mt-2">
              {errors.id_categoria && (
                <p className="text-xs text-red-500 truncate">{errors.id_categoria}</p>
              )}
            </div>
          </div>

          <div className="h-16 flex flex-col">
            <Label className="text-xs font-medium text-gray-600 mb-1">
              Subcategoría *
            </Label>
            <ComboboxSelect
              value={formData.id_subcategoria}
              onChange={(value: any) => {
                handleFieldChange("id_subcategoria", value);
              }}
              options={subcategorias || []}
              optionTag={"subcategoria"}
              placeholder="Seleccionar subcategoría"
              searchPlaceholder="Buscar subcategoría..."
              className={getSelectClassName("id_subcategoria")}
            />
            <div className="h-4 mt-2">
              {errors.id_subcategoria && (
                <p className="text-xs text-red-500 truncate">{errors.id_subcategoria}</p>
              )}
            </div>
          </div>

          <div className="h-16 flex flex-col">
            <Label className="text-xs font-medium text-gray-600 mb-1">
              Precio de venta *
            </Label>
            <Input
              type="number"
              step="0.01"
              min={0}
              value={formData.precio_venta}
              onChange={(e) => handleFieldChange("precio_venta", e.target.value)}
              onBlur={() => handleFieldBlur("precio_venta")}
              placeholder="0.00"
              className={getInputClassName("precio_venta")}
            />
            <div className="h-4 mt-2">
              {errors.precio_venta && (
                <p className="text-xs text-red-500 truncate">{errors.precio_venta}</p>
              )}
            </div>
          </div>

          <div className="h-16 flex flex-col">
            <Label className="text-xs font-medium text-gray-600 mb-1">Stock mínimo *</Label>
            <Input
              type="number"
              min={0}
              value={formData.stock_minimo}
              onChange={(e) => handleFieldChange("stock_minimo", e.target.value)}
              onBlur={() => handleFieldBlur("stock_minimo")}
              placeholder="0"
              className={getInputClassName("stock_minimo")}
            />
            <div className="h-4 mt-2">
              {errors.stock_minimo && (
                <p className="text-xs text-red-500 truncate">{errors.stock_minimo}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-white border border-gray-200 rounded-lg sm:p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">
          Especificaciones del Vehículo
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <div className="h-16 flex flex-col">
            <Label className="text-xs font-medium text-gray-600 mb-1">Marca *</Label>
            <ComboboxSelect
              value={formData.id_marca}
              onChange={(value: any) => {
                handleFieldChange("id_marca", value);
              }}
              options={brands || []}
              optionTag={"marca"}
              placeholder="Seleccionar marca"
              searchPlaceholder="Buscar marcas..."
              className={getSelectClassName("id_marca")}
            />
            <div className="h-4 mt-2">
              {errors.id_marca && (
                <p className="text-xs text-red-500 truncate">{errors.id_marca}</p>
              )}
            </div>
          </div>

          <div className="h-16 flex flex-col">
            <Label className="text-xs font-medium text-gray-600 mb-1">
              Marca vehículo *
            </Label>
            <ComboboxSelect
              value={formData.id_marca_vehiculo}
              onChange={(value: any) => {
                handleFieldChange("id_marca_vehiculo", value);
              }}
              options={vehicleBrands || []}
              optionTag={"marca_vehiculo"}
              placeholder="Seleccionar marca vehículo"
              searchPlaceholder="Buscar marcas..."
              className={getSelectClassName("id_marca_vehiculo")}
            />
            <div className="h-4 mt-2">
              {errors.id_marca_vehiculo && (
                <p className="text-xs text-red-500 truncate">{errors.id_marca_vehiculo}</p>
              )}
            </div>
          </div>

          <div className="h-16 flex flex-col">
            <Label className="text-xs font-medium text-gray-600 mb-1">Nro. Motor</Label>
            <Input
              value={formData.nro_motor}
              onChange={(e) => handleFieldChange("nro_motor", e.target.value)}
              onBlur={() => handleFieldBlur("nro_motor")}
              placeholder="Nro. Motor"
              className={getInputClassName("nro_motor")}
            />
            <div className="h-4 mt-2">
              {errors.nro_motor && (
                <p className="text-xs text-red-500 truncate">{errors.nro_motor}</p>
              )}
            </div>
          </div>

          <div className="h-16 flex flex-col">
            <Label className="text-xs font-medium text-gray-600 mb-1">Medida</Label>
            <Input
              value={formData.medida}
              onChange={(e) => handleFieldChange("medida", e.target.value)}
              onBlur={() => handleFieldBlur("medida")}
              placeholder="Medida"
              className={getInputClassName("medida")}
            />
            <div className="h-4 mt-2">
              {errors.medida && (
                <p className="text-xs text-red-500 truncate">{errors.medida}</p>
              )}
            </div>
          </div>

          <div className="h-16 flex flex-col">
            <Label className="text-xs font-medium text-gray-600 mb-1">Modelo</Label>
            <Input
              value={formData.modelo}
              onChange={(e) => handleFieldChange("modelo", e.target.value)}
              onBlur={() => handleFieldBlur("modelo")}
              placeholder="Ej: 2020-2024"
              className="h-8 text-sm"
            />
            <div className="h-4 mt-2">
              {errors.modelo && (
                <p className="text-xs text-red-500 truncate">{errors.modelo}</p>
              )}
            </div>
          </div>

          <div className="h-16 flex flex-col sm:col-span-2 lg:col-span-3 xl:col-span-2">
            <Label className="text-xs font-medium text-gray-600 mb-1">
              Descripción alt. *
            </Label>
            <Input
              value={formData.descripcion_alt}
              onChange={(e) => handleFieldChange("descripcion_alt", e.target.value)}
              onBlur={() => handleFieldBlur("descripcion_alt")}
              placeholder="Descripción alt."
              className="h-8 text-sm"
            />
            <div className="h-4 mt-2">
              {errors.descripcion_alt && (
                <p className="text-xs text-red-500 truncate">{errors.descripcion_alt}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-white border border-gray-200 rounded-lg sm:p-4">
        <h3 className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-900">
          <Wand2 className="w-4 h-4" />
          Descripción Auto-generada
        </h3>
        <div className="p-3 text-sm text-gray-800 border border-gray-200 rounded bg-gray-50 min-h-[40px] flex items-center">
          {formData.descripcion ||
            "Completa los campos para generar la descripción"}
        </div>
      </div>

      <div className="p-3 bg-white border border-gray-200 rounded-lg sm:p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">
          Información Adicional
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="h-16 flex flex-col">
            <Label className="text-xs font-medium text-gray-600 mb-1">Costo Referencia *</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.costo_referencia}
              onChange={(e) => handleFieldChange("costo_referencia", e.target.value)}
              onBlur={() => handleFieldBlur("costo_referencia")}
              placeholder="0.00"
              className={getInputClassName("costo_referencia")}
            />
            <div className="h-4 mt-2">
              {errors.costo_referencia && (
                <p className="text-xs text-red-500 truncate">{errors.costo_referencia}</p>
              )}
            </div>
          </div>

          <div className="h-16 flex flex-col">
            <Label className="text-xs font-medium text-gray-600 mb-1">
              P. Venta. Alt *
            </Label>
            <Input
              type="number"
              value={formData.precio_venta_alt}
              onChange={(e) => handleFieldChange("precio_venta_alt", e.target.value)}
              onBlur={() => handleFieldBlur("precio_venta_alt")}
              placeholder="0"
              className={getInputClassName("precio_venta_alt")}
            />
            <div className="h-4 mt-2">
              {errors.precio_venta_alt && (
                <p className="text-xs text-red-500 truncate">{errors.precio_venta_alt}</p>
              )}
            </div>
          </div>

          <div className="h-16 flex flex-col">
            <Label className="text-xs font-medium text-gray-600 mb-1">
              Código OEM
            </Label>
            <Input
              value={formData.codigo_oem}
              onChange={(e) => handleFieldChange("codigo_oem", e.target.value)}
              placeholder="Código OEM"
              className="h-8 text-sm"
            />
            <div className="h-4 mt-2">
              {errors.codigo_oem && (
                <p className="text-xs text-red-500 truncate">{errors.codigo_oem}</p>
              )}
            </div>
          </div>

          <div className="h-16 flex flex-col">
            <Label className="text-xs font-medium text-gray-600 mb-1">
              Código UPC *
            </Label>
            <Input
              value={formData.codigo_upc}
              onChange={(e) => handleFieldChange("codigo_upc", e.target.value)}
              onBlur={() => handleFieldBlur("codigo_upc")}
              placeholder="Código UPC"
              className="h-8 text-sm"
            />
            <div className="h-4 mt-2">
              {errors.codigo_upc && (
                <p className="text-xs text-red-500 truncate">{errors.codigo_upc}</p>
              )}
            </div>
          </div>

          <div className="h-16 flex flex-col">
            <Label className="text-xs font-medium text-gray-600 mb-1">
              Unidad *
            </Label>
            <ComboboxSelect
              value={formData.id_unidad}
              onChange={(value: any) => {
                handleFieldChange("id_unidad", value);
              }}
              options={unidades || []}
              optionTag={"unidad_medida"}
              placeholder="Seleccionar unidad"
              searchPlaceholder="Buscar unidad..."
              className={getSelectClassName("id_unidad")}
            />
            <div className="h-4 mt-2">
              {errors.id_unidad && (
                <p className="text-xs text-red-500 truncate">{errors.id_unidad}</p>
              )}
            </div>
          </div>

          <div className="h-16 flex flex-col">
            <Label className="text-xs font-medium text-gray-600 mb-1">
              Procedencia *
            </Label>
            <ComboboxSelect
              value={formData.id_procedencia}
              onChange={(value: any) => {
                handleFieldChange("id_procedencia", value);
              }}
              options={procedencia || []}
              optionTag={"procedencia"}
              placeholder="Seleccionar procedencia"
              searchPlaceholder="Buscar procedencia..."
              className={getSelectClassName("id_procedencia")}
            />
            <div className="h-4 mt-2">
              {errors.id_procedencia && (
                <p className="text-xs text-red-500 truncate">{errors.id_procedencia}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-white border border-gray-200 rounded-lg sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-gray-500">* Campos requeridos</span>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full h-8 text-sm bg-gray-900 hover:bg-gray-800 sm:w-auto"
          >
            <Save className="w-3 h-3 mr-2" />
            {isLoading ? "Guardando..." : "Crear Producto"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormCreateProduct;