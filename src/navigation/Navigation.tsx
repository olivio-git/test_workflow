// src/routes/Navigation.tsx
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import type { AuthState, AuthUser } from "sdk-simple-auth";
import { publicRoutes } from "./Public.Route";
import RouteRenderer from "./RouteRenderer";
import authSDK from "@/services/sdk-simple-auth";
import protectedRoutes from "./Protected.Route";
import BranchSelection from "@/modules/auth/screens/BranchScreen";
import { environment } from "@/utils/environment";

const Navigation = () => {
  const [authState, setAuthState] = useState<{
    user: AuthUser | null;
    selectedBranch: string | null;
  }>({
    user: null,
    selectedBranch: localStorage.getItem(environment.branch_selected_key),
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authSDK.onAuthStateChanged((possible: AuthState) => {
      setIsLoading(true);
      if (!possible.user) {
        setAuthState({ user: null, selectedBranch: null });
      } else {
        setAuthState((_prev) => ({
          user: possible.user,
          selectedBranch: localStorage.getItem(environment.branch_selected_key),
        }));
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleBranchSelect = (branchId: string) => {
    localStorage.setItem(environment.branch_selected_key, branchId);
    setAuthState((prev) => ({ ...prev, selectedBranch: branchId }));
  };

  if (authState.user && !authState.selectedBranch) {
    return (
      <BranchSelection user={authState.user} onSelect={handleBranchSelect} />
    );
  }

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  const allRoutes = [...publicRoutes, ...protectedRoutes];
  return (
    <Routes>
      {allRoutes.map((route, index) => (
        <Route
          key={`${route.type}-${index}`}
          path={route.path}
          element={
            <RouteRenderer
              route={route}
              isAuthenticated={!!authState.user}
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
