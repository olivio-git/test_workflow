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

  const [formData, setFormData] = useState({
    name: "", category: "", vehicleBrand: "", engineNumber: "", measurement: "",
    model: "", additionalDescription: "", autoDescription: "", price: "", cost: "",
    stock: "", minStock: "", supplier: "", barcode: "", location: "", weight: "",
    dimensions: "", warranty: "", status: "active", tags: "", notes: "",
  })

  const singularizeCategory = (categoryId:any) => {
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

  useEffect(() => {
    setFormData(prev => ({ ...prev, autoDescription: generateAutoDescription() }))
  }, [formData.category, formData.vehicleBrand, formData.engineNumber, formData.measurement, formData.model, formData.additionalDescription])

  const handleFieldChange = (field:any, value:any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const required = ["name", "category", "price", "stock"]
    const missing = required.filter(field => !formData[field as keyof typeof formData])
    if (missing.length > 0) {
      toast({
        title: "Campos requeridos",
        description: `Por favor completa: ${missing.join(", ")}`,
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
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
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Package className="w-4 h-4" />
          Información Principal
        </h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label className="text-xs font-medium text-gray-600">Nombre *</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              placeholder="Nombre del producto"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">Categoría *</Label>
            <Select value={formData.category} onValueChange={(value) => handleFieldChange("category", value)}>
              <SelectTrigger className="h-8 text-sm">
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
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">Precio *</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleFieldChange("price", e.target.value)}
              placeholder="0.00"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">Stock *</Label>
            <Input
              type="number"
              value={formData.stock}
              onChange={(e) => handleFieldChange("stock", e.target.value)}
              placeholder="0"
              className="h-8 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Especificaciones del Vehículo */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Especificaciones del Vehículo</h3>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
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
          <div>
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
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Wand2 className="w-4 h-4" />
          Descripción Auto-generada
        </h3>
        <div className="p-3 bg-gray-50 border border-gray-200 rounded text-sm text-gray-800">
          {formData.autoDescription || "Completa los campos para generar la descripción"}
        </div>
      </div>

      {/* Información Adicional */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Información Adicional</h3>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label className="text-xs font-medium text-gray-600">Costo</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => handleFieldChange("cost", e.target.value)}
              placeholder="0.00"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">Stock Mínimo</Label>
            <Input
              type="number"
              value={formData.minStock}
              onChange={(e) => handleFieldChange("minStock", e.target.value)}
              placeholder="0"
              className="h-8 text-sm"
            />
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
              placeholder="123456789012"
              className="h-8 text-sm"
            />
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
              placeholder="12"
              className="h-8 text-sm"
            />
          </div>
          <div className="md:col-span-2">
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
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">* Campos requeridos</span>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="bg-gray-900 hover:bg-gray-800 h-8 text-sm"
          >
            <Save className="mr-2 h-3 w-3" />
            {isLoading ? "Guardando..." : "Crear Producto"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FormCreateProduct