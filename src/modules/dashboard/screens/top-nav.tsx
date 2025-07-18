import { Bell, PanelLeftClose, PanelLeftOpen, ShoppingCart } from "lucide-react";
import CommandPalette from "./CommandPalette/CommandPalette";
import SearchButton from "./CommandPalette/SearchButton";
import { useState } from "react";
import protectedRoutes from "@/navigation/Protected.Route";
import { Link, useLocation } from "react-router";
import { useHotkeys } from "react-hotkeys-hook";
import SelectBranch from "../components/SelectBranch";
import type RouteType from "@/navigation/RouteType";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import authSDK from "@/services/sdk-simple-auth";
import { useCartWithUtils } from "@/modules/shoppingCart/hooks/useCartWithUtils";

interface TopNavProps {
  isSidebarMenuOpen: boolean;
  handleToogleSidebarMenu: () => void;
  onOpenCartChange: () => void
}

const flattenRoutes = (routes: RouteType[]): RouteType[] => {
  const flattened: RouteType[] = [];

  routes.forEach((route) => {
    if (route.path) {
      flattened.push(route);
    }

    if (route.subRoutes) {
      flattened.push(...flattenRoutes(route.subRoutes));
    }
  });

  return flattened;
};

const findParentRoute = (routes: RouteType[], targetPath: string): RouteType | null => {
  for (const route of routes) {
    if (route.subRoutes) {
      for (const subRoute of route.subRoutes) {
        if (subRoute.path === targetPath) {
          return route;
        }
      }
    }
  }
  return null;
};

const TopNav: React.FC<TopNavProps> = ({
  isSidebarMenuOpen,
  handleToogleSidebarMenu,
  onOpenCartChange
}) => {
  const user = authSDK.getCurrentUser()
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const routes = protectedRoutes.filter((route) => route.type === "protected");
  const flatRoutes = flattenRoutes(routes);

  const currentRoute = flatRoutes.find((route) => route.path === location.pathname);
  const parentRoute = findParentRoute(routes, location.pathname);
  const {
    getCartCount: cartLength
  } = useCartWithUtils(user?.name || '')
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

  const renderBreadcrumb = () => {
    if (location.pathname === "/dashboard") {
      return (
        <Link className="hidden sm:flex" to={"/dashboard"}>
          Dashboard/
        </Link>
      );
    }

    const breadcrumbItems = [];

    breadcrumbItems.push(
      <Link
        key="dashboard"
        to={"/dashboard"}
        className="text-gray-500 hover:text-gray-700"
      >
        Dashboard/
      </Link>
    );

    if (parentRoute) {
      breadcrumbItems.push(
        <span key="parent" className="text-gray-500">
          {parentRoute.name}/
        </span>
      );
    }

    breadcrumbItems.push(
      <Link
        key="current"
        to={location.pathname}
        className="text-gray-800 hover:text-gray-900"
      >
        {currentRoute?.name || "Ruta Desconocida"}
      </Link>
    );

    return <div className="hidden sm:flex">{breadcrumbItems}</div>;
  };

  return (
    <nav className="flex items-center justify-between h-full px-2 bg-white border-b border-gray-200 sm:px-4">
      <div className="font-medium text-sm flex items-center space-x-1 truncate w-full">
        <button
          onClick={() => handleToogleSidebarMenu()}
          className="rounded p-1.5 border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          {isSidebarMenuOpen ? (
            <PanelLeftClose className="size-4 text-gray-800" />
          ) : (
            <PanelLeftOpen className="size-4 text-gray-800" />
          )}
        </button>
        {renderBreadcrumb()}
      </div>

      <div className="flex items-center gap-2 ml-auto sm:gap-4 sm:ml-0">
        <div className="flex items-center gap-4 w-full">
          <SelectBranch></SelectBranch>
        </div>
        <div className="flex items-center gap-4">
          <SearchButton onClick={() => setOpen(true)} />
          <CommandPalette open={open} setOpen={setOpen} />
        </div>
        <Button variant="outline" className="relative size-10" size={'sm'} onClick={onOpenCartChange}>
          <ShoppingCart className="h-4 w-4" />
          {cartLength() > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {cartLength()}
            </Badge>
          )}
        </Button>
        <button
          type="button"
          className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Bell className="w-4 h-4 text-gray-600 sm:h-5 sm:w-5" />
        </button>
      </div>
    </nav>
  );
};

export default TopNav;