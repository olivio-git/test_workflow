import type RouteType from "@/navigation/RouteType";
import NavItem from "./NavItem";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useLocation } from "react-router";

const HeaderTagRoute = ({
  route,
  expandedHeaders,
  toggleHeader,
  handleNavigation
}: {
  route: RouteType;
  expandedHeaders: string[]
  toggleHeader: (headerName: string) => void
  handleNavigation: () => void
}) => {
  const location = useLocation();
  const hasSubRoutes = route.subRoutes && route.subRoutes.length > 0;

  const isInSubRoute = hasSubRoutes
    ? (route.subRoutes ?? []).some(
        (subRoute) => subRoute.path && location.pathname.startsWith(subRoute.path)
      )
    : false;

  const isExpanded = expandedHeaders.includes(route.name) || isInSubRoute;

  if (!route.showSidebar) return null

  if (!route.isHeader) {
    return (
      <NavItem
        key={route.path}
        href={route.path || "/"}
        icon={route.icon}
        handleNavigation={handleNavigation}
      >
        {route.name}
      </NavItem>
    );
  }

  return (
    <div className="mb-2">
      <div
        onClick={() => toggleHeader(route.name)}
        className="flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-secondary hover:text-secondary-foreground cursor-pointer rounded-md transition-colors"
      >
        <div className="flex items-center gap-2">
          {route.icon && <route.icon className="h-4 w-4 flex-shrink-0" />}
          <span className="text-xs font-semibold uppercase tracking-wider">
            {route.name}
          </span>
        </div>
        {hasSubRoutes && (
          <div className="ml-2">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        )}
      </div>

      {hasSubRoutes && isExpanded && (
        <div className="ml-4 mt-1 space-y-1">
          {route.subRoutes
            ?.filter((subRoute) => subRoute.showSidebar && subRoute.path)
            .map((subRoute, index) => (
              <NavItem
                key={`${subRoute.path}-${index}`}
                href={subRoute.path || "#"}
                icon={subRoute.icon}
                handleNavigation={handleNavigation}
              >
                {subRoute.name}
              </NavItem>
            ))}
        </div>
      )}
    </div>
  );
};

export default HeaderTagRoute;
