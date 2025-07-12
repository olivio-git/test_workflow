import { Button } from "@/components/atoms/button";
import protectedRoutes from "@/navigation/Protected.Route";
import type RouteType from "@/navigation/RouteType";
import authSDK from "@/services/sdk-simple-auth";
import { Settings, HelpCircle, Menu, LogOut } from "lucide-react";

import { Link } from "react-router";
interface SidebarProps {
  isSidebarMenuOpen: boolean
  handleNavigation: () => void
}
const Sidebar: React.FC<SidebarProps> = ({ isSidebarMenuOpen, handleNavigation }) => {

  const handleLogout = async () => {
    try {
      await authSDK.logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  function NavItem({
    href,
    icon: Icon,
    children,
  }: {
    href: string;
    icon: any;
    children: React.ReactNode;
  }) {
    return (
      <Link
        to={href}
        onClick={handleNavigation}
        className="flex items-center px-3 py-2 text-sm rounded-md transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      >
        <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
        {children}
      </Link>
    );
  }

  return (
    <>
      {/* <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-lg bg-white shadow-md"
        onClick={() => handleToogleSidebarMenu()}
      >
        <Menu className="h-5 w-5 text-gray-600" />
      </button> */}
      <nav
        className={`
                fixed inset-y-0 left-0 z-[70] w-64 bg-white transform transition-transform duration-200 ease-in-out
                 lg:w-2/12 border-r border-gray-200
                ${isSidebarMenuOpen ? "translate-x-0 lg:static" : "-translate-x-full"}
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
            <div className="space-y-6">
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Overview
                </div>
                <div className="space-y-1">
                  {protectedRoutes.map((route: RouteType) => (
                    <NavItem
                      key={route.path}
                      href={route.path}
                      icon={route.icon}
                    >
                      {route.name}
                    </NavItem>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 border-t border-gray-200">
            <div className="space-y-1">
              <NavItem href="#" icon={Settings}>
                Configuración
              </NavItem>
              <NavItem href="#" icon={HelpCircle}>
                Ayuda
              </NavItem>
              <Button
                className="w-full"
                variant="secondary"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
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
}
export default Sidebar;