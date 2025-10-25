import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import OperatorManagement from "./pages/OperatorManagement";
import CallQueueMonitoring from "./pages/CallQueueMonitoring";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import CallHistory from "./pages/CallHistory";
import CallLogger from "./pages/CallLogger";
import Login from "./pages/Login";
// Connection status indicator is rendered inline in the dashboard header now

const queryClient = new QueryClient();

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const RedirectIfAuthenticated = ({ children }: { children: React.ReactNode }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    return <Navigate to="/dispatch" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* Connection status indicator moved into header */}
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/login" element={<RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>} />
          <Route path="/dispatch" element={<RequireAuth><Index /></RequireAuth>} />
          <Route path="/events" element={<RequireAuth><Events /></RequireAuth>} />
          <Route path="/events/:id" element={<RequireAuth><EventDetails /></RequireAuth>} />
          <Route path="/operators" element={<RequireAuth><OperatorManagement /></RequireAuth>} />
          <Route path="/queue" element={<RequireAuth><CallQueueMonitoring /></RequireAuth>} />
          <Route path="/history" element={<RequireAuth><CallHistory /></RequireAuth>} />
          <Route path="/logs" element={<RequireAuth><CallLogger /></RequireAuth>} />
          <Route path="/" element={<RequireAuth><Navigate to="/dispatch" replace /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;