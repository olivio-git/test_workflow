import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import Navigation from "./navigation/Navigation.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/atoms/tooltip.tsx";
// import { Toaster as Sonner } from "./components/atoms/sonner.tsx";
import { Toaster } from "./components/atoms/toaster.tsx";
import { HotkeysProvider } from "react-hotkeys-hook";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <HotkeysProvider initiallyActiveScopes={["default", "esc-key"]}>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          {/* <Sonner /> */}
          <Navigation />
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </HotkeysProvider>
);
