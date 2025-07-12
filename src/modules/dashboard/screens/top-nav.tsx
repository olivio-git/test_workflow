import { Bell } from "lucide-react";
import CommandPalette from "./CommandPalette/CommandPalette";
import SearchButton from "./CommandPalette/SearchButton";
import { useState } from "react";
import protectedRoutes from "@/navigation/Protected.Route";
import { Link, useLocation } from "react-router";
import { useHotkeys } from "react-hotkeys-hook";
import SelectBranch from "../components/SelectBranch";

export default function TopNav() {
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
    <nav className="flex items-center justify-between h-full px-3 bg-white border-b border-gray-200 sm:px-6">
      <div className="font-medium text-sm hidden sm:flex items-center space-x-1 truncate">
        {location.pathname === "/dashboard" ? (
          <Link to={"/dashboard"}>Dashboard/</Link>
        ) : (
          <div>
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
        <div className="flex items-center gap-4 w-full">
          <SelectBranch></SelectBranch>
        </div>
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
