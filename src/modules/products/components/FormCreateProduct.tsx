import { useState, useEffect } from "react" 
import { useToast } from "@/hooks/use-toast"
import { Package, Wand2, Save } from "lucide-react"
import { Label } from "@/components/atoms/label"
import { Input } from "@/components/atoms/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select"
import { Textarea } from "@/components/atoms/textarea"
import { Button } from "@/components/atoms/button"

const categories = [
  { id: "amortiguadores", name: "Amortiguadores", singular: "Amortiguador" },
  { id: "frenos", name: "Frenos", singular: "Freno" },
  { id: "filtros", name: "Filtros", singular: "Filtro" },
  { id: "aceites", name: "Aceites", singular: "Aceite" },
  { id: "baterias", name: "Baterías", singular: "Batería" },
  { id: "llantas", name: "Llantas", singular: "Llanta" },
  { id: "luces", name: "Luces", singular: "Luz" },
  { id: "espejos", name: "Espejos", singular: "Espejo" },
]

const vehicleBrands = [
  "Toyota", "Honda", "Ford", "Chevrolet", "Nissan", "Hyundai", "Kia", "Mazda", 
  "Subaru", "Mitsubishi", "Suzuki", "Isuzu", "Volkswagen", "BMW", "Mercedes-Benz", "Audi"
]

const engines = [
  "1.0L", "1.2L", "1.4L", "1.5L", "1.6L", "1.8L", "2.0L", "2.2L", "2.4L", 
  "2.5L", "2.7L", "3.0L", "3.5L", "4.0L", "V6", "V8"
]

const measurements = [
  "Universal", "Pequeño", "Mediano", "Grande", "XL", '14"', '15"', '16"', '17"', 
  '18"', '19"', '20"', "205/55R16", "215/60R16", "225/65R17"
]

const FormCreateProduct = () => {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const [formData, setFormData] = useState({
    name: "", category: "", vehicleBrand: "", engineNumber: "", measurement: "",
    model: "", additionalDescription: "", autoDescription: "", price: "", cost: "",
    stock: "", minStock: "", supplier: "", barcode: "", location: "", weight: "",
    dimensions: "", warranty: "", status: "active", tags: "", notes: "",
  })

  const singularizeCategory = (categoryId) => {
    return categories.find(cat => cat.id === categoryId)?.singular || ""
  }

  const generateAutoDescription = () => {
    const parts = [
      formData.category && singularizeCategory(formData.category),
      formData.vehicleBrand,
      formData.engineNumber,
      formData.measurement,
      formData.model,
      formData.additionalDescription
    ].filter(Boolean)
    return parts.join(" ")
  }

  const validateField = (field, value) => {
    let error = ""
    
    switch (field) {
      case "name":
        if (!value || value.trim() === "") {
          error = "El nombre es requerido"
        } else if (value.length < 3) {
          error = "El nombre debe tener al menos 3 caracteres"
        }
        break
      case "category":
        if (!value) {
          error = "La categoría es requerida"
        }
        break
      case "price":
        if (!value || value === "") {
          error = "El precio es requerido"
        } else if (parseFloat(value) <= 0) {
          error = "El precio debe ser mayor a 0"
        }
        break
      case "stock":
        if (!value || value === "") {
          error = "El stock es requerido"
        } else if (parseInt(value) < 0) {
          error = "El stock no puede ser negativo"
        }
        break
      case "cost":
        if (value && parseFloat(value) < 0) {
          error = "El costo no puede ser negativo"
        }
        break
      case "minStock":
        if (value && parseInt(value) < 0) {
          error = "El stock mínimo no puede ser negativo"
        }
        break
      case "warranty":
        if (value && parseInt(value) < 0) {
          error = "La garantía no puede ser negativa"
        }
        break
      case "barcode":
        if (value && value.length > 0 && value.length < 8) {
          error = "El código de barras debe tener al menos 8 caracteres"
        }
        break
    }
    
    return error
  }

  const validateAllFields = () => {
    const newErrors = {}
    const requiredFields = ["name", "category", "price", "stock"]
    
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field])
      if (error) {
        newErrors[field] = error
      }
    })
    
    // Validar campos opcionales si tienen valor
    const optionalFields = ["cost", "minStock", "warranty", "barcode"]
    optionalFields.forEach(field => {
      if (formData[field]) {
        const error = validateField(field, formData[field])
        if (error) {
          newErrors[field] = error
        }
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  useEffect(() => {
    setFormData(prev => ({ ...prev, autoDescription: generateAutoDescription() }))
  }, [formData.category, formData.vehicleBrand, formData.engineNumber, formData.measurement, formData.model, formData.additionalDescription])

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Validar campo en tiempo real si ya fue tocado
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  const handleFieldBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, formData[field])
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  const handleSubmit = async () => {
    // Marcar todos los campos como tocados
    const allTouched = {}
    Object.keys(formData).forEach(field => {
      allTouched[field] = true
    })
    setTouched(allTouched)

    if (!validateAllFields()) {
      toast({
        title: "Errores en el formulario",
        description: "Por favor corrige los errores antes de continuar",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast({
        title: "Producto creado",
        description: `${formData.name} ha sido agregado al catálogo`,
      })
      resetForm()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el producto",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "", category: "", vehicleBrand: "", engineNumber: "", measurement: "",
      model: "", additionalDescription: "", autoDescription: "", price: "", cost: "",
      stock: "", minStock: "", supplier: "", barcode: "", location: "", weight: "",
      dimensions: "", warranty: "", status: "active", tags: "", notes: "",
    })
    setErrors({})
    setTouched({})
  }

  const getInputClassName = (field) => {
    const baseClass = "h-8 text-sm"
    return errors[field] ? `${baseClass} border-red-500 focus:border-red-500 focus:ring-red-500` : baseClass
  }

  const getSelectClassName = (field) => {
    const baseClass = "h-8 text-sm"
    return errors[field] ? `${baseClass} border-red-500 focus:border-red-500` : baseClass
  }

  return (
    <div className="px-2 mx-auto max-w-7xl sm:px-4">
      <div className="p-3 bg-white border border-gray-200 rounded-lg sm:p-4">
        <h2 className="flex items-center gap-2 mb-3 text-base font-semibold text-gray-900">
          <Package className="w-4 h-4" />
          Información Principal
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label className="text-xs font-medium text-gray-600">Nombre *</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              onBlur={() => handleFieldBlur("name")}
              placeholder="Nombre del producto"
              className={getInputClassName("name")}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">Categoría *</Label>
            <Select value={formData.category} onValueChange={(value) => {
              handleFieldChange("category", value)
              handleFieldBlur("category")
            }}>
              <SelectTrigger className={getSelectClassName("category")}>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent className="border border-gray-200">
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">Precio *</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleFieldChange("price", e.target.value)}
              onBlur={() => handleFieldBlur("price")}
              placeholder="0.00"
              className={getInputClassName("price")}
            />
            {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">Stock *</Label>
            <Input
              type="number"
              value={formData.stock}
              onChange={(e) => handleFieldChange("stock", e.target.value)}
              onBlur={() => handleFieldBlur("stock")}
              placeholder="0"
              className={getInputClassName("stock")}
            />
            {errors.stock && <p className="mt-1 text-xs text-red-500">{errors.stock}</p>}
          </div>
        </div>
      </div>

      {/* Especificaciones del Vehículo */}
      <div className="p-3 bg-white border border-gray-200 rounded-lg sm:p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Especificaciones del Vehículo</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <div>
            <Label className="text-xs font-medium text-gray-600">Marca</Label>
            <Select value={formData.vehicleBrand} onValueChange={(value) => handleFieldChange("vehicleBrand", value)}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Marca" />
              </SelectTrigger>
              <SelectContent className="border border-gray-200">
                {vehicleBrands.map(brand => (
                  <SelectItem className="hover:bg-gray-100" key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">Motor</Label>
            <Select value={formData.engineNumber} onValueChange={(value) => handleFieldChange("engineNumber", value)}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Motor" />
              </SelectTrigger>
              <SelectContent className="border border-gray-200">
                {engines.map(engine => (
                  <SelectItem className="hover:bg-gray-100" key={engine} value={engine}>{engine}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">Medida</Label>
            <Select value={formData.measurement} onValueChange={(value) => handleFieldChange("measurement", value)}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Medida" />
              </SelectTrigger>
              <SelectContent className="border border-gray-200">
                {measurements.map(measurement => (
                  <SelectItem className="hover:bg-gray-100" key={measurement} value={measurement}>{measurement}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">Modelo</Label>
            <Input
              value={formData.model}
              onChange={(e) => handleFieldChange("model", e.target.value)}
              placeholder="Ej: 2020-2024"
              className="h-8 text-sm"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-3 xl:col-span-1">
            <Label className="text-xs font-medium text-gray-600">Descripción</Label>
            <Input
              value={formData.additionalDescription}
              onChange={(e) => handleFieldChange("additionalDescription", e.target.value)}
              placeholder="Ej: Premium"
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
          {formData.autoDescription || "Completa los campos para generar la descripción"}
        </div>
      </div>

      {/* Información Adicional */}
      <div className="p-3 bg-white border border-gray-200 rounded-lg sm:p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Información Adicional</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label className="text-xs font-medium text-gray-600">Costo</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => handleFieldChange("cost", e.target.value)}
              onBlur={() => handleFieldBlur("cost")}
              placeholder="0.00"
              className={getInputClassName("cost")}
            />
            {errors.cost && <p className="mt-1 text-xs text-red-500">{errors.cost}</p>}
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">Stock Mínimo</Label>
            <Input
              type="number"
              value={formData.minStock}
              onChange={(e) => handleFieldChange("minStock", e.target.value)}
              onBlur={() => handleFieldBlur("minStock")}
              placeholder="0"
              className={getInputClassName("minStock")}
            />
            {errors.minStock && <p className="mt-1 text-xs text-red-500">{errors.minStock}</p>}
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">Proveedor</Label>
            <Input
              value={formData.supplier}
              onChange={(e) => handleFieldChange("supplier", e.target.value)}
              placeholder="Nombre del proveedor"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">Código de Barras</Label>
            <Input
              value={formData.barcode}
              onChange={(e) => handleFieldChange("barcode", e.target.value)}
              onBlur={() => handleFieldBlur("barcode")}
              placeholder="123456789012"
              className={getInputClassName("barcode")}
            />
            {errors.barcode && <p className="mt-1 text-xs text-red-500">{errors.barcode}</p>}
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">Ubicación</Label>
            <Input
              value={formData.location}
              onChange={(e) => handleFieldChange("location", e.target.value)}
              placeholder="A1-B2-C3"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">Garantía (meses)</Label>
            <Input
              type="number"
              value={formData.warranty}
              onChange={(e) => handleFieldChange("warranty", e.target.value)}
              onBlur={() => handleFieldBlur("warranty")}
              placeholder="12"
              className={getInputClassName("warranty")}
            />
            {errors.warranty && <p className="mt-1 text-xs text-red-500">{errors.warranty}</p>}
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs font-medium text-gray-600">Etiquetas</Label>
            <Input
              value={formData.tags}
              onChange={(e) => handleFieldChange("tags", e.target.value)}
              placeholder="original, premium, importado"
              className="h-8 text-sm"
            />
          </div>
        </div>
        <div className="mt-3">
          <Label className="text-xs font-medium text-gray-600">Notas Internas</Label>
          <Textarea
            value={formData.notes}
            onChange={(e) => handleFieldChange("notes", e.target.value)}
            placeholder="Notas adicionales..."
            rows={2}
            className="text-sm"
          />
        </div>
      </div>

      {/* Botón de Acción */}
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
  )
}

export default FormCreateProduct