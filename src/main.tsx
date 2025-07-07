import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import Navigation from "./navigation/Navigation.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Navigation />
    </QueryClientProvider>
  </BrowserRouter>
);
