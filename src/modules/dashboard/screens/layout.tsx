import type { ReactNode } from "react"
import TopNav from "./top-nav"
import { useEffect, useState } from "react"
import Sidebar from "./sidebar"
import CartSidebar from "@/modules/shoppingCart/components/CartSidebar"
import { useCartUiStore } from "@/modules/shoppingCart/store/cartUiStore"
interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { isOpen, close, toggle } = useCartUiStore()
  const [mounted, setMounted] = useState(false)
  const [isSidebarMenuOpen, setIsSidebarMenuOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024; // md breakpoint
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarMenuOpen(false);
      }
      else {
        setIsSidebarMenuOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);

    // Check on initial load
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleNavigation = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarMenuOpen(false);
    }
  }
  const handleToogleSidebarMenu = () => {
    setIsSidebarMenuOpen(!isSidebarMenuOpen);
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className={`flex h-screen`}>
      <Sidebar
        handleNavigation={handleNavigation}
        isSidebarMenuOpen={isSidebarMenuOpen}
      />
      <div className="w-full lg:w-10/12 flex flex-1 flex-col">
        <header className="h-16 border-b border-gray-200">
          <TopNav
            handleToogleSidebarMenu={handleToogleSidebarMenu}
            isSidebarMenuOpen={isSidebarMenuOpen}
            onOpenCartChange={toggle}
          />
        </header>
        <main
          id="main-scroll-container"
          className="flex-1 overflow-auto p-2  bg-gray-50">{children}</main>
      </div>
      <CartSidebar
        open={isOpen}
        onOpenChange={close}
      />
    </div>
  )
}
