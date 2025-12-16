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
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
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
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const HomeRedirect = () => {
  const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const shiftStr = typeof window !== 'undefined' ? localStorage.getItem('shift_data') : null;
  let to = '/dispatch';
  try {
    const user = userStr ? JSON.parse(userStr) : null;
    const shift = shiftStr ? JSON.parse(shiftStr) : null;
    const type = (user?.type || user?.role || '').toString().toLowerCase();
    const status = typeof shift?.status === 'number' ? shift.status : undefined;

    if (type === 'admin') {
      to = '/admin-dashboard';
    } else if (status === 2) {
      to = '/events';
    } else {
      to = '/dispatch';
    }
  } catch {}

  return <Navigate to={to} replace />;
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
          <Route path="/admin-login" element={<RedirectIfAuthenticated><AdminLogin /></RedirectIfAuthenticated>} />
          <Route path="/admin-dashboard" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
          <Route path="/dispatch" element={<RequireAuth><Index /></RequireAuth>} />
          <Route path="/events" element={<RequireAuth><Events /></RequireAuth>} />
          <Route path="/events/:id" element={<RequireAuth><EventDetails /></RequireAuth>} />
          <Route path="/operators" element={<RequireAuth><OperatorManagement /></RequireAuth>} />
          <Route path="/queue" element={<RequireAuth><CallQueueMonitoring /></RequireAuth>} />
          <Route path="/history" element={<RequireAuth><CallHistory /></RequireAuth>} />
          <Route path="/logs" element={<RequireAuth><CallLogger /></RequireAuth>} />
          <Route path="/" element={<RequireAuth><HomeRedirect /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;