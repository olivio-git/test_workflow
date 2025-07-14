import type RouteType from "@/navigation/RouteType";
import NavItem from "./NavItem";
import { ChevronDown, ChevronRight } from "lucide-react"; 

const HeaderTagRoute = ({
    route,
    expandedHeaders,
    toggleHeader,
    handleNavigation
  }: {
    route: RouteType;
    expandedHeaders:string[]
    toggleHeader:(headerName:string)=>void
    handleNavigation:()=>void
  }) => {
  const isExpanded = expandedHeaders.includes(route.name);
  const hasSubRoutes = route.subRoutes && route.subRoutes.length > 0;

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
        className="flex items-center justify-start gap-2 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 cursor-pointer rounded-md transition-colors"
      >
        {hasSubRoutes && (
          <div className="ml-2">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        )}
        <div className="flex items-center">
          {route.icon && <route.icon className="h-4 w-4 mr-3 flex-shrink-0" />}
          <span className="text-xs text-gray-600 font-semibold uppercase tracking-wider">
            {route.name}
          </span>
        </div>
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
