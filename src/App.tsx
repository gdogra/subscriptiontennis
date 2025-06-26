import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import Login from '@/components/Login';
import AdminDashboard from '@/components/AdminDashboard';
import PlayerDashboard from '@/components/PlayerDashboard';
import FAQ from '@/components/FAQ';
import UserGuide from '@/components/UserGuide';
import ChatBotWidget from '@/components/ChatBotWidget';
import OnAuthSuccess from '@/pages/OnAuthSuccess';
import ResetPassword from '@/pages/ResetPassword';
import './App.css';

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const { user, loading, error } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-id="i7kpnbsup" data-path="src/App.tsx">
        <div className="text-center" data-id="6hk70ahv5" data-path="src/App.tsx">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto" data-id="7isrjzcpf" data-path="src/App.tsx"></div>
          <p className="mt-4 text-gray-600" data-id="f29rjh4c7" data-path="src/App.tsx">Loading Dashboard...</p>
        </div>
      </div>);

  }

  // Show error state with retry option
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-id="0ak83zilt" data-path="src/App.tsx">
        <div className="text-center" data-id="u0ktuy4c5" data-path="src/App.tsx">
          <div className="text-red-600 mb-4" data-id="ktqid3clv" data-path="src/App.tsx">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-id="262drt5nq" data-path="src/App.tsx">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" data-id="j5e9q44xe" data-path="src/App.tsx" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2" data-id="4fb5sbsqi" data-path="src/App.tsx">Connection Error</h2>
          <p className="text-gray-600 mb-4" data-id="2mw0en9tu" data-path="src/App.tsx">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700" data-id="bvat9m7bw" data-path="src/App.tsx">
            Retry
          </button>
        </div>
      </div>);

  }

  // Show login if no user
  if (!user) {
    return <Login data-id="1zenfn1d5" data-path="src/App.tsx" />;
  }

  // Determine dashboard based on user email (admin check)
  const isAdmin = user.Email?.toLowerCase().includes('admin') || user.email?.toLowerCase().includes('admin');

  return (
    <div data-id="d50n11mh6" data-path="src/App.tsx">
      {isAdmin ? <AdminDashboard data-id="dq27f8f19" data-path="src/App.tsx" /> : <PlayerDashboard data-id="oceze9rxu" data-path="src/App.tsx" />}
    </div>);

};

function App() {
  return (
    <QueryClientProvider client={queryClient} data-id="5x399dpf7" data-path="src/App.tsx">
      <TooltipProvider data-id="c0zrhec9t" data-path="src/App.tsx">
        <Router data-id="0sk48nz2g" data-path="src/App.tsx">
          <AuthProvider data-id="j1qr4zh88" data-path="src/App.tsx">
            <Routes data-id="afkl52ute" data-path="src/App.tsx">
              <Route path="/" element={<AppContent data-id="xmzq93w38" data-path="src/App.tsx" />} data-id="5r690eaiw" data-path="src/App.tsx" />
              <Route path="/onauthsuccess" element={<OnAuthSuccess data-id="r1xjyrkgk" data-path="src/App.tsx" />} data-id="lq2bn09f3" data-path="src/App.tsx" />
              <Route path="/resetpassword" element={<ResetPassword data-id="ln8xouqym" data-path="src/App.tsx" />} data-id="fcli6usbi" data-path="src/App.tsx" />
              <Route path="/faq" element={<FAQ data-id="ostbmwb63" data-path="src/App.tsx" />} data-id="rdgwqc29v" data-path="src/App.tsx" />
              <Route path="/guide" element={<UserGuide data-id="81ce7jsjs" data-path="src/App.tsx" />} data-id="v1xe1iyva" data-path="src/App.tsx" />
            </Routes>
            <ChatBotWidget data-id="gzg93k0py" data-path="src/App.tsx" />
            <Toaster data-id="8umk8tj6y" data-path="src/App.tsx" />
          </AuthProvider>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>);

}

export default App;