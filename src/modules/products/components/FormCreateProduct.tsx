"use client"

import { useState, useEffect } from "react" 
import { useToast } from "@/hooks/use-toast"
import { Package, Wand2, Save, X } from "lucide-react"
import { Label } from "@/components/atoms/label"
import { Input } from "@/components/atoms/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select"
import { Textarea } from "@/components/atoms/textarea"
import { Button } from "@/components/atoms/button"

// interface ProductFormProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   onProductCreated: () => void
//   editProduct?: any
// }

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
    name: "",
    category: "",
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
  })

  const singularizeCategory = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.singular : ""
  }

  const generateAutoDescription = () => {
    const parts = []
    if (formData.category) parts.push(singularizeCategory(formData.category))
    if (formData.vehicleBrand) parts.push(formData.vehicleBrand)
    if (formData.engineNumber) parts.push(formData.engineNumber)
    if (formData.measurement) parts.push(formData.measurement)
    if (formData.model) parts.push(formData.model)
    if (formData.additionalDescription) parts.push(formData.additionalDescription)
    return parts.filter(Boolean).join(" ")
  }

  useEffect(() => {
    const autoDesc = generateAutoDescription()
    setFormData((prev) => ({ ...prev, autoDescription: autoDesc }))
  }, [
    formData.category,
    formData.vehicleBrand,
    formData.engineNumber,
    formData.measurement,
    formData.model,
    formData.additionalDescription,
  ])

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const required = ["name", "category", "price", "stock"]
    const missing = required.filter((field) => !formData[field as keyof typeof formData])

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
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast({
        title: "Producto creado",
        description: `${formData.name} ha sido agregado al catálogo`,
      })
    //   onProductCreated()
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
      name: "",
      category: "",
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
    })
  }

  return (
    <div className="space-y-6">
      {/* Información básica */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Package className="w-3.5 h-3.5 text-zinc-900" />
          Información Básica
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nombre del Producto *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              placeholder="Ej: Amortiguador Delantero Premium"
              className="border-gray-200 focus:border-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
              Categoría *
            </Label>
            <Select value={formData.category} onValueChange={(value) => handleFieldChange("category", value)}>
              <SelectTrigger className="border-gray-200 focus:border-gray-400">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Especificaciones del vehículo */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Especificaciones del Vehículo
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="vehicleBrand" className="text-sm font-medium text-gray-700">
              Marca del Vehículo
            </Label>
            <Select
              value={formData.vehicleBrand}
              onValueChange={(value) => handleFieldChange("vehicleBrand", value)}
            >
              <SelectTrigger className="border-gray-200 focus:border-gray-400">
                <SelectValue placeholder="Seleccionar marca" />
              </SelectTrigger>
              <SelectContent>
                {vehicleBrands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="engineNumber" className="text-sm font-medium text-gray-700">
              Número de Motor
            </Label>
            <Select
              value={formData.engineNumber}
              onValueChange={(value) => handleFieldChange("engineNumber", value)}
            >
              <SelectTrigger className="border-gray-200 focus:border-gray-400">
                <SelectValue placeholder="Seleccionar motor" />
              </SelectTrigger>
              <SelectContent>
                {engines.map((engine) => (
                  <SelectItem key={engine} value={engine}>
                    {engine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="measurement" className="text-sm font-medium text-gray-700">
              Medida
            </Label>
            <Select
              value={formData.measurement}
              onValueChange={(value) => handleFieldChange("measurement", value)}
            >
              <SelectTrigger className="border-gray-200 focus:border-gray-400">
                <SelectValue placeholder="Seleccionar medida" />
              </SelectTrigger>
              <SelectContent>
                {measurements.map((measurement) => (
                  <SelectItem key={measurement} value={measurement}>
                    {measurement}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 mt-4">
          <div className="space-y-2">
            <Label htmlFor="model" className="text-sm font-medium text-gray-700">
              Modelo
            </Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => handleFieldChange("model", e.target.value)}
              placeholder="Ej: 2020-2024, Civic, Corolla"
              className="border-gray-200 focus:border-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="additionalDescription" className="text-sm font-medium text-gray-700">
              Descripción Adicional
            </Label>
            <Input
              id="additionalDescription"
              value={formData.additionalDescription}
              onChange={(e) => handleFieldChange("additionalDescription", e.target.value)}
              placeholder="Ej: Original, Reforzado, Premium"
              className="border-gray-200 focus:border-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Descripción generada */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Wand2 className="w-3.5 h-3.5 text-zinc-900" />
          Descripción Auto-generada
        </h2>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Descripción Final
          </Label>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg min-h-[60px] flex items-center">
            <p className="text-sm text-gray-800">
              {formData.autoDescription || "Completa los campos anteriores para generar la descripción"}
            </p>
          </div>
        </div>
      </div>

      {/* Precios e inventario */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Precios e Inventario
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium text-gray-700">
              Precio de Venta *
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleFieldChange("price", e.target.value)}
              placeholder="0.00"
              className="border-gray-200 focus:border-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cost" className="text-sm font-medium text-gray-700">
              Costo
            </Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => handleFieldChange("cost", e.target.value)}
              placeholder="0.00"
              className="border-gray-200 focus:border-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock" className="text-sm font-medium text-gray-700">
              Stock Actual *
            </Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={(e) => handleFieldChange("stock", e.target.value)}
              placeholder="0"
              className="border-gray-200 focus:border-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minStock" className="text-sm font-medium text-gray-700">
              Stock Mínimo
            </Label>
            <Input
              id="minStock"
              type="number"
              value={formData.minStock}
              onChange={(e) => handleFieldChange("minStock", e.target.value)}
              placeholder="0"
              className="border-gray-200 focus:border-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Información Adicional
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="supplier" className="text-sm font-medium text-gray-700">
              Proveedor
            </Label>
            <Input
              id="supplier"
              value={formData.supplier}
              onChange={(e) => handleFieldChange("supplier", e.target.value)}
              placeholder="Nombre del proveedor"
              className="border-gray-200 focus:border-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="barcode" className="text-sm font-medium text-gray-700">
              Código de Barras
            </Label>
            <Input
              id="barcode"
              value={formData.barcode}
              onChange={(e) => handleFieldChange("barcode", e.target.value)}
              placeholder="123456789012"
              className="border-gray-200 focus:border-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium text-gray-700">
              Ubicación
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleFieldChange("location", e.target.value)}
              placeholder="Ej: A1-B2-C3"
              className="border-gray-200 focus:border-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="warranty" className="text-sm font-medium text-gray-700">
              Garantía (meses)
            </Label>
            <Input
              id="warranty"
              type="number"
              value={formData.warranty}
              onChange={(e) => handleFieldChange("warranty", e.target.value)}
              placeholder="12"
              className="border-gray-200 focus:border-gray-400"
            />
          </div>
        </div>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-medium text-gray-700">
              Etiquetas
            </Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleFieldChange("tags", e.target.value)}
              placeholder="original, premium, importado (separadas por comas)"
              className="border-gray-200 focus:border-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
              Notas Internas
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleFieldChange("notes", e.target.value)}
              placeholder="Notas adicionales para uso interno..."
              rows={3}
              className="border-gray-200 focus:border-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">* Campos requeridos</div>
          <div className="flex gap-2">
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className="bg-gray-900 hover:bg-gray-800"
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Guardando..." : "Crear Producto"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormCreateProduct