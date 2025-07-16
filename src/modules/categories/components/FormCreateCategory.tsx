import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Label } from "@/components/atoms/label";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { useToast } from "@/hooks/use-toast";
import { createCategory, getCategories } from "../services/categories";
import { SearchCategories } from "./SearchCategories";

interface FormErrors {
  [key: string]: string;
}

interface FormTouched {
  [key: string]: boolean;
}

interface Category {
  id: string;
  categoria: string;
  // Agrega otros campos según tu API
}

const FormCreateCategory: React.FC = () => {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    categoria: "",
    subcategoria: "",
    categoriaSeleccionada: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await getCategories(1, 100);
        setCategories(response);
      } catch (error) {
        toast({
          title: "Error al cargar categorías",
          description:
            "No se pudieron cargar las categorías disponibles" + error,
          variant: "destructive",
        });
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [toast]);

  const validateField = (field: string, value: string): string => {
    if (!value.trim()) return "Este campo es requerido" + field;
    if (value.length < 3) return "Debe tener al menos 3 caracteres";
    return "";
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(
      field,
      formData[field as keyof typeof formData]
    );
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmitCategoria = async () => {
    const newErrors: FormErrors = {};
    const error = validateField("categoria", formData.categoria);
    if (error) newErrors["categoria"] = error;

    setErrors(newErrors);
    setTouched({ categoria: true });

    if (Object.keys(newErrors).length > 0) {
      toast({
        title: "Error de validación",
        description: "Completa el campo requerido",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await createCategory(formData.categoria);
      console.log(response)
      alert("Categoria creada exitosamente")
      setFormData((prev) => ({ ...prev, categoria: "" }));
      setErrors((prev) => ({ ...prev, categoria: "" }));
      setTouched((prev) => ({ ...prev, categoria: false }));

      // Recargar categorías después de crear una nueva
      try {
        const response = await getCategories(1, 100);
        setCategories(response);
      } catch (error) {
        console.error("Error al recargar categorías:", error);
      }
    } catch (error) {
      toast({
        title: "Error al guardar",
        description: "No se pudo crear la categoría" + error,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitSubcategoria = async () => {
    const newErrors: FormErrors = {};

    // Validar subcategoría
    const subcategoriaError = validateField(
      "subcategoria",
      formData.subcategoria
    );
    if (subcategoriaError) newErrors["subcategoria"] = subcategoriaError;

    // Validar que se haya seleccionado una categoría
    if (!formData.categoriaSeleccionada) {
      newErrors["categoriaSeleccionada"] = "Debe seleccionar una categoría";
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    setTouched((prev) => ({
      ...prev,
      subcategoria: true,
      categoriaSeleccionada: true,
    }));

    if (Object.keys(newErrors).length > 0) {
      toast({
        title: "Error de validación",
        description: "Completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      // Aquí implementa tu función para crear subcategoría
      // await createSubcategory({
      //   subcategoria: formData.subcategoria,
      //   categoriaId: formData.categoriaSeleccionada
      // });

      toast({
        title: "Subcategoría creada",
        description: `La subcategoría "${formData.subcategoria}" fue registrada exitosamente.`,
      });

      setFormData((prev) => ({
        ...prev,
        subcategoria: "",
        categoriaSeleccionada: "",
      }));
      setErrors((prev) => ({
        ...prev,
        subcategoria: "",
        categoriaSeleccionada: "",
      }));
      setTouched((prev) => ({
        ...prev,
        subcategoria: false,
        categoriaSeleccionada: false,
      }));
    } catch (error) {
      toast({
        title: "Error al guardar",
        description: "No se pudo crear la subcategoría" + error,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClassName = (field: string) =>
    errors[field]
      ? "h-8 text-sm border-red-500 focus:border-red-500 focus:ring-red-500"
      : "h-8 text-sm";

  return (
    <div className="space-y-4">
      {/* Sección Categoría */}
      <div className="px-2 max-w-7xl sm:px-4">
        <div className="p-3 bg-white border border-gray-100 rounded-lg sm:p-4">
          <h2 className="mb-4 text-lg font-semibold">Categoría</h2>
          <div className="space-y-2">
            <Label className="text-xs text-gray-600">Categoría</Label>
            <Input
              value={formData.categoria}
              onChange={(e) => handleChange("categoria", e.target.value)}
              onBlur={() => handleBlur("categoria")}
              placeholder="Ej: Amortiguadores"
              className={getInputClassName("categoria")}
            />
            {errors.categoria && (
              <p className="mt-1 text-xs text-red-500">{errors.categoria}</p>
            )}
          </div>

          <div className="flex justify-between mt-6">
            <span className="text-xs text-gray-500">* Campo requerido</span>
            <Button
              onClick={handleSubmitCategoria}
              disabled={isLoading}
              className="h-8 text-sm bg-gray-900 hover:bg-gray-800"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Guardando..." : "Guardar Categoría"}
            </Button>
          </div>
        </div>
      </div>

      {/* Sección Subcategoría */}
      <div className="px-2 max-w-7xl sm:px-4">
        <div className="p-3 bg-white border border-gray-100 rounded-lg sm:p-4">
          <h2 className="mb-4 text-lg font-semibold">Subcategoría</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-gray-600">Categoría</Label>
              <SearchCategories
                categories={categories}
                onSelect={(category) => handleChange("categoriaSeleccionada", category.id)}
                disabled={loadingCategories}
              />
              {errors.categoriaSeleccionada && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.categoriaSeleccionada}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-gray-600">Subcategoría</Label>
              <Input
                value={formData.subcategoria}
                onChange={(e) => handleChange("subcategoria", e.target.value)}
                onBlur={() => handleBlur("subcategoria")}
                placeholder="Ej: Amortiguadores delanteros"
                className={getInputClassName("subcategoria")}
              />
              {errors.subcategoria && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.subcategoria}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <span className="text-xs text-gray-500">* Campo requerido</span>
            <Button
              onClick={handleSubmitSubcategoria}
              // disabled={isLoading}
              className="h-8 text-sm bg-gray-900 hover:bg-gray-800"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar Subcategoria
              {/* {isLoading ? "Guardando..." : "Guardar Subcategoría"} */}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormCreateCategory;
