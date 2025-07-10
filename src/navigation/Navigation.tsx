import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import type { AuthState, AuthUser } from "sdk-simple-auth";
import { publicRoutes } from "./Public.Route";
import RouteRenderer from "./RouteRenderer";
import authSDK from "@/services/sdk-simple-auth";
import protectedRoutes from "./Protected.Route";

const Navigation = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  useEffect(() => {
    const unsubscribe = authSDK.onAuthStateChanged((possible: AuthState) => {
      setIsLoading(true);
      if (!possible.user) {
        setUser(null);
      } else {
        setUser(possible.user);
      }
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  const allRoutes = [...publicRoutes, ...protectedRoutes];
  return (
    <Routes>
      { 
        allRoutes.map((route, index) => (
        <Route
          key={`${route.type}-${index}`}
          path={route.path}
          element={
            <RouteRenderer
              route={route}
              isAuthenticated={!!user} // Cambia esto para usar el estado real
              redirectTo="/"
              isLoading={isLoading}
            />
          }
        />
      ))}
      <Route path="*" element={<div>404 - Página no encontrada</div>} />
    </Routes>
  );
};

export default Navigation;