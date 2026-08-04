import { Link } from 'react-router-dom';
import { Phone, Wifi, Shield, Star } from 'lucide-react';
import { CONTACT_NUMBER, SITE_NAME } from '@/constants/data';
import logoImg from '@/assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-black/40 border-t border-white/10 mt-16">
      {/* Ad slot - footer */}
      <div className="ad-container">
        <div className="ad-slot h-16 mx-4 my-4 rounded-xl">
          <span className="text-xs text-white/20">مساحة إعلانية 728×90</span>
        </div>
      </div>

      <div className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={logoImg} alt={SITE_NAME} className="w-10 h-10 rounded-xl object-cover" />
              <div>
                <span className="text-xl font-black gradient-text">تواصل</span>
                <span className="text-xl font-black text-white"> فري</span>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              منصة ترفيهية سحابية مجانية للمستخدمين المتصلين بشبكة الواي فاي المحلية.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'الرئيسية' },
                { to: '/games', label: 'الألعاب' },
                { to: '/competitions', label: 'المسابقات' },
                { to: '/leaderboard', label: 'المتصدرون' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-white/50 hover:text-brand-secondary text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-bold text-white mb-4">مميزات المنصة</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li className="flex items-center gap-2">
                <Wifi size={14} className="text-brand-secondary flex-shrink-0" />
                وصول مجاني عبر الشبكة المحلية
              </li>
              <li className="flex items-center gap-2">
                <Star size={14} className="text-brand-warning flex-shrink-0" />
                جوائز ونقاط أسبوعية
              </li>
              <li className="flex items-center gap-2">
                <Shield size={14} className="text-brand-success flex-shrink-0" />
                نظام نقاط آمن وموثوق
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-4">تواصل معنا</h4>
            <div className="space-y-3">
              <a
                href={`tel:${CONTACT_NUMBER}`}
                className="flex items-center gap-2 text-brand-secondary hover:text-white transition-colors text-sm"
              >
                <Phone size={16} />
                {CONTACT_NUMBER}
              </a>
              <p className="text-white/40 text-xs leading-relaxed">
                للتواصل بشأن الجوائز والاستفسارات يرجى الاتصال على الرقم أعلاه.
              </p>
            </div>
          </div>
        </div>

        <hr className="border-white/10 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <p>© 2026 {SITE_NAME}. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="hover:text-white/60 transition-colors">لوحة الإدارة</Link>
            <span>تصميم وتطوير منصة تواصل</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
