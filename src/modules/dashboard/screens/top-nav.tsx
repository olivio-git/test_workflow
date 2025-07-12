"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";
import { Bell, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Profile01 from "./profile-01";
import CommandPalette from "./CommandPalette/CommandPalette";
import SearchButton from "./CommandPalette/SearchButton";
import { useState } from "react";
import protectedRoutes from "@/navigation/Protected.Route";
import { Link, useLocation } from "react-router";
import { useHotkeys } from "react-hotkeys-hook";
interface TopNavProps {
  isSidebarMenuOpen: boolean
  handleToogleSidebarMenu: () => void
}
const TopNav: React.FC<TopNavProps> = ({
  isSidebarMenuOpen,
  handleToogleSidebarMenu,
}) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  // Podriamos filtrar aqui las rutas por rol.
  const routes = protectedRoutes.filter((route) => route.type === "protected");

  useHotkeys(
    "ctrl+k",
    (e) => {
      e.preventDefault();
      setOpen(!open);
    },
    {
      enableOnFormTags: true,
      enabled: true,
    }
  );
  useHotkeys("esc", () => setOpen(false), {
    enableOnFormTags: true,
    enabled: open,
  });
  return (
    <nav className="flex items-center justify-between h-full px-2 bg-white border-b border-gray-200 sm:px-4">
      <div className="font-medium text-sm flex items-center space-x-1 truncate w-full">
        <button
          onClick={() => handleToogleSidebarMenu()}
          className="rounded p-1.5 border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
          {
            isSidebarMenuOpen ? (
              <PanelLeftClose className="size-4 text-gray-800" />
            ) : (
              <PanelLeftOpen className="size-4 text-gray-800" />
            )
          }
        </button>
        {location.pathname === "/dashboard" ? (
          <Link className="hidden sm:flex" to={"/dashboard"}>Dashboard/</Link>
        ) : (
          <div className="hidden sm:flex">
            <Link
              to={"/dashboard"}
              className="text-gray-500 hover:text-gray-700"
            >
              Dashboard/
            </Link>
            <Link
              to={location.pathname}
              className="text-gray-800 hover:text-gray-900"
            >
              {routes.find((route) => route.path === location.pathname)?.name ||
                "Ruta Desconocida"}
            </Link>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 ml-auto sm:gap-4 sm:ml-0">
        <div className="flex items-center gap-4">
          <SearchButton onClick={() => setOpen(true)} />
          <CommandPalette open={open} setOpen={setOpen} />
        </div>
        <button
          type="button"
          className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Bell className="w-4 h-4 text-gray-600 sm:h-5 sm:w-5" />
        </button>
      </div>
    </nav>
  );
}
export default TopNav;