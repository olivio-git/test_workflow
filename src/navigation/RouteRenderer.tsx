import type React from "react";
import { Navigate } from "react-router";
import type RouteType from "./RouteType"; 
import Layout from "@/modules/dashboard/screens/layout";

interface RouteRendererProps {
  route: RouteType;
  isAuthenticated?: boolean;
  redirectTo?: string;
}

const RouteRenderer: React.FC<RouteRendererProps> = ({
  route,
  isAuthenticated = true,
  redirectTo = "/",
}) => {
  const Component = route.element;

  if (!Component) {
    return <div>Componente no encontrado para la ruta: {route.path}</div>;
  }

  if (route.type === "protected" && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <Layout>
      <Component />
    </Layout>
  );
};

export default RouteRenderer;
