import type React from "react";
import { Navigate, useLocation } from "react-router";
import type RouteType from "./RouteType";
import Layout from "@/modules/dashboard/screens/layout";

interface RouteRendererProps {
  route: RouteType;
  isAuthenticated?: boolean;
  redirectTo?: string;
  isLoading: boolean;
}

const RouteRenderer: React.FC<RouteRendererProps> = ({
  route,
  isAuthenticated = true,
  redirectTo = "/",
  isLoading = false,
}) => {
  const Component = route.element;
  const location = useLocation();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isLoading && location.pathname !== redirectTo) {
    localStorage.setItem("lastPath", location.pathname);
  } 
  if (!Component) {
    return <div>Componente no encontrado para la ruta: {route.path}</div>;
  }

  if (route.type === "protected" && !isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  if (route.type === "public" && isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  if (route.type === "protected") {
    return (
      <Layout>
        <Component />
      </Layout>
    );
  }

  return <Component />;
};

export default RouteRenderer;
