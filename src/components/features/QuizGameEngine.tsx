import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Clock, Star, Trophy, RotateCcw, Play } from 'lucide-react';
import type { Game, QuizQuestion } from '@/types';
import { useApp } from '@/stores/appStore';
import { storage } from '@/lib/storage';
import { toast } from 'sonner';
import AdBanner from './AdBanner';

interface Props {
  game: Game;
  onClose?: () => void;
}

type Phase = 'intro' | 'playing' | 'result' | 'rewarded-ad';

export default function QuizGameEngine({ game, onClose }: Props) {
  const { user, refreshUser, setShowRegModal } = useApp();
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [attemptsLeft, setAttemptsLeft] = useState(game.maxAttempts);
  const [showRewardedAd, setShowRewardedAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);

  const questions: QuizQuestion[] = game.questions || [];

  const handleAnswer = useCallback(
    (idx: number) => {
      if (selected !== null) return;
      setSelected(idx);

      const correct = idx === questions[currentQ].correctIndex;
      const newAnswers = [...answers, correct];
      setAnswers(newAnswers);

      if (correct) {
        setScore((s) => s + questions[currentQ].points);
      }

      setTimeout(() => {
        if (currentQ + 1 < questions.length) {
          setCurrentQ((q) => q + 1);
          setSelected(null);
          setTimeLeft(15);
        } else {
          finishGame(newAnswers, score + (correct ? questions[currentQ].points : 0));
        }
      }, 1200);
    },
    [selected, currentQ, questions, answers, score]
  );

  const finishGame = (finalAnswers: boolean[], finalScore: number) => {
    if (user) {
      storage.addPoints(finalScore);
      storage.incrementGames();
      storage.saveSession({
        gameId: game.id,
        userId: user.id,
        score: finalScore,
        completedAt: new Date().toISOString(),
        pointsEarned: finalScore,
      });
      refreshUser();
    }
    setScore(finalScore);
    setPhase('result');
  };

  // Timer
  useEffect(() => {
    if (phase !== 'playing' || selected !== null) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleAnswer(-1);
          return 15;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, selected, handleAnswer]);

  // Rewarded ad countdown
  useEffect(() => {
    if (!showRewardedAd) return;
    const timer = setInterval(() => {
      setAdCountdown((t) => {
        if (t <= 1) {
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showRewardedAd]);

  const startGame = () => {
    if (!user) {
      setShowRegModal(true);
      return;
    }
    if (attemptsLeft <= 0) {
      toast.error('لقد استنفذت محاولاتك. شاهد إعلاناً للحصول على محاولة إضافية!');
      return;
    }
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setTimeLeft(15);
    setAnswers([]);
    setAttemptsLeft((a) => a - 1);
    setPhase('playing');
  };

  const claimReward = () => {
    if (!user) return;
    storage.addPoints(20);
    refreshUser();
    setAttemptsLeft((a) => a + 1);
    setShowRewardedAd(false);
    toast.success('حصلت على 20 نقطة إضافية ومحاولة جديدة! 🎉');
    setPhase('intro');
    setAdCountdown(5);
  };

  if (questions.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="text-4xl mb-4">🚧</div>
        <p className="text-white/60">هذه اللعبة قيد التطوير. تابعنا قريباً!</p>
      </div>
    );
  }

  // Intro
  if (phase === 'intro') {
    return (
      <div className="glass-card p-8 text-center animate-fade-in">
        <div className="text-6xl mb-4">🎮</div>
        <h2 className="text-2xl font-black text-white mb-2">{game.titleAr}</h2>
        <p className="text-white/50 mb-6">{game.description}</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-brand-secondary font-bold text-xl">{questions.length}</div>
            <div className="text-white/40 text-xs">سؤال</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-brand-success font-bold text-xl">{game.pointsPerGame}</div>
            <div className="text-white/40 text-xs">نقطة</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-brand-warning font-bold text-xl">{attemptsLeft}</div>
            <div className="text-white/40 text-xs">محاولة</div>
          </div>
        </div>

        <button onClick={startGame} className="btn-primary w-full text-lg py-4 mb-4">
          <Play size={20} fill="white" />
          ابدأ اللعب
        </button>

        {game.hasRewardedAd && attemptsLeft < game.maxAttempts && (
          <button
            onClick={() => setShowRewardedAd(true)}
            className="btn-secondary w-full text-sm"
          >
            🎬 شاهد إعلاناً واحصل على محاولة + 20 نقطة
          </button>
        )}
      </div>
    );
  }

  // Rewarded Ad
  if (showRewardedAd) {
    return (
      <div className="glass-card p-8 text-center animate-fade-in">
        <div className="text-4xl mb-4">🎬</div>
        <h3 className="text-white font-bold text-xl mb-2">مشاهدة إعلان مكافأة</h3>
        <p className="text-white/50 text-sm mb-6">شاهد هذا الإعلان القصير للحصول على محاولة إضافية و20 نقطة مجانية</p>

        <AdBanner location="rewarded" size="square" className="mb-6" />

        <div className="bg-brand-success/10 border border-brand-success/30 rounded-xl p-4 mb-6">
          <div className="text-brand-success font-bold">ستحصل على:</div>
          <div className="text-white mt-1">+20 نقطة + محاولة إضافية</div>
        </div>

        <button
          onClick={claimReward}
          disabled={adCountdown > 0}
          className="btn-success w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {adCountdown > 0 ? `انتظر ${adCountdown}s...` : '✓ احصل على مكافأتك'}
        </button>
      </div>
    );
  }

  // Playing
  if (phase === 'playing') {
    const q = questions[currentQ];
    const progress = ((currentQ) / questions.length) * 100;

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm text-white/60 mb-2">
            <span>سؤال {currentQ + 1} من {questions.length}</span>
            <span className={`flex items-center gap-1 font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-brand-secondary'}`}>
              <Clock size={14} />
              {timeLeft}s
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Time bar */}
          <div className="h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${timeLeft <= 5 ? 'bg-red-400' : 'bg-brand-success'}`}
              style={{ width: `${(timeLeft / 15) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="glass-card p-6">
          <h3 className="text-white font-bold text-xl text-center leading-relaxed">{q.question}</h3>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Star size={14} className="text-brand-warning" />
            <span className="text-brand-warning text-sm font-medium">{q.points} نقطة</span>
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {q.options.map((opt, idx) => {
            let style = 'glass-card hover:border-brand-secondary/50 cursor-pointer';
            if (selected !== null) {
              if (idx === q.correctIndex) {
                style = 'bg-brand-success/20 border-brand-success border';
              } else if (idx === selected && selected !== q.correctIndex) {
                style = 'bg-red-500/20 border-red-500 border';
              } else {
                style = 'glass-card opacity-50';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={selected !== null}
                className={`p-4 rounded-xl text-right transition-all duration-200 min-h-[44px] w-full border border-white/10 ${style}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    selected !== null && idx === q.correctIndex
                      ? 'bg-brand-success text-white'
                      : selected !== null && idx === selected && selected !== q.correctIndex
                      ? 'bg-red-500 text-white'
                      : 'bg-white/10 text-white/60'
                  }`}>
                    {selected !== null && idx === q.correctIndex ? (
                      <CheckCircle size={16} />
                    ) : selected !== null && idx === selected && selected !== q.correctIndex ? (
                      <XCircle size={16} />
                    ) : (
                      ['أ', 'ب', 'ج', 'د'][idx]
                    )}
                  </div>
                  <span className="text-white text-sm font-medium">{opt}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Current score */}
        <div className="text-center">
          <span className="points-badge mx-auto">
            <Star size={12} />
            النقاط الحالية: {score}
          </span>
        </div>
      </div>
    );
  }

  // Result
  const correctCount = answers.filter(Boolean).length;
  const percentage = Math.round((correctCount / questions.length) * 100);

  return (
    <div className="glass-card p-8 text-center animate-fade-in">
      <div className="text-6xl mb-4">
        {percentage >= 80 ? '🏆' : percentage >= 50 ? '🌟' : '💪'}
      </div>
      <h2 className="text-2xl font-black text-white mb-1">
        {percentage >= 80 ? 'ممتاز!' : percentage >= 50 ? 'جيد!' : 'حاول مرة أخرى!'}
      </h2>
      <p className="text-white/50 mb-6">
        أجبت على {correctCount} من {questions.length} أسئلة بشكل صحيح
      </p>

      {/* Score display */}
      <div className="bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 border border-brand-secondary/30 rounded-2xl p-6 mb-6">
        <div className="text-brand-secondary text-sm mb-1">النقاط المكتسبة</div>
        <div className="text-5xl font-black text-white flex items-center justify-center gap-2">
          <Star size={32} className="text-brand-warning" fill="currentColor" />
          {score}
        </div>
        {user && (
          <div className="text-brand-success text-sm mt-2">
            تمت إضافة النقاط إلى حسابك! إجمالي: {(user.points).toLocaleString()} نقطة
          </div>
        )}
      </div>

      {/* Answer breakdown */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-brand-success/10 border border-brand-success/20 rounded-xl p-3">
          <div className="text-brand-success font-bold text-xl">{correctCount}</div>
          <div className="text-white/40 text-xs">صحيح</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          <div className="text-red-400 font-bold text-xl">{questions.length - correctCount}</div>
          <div className="text-white/40 text-xs">خطأ</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <div className="text-white font-bold text-xl">{percentage}%</div>
          <div className="text-white/40 text-xs">دقة</div>
        </div>
      </div>

      <div className="space-y-3">
        {attemptsLeft > 0 ? (
          <button onClick={startGame} className="btn-primary w-full">
            <RotateCcw size={16} />
            العب مرة أخرى ({attemptsLeft} محاولة)
          </button>
        ) : (
          game.hasRewardedAd && (
            <button onClick={() => setShowRewardedAd(true)} className="btn-secondary w-full">
              🎬 شاهد إعلاناً للحصول على محاولة جديدة
            </button>
          )
        )}
        {onClose && (
          <button onClick={onClose} className="btn-secondary w-full">
            <Trophy size={16} />
            العودة للألعاب
          </button>
        )}
      </div>
    </div>
  );
}
