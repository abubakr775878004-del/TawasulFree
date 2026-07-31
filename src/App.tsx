import { useEffect } from 'react';
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

  // فحص وتفعيل الإرسال الآلي والتصفير يوم الجمعة
  useEffect(() => {
    const checkAndResetWeekly = async () => {
      const today = new Date();
      const isFriday = today.getDay() === 5; // 5 يوافق يوم الجمعة
      
      const lastResetDate = localStorage.getItem("last_weekly_reset");
      const currentDateString = today.toISOString().split('T')[0];

      if (isFriday && lastResetDate !== currentDateString) {
        try {
          const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
          const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

          if (!botToken || !chatId) return;

          // رسالة تقرير الجمعة والابهار الآلي عبر تلجرام
          const message = "🏆 *تقرير الجمعة الآلي: أبطال أسبوع شبكة TawasulNet* 🏆\n\nتم تصفير العدادات، وبدأت منافسة أسبوع جديد كلياً! بالتوفيق للجميع 🚀";
          
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "Markdown" }),
          });

          // حفظ تاريخ اليوم لضمان عدم تكرار العملية مرتين في نفس الجمعة
          localStorage.setItem("last_weekly_reset", currentDateString);
          console.log("تم إرسال تقرير الجمعة الآلي بنجاح!");
        } catch (error) {
          console.error("Error in automatic weekly task:", error);
        }
      }
    };

    checkAndResetWeekly();
  }, []);

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
