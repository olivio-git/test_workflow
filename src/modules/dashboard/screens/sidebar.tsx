import protectedRoutes from "@/navigation/Protected.Route";
import type RouteType from "@/navigation/RouteType";
import authSDK from "@/services/sdk-simple-auth";
import { Settings, HelpCircle, LogOut } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import NavItem from "../components/NavItem";
import HeaderTagRoute from "../components/HeaderTagRoute";
import ButtonItem from "../components/ButtonItem";

interface SidebarProps {
  isSidebarMenuOpen: boolean;
  handleNavigation: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarMenuOpen,
  handleNavigation,
}) => {
  // Estado para manejar qué headers están expandidos
  const [expandedHeaders, setExpandedHeaders] = useState<string[]>([]);

  const handleLogout = async () => {
    try {
      // localStorage.removeItem("lastPath");
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
    <>
      <nav
        className={`
          fixed inset-y-0 left-0 z-[70] w-64 bg-white transform transition-transform duration-200 ease-in-out
          lg:w-2/12 border-r border-gray-200
          ${
            isSidebarMenuOpen
              ? "translate-x-0 lg:static"
              : "-translate-x-full"
          }
        `}
      >
        <div className="h-full flex flex-col">
          <Link
            to="#"
            className="h-16 px-6 flex items-center border-b border-gray-200"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold hover:cursor-pointer text-gray-900">
                INTERMOTORS
              </span>
            </div>
          </Link>

          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-2">
              {protectedRoutes.map((route: RouteType, index) => (
                <HeaderTagRoute
                  handleNavigation={handleNavigation}
                  toggleHeader={toggleHeader}
                  expandedHeaders={expandedHeaders}
                  key={`${route.name}-${index}`}
                  route={route}
                />
              ))}
            </div>
          </div>

          <div className="px-4 py-4 border-t border-gray-200">
            <div className="space-y-1">
              <NavItem
                href="/dashboard"
                handleNavigation={handleNavigation}
                icon={Settings}
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
              <ButtonItem icon={LogOut} onClick={handleLogout}> 
                Logout
              </ButtonItem>
            </div>
          </div>
        </div>
      </nav>

      {isSidebarMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[65] lg:hidden"
          onClick={() => handleNavigation()}
        />
      )}
    </>
  );
};

export default Sidebar;