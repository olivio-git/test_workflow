import React from "react";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "cmdk";
import { useNavigate } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";
import protectedRoutes from "@/navigation/Protected.Route";
import { createPortal } from "react-dom";

// Se procesan las rutas una sola vez fuera del componente para mayor eficiencia
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
  const navigate = useNavigate();

  

  const handleSelect = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  if (!open) {
    return null;
  }

  const commandPalette = (
    // Contenedor del fondo que permite cerrar al hacer clic fuera
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-16 sm:pt-24 bg-black/30 backdrop-blur-sm"
      onMouseDown={() => setOpen(false)}
    >
      <Command
        // Evita que el clic dentro del menú lo cierre
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white border border-gray-200 shadow-2xl rounded-xl animate-in fade-in-0 zoom-in-95 overflow-hidden"
      >
        <CommandInput
          autoFocus
          placeholder="Busca una ruta o escribe un comando..."
          className="w-full h-12 px-4 text-sm text-gray-800 bg-transparent placeholder:text-gray-400 focus:outline-none border-b border-gray-200"
        />
        <CommandList className="max-h-[300px] overflow-y-auto">
          <CommandEmpty className="py-6 text-center text-sm text-gray-500">
            No se encontraron resultados.
          </CommandEmpty>

          <CommandGroup className="px-2" heading="Navegación">
            {routes.map((route) => (
              <CommandItem
                key={route.path}
                value={`${route.name} ${route.path}`}
                onSelect={() => handleSelect(route.path)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 aria-selected:bg-gray-100"
              >
                {route.icon && (
                  <route.icon size={16} className="text-gray-500" />
                )}
                <span>{route.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );

  // Renderizar el CommandPalette usando un portal para que aparezca fuera del contenedor del layout
  return createPortal(commandPalette, document.body);
}