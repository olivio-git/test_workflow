import type RouteType from "./RouteType";
import Content from "@/modules/dashboard/screens/content";
import { BoxIcon, Layers, LayoutDashboardIcon, Package, ShoppingBag, Table2Icon, TableCellsMerge } from "lucide-react";
import CreateProduct from "@/modules/products/screens/CreateProduct";
import ProductListScreen from "@/modules/products/screens/ProductListScreen";
import ProductDetailScreen from "@/modules/products/screens/ProductDetailScreen";
import CreatePurchase from "@/modules/purchases/screens/CreatePurchase";
// import CreateCategory from "@/modules/categories/screens/CreateCategory";
import TableCreateCategory from "@/modules/categories/components/TableCreateCategory";
import CreateSale from "@/modules/sales/screens/createSale";

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
        path: "/dashboard/productos/:id",
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
      // {
      //   path: "/dashboard/create-categoria",
      //   name: "Registrar Categoria",
      //   type: "protected",
      //   element: CreateCategory,
      //   isAdmin: true,
      //   role: ["admin"],
      //   icon: Layers,

      //   isHeader: false,
      //   showSidebar: true
      // },
      {
        path:"/dashboard/management-categories",
        name:"Gestionar categorias",
        type:"protected",
        element:TableCreateCategory,
        isAdmin:true,
        role:["admin"],
        icon:TableCellsMerge,

        isHeader:false,
        showSidebar:true
      }
    ]
  },
  {
    name: "Compras",
    type: "protected",
    isAdmin: false,
    role: ["user"],
    isHeader: true,
    showSidebar: true,
    subRoutes: [
      {
        path: "/dashboard/create-purchase",
        name: "Registrar compra",
        type: "protected",
        element: CreatePurchase,
        isAdmin: true,
        role: ["admin"],
        icon: ShoppingBag,

        isHeader: false,
        showSidebar: true
      }
    ]
  },
  {
    name: "Ventas",
    type: "protected",
    isAdmin: false,
    role: ["user"],
    isHeader: true,
    showSidebar: true,
    subRoutes: [
      {
        path: "/dashboard/create-sale",
        name: "Registrar venta",
        type: "protected",
        element: CreateSale,
        isAdmin: true,
        role: ["admin"],
        icon: ShoppingBag,

        isHeader: false,
        showSidebar: true
      }
    ]
  }
];

export default protectedRoutes;