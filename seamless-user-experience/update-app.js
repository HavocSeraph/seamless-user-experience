const fs = require('fs');
const filePath = 'C:/Users/SANDIP/Documents/JAVA LEC DEMO (MODULE 5)/frontend/seamless-user-experience/seamless-user-experience/src/App.tsx';

let content = fs.readFileSync(filePath, 'utf8');

content = content.replace('import AdminPage from "./pages/AdminPage";', 
\import AdminPanel from "./pages/AdminPanel";
import { Notifications } from "@/components/Notifications";
import { OnlinePresence } from "@/components/OnlinePresence";
import { Navbar } from "@/components/Navbar";
import { Outlet } from "react-router-dom";\);

content = content.replace('const App = () => (', 
\const MainLayout = () => (
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

const App = () => (\);

content = content.replace(/<Routes>[\\s\\S]*?<\\/Routes>/,
\<Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
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
        </Routes>\);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated successfully");
