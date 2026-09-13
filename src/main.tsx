import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import { AppErrorBoundary } from "./components/feedback/AppErrorBoundary";
import { ScrollToTop } from "./components/navigation/ScrollToTop";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AppErrorBoundary>
          <BrowserRouter>
            <ScrollToTop />
            <App />
          </BrowserRouter>
        </AppErrorBoundary>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);
