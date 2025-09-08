import { cn } from "@/lib/utils"
import type React from "react"
import { useState } from "react"
import {
    Plus,
    Edit2,
    Trash2,
    Settings2,
    MapPin,
    Tag,
    FolderOpen,
    Layers,
    Car,
    Ruler,
    ArrowLeft,
    Eye,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card"
import { Badge } from "@/components/atoms/badge"
import { Button } from "@/components/atoms/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/atoms/dialog"
import { Label } from "@/components/atoms/label"
import { Input } from "@/components/atoms/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/atoms/table"

const mockData = {
    procedencias: [
        { id: 1, nombre: "Nacional" },
        { id: 2, nombre: "Importado" },
        { id: 3, nombre: "Remanufacturado" },
    ],
    marcas: [
        { id: 1, nombre: "Toyota" },
        { id: 2, nombre: "Honda" },
        { id: 3, nombre: "Nissan" },
    ],
    categorias: [
        { id: 1, nombre: "Motor" },
        { id: 2, nombre: "Transmisión" },
        { id: 3, nombre: "Frenos" },
        { id: 4, nombre: "Suspensión" },
        { id: 5, nombre: "Eléctrico" },
    ],
    subcategorias: [
        { id: 1, nombre: "Pistones", categoriaId: 1, categoria: "Motor" },
        { id: 2, nombre: "Válvulas", categoriaId: 1, categoria: "Motor" },
        { id: 3, nombre: "Discos", categoriaId: 3, categoria: "Frenos" },
    ],
    marcasVehiculo: [
        { id: 1, nombre: "Toyota" },
        { id: 2, nombre: "Honda" },
        { id: 3, nombre: "Ford" },
    ],
    medidas: [
        { id: 1, valor: "11x6x7" },
        { id: 2, valor: "15x8x10" },
        { id: 3, valor: "20x12x8" },
    ],
}

export default function SettingsScreen() {
    const [currentView, setCurrentView] = useState<"dashboard" | string>("dashboard")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<any>(null)
    const [formData, setFormData] = useState({ nombre: "", valor: "", categoriaId: "" })

    const configSections = [
        {
            key: "procedencias",
            title: "Procedencias",
            description: "Origen de los productos",
            icon: MapPin,
            color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
        },
        {
            key: "marcas",
            title: "Marcas",
            description: "Marcas de productos",
            icon: Tag,
            color: "bg-green-50 border-green-200 hover:bg-green-100",
        },
        {
            key: "categorias",
            title: "Categorías",
            description: "Categorías principales",
            icon: FolderOpen,
            color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
        },
        {
            key: "subcategorias",
            title: "Subcategorías",
            description: "Subcategorías por categoría",
            icon: Layers,
            color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
        },
        {
            key: "marcasVehiculo",
            title: "Marcas de Vehículo",
            description: "Marcas de vehículos",
            icon: Car,
            color: "bg-red-50 border-red-200 hover:bg-red-100",
        },
        {
            key: "medidas",
            title: "Medidas",
            description: "Medidas de productos",
            icon: Ruler,
            color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
        },
    ]

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsDialogOpen(false)
        setEditingItem(null)
        setFormData({ nombre: "", valor: "", categoriaId: "" })
    }

    const openDialog = (item?: any) => {
        if (item) {
            setEditingItem(item)
            setFormData({
                nombre: item.nombre || "",
                valor: item.valor || "",
                categoriaId: item.categoriaId?.toString() || "",
            })
        } else {
            setEditingItem(null)
            setFormData({ nombre: "", valor: "", categoriaId: "" })
        }
        setIsDialogOpen(true)
    }

    const getCurrentData = () => {
        return mockData[currentView as keyof typeof mockData] || []
    }

    const getFieldLabel = () => {
        return currentView === "medidas" ? "Valor" : "Nombre"
    }

    const needsCategory = currentView === "subcategorias"
    const currentSection = configSections.find((s) => s.key === currentView)

    if (currentView === "dashboard") {
        return (
            <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-4">
                {/* Header */}
                <header className="border-gray-200 border bg-white rounded-lg p-2 sm:p-3">
                    <div className="flex flex-wrap gap-2 items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Settings2 className="h-6 w-6 lg:h-8 lg:w-8 text-gray-700" />
                            <div>
                                <h1 className="text-lg lg:text-xl font-bold text-gray-900 leading-tight">
                                    Configuración
                                </h1>
                                <p className="text-sm text-gray-500">Gestiona los datos maestros del sistema</p>
                            </div>
                        </div >
                    </div >
                </header >

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {configSections.map((section) => {
                        const Icon = section.icon
                        const count = mockData[section.key as keyof typeof mockData]?.length || 0

                        return (
                            <Card
                                key={section.key}
                                className={cn("cursor-pointer transition-all duration-200 hover:shadow-md border-2", section.color)}
                                onClick={() => setCurrentView(section.key)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                <Icon className="h-5 w-5 text-gray-700" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{section.title}</CardTitle>
                                                <CardDescription className="text-sm">{section.description}</CardDescription>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="text-sm font-medium">
                                                {count} elemento{count !== 1 ? "s" : ""}
                                            </Badge>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setCurrentView(section.key)
                                                }}
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                Ver
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="bg-black hover:bg-gray-800"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setCurrentView(section.key)
                                                    setTimeout(() => openDialog(), 100)
                                                }}
                                            >
                                                <Plus className="h-4 w-4 mr-1" />
                                                Agregar
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            <div className="mb-6 lg:mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentView("dashboard")}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver
                    </Button>
                </div>
                <div className="flex items-center gap-3 mb-2">
                    {currentSection && <currentSection.icon className="h-6 w-6 lg:h-8 lg:w-8 text-gray-700" />}
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{currentSection?.title}</h1>
                </div>
                <p className="text-sm lg:text-base text-gray-600">{currentSection?.description}</p>
            </div>

            <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div>
                        <CardTitle className="text-lg lg:text-xl">Gestionar {currentSection?.title}</CardTitle>
                        <CardDescription className="text-sm lg:text-base">
                            {getCurrentData().length} elemento{getCurrentData().length !== 1 ? "s" : ""} registrado
                            {getCurrentData().length !== 1 ? "s" : ""}
                        </CardDescription>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => openDialog()} className="bg-black hover:bg-gray-800 w-full sm:w-auto">
                                <Plus className="h-4 w-4 mr-2" />
                                Agregar
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingItem ? "Editar" : "Agregar"} {currentSection?.title.slice(0, -1)}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingItem ? "Modifica" : "Agrega"} un nuevo elemento a la lista.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="field">{getFieldLabel()} *</Label>
                                    <Input
                                        id="field"
                                        value={currentView === "medidas" ? formData.valor : formData.nombre}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                [currentView === "medidas" ? "valor" : "nombre"]: e.target.value,
                                            }))
                                        }
                                        placeholder={`Ingrese ${getFieldLabel().toLowerCase()}`}
                                        required
                                    />
                                </div>
                                {needsCategory && (
                                    <div>
                                        <Label htmlFor="categoria">Categoría *</Label>
                                        <Select
                                            value={formData.categoriaId}
                                            onValueChange={(value) => setFormData((prev) => ({ ...prev, categoriaId: value }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione una categoría" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {mockData.categorias.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id.toString()}>
                                                        {cat.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit" className="bg-black hover:bg-gray-800">
                                        {editingItem ? "Actualizar" : "Crear"}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent className="px-0 sm:px-6">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16">ID</TableHead>
                                    <TableHead className="min-w-32">{getFieldLabel()}</TableHead>
                                    {needsCategory && <TableHead className="min-w-32">Categoría</TableHead>}
                                    <TableHead className="text-right w-24">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {getCurrentData().map((item: any) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.id}</TableCell>
                                        <TableCell className="font-medium">{item.nombre || item.valor}</TableCell>
                                        {needsCategory && <TableCell>{item.categoria}</TableCell>}
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button variant="outline" size="sm" onClick={() => openDialog(item)}>
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {getCurrentData().length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-2">
                                {currentSection && <currentSection.icon className="h-12 w-12 mx-auto" />}
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No hay elementos</h3>
                            <p className="text-gray-500 mb-4">Comienza agregando tu primer elemento.</p>
                            <Button onClick={() => openDialog()} className="bg-black hover:bg-gray-800">
                                <Plus className="h-4 w-4 mr-2" />
                                Agregar {currentSection?.title.slice(0, -1)}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}