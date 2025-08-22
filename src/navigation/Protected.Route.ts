import Content from "@/modules/dashboard/screens/content";
import CreateProduct from "@/modules/products/screens/CreateProduct";
import ProductDetailScreen from "@/modules/products/screens/ProductDetailScreen";
import ProductListScreen from "@/modules/products/screens/ProductListScreen";
import CreatePurchase from "@/modules/purchases/screens/CreatePurchase";
import { BoxIcon, LayoutDashboardIcon, Package, ShoppingBag, Table2, Table2Icon, TableCellsMerge, UserCogIcon } from "lucide-react";
import type RouteType from "./RouteType";
// import CreateCategory from "@/modules/categories/screens/CreateCategory";
import TableCreateCategory from "@/modules/categories/components/TableCreateCategory";
import EditPurchase from "@/modules/purchases/screens/EditPurchase";
import PurchaseDetailScreen from "@/modules/purchases/screens/PurchaseDetailScreen";
import PurchaseListScreen from "@/modules/purchases/screens/PurchaseListScreen";
import CreateSaleScreen from "@/modules/sales/screens/createSaleScreen";
import SalesListScreen from "@/modules/sales/screens/salesListScreen";
import { UserDetailScreen } from "@/modules/users";
import UserListScreen from "@/modules/users/screens/UserListScreen";
import SaleDetailScreen from "@/modules/sales/screens/saleDetailScreen";
import QuotationListScreen from "@/modules/quotations/screens/quotationListScreen";

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
    name: "Usuarios",
    type: "protected",
    role: ["admin"],
    isHeader: true,
    showSidebar: true,
    // icon:BoxIcon,
    subRoutes: [
      {
        path: "/dashboard/user",
        name: "Listar Usuarios",
        type: "protected",
        element: UserListScreen,
        isAdmin: true,
        role: ["admin"],
        icon: UserCogIcon,

        isHeader: false,
        showSidebar: true
      },
      {
        path: "/dashboard/user/:nickname",
        name: "Detalle de Usuario",
        type: "protected",
        element: UserDetailScreen,
        isAdmin: true,
        role: ["admin"],
        icon: BoxIcon,

        isHeader: false,
        showSidebar: false,
        showInCommandPalette: false
      },
      // {
      //   path: "/dashboard/user/:iuserId/permisions",
      //   name: "Permisos de Usuario",
      //   type: "protected",
      //   element: UserPermissionsScreen,
      //   isAdmin: true,
      //   role: ["admin"],
      //   icon: BoxIcon,

      //   isHeader: false,
      //   showSidebar: false
      // },
    ]
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
        path: "/dashboard/create-product",
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
        showSidebar: false,
        showInCommandPalette: false
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
        path: "/dashboard/management-categories",
        name: "Gestionar categorias",
        type: "protected",
        element: TableCreateCategory,
        isAdmin: true,
        role: ["admin"],
        icon: TableCellsMerge,

        isHeader: false,
        showSidebar: true
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
      },
      {
        path: "/dashboard/list-purchases",
        name: "Listado de compras",
        type: "protected",
        element: PurchaseListScreen,
        isAdmin: true,
        role: ["admin"],
        icon: Package,

        isHeader: false,
        showSidebar: true
      },
      {
        path: "/dashboard/purchases/:purchaseId",
        name: "Detalle de compra",
        type: "protected",
        element: PurchaseDetailScreen,
        isAdmin: true,
        role: ["admin"],
        icon: Package,

        showInCommandPalette: false,
        isHeader: false,
        showSidebar: false
      },
      {
        path: "/dashboard/purchases/:purchaseId/editar",
        name: "Editar compra",
        type: "protected",
        element: EditPurchase,
        isAdmin: true,
        role: ["admin"],
        icon: Package,

        isHeader: false,
        showSidebar: false
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
        element: CreateSaleScreen,
        isAdmin: true,
        role: ["admin"],
        icon: ShoppingBag,

        isHeader: false,
        showSidebar: true
      },
      {
        path: "/dashboard/sales",
        name: "Lista de ventas",
        type: "protected",
        element: SalesListScreen,
        isAdmin: true,
        role: ["admin"],
        icon: Table2,

        isHeader: false,
        showSidebar: true
      },
      {
        path: "/dashboard/sales/:id",
        name: "Detalle de venta",
        type: "protected",
        element: SaleDetailScreen,
        isAdmin: true,
        role: ["admin"],
        icon: Package,
        isHeader: false,
        showSidebar: false,
        showInCommandPalette: false
      },
    ]
  },
  {
    name: "Cotizaciones",
    type: "protected",
    isAdmin: false,
    role: ["user"],
    isHeader: true,
    showSidebar: true,
    subRoutes: [
      // {
      //   path: "/dashboard/create-sale",
      //   name: "Registrar venta",
      //   type: "protected",
      //   element: CreateSaleScreen,
      //   isAdmin: true,
      //   role: ["admin"],
      //   icon: ShoppingBag,

      //   isHeader: false,
      //   showSidebar: true
      // },
      {
        path: "/dashboard/quotations",
        name: "Lista de cotizaciones",
        type: "protected",
        element: QuotationListScreen,
        isAdmin: true,
        role: ["admin"],
        icon: Table2,

        isHeader: false,
        showSidebar: true
      },
      // {
      //   path: "/dashboard/sales/:id",
      //   name: "Detalle de venta",
      //   type: "protected",
      //   element: SaleDetailScreen,
      //   isAdmin: true,
      //   role: ["admin"],
      //   icon: Package,
      //   isHeader: false,
      //   showSidebar: false,
      //   showInCommandPalette: false
      // },
    ]
  },
];

export default protectedRoutes;