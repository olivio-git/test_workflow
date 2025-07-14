import type RouteType from "./RouteType";
import Content from "@/modules/dashboard/screens/content";
import { BoxIcon, LayoutDashboardIcon, Package, PlusIcon, Table2Icon } from "lucide-react";
import CreateProduct from "@/modules/products/screens/CreateProduct";
import ProductListScreen from "@/modules/products/screens/ProductListScreen";
import ProductDetailScreen from "@/modules/products/screens/ProductDetailScreen";

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
        name: "Crear Producto",
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
    path: "/dashboard/compras",
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

  // // Ventas
  // {
  //   path: "/dashboard/ventas",
  //   name: "Ventas",
  //   type: "protected",
  //   //element: SaleList,
  //   isAdmin: true,
  //   role: ["admin"],
  //   icon: DollarSignIcon
  // },
  // {
  //   path: "/dashboard/ventas/crear",
  //   name: "Registrar Venta",
  //   type: "protected",
  //   //element: CreateSale,
  //   isAdmin: true,
  //   role: ["admin"],
  //   icon: PlusIcon
  // },

  // // Clientes
  // {
  //   path: "/dashboard/clientes",
  //   name: "Clientes",
  //   type: "protected",
  //   //element: ClientList,
  //   isAdmin: true,
  //   role: ["admin"],
  //   icon: UsersIcon
  // },
  // {
  //   path: "/dashboard/clientes/crear",
  //   name: "Registrar Cliente",
  //   type: "protected",
  //   //element: CreateClient,
  //   isAdmin: true,
  //   role: ["admin"],
  //   icon: PlusIcon
  // },

  // // Proveedores
  // {
  //   path: "/dashboard/proveedores",
  //   name: "Proveedores",
  //   type: "protected",
  //   //element: SupplierList,
  //   isAdmin: true,
  //   role: ["admin"],
  //   icon: StoreIcon
  // },
  // {
  //   path: "/dashboard/proveedores/crear",
  //   name: "Registrar Proveedor",
  //   type: "protected",
  //   //element: CreateSupplier,
  //   isAdmin: true,
  //   role: ["admin"],
  //   icon: PlusIcon
  // },

  // // Almacenes
  // {
  //   path: "/dashboard/almacenes",
  //   name: "Almacenes",
  //   type: "protected",
  //   //element: WarehouseList,
  //   isAdmin: true,
  //   role: ["admin"],
  //   icon: StoreIcon
  // },
  // {
  //   path: "/dashboard/almacenes/crear",
  //   name: "Crear Almacén",
  //   type: "protected",
  //   //element: CreateWarehouse,
  //   isAdmin: true,
  //   role: ["admin"],
  //   icon: PlusIcon
  // },

  // // Usuarios
  // {
  //   path: "/dashboard/usuarios",
  //   name: "Usuarios",
  //   type: "protected",
  //   //element: UserList,
  //   isAdmin: true,
  //   role: ["admin"],
  //   icon: UserCogIcon
  // },
  // {
  //   path: "/dashboard/usuarios/crear",
  //   name: "Registrar Usuario",
  //   type: "protected",
  //   //element: CreateUser,
  //   isAdmin: true,
  //   role: ["admin"],
  //   icon: PlusIcon
  // },

  // // Reportes
  // {
  //   path: "/dashboard/reportes",
  //   name: "Reportes",
  //   type: "protected",
  //   //element: ReportScreen,
  //   isAdmin: true,
  //   role: ["admin"],
  //   icon: BarChart3Icon
  // }
];

export default protectedRoutes;