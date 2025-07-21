import LoginScreen from "@/modules/auth/screens/LoginScreen";
import type RouteType from "./RouteType";
import {LogIn, Table2Icon } from "lucide-react" 
import ProductListScreen from "@/modules/products/screens/ProductListScreen";


export const publicRoutes: RouteType[] = [
  {
    path: "/",
    name: "Login",
    type: "public",
    element: LoginScreen,
    isAdmin: false,
    role: ['guest'],
    icon: LogIn
  },
  // {
  //   path: "/products",
  //   name: "Lista de Productos",
  //   type: "public",
  //   element: ProductListScreen,
  //   isAdmin: false,
  //   role: ["guest"],
  //   icon: Table2Icon,
  // },
]; 