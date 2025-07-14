import type RouteType from "./RouteType";
import Content from "@/modules/dashboard/screens/content";
import { BoxIcon, Layers, LayoutDashboardIcon, Package, PlusIcon, Table2Icon } from "lucide-react";
import CreateProduct from "@/modules/products/screens/CreateProduct";
import ProductListScreen from "@/modules/products/screens/ProductListScreen";
import ProductDetailScreen from "@/modules/products/screens/ProductDetailScreen";
import Categoria from "@/modules/Categories/Screens/CreateCategory";

const protectedRoutes: RouteType[] = [
  {
    path: "/dashboard",
    name: "Dashboard",
    type: "protected",
    element: Content,
    isAdmin: false,
    role: ["user"],
    icon: LayoutDashboardIcon,
  },
  {
    name: "Productos",
    type: "protected",
    role: ["admin"],
    isHeader: true,
    showSidebar: true,
    // icon:BoxIcon,
    subRoutes: [
      {
        path: "/dashboard/create-producto",
        name: "Registrar Producto",
        type: "protected",
        element: CreateProduct,
        isAdmin: true,
        role: ["admin"],
        icon: BoxIcon,

        isHeader: false,
        showSidebar: true
      },
      {
        path: "/dashboard/productos",
        name: "Lista de Productos",
        type: "protected",
        element: ProductListScreen,
        isAdmin: true,
        role: ["admin"],
        icon: Table2Icon,
        isHeader: false,
        showSidebar: true
      },
      {
        path: "/dashboard/product-detail",
        name: "Detalle de Producto",
        type: "protected",
        element: ProductDetailScreen,
        isAdmin: true,
        role: ["admin"],
        icon: Package,
        isHeader: false,
        showSidebar: false
      },
    ]
  },
  // compras
  {
    name: "Compras",
    type: "protected",
    //element: Content,
    isAdmin: false,
    role: ["user"],
    // icon: HomeIcon,

    isHeader: true,
    showSidebar: true,
    subRoutes: [
      {
        path: "/dashboard/compras/crear",
        name: "Registrar Compra",
        type: "protected",
        element: CreateProduct,
        isAdmin: true,
        role: ["admin"],
        icon: PlusIcon,

        isHeader: false,
        showSidebar: true
      },
    ]
  },
  {
    name: "Categorias",
    type: "protected",
    //element: Content,
    isAdmin: false,
    role: ["user"],
    // icon: HomeIcon,

    isHeader: true,
    showSidebar: true,
    subRoutes: [
      {
        path: "/dashboard/create-categoria",
        name: "Registrar Categoria",
        type: "protected",
        element: Categoria,
        isAdmin: true,
        role: ["admin"],
        icon: Layers,

        isHeader: false,
        showSidebar: true
      },
    ]
  }
];

export default protectedRoutes;