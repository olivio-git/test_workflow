import { useState } from "react";
import { Save } from "lucide-react";
import { Label } from "@/components/atoms/label";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { useToast } from "@/hooks/use-toast";
import { createCategory } from "../Services/categories";
import {} from "../Services/endpoints";

interface FormErrors {
  [key: string]: string;
}

interface FormTouched {
  [key: string]: boolean;
}

const FormCreateCategory: React.FC = () => {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    categoria: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (field: string, value: string): string => {
    if (!value.trim()) return "Este campo es requerido";
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

  const handleSubmit = async () => {
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
      await await createCategory({ categoria: formData.categoria });
      toast({
        title: "Categoría creada",
        description: `La categoría "${formData.categoria}" fue registrada exitosamente.`,
      });

      setFormData({ categoria: "" });
      setErrors({});
      setTouched({});
    } catch (error) {
      toast({
        title: "Error al guardar",
        description: "No se pudo crear la categoría",
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
    <div className="px-2 max-w-7xl sm:px-4">
      <div className="p-3 bg-white border border-gray-100 rounded-lg sm:p-4">
        <h2 className="mb-4 text-lg font-semibold">Crear Categoría</h2>
        <div>
          <Label className="text-xs text-gray-600">Categoría *</Label>
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
            onClick={handleSubmit}
            disabled={isLoading}
            className="h-8 text-sm bg-gray-900 hover:bg-gray-800"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Guardando..." : "Guardar Categoría"}
          </Button>
        </div>
      </div>
      <div className="p-3 bg-white border border-gray-100 rounded-lg sm:p-4">
        <h3 className="mt-6 mb-2 text-sm font-semibold text-gray-700">
          Buscar Categoría
        </h3>
        <p className="text-xs text-gray-500">
          Puedes buscar una categoría existente para evitar duplicados.
        </p>
        <div className="mb-4">
          <Label className="text-xs text-gray-600">
            Buscar categoría existente
          </Label>
          <Input
            placeholder="Ej: Filtros"
            //value={searchTerm}
            //onChange={handleSearch}
            className="h-8 text-sm"
          />
          {/* {searchTerm && (
          <ul className="mt-2 space-y-1 text-sm text-gray-600 list-disc list-inside">
            {filtered.length > 0 ? (
              filtered.map((cat) => <li key={cat.id}>{cat.categoria}</li>)
            ) : (
              <li className="italic text-gray-400">No se encontró ninguna</li>
            )}
          </ul>
        )} */}
        </div>
      </div>
    </div>
  );
};

export default FormCreateCategory;
