import { Package } from "lucide-react";
interface NoDataProps {
    message?: string
}
const NoDataComponent: React.FC<NoDataProps> = ({
    message
}) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-6 px-12 py-16 mx-auto bg-blue-50 rounded-3xl border border-blue-100">
            <div className="p-3 rounded-full bg-blue-100">
                <Package className="h-8 w-8 text-blue-600" />
            </div>
            <div className="space-y-3 text-center">
                <h3 className="text-lg font-semibold text-blue-600">
                    {message ?? 'No se encontraron datos'}
                </h3>
                <p className="text-sm text-blue-400 leading-relaxed">
                    Intenta ajustar los filtros de búsqueda o verifica que los códigos estén escritos correctamente.
                </p>
            </div>
        </div>
    );
}

export default NoDataComponent;