import type { ReactNode } from "react"
import TopNav from "./top-nav"
import { useEffect, useState } from "react"
import CartSidebar from "@/modules/shoppingCart/components/CartSidebar"
import { useCartUiStore } from "@/modules/shoppingCart/store/cartUiStore"
import { useHotkeys } from "react-hotkeys-hook"
import AppSidebar from "./appSidebar"
import { SidebarInset, SidebarProvider } from "@/components/atoms/sidebar"
interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { isOpen, close, toggle, open } = useCartUiStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useHotkeys('alt+c', () => {
    if (!isOpen) open();
  }, {
    enabled: !isOpen
  });

  if (!mounted) {
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <header className="h-16 border-b border-gray-200 sticky top-0 z-10">
          <TopNav
            onOpenCartChange={toggle}
          />
        </header>
        <div
          id="main-scroll-container"
          className="flex-1 overflow-auto p-2 bg-gray-50">
          {children}
        </div>
      </SidebarInset>
      <CartSidebar
        open={isOpen}
        onOpenChange={close}
      />
    </SidebarProvider>
  )
}
