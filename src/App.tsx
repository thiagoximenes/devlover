import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MemberLayout } from "@/components/layouts/MemberLayout";
import { AdminLayout } from "@/components/layouts/AdminLayout";

import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import SelectPlan from "./pages/SelectPlan";
import Checkout from "./pages/Checkout";
import MemberDashboard from "./pages/dashboard/MemberDashboard";
import ClientsPage from "./pages/dashboard/ClientsPage";
import ProjectsPage from "./pages/dashboard/ProjectsPage";
import ContractsPage from "./pages/dashboard/ContractsPage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import SubscriptionPage from "./pages/dashboard/SubscriptionPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminPlansPage from "./pages/admin/AdminPlansPage";
import AdminPaymentsPage from "./pages/admin/AdminPaymentsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />

            {/* Protected routes - requires auth */}
            <Route path="/select-plan" element={
              <ProtectedRoute>
                <SelectPlan />
              </ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />

            {/* Member dashboard - requires subscription */}
            <Route path="/dashboard" element={
              <ProtectedRoute requireSubscription>
                <MemberLayout />
              </ProtectedRoute>
            }>
              <Route index element={<MemberDashboard />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="contracts" element={<ContractsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="subscription" element={<SubscriptionPage />} />
            </Route>

            {/* Admin dashboard - requires admin role */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="plans" element={<AdminPlansPage />} />
              <Route path="payments" element={<AdminPaymentsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
