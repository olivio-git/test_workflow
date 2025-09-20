import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import Navigation from "./navigation/Navigation.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/atoms/tooltip.tsx";
// import { Toaster as Sonner } from "./components/atoms/sonner.tsx";
import { Toaster } from "./components/atoms/toaster.tsx";
import { HotkeysProvider } from "react-hotkeys-hook";
import "@/config/zodI18nConfig.ts"
import { queryClient } from "./lib/reactQueryConfig.ts";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <HotkeysProvider initiallyActiveScopes={["default", "esc-key"]}>
      <TooltipProvider>
        <Toaster />
        {/* <Sonner /> */}
        <BrowserRouter>
          {/* <SidebarProvider> */}
            <Navigation />
          {/* </SidebarProvider> */}
        </BrowserRouter>
      </TooltipProvider>
    </HotkeysProvider>
  </QueryClientProvider>
);
