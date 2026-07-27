import { useState } from 'react';
import { X, Info, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import type { Announcement } from '@/types';

interface Props {
  announcements: Announcement[];
}

const TYPE_CONFIG = {
  info: {
    bg: 'bg-blue-500/15 border-blue-500/30',
    text: 'text-blue-300',
    icon: Info,
  },
  warning: {
    bg: 'bg-yellow-500/15 border-yellow-500/30',
    text: 'text-yellow-300',
    icon: AlertTriangle,
  },
  success: {
    bg: 'bg-brand-success/15 border-brand-success/30',
    text: 'text-brand-success',
    icon: CheckCircle,
  },
  urgent: {
    bg: 'bg-red-500/15 border-red-500/30',
    text: 'text-red-300',
    icon: Zap,
  },
};

export default function AnnouncementBanner({ announcements }: Props) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = announcements.filter((a) => a.isActive && !dismissed.has(a.id));

  if (visible.length === 0) return null;

  return (
    <div className="space-y-2">
      {visible.map((ann) => {
        const cfg = TYPE_CONFIG[ann.type];
        const Icon = cfg.icon;

        return (
          <div
            key={ann.id}
            className={`flex items-start gap-3 p-4 rounded-xl border ${cfg.bg} animate-fade-in`}
          >
            <Icon size={18} className={`${cfg.text} flex-shrink-0 mt-0.5`} />
            <div className="flex-1 min-w-0">
              <div className={`font-bold text-sm ${cfg.text}`}>{ann.title}</div>
              <div className="text-white/60 text-xs mt-0.5">{ann.content}</div>
            </div>
            <button
              onClick={() => setDismissed((s) => new Set([...s, ann.id]))}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
            >
              <X size={14} className="text-white/40" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
