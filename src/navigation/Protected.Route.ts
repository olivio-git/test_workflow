import type RouteType from "./RouteType";
import ProductScreen from "@/modules/products/screens/ProductScreen";

export const protectedRoutes:RouteType[] = [
  {
    path: "/dashboard/producto-lista",
    name: "Productos",
    type: "protected",
    element: ProductScreen,
    isAdmin: true,
    role: "admin"
  }
]