import {
    Settings2,
    MapPin,
    Tag,
    FolderOpen,
    Layers,
    Car,
    Ruler,
} from "lucide-react"
import ConfigCard from "../components/configCard"
import { useNavigate } from "react-router"

const configSections = [
    {
        key: "categorias",
        href: "/dashboard/settings/categories",
        title: "Categorías",
        description: "Categorías principales",
        icon: FolderOpen,
        iconClassName: "bg-purple-100 text-purple-600",
    },
    {
        key: "subcategorias",
        href: "/dashboard/settings/subcategories",
        title: "Subcategorías",
        description: "Subcategorías por categoría",
        icon: Layers,
        iconClassName: "bg-orange-100 text-orange-600",
    },
    {
        key: "procedencias",
        href: "/dashboard/settings/origins",
        title: "Procedencias",
        description: "Origen de los productos",
        icon: MapPin,
        iconClassName: "bg-blue-100 text-blue-600",
    },
    {
        key: "marcas",
        href: "/dashboard/settings/brands",
        title: "Marcas",
        description: "Marcas de productos",
        icon: Tag,
        iconClassName: "bg-emerald-100 text-emerald-600",
    },
    {
        key: "marcasVehiculo",
        href: "/dashboard/settings/vehicle-brands",
        title: "Marcas de Vehículo",
        description: "Marcas de vehículos",
        icon: Car,
        iconClassName: "bg-red-100 text-red-600",
    },
    {
        key: "medidas",
        href: "/dashboard/settings/measurements",
        title: "Medidas",
        description: "Medidas de productos",
        icon: Ruler,
        iconClassName: "bg-yellow-100 text-yellow-600",
    },
]

const SettingsScreen = () => {
    const navigate = useNavigate()

    const handleOnView = (href: string) => {
        navigate(href)
    }

    const handleOnAdd = (href: string) => {
        navigate(href, {
            state: {
                openModal: true
            }
        })
    }
    return (
        <main className="max-w-7xl mx-auto space-y-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {configSections.map((section) => {
                    return (
                        <ConfigCard
                            key={section.key}
                            title={section.title}
                            description={section.description}
                            icon={section.icon}
                            iconClassName={section.iconClassName}
                            count={5}
                            onView={() => {
                                handleOnView(section.href)
                            }}
                            onAdd={() => {
                                handleOnAdd(section.href)
                            }}
                        />
                    )
                })}
            </div>
        </main>
    )
}
export default SettingsScreen