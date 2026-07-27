import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Trophy, Gamepad2, Star, Home, User, Settings, LogOut } from 'lucide-react';
import { useApp } from '@/stores/appStore';
import logoImg from '@/assets/logo.png';

const NAV_ITEMS = [
  { path: '/', label: 'الرئيسية', icon: Home },
  { path: '/games', label: 'الألعاب', icon: Gamepad2 },
  { path: '/competitions', label: 'المسابقات', icon: Trophy },
  { path: '/leaderboard', label: 'المتصدرون', icon: Star },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, setShowRegModal, logout } = useApp();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-brand-dark/95 backdrop-blur-md border-b border-white/10">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img src={logoImg} alt="تواصل فري" className="w-10 h-10 rounded-xl object-cover" />
            <div>
              <span className="text-xl font-black gradient-text">تواصل</span>
              <span className="text-xl font-black text-white"> فري</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`nav-link text-sm ${isActive(path) ? 'text-brand-secondary bg-brand-secondary/10' : ''}`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>

          {/* User Area */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2 transition-all duration-200 min-h-[44px]"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center text-sm font-bold">
                    {user.fullName.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-right">
                    <div className="text-xs font-bold text-white leading-none">{user.fullName.split(' ')[0]}</div>
                    <div className="text-xs text-brand-success font-bold">{user.points.toLocaleString()} نقطة</div>
                  </div>
                </button>
                {profileOpen && (
                  <div className="absolute left-0 top-full mt-2 w-48 glass-card-dark border border-white/20 rounded-xl overflow-hidden shadow-xl z-50">
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-white/10 text-sm text-white transition-colors"
                    >
                      <User size={16} className="text-brand-secondary" />
                      ملفي الشخصي
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 hover:bg-white/10 text-sm text-white transition-colors"
                      >
                        <Settings size={16} className="text-brand-secondary" />
                        لوحة الإدارة
                      </Link>
                    )}
                    <hr className="border-white/10" />
                    <button
                      onClick={() => { logout(); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-500/10 text-sm text-red-400 transition-colors"
                    >
                      <LogOut size={16} />
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowRegModal(true)}
                className="btn-primary text-sm py-2 px-4"
              >
                <User size={16} />
                انضم الآن
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 py-4 space-y-1 animate-fade-in">
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(path)
                    ? 'text-brand-secondary bg-brand-secondary/10'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Settings size={18} />
                لوحة الإدارة
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {(profileOpen || menuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setProfileOpen(false); setMenuOpen(false); }}
        />
      )}
    </nav>
  );
}
