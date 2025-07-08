import React, { useState } from "react";
import { Command, CommandGroup, CommandItem } from "cmdk";
import { useNavigate } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";
import protectedRoutes from "@/navigation/Protected.Route";

const routes = protectedRoutes.map((route) => ({
  name: route.name,
  path: route.path,
  icon: route.icon,
}));

export default function CommandPalette({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useHotkeys("esc", () => setOpen(false), { enableOnFormTags: true });

  const handleSelect = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const filteredRoutes =
    search.trim() === ""
      ? routes
      : routes.filter(
          (route) =>
            route.name.toLowerCase().includes(search.toLowerCase()) ||
            route.path.toLowerCase().includes(search.toLowerCase())
        );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md mt-24 bg-white border border-gray-200 shadow-xl rounded-xl animate-in fade-in-0 zoom-in-95">
        <Command loop>
          {/* Input superior */}
          <div className="px-4 py-3 border-b border-gray-200">
            <Command.Input
              autoFocus
              value={search}
              onValueChange={setSearch}
              placeholder="Buscar rutas..."
              className="w-full text-sm text-gray-800 bg-white placeholder:text-gray-400 focus:outline-none"
            />
          </div>

          {/* Lista de resultados */}
          <Command.List className="max-h-[300px] overflow-y-auto py-2">
            {filteredRoutes.length > 0 ? (
              <CommandGroup heading="Navegación">
                {filteredRoutes.map((route) => (
                  <CommandItem
                    key={route.path}
                    onSelect={() => handleSelect(route.path)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                  >
                    {route.icon && (
                      <route.icon size={16} className="text-gray-500" />
                    )}
                    <span>{route.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <div className="px-4 py-2 text-sm text-gray-400">
                Sin resultados
              </div>
            )}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
