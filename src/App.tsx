import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppContext, useAppStore } from '@/stores/appStore';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import UserRegistrationModal from '@/components/features/UserRegistrationModal';
import BannerAd from '@/components/ui/BannerAd';
import HomePage from '@/pages/HomePage';
import GamesPage from '@/pages/GamesPage';
import GamePlayPage from '@/pages/GamePlayPage';
import CompetitionsPage from '@/pages/CompetitionsPage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import ProfilePage from '@/pages/ProfilePage';
import AdminPage from '@/pages/AdminPage';
import NotFound from '@/pages/NotFound';
import { handleUserLogin } from '@/userService';
import { supabase } from '@/supabaseClient';
import { storage } from '@/lib/storage';

function AppContent() {
  const appState = useAppStore();

  // 🟢 التحقق من حساب المستخدم المسجل وتحديث نقاطه أسبوعياً عند فتح الموقع
  useEffect(() => {
    const syncUserData = async () => {
      // المصدر الوحيد الآن لاسم المستخدم المحفوظ هو storage (بدل مفتاح منفصل لم يعد يُضبط)
      const savedName = storage.getUser()?.fullName;
      if (savedName) {
        // تحديث نقاط وتفاصيل المستخدم من Supabase أوتوماتيكياً، وتحديث حالة الواجهة فوراً
        const result = await handleUserLogin(savedName);
        if (result.success && result.user) {
          appState.setUser(result.user);
        }
      }
    };

    syncUserData();
  }, []);

  // 🟢 فحص وتفعيل الإرسال الآلي وتصفيات يوم الجمعة عبر تلجرام
  useEffect(() => {
    const checkAndResetWeekly = async () => {
      const today = new Date();
      const isFriday = today.getDay() === 5; // 5 يوافق يوم الجمعة
      
      const lastResetDate = localStorage.getItem("last_weekly_reset");
      const currentDateString = today.toISOString().split('T')[0];

      if (isFriday && lastResetDate !== currentDateString) {
        try {
          // التوكن لم يعد موجوداً في كود المتصفح إطلاقاً.
          // الإرسال الآن يمر عبر Supabase Edge Function التي تحتفظ بالتوكن كسرّ على السيرفر.
          // ملاحظة: للحل الجذري (عدم تكرار الرسالة لكل زائر)، يُفضّل جدولة هذه الدالة
          // عبر Supabase Cron بدل تشغيلها من useEffect، راجع التوصية رقم 7.
          const { error } = await supabase.functions.invoke('send-weekly-report');
          if (error) throw error;

          // حفظ تاريخ اليوم لضمان عدم تكرار العملية مرتين في نفس الجمعة على نفس الجهاز
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

          {/* البنر الإعلاني (HilltopAds Banner) */}
          <BannerAd />

          <Footer />

          {/* نافذة التسجيل بحساب جديد بالاسم الثلاثي الفريد */}
          {appState.showRegModal && <UserRegistrationModal />}

          {/* التنبيهات المنبثقة */}
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
