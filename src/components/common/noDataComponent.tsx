import { Package } from "lucide-react";
interface NoDataProps {
    message?: string
    description?: string
}
const NoDataComponent: React.FC<NoDataProps> = ({
    message = "No se encontraron datos",
    description = "Actualmente no hay datos disponibles para mostrar."
}) => {
    return (
        <article className="flex flex-col items-center justify-center space-y-6 px-12 py-16 mx-auto bg-blue-50 rounded-3xl border border-blue-100">
            <div className="p-3 rounded-full bg-blue-100">
                <Package className="h-8 w-8 text-blue-600" />
            </div>
            <div className="space-y-3 text-center">
                <h3 className="text-lg font-semibold text-blue-600">
                    {message}
                </h3>
                <p className="text-sm text-blue-400 leading-relaxed">
                    {description}
                </p>
            </div>
        </article>
    );
}

export default NoDataComponent;