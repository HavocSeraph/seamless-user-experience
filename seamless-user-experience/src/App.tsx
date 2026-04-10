import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AuthCallback from "./pages/AuthCallback";
import VerifyEmailNotice from "./pages/VerifyEmailNotice";
import DashboardPage from "./pages/DashboardPage";
import MarketplacePage from "./pages/MarketplacePage";
import SkillDetailPage from "./pages/SkillDetailPage";
import WalletPage from "./pages/WalletPage";
import BountyBoardPage from "./pages/BountyBoardPage";
import SessionsPage from "./pages/SessionsPage";
import ClassroomPage from "./pages/ClassroomPage";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import AdminPanel from "./pages/AdminPanel";
import { Notifications } from "@/components/Notifications";
import { OnlinePresence } from "@/components/OnlinePresence";
import { Navbar } from "@/components/Navbar";
import { Outlet } from "react-router-dom";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const MainLayout = () => (
  <div className="min-h-screen bg-background flex flex-col pt-16">
    <Navbar isAuthenticated={true} />
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-4 bg-background border-border p-2 rounded-full shadow-lg backdrop-blur-md border px-4">
      <OnlinePresence userId="me" />
      <Notifications />
    </div>
    <main className="flex-1">
      <Outlet />
    </main>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailNotice />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/marketplace/:skillId" element={<SkillDetailPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/bounties" element={<BountyBoardPage />} />
            <Route path="/sessions" element={<SessionsPage />} />
            <Route path="/classroom/:sessionId" element={<ClassroomPage />} />
            <Route path="/profile/me" element={<ProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
