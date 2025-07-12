import protectedRoutes from "@/navigation/Protected.Route";
import type RouteType from "@/navigation/RouteType";
import authSDK from "@/services/sdk-simple-auth";
import { Settings, HelpCircle, Menu, LogOut } from "lucide-react";

import { useState } from "react";
import { Link } from "react-router";
import NavItem from "../components/NavItem";

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  function handleNavigation() {
    setIsMobileMenuOpen(false);
  }
  const handleLogout = async () => {
    try {
      await authSDK.logout();
      // localStorage.removeItem(environment.branch_selected_key);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }; 
  function ButtonItem({
    onClick,
    icon: Icon,
    children,
  }: {
    onClick: () => void;
    icon: any;
    children: React.ReactNode;
  }) {
    return (
      <div
        onClick={onClick}
        className="flex items-center px-3 py-2 text-sm rounded-md transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-50 cursor-pointer"
      >
        <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
        {children}
      </div>
    );
  }
  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-lg bg-white shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-gray-600" />
      </button>
      <nav
        className={`
                fixed inset-y-0 left-0 z-[70] w-64 bg-white transform transition-transform duration-200 ease-in-out
                lg:translate-x-0 lg:static lg:w-64 border-r border-gray-200
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}
      >
        <div className="h-full flex flex-col">
          <Link
            to="https://kokonutui.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="h-16 px-6 flex items-center border-b border-gray-200"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold hover:cursor-pointer text-gray-900">
                TPS_INTERMOTORS
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
                      handleNavigation={handleNavigation}
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
              <NavItem href="/dashboard" handleNavigation={handleNavigation} icon={Settings}>
                Configuración
              </NavItem>
              <NavItem href="#" handleNavigation={handleNavigation} icon={HelpCircle}>
                Ayuda
              </NavItem>
              <ButtonItem icon={LogOut} onClick={handleLogout}>
                Logout
              </ButtonItem>
            </div>
          </div>
        </div>
      </nav> 
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[65] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
