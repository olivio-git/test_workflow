import { Button } from "@/components/atoms/button";
import { Kbd } from "@/components/atoms/kbd";
import protectedRoutes from "@/navigation/Protected.Route";
import type RouteType from "@/navigation/RouteType";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "cmdk";
import { Search, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

interface RouteTypeWithParent extends RouteType {
  parentName?: string | null;
}

const processRoutes = (routes: RouteType[]) => {
  const flatRoutes: RouteTypeWithParent[] = [];

  routes.forEach((route) => {
    // Verificar si la ruta debe mostrarse en el command palette
    if (route.path && !route.isHeader && route.showInCommandPalette !== false) {
      flatRoutes.push({
        path: route.path,
        name: route.name,
        icon: route.icon,
        type: route.type,
        parentName: null,
      });
    }

    if (route.subRoutes) {
      route.subRoutes.forEach((subRoute: RouteType) => {
        // Verificar si la subruta debe mostrarse en el command palette
        if (subRoute.path && subRoute.showInCommandPalette !== false) {
          flatRoutes.push({
            path: subRoute.path,
            name: subRoute.name,
            icon: subRoute.icon,
            type: subRoute.type,
            parentName: route.name,
          });
        }
      });
    }
  });

  return flatRoutes;
};

const routes = processRoutes(protectedRoutes);

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
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-16 sm:pt-24 px-2 bg-black/50"
      onMouseDown={() => setOpen(false)}
    >
      <Command
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white p-2 border border-gray-200 shadow-2xl rounded-xl animate-in fade-in-0 zoom-in-95 overflow-hidden"
      >
        <div className="flex items-center px-2 border-b border-gray-200">
          <Search className="size-4 text-gray-400" />
          <CommandInput
            autoFocus
            placeholder="Busca una ruta o escribe un comando..."
            className="w-full h-12 px-2 text-sm text-gray-800 bg-transparent placeholder:text-gray-400 focus:outline-none"
          />
          <Kbd onClick={() => setOpen(false)} className="hidden sm:block">esc</Kbd>
          <Button
            className="sm:hidden size-6"
            variant={"outline"}
            onClick={() => setOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </div>
        <CommandList className="max-h-[350px] overflow-y-auto">
          <CommandEmpty className="py-6 min-h-40 flex items-center justify-center font-medium text-center text-base text-gray-500">
            No se encontraron resultados.
          </CommandEmpty>

          <CommandGroup className="px-2 py-1 font-medium" heading="Navegación">
            {routes.map((route) => (
              <CommandItem
                key={route.path}
                value={`${route.name} ${route.path} ${route.parentName || ''}`}
                onSelect={() => route.path && handleSelect(route.path)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 cursor-pointer hover:bg-accent aria-selected:bg-accent rounded"
              >
                {route.icon && (
                  <route.icon size={16} className="text-gray-500" />
                )}
                <div className="flex flex-col">
                  <span>{route.name}</span>
                  {route.parentName && (
                    <span className="text-xs text-gray-400 font-normal">
                      {route.parentName}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );

  return createPortal(commandPalette, document.body);
}