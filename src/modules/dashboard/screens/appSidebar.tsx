import protectedRoutes from "@/navigation/Protected.Route";
import type RouteType from "@/navigation/RouteType";
import authSDK from "@/services/sdk-simple-auth";
import { Settings, HelpCircle, LogOut, Package } from "lucide-react";
import { useState } from "react";
import NavItem from "../components/NavItem";
import HeaderTagRoute from "../components/HeaderTagRoute";
import ButtonItem from "../components/ButtonItem";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, useSidebar } from "@/components/atoms/sidebar";
import { useUpdateChecker } from "@/hooks/useUpdateChecker";

const AppSidebar = () => {
  const [expandedHeaders, setExpandedHeaders] = useState<string[]>([]);
  const { setOpenMobile, isMobile } = useSidebar();
  const { available } = useUpdateChecker();

  const handleNavigation = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }

  const handleLogout = async () => {
    try {
      // localStorage.removeItem("lastPath"); ///POR SI QUEREMOS BORRAR HISTORIAL DE ULTIMA RUTA
      await authSDK.logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const toggleHeader = (headerName: string) => {
    setExpandedHeaders(prev =>
      prev.includes(headerName)
        ? prev.filter(name => name !== headerName)
        : [...prev, headerName]
    );
  };

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-gray-200 bg-white">
      <SidebarHeader className="border-b border-gray-200 h-16 flex justify-center px-4">
        <div className="flex items-center gap-2">
          {/* logo de la empresa */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <Package className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">INTERMOTORS</span>
            <span className="text-xs text-muted-foreground">Sistema de Gestión</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-1">
            <SidebarMenu>
              {protectedRoutes.map((route: RouteType, index) => (
                <HeaderTagRoute
                  handleNavigation={handleNavigation}
                  toggleHeader={toggleHeader}
                  expandedHeaders={expandedHeaders}
                  key={`${route.name}-${index}`}
                  route={route}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 p-0">
        <SidebarGroup>
          <SidebarGroupLabel className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            General
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-1">
            <SidebarMenu>
              <NavItem
                href="/dashboard/settings"
                handleNavigation={handleNavigation}
                icon={Settings}
                badge={available ? 1 : null}
              >
                Configuración
              </NavItem>
              <NavItem
                href="#"
                handleNavigation={handleNavigation}
                icon={HelpCircle}
              >
                Ayuda
              </NavItem>
              <ButtonItem
                className="bg-primary text-primary-foreground hover:text-primary-foreground hover:bg-primary/90"
                icon={LogOut}
                onClick={handleLogout}>
                Cerrar Sesión
              </ButtonItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
};
export default AppSidebar;