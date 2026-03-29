import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MarketplacePage } from './pages/MarketplacePage';
import { WalletPage } from './pages/WalletPage';
import { VideoSessionPage } from './pages/VideoSessionPage';
import { DashboardPage } from './pages/DashboardPage';

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex justify-between items-center px-4 max-w-6xl">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-600/30">S</div>
             <Link to="/" className="text-2xl font-extrabold tracking-tight text-white hover:opacity-80 transition-opacity">SkillBarter</Link>
          </div>
          <div className="hidden md:flex gap-8 items-center bg-gray-100 dark:bg-gray-900/80 px-8 py-2.5 rounded-full border border-gray-200 dark:border-gray-800 shadow-inner">
            <Link to="/marketplace" className="text-sm font-semibold text-gray-400 hover:text-indigo-400 transition-colors">Marketplace</Link>
            <Link to="/dashboard" className="text-sm font-semibold text-gray-400 hover:text-indigo-400 transition-colors">Dashboard</Link>
            <Link to="/wallet" className="text-sm font-semibold text-gray-400 hover:text-indigo-400 transition-colors">Wallet</Link>              <Link to="/admin" className="text-sm font-semibold text-red-500 hover:text-red-400 transition-colors">Admin</Link>          </div>
          <div className="flex items-center gap-4">
             <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-800 border border-gray-600 flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-all shadow-md">
               <span className="text-sm font-bold text-gray-200">ME</span>
             </div>
          </div>
        </div>
      </nav>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

import { AdminDashboardPage } from './pages/AdminDashboardPage';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout><div className="p-8 text-center text-3xl font-bold">Welcome to SkillBarter!</div></Layout>} />
          <Route path="/marketplace" element={<Layout><MarketplacePage /></Layout>} />
          <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
          <Route path="/wallet" element={<Layout><WalletPage /></Layout>} />            <Route path="/admin" element={<Layout><AdminDashboardPage /></Layout>} />          {/* Note: Video session might not use Layout to take up full screen */}
          <Route path="/session/:sessionId" element={<VideoSessionPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
export default App;