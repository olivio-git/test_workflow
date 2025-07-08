import type RouteType from "./RouteType";
import ProductScreen from "@/modules/products/screens/ProductScreen";
// Importa un componente para el dashboard principal
import Content from "@/modules/dashboard/screens/content"; // Necesitas crear este componente
import { HomeIcon, LayoutDashboardIcon } from "lucide-react";
import CreateProduct from "@/modules/products/screens/CreateProduct";

export const protectedRoutes: RouteType[] = [
  {
    path: "/dashboard",
    name: "Dashboard",
    type: "protected",
    element: Content,
    isAdmin: false,
    role: "user",
    icon: LayoutDashboardIcon
  },
  {
    path: "/dashboard/producto-lista",
    name: "Productos",
    type: "protected",
    element: ProductScreen,
    isAdmin: true,
    role: "admin",
    icon: HomeIcon
  },
  {
    path: "/dashboard/create-producto",
    name: "Crear Producto",
    type: "protected",
    element: CreateProduct,
    isAdmin: true,
    role: "admin",
    icon: HomeIcon
  },
];