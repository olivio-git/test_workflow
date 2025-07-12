import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Package, Wand2, Save } from "lucide-react";
import { Label } from "@/components/atoms/label";
import { Input } from "@/components/atoms/input";  
import { Button } from "@/components/atoms/button";
import { useQuery } from "@tanstack/react-query";
import { apiConstructor } from "../services/api";
import { ComboboxSelect } from "./SelectCombobox";

interface Category {
  id: number;
  categoria: string;
  subcategorias: [any];
}

interface FormData {
  descripcion: number;
  id_categoria: number;
  id_subcategoria: string;
  descripcion_alt:string;
  codigo_oem:string;
  codigo_upc:string;
  modelo: string;
  medida:string;
  nro_motor:string;
  costo_referencia:number;
  stock_minimo:number;
  precio_venta:number;
  precio_venta_alt:number;
  id_marca:number;
  id_procedencia:number;
  id_marca_vehiculo:number;
  id_unidad:number;
}

interface FormErrors {
  [key: string]: string;
}

interface FormTouched {
  [key: string]: boolean;
}
const subcategorias = [
  {
    id:36,
    subcategoria: 'Sub categoria 1'
  },
  {
    id:37,
    subcategoria: 'Subcategoria 2'
  },
  {
    id:38,
    subcategoria: 'Subcategoria 3'
  }
]
const productBrands = [
  { id: 35, marca: "Bosch" },
  { id: 34, marca: "NGK" },
  { id: 36, marca: "Denso" },
  { id: 38, marca: "Valeo" },
  { id: 33, marca: "Magneti Marelli" },
  { id: 43, marca: "ACDelco" },
  { id: 37, marca: "Delphi" },
  { id: 84, marca: "Mann-Filter" },
  { id: 66, marca: "Mahle" },
  { id: 10, marca: "Hella" },
  { id: 11, marca: "TRW" },
  { id: 12, marca: "SKF" },
  { id: 13, marca: "Gates" },
  { id: 14, marca: "Brembo" },
  { id: 15, marca: "Monroe" },
  { id: 16, marca: "KYB" },
];
const vehicleBrands = [
  { id: 1, marca: "Toyota" },
  { id: 2, marca: "Honda" },
  { id: 3, marca: "Ford" },
  { id: 4, marca: "Chevrolet" },
  { id: 5, marca: "Nissan" },
  { id: 6, marca: "Hyundai" },
  { id: 7, marca: "Kia" },
  { id: 8, marca: "Mazda" },
  { id: 9, marca: "Subaru" },
  { id: 10, marca: "Mitsubishi" },
  { id: 11, marca: "Suzuki" },
  { id: 12, marca: "Isuzu" },
  { id: 13, marca: "Volkswagen" },
  { id: 14, marca: "BMW" },
  { id: 15, marca: "Mercedes-Benz" },
  { id: 16, marca: "Audi" },
];

const unidades = [
  { id: 1, unidad: "Universal" },
  { id: 2, unidad: "Pequeño" },
  { id: 3, unidad: "Mediano" },
  { id: 4, unidad: "Grande" },
  { id: 5, unidad: "XL" },
  { id: 6, unidad: '14"' },
  { id: 7, unidad: '15"' },
  { id: 8, unidad: '16"' },
  { id: 9, unidad: '17"' },
  { id: 10, unidad: '18"' },
  { id: 11, unidad: '19"' },
  { id: 12, unidad: '20"' },
  { id: 13, unidad: "205/55R16" },
  { id: 14, unidad: "215/60R16" },
  { id: 15, unidad: "225/65R17" },
];

const procedencia: object[] = [
  { id: 1, procedencia: "JAPAN" },
  { id: 2, procedencia: "USA" },
  { id: 3, procedencia: "GERMANY" },
  { id: 4, procedencia: "KOREA" },
  { id: 5, procedencia: "CHINA" },
  { id: 6, procedencia: "BRAZIL" },
  { id: 7, procedencia: "FRANCE" },
  { id: 8, procedencia: "ITALY" },
  { id: 9, procedencia: "SPAIN" },
  { id: 10, procedencia: "MEXICO" },
  { id: 11, procedencia: "INDIA" },
  { id: 12, procedencia: "UK" },
  { id: 13, procedencia: "CANADA" },
  { id: 14, procedencia: "ARGENTINA" },
  { id: 15, procedencia: "THAILAND" },
  { id: 16, procedencia: "TURKEY" },
  { id: 17, procedencia: "TAIWAN" },
  { id: 18, procedencia: "POLAND" },
  { id: 19, procedencia: "AUSTRALIA" },
  { id: 20, procedencia: "SOUTH AFRICA" },
];
const FormCreateProduct: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});

  const [allCategorys, setAllCategorys] = useState<Category[] | null>(null);
  const { data: categorys } = useQuery({
    queryKey: ["categorys"],
    queryFn: () =>
      apiConstructor({ url: "/categories?pagina=1&pagina_registros=9999" }),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (categorys) {
      setAllCategorys(categorys);
    }
  }, [categorys]);
  const [formData, setFormData] = useState<any>({
      descripcion: "",
      id_categoria: 0,
      id_subcategoria: "",
      descripcion_alt:"",
      codigo_oem:"",
      codigo_upc:"",
      modelo: "",
      medida:"",
      nro_motor:"",
      costo_referencia:0,
      stock_minimo:0,
      precio_venta:0,
      precio_venta_alt:0,
      id_marca:0,
      id_procedencia:0,
      id_marca_vehiculo:0,
      id_unidad:0,

      marca:"",
      category:"",
      name: "",
      vehicleBrand: "",
      engineNumber: "",
      measurement: "",
      model: "",
      additionalDescription: "",
      autoDescription: "",
      price: "",
      cost: "",
      stock: "",
      minStock: "",
      supplier: "",
      barcode: "",
      location: "",
      weight: "",
      dimensions: "",
      warranty: "",
      status: "active",
      tags: "",
      notes: "",
  }); 
  const validateField = (field: string, value: string): string => {
    let error = "";

    switch (field) {
      case "descripcion":
        if (!value || value.trim() === "") {
          error = "El nombre es requerido";
        } else if (value.length < 3) {
          error = "El nombre debe tener al menos 3 caracteres";
        }
        break;
      case "id_categoria":
        if (!value) {
          error = "La categoría es requerida";
        }
        break;
      case "precio_venta":
        if (!value || value === "") {
          error = "El precio es requerido";
        } else if (parseFloat(value) <= 0) {
          error = "El precio debe ser mayor a 0";
        }
        break;
      case "stock_minimo":
        if (!value || value === "") {
          error = "El stock es requerido";
        } else if (parseInt(value) < 0) {
          error = "El stock no puede ser negativo";
        }
        break;
      case "cost":
        if (value && parseFloat(value) < 0) {
          error = "El costo no puede ser negativo";
        }
        break;
      case "minStock":
        if (value && parseInt(value) < 0) {
          error = "El stock mínimo no puede ser negativo";
        }
        break;
      case "warranty":
        if (value && parseInt(value) < 0) {
          error = "La garantía no puede ser negativa";
        }
        break;
      case "barcode":
        if (value && value.length > 0 && value.length < 8) {
          error = "El código de barras debe tener al menos 8 caracteres";
        }
        break;
    }

    return error;
  };

  // const validateAllFields = (): boolean => {
  //   const newErrors: FormErrors = {};
  //   const requiredFields: (keyof FormData)[] = [
  //     "descripcion",
  //     "precio_venta",
  //     "id_marca",
  //     "modelo",
  //   ];

  //   requiredFields.forEach((field) => {
  //     const error = validateField(field, formData[field]);
  //     if (error) {
  //       newErrors[field] = error;
  //     }
  //   });

  //   // Validar campos opcionales si tienen valor
  //   const optionalFields: (keyof FormData)[] = [
  //     "nro_motor",
  //     "id_procedencia",
  //     "id_marca_vehiculo",
  //     "id_unidad",
  //   ];
  //   optionalFields.forEach((field) => {
  //     if (formData[field]) {
  //       const error = validateField(field, formData[field]);
  //       if (error) {
  //         newErrors[field] = error;
  //       }
  //     }
  //   });

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };


  // Función para singularizar la categoría
  const singularizeCategory = (categoryId:any) => {
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
  const getVehicleBrandName = (brandId:any) => {
    if (!brandId || brandId === 0) return "";
    const brand = vehicleBrands.find((b) => b.id === parseInt(brandId));
    return brand ? brand.marca : "";
  };

  // Función para generar la descripción automática
  const generateAutoDescription = () => {
    // console.log("Generando descripción con:", {
    //   categoria: formData.id_categoria,
    //   marca_vehiculo: formData.id_marca_vehiculo,
    //   nro_motor: formData.nro_motor,
    //   medida: formData.medida,
    //   modelo: formData.modelo,
    //   descripcion_alt: formData.descripcion_alt
    // });

    const parts = [
      singularizeCategory(formData.id_categoria),
      getVehicleBrandName(formData.id_marca_vehiculo),
      formData.nro_motor,
      formData.medida,
      formData.modelo,
      formData.descripcion_alt,
    ].filter(part => part && part.toString().trim() !== "");

    const description = parts.join(" ");
    // console.log("Descripción generada:", description);
    return description;
  };

  // useEffect para actualizar la descripción automática
  useEffect(() => {
    const newDescription = generateAutoDescription();
    setFormData((prev:any) => ({
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
    allCategorys // Agregar allCategorys como dependencia
  ]);

  const handleFieldChange = (field: keyof FormData, value: string): void => {
    setFormData((prev:any) => ({ ...prev, [field]: value }));

    // Validar campo en tiempo real si ya fue tocado
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleFieldBlur = (field: any): void => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (): Promise<void> => {
    // Marcar todos los campos como tocados
    const allTouched: FormTouched = {};
    Object.keys(formData).forEach((field) => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    // if (!validateAllFields()) {
    //   console.log(first)
    //   toast({
    //     title: "Errores en el formulario",
    //     description: "Por favor corrige los errores antes de continuar",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    setIsLoading(true);
    try {
      await apiConstructor({url:'/products',data:formData,method:"POST"});
      alert("Producto creado")
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el producto",
        variant: "destructive",
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
      descripcion_alt:"",
      codigo_oem:"",
      codigo_upc:"",
      modelo: "",
      medida:"",
      nro_motor:"",
      costo_referencia:0,
      stock_minimo:0,
      precio_venta:0,
      precio_venta_alt:0,
      id_marca:0,
      id_procedencia:0,
      id_marca_vehiculo:0,
      id_unidad:0,

      marca:"",
      category:"",
      name: "",
      vehicleBrand: "",
      engineNumber: "",
      measurement: "",
      model: "",
      additionalDescription: "",
      autoDescription: "",
      price: "",
      cost: "",
      stock: "",
      minStock: "",
      supplier: "",
      barcode: "",
      location: "",
      weight: "",
      dimensions: "",
      warranty: "",
      status: "active",
      tags: "",
      notes: "",
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
    <div className="px-2 max-w-7xl sm:px-4">
      <div className="p-3 bg-white border border-gray-200 rounded-lg sm:p-4">
        <h2 className="flex items-center gap-2 mb-3 text-base font-semibold text-gray-900">
          <Package className="w-4 h-4" />
          Información Principal
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* <div>
            <Label className="text-xs font-medium text-gray-600">
              Descripción *
            </Label>
            <Input
              value={formData.descripcion}
              onChange={(e) => handleFieldChange("descripcion", e.target.value)}
              onBlur={() => handleFieldBlur("descripcion")}
              placeholder="Descripción del producto"
              className={getInputClassName("name")}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div> */}
          <div>
            <Label className="text-xs font-medium text-gray-600">
              Categoría *
            </Label>
            <ComboboxSelect
              value={formData.id_categoria}
              onChange={(value: any) => {
                handleFieldChange("id_categoria", value);
                handleFieldBlur("category");
              }}
              options={allCategorys || []}
              optionTag={"categoria"}
              placeholder="Seleccionar categoría"
              searchPlaceholder="Buscar categorías..."
              className={getSelectClassName("category")}
            />
            {errors.category && (
              <p className="mt-1 text-xs text-red-500">{errors.category}</p>
            )}
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">
              Precio de venta *
            </Label>
            <Input
              type="number"
              step="0.01"
              value={formData.precio_venta}
              onChange={(e) => handleFieldChange("precio_venta", e.target.value)}
              onBlur={() => handleFieldBlur("precio_venta")}
              placeholder="0.00"
              className={getInputClassName("precio_venta")}
            />
            {errors.price && (
              <p className="mt-1 text-xs text-red-500">{errors.precio_venta}</p>
            )}
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">Stock mínimo *</Label>
            <Input
              type="number"
              value={formData.stock_minimo}
              onChange={(e) => handleFieldChange("stock_minimo", e.target.value)}
              onBlur={() => handleFieldBlur("stock_minimo")}
              placeholder="0"
              className={getInputClassName("stock_minimo")}
            />
            {errors.stock && (
              <p className="mt-1 text-xs text-red-500">{errors.stock_minimo}</p>
            )}
          </div>
        </div>
      </div>

      {/* Especificaciones del Vehículo */}
      <div className="p-3 bg-white border border-gray-200 rounded-lg sm:p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">
          Especificaciones del Vehículo
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <div>
            <Label className="text-xs font-medium text-gray-600">Marca</Label>
            <ComboboxSelect
              value={formData.id_marca}
              onChange={(value: any) => {
                handleFieldChange("id_marca", value);
                handleFieldBlur("marca");
              }}
              options={productBrands || []}
              optionTag={"marca"}
              placeholder="Seleccionar marca"
              searchPlaceholder="Buscar marcas..."
              className={getSelectClassName("marca")}
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">Nro. Motor</Label>
            <Input
              value={formData.nro_motor}
              onChange={(e) => handleFieldChange("nro_motor", e.target.value)}
              onBlur={() => handleFieldBlur("nro_motor")}
              placeholder="Nro. Motor"
              className={getInputClassName("nro_motor")}
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">Medida</Label>
            <Input
              value={formData.medida}
              onChange={(e) => handleFieldChange("medida", e.target.value)}
              onBlur={() => handleFieldBlur("medida")}
              placeholder="Medida"
              className={getInputClassName("medida")}
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">Modelo</Label>
            <Input
              value={formData.modelo}
              onChange={(e) => handleFieldChange("modelo", e.target.value)}
              onBlur={() => handleFieldBlur("modelo")}
              placeholder="Ej: 2020-2024"
              className="h-8 text-sm"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-3 xl:col-span-1">
            <Label className="text-xs font-medium text-gray-600">
              Descripción alt.
            </Label>
            <Input
              value={formData.descripcion_alt}
              onChange={(e) => handleFieldChange("descripcion_alt", e.target.value)}
              onBlur={() => handleFieldBlur("descripcion_alt")}
              placeholder="Descripción alt."
              className="h-8 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Descripción Auto-generada */}
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

      {/* Información Adicional */}
      <div className="p-3 bg-white border border-gray-200 rounded-lg sm:p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">
          Información Adicional
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label className="text-xs font-medium text-gray-600">Costo Referencia</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.costo_referencia}
              onChange={(e) => handleFieldChange("costo_referencia", e.target.value)}
              onBlur={() => handleFieldBlur("cost")}
              placeholder="0.00"
              className={getInputClassName("cost")}
            />
            {errors.cost && (
              <p className="mt-1 text-xs text-red-500">{errors.cost}</p>
            )}
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">
              P. Venta. Alt
            </Label>
            <Input
              type="number"
              value={formData.precio_venta_alt}
              onChange={(e) => handleFieldChange("precio_venta_alt", e.target.value)}
              onBlur={() => handleFieldBlur("precio_venta_alt")}
              placeholder="0"
              className={getInputClassName("precio_venta_alt")}
            />
            {errors.minStock && (
              <p className="mt-1 text-xs text-red-500">{errors.minStock}</p>
            )}
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">
              Marca vehículo
            </Label>
            <ComboboxSelect
              value={formData.id_marca_vehiculo}
              onChange={(value: any) => {
                handleFieldChange("id_marca_vehiculo", value);
                handleFieldBlur("id_marca_vehiculo");
              }}
              options={vehicleBrands || []}
              optionTag={"marca"}
              placeholder="Seleccionar marca vehículo"
              searchPlaceholder="Buscar marcas..."
              className={getSelectClassName("marcaVehículo")}
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">
              Subcategoría
            </Label>
            <ComboboxSelect
              value={formData.id_subcategoria}
              onChange={(value: any) => {
                handleFieldChange("id_subcategoria", value);
                handleFieldBlur("subcategoria");
              }}
              options={subcategorias || []}
              optionTag={"subcategoria"}
              placeholder="Seleccionar subcategoría"
              searchPlaceholder="Buscar subcategoría..."
              className={getSelectClassName("subcategoría")}
            /> 
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-5008">
              Código OEM
            </Label>
            <Input
              value={formData.codigo_oem}
              onChange={(e) => handleFieldChange("codigo_oem", e.target.value)}
              placeholder="Código OEM"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">
              Código UPC
            </Label>
            <Input
              value={formData.codigo_upc}
              onChange={(e) => handleFieldChange("codigo_upc", e.target.value)}
              placeholder="Código UPC"
              className="h-8 text-sm"
            />
            {errors.codigo_upc && (
              <p className="mt-1 text-xs text-red-500">{errors.codigo_upc}</p>
            )}
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">
              Unidad
            </Label>
            <ComboboxSelect
              value={formData.id_unidad}
              onChange={(value: any) => {
                handleFieldChange("id_unidad", value);
                handleFieldBlur("unidad");
              }}
              options={unidades || []}
              optionTag={"unidad"}
              placeholder="Seleccionar unidad"
              searchPlaceholder="Buscar unidad..."
              className={getSelectClassName("unidad")}
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">
              Procedencia
            </Label>
            <ComboboxSelect
              value={formData.id_procedencia}
              onChange={(value: any) => {
                handleFieldChange("id_procedencia", value);
                handleFieldBlur("procedencia");
              }}
              options={procedencia || []}
              optionTag={"procedencia"}
              placeholder="Seleccionar procedencia"
              searchPlaceholder="Buscar procedencia..."
              className={getSelectClassName("procedencia")}
            />
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
