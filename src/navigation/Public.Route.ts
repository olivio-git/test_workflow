import LoginScreen from "@/modules/auth/screens/LoginScreen";
import type RouteType from "./RouteType";
import {LogIn } from "lucide-react" 


export const publicRoutes: RouteType[] = [
  {
    path: "/",
    name: "Login",
    type: "public",
    element: LoginScreen,
    isAdmin: false,
    role: "guest",
    icon: LogIn
  },
]; 