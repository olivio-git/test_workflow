import LoginScreen from "@/modules/auth/screens/LoginScreen";
import { HomeScreen } from "@/modules/dashboard/screens/HomeScreen";
import { Home, LogIn } from "lucide-react"

export interface Route {
    path: string;
    name: string;
    component: React.ComponentType<any>;
    active?: boolean;
    icon: any;
    type: "public" | "private";
}

export const routes: Route[] = [
    {
        path: "/",
        name: "Home",
        component: HomeScreen,
        icon: Home,
        active:true,
        type: "private"
    },
    {
        path: "/login",
        name: "Login",
        component: LoginScreen,
        icon: LogIn,
        active:true,
        type: "public"
    }
]
