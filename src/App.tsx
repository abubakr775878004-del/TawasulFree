import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppContext, useAppStore } from '@/stores/appStore';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import UserRegistrationModal from '@/components/features/UserRegistrationModal';
import HomePage from '@/pages/HomePage';
import GamesPage from '@/pages/GamesPage';
import GamePlayPage from '@/pages/GamePlayPage';
import CompetitionsPage from '@/pages/CompetitionsPage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import ProfilePage from '@/pages/ProfilePage';
import AdminPage from '@/pages/AdminPage';
import NotFound from '@/pages/NotFound';

function AppContent() {
  const appState = useAppStore();

  return (
    <AppContext.Provider value={appState}>
      <BrowserRouter>
        <div className="min-h-screen bg-brand-dark flex flex-col">
          <Navbar />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/games" element={<GamesPage />} />
              <Route path="/games/:id" element={<GamePlayPage />} />
              <Route path="/competitions" element={<CompetitionsPage />} />
              <Route path="/competitions/:id" element={<CompetitionsPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />

          {/* Registration Modal */}
          {appState.showRegModal && <UserRegistrationModal />}

          {/* Toast notifications */}
          <Toaster
            position="top-center"
            richColors
            toastOptions={{
              style: {
                background: '#1F2937',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontFamily: 'Cairo, Tajawal, sans-serif',
                direction: 'rtl',
              },
            }}
          />
        </div>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default function App() {
  return <AppContent />;
}
