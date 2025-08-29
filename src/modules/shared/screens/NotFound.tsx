import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/atoms/button";

const NotFound = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        console.error(
            "404 Error: User attempted to access non-existent route:",
            location.pathname
        );
    }, [location.pathname]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse delay-700" />
            </div>

            <div className="relative z-10 text-center px-4 max-w-md mx-auto">
                {/* Animated 404 number */}
                <div className="relative mb-8">
                    <h1 className="text-9xl font-bold text-primary/10 animate-fade-in">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-7xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent animate-scale-in">
                            404
                        </span>
                    </div>
                </div>

                {/* Error message with fade animation */}
                <div className="space-y-4 animate-fade-in animation-delay-200">
                    <h2 className="text-2xl font-semibold text-foreground">
                        Página no encontrada
                    </h2>
                    <p className="text-muted-foreground">
                        La página que estás buscando no existe o ha sido movida.
                    </p>
                </div>

                {/* Action buttons with hover animations */}
                <div className="flex gap-3 justify-center mt-8 animate-fade-in animation-delay-400">
                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="group cursor-pointer"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Volver
                    </Button>
                    <Button
                        onClick={() => navigate("/dashboard")}
                        className="cursor-pointer"
                    >
                        <Home className="mr-2 h-4 w-4" />
                        Inicio
                    </Button>
                </div>

                {/* Current path info */}
                <div className="mt-12 p-3 bg-muted/50 rounded-lg animate-fade-in animation-delay-600">
                    <p className="text-xs text-muted-foreground">
                        Ruta intentada: <code className="text-primary/70">{location.pathname}</code>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;