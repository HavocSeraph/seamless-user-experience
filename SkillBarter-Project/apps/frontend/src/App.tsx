import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MarketplacePage } from './pages/MarketplacePage';
import { WalletPage } from './pages/WalletPage';
import { VideoSessionPage } from './pages/VideoSessionPage';

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 sticky top-0 z-50">
        <div className="container mx-auto flex gap-6 items-center">
          <Link to="/" className="text-xl font-bold text-primary">SkillBarter</Link>
          <div className="flex gap-4">
            <Link to="/marketplace" className="text-sm font-medium hover:text-primary">Marketplace</Link>
            <Link to="/wallet" className="text-sm font-medium hover:text-primary">Wallet</Link>
          </div>
        </div>
      </nav>
      <main>
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout><div className="p-8 text-center text-3xl font-bold">Welcome to SkillBarter!</div></Layout>} />
          <Route path="/marketplace" element={<Layout><MarketplacePage /></Layout>} />
          <Route path="/wallet" element={<Layout><WalletPage /></Layout>} />
          {/* Note: Video session might not use Layout to take up full screen */}
          <Route path="/session/:sessionId" element={<VideoSessionPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
