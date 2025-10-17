import React, { useState, useContext, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { FiX, FiRefreshCw, FiChevronLeft, FiChevronRight, FiZap, FiCheck } from 'react-icons/fi';
import { FaHandPointer } from 'react-icons/fa';
import { LanguageContext } from '../App';
import { azkar as zikrList } from '../data/azkar';
import type { AzkarProgress } from '../types';
import { achievements } from '../data/achievements';
import AchievementToast from './AchievementToast';

const backdrop: Variants = {
  visible: { opacity: 1, transition: { duration: 0.5 } },
  hidden: { opacity: 0, transition: { duration: 0.5 } },
};

const modal: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 25, delay: 0.2 } 
  },
};

const zikrVariants: Variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0,
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? '100%' : '-100%',
        opacity: 0,
    }),
};

// --- Web Audio API for sound feedback ---
const createAudioContext = () => {
    if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
        return new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return null;
};

const playChime = (audioContext: AudioContext | null) => {
    if (!audioContext || audioContext.state === 'suspended') {
        audioContext?.resume();
    }
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
};

// --- Date helpers for streak ---
const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
};

const isYesterday = (d1: Date, d2: Date) => {
    const yesterday = new Date(d2);
    yesterday.setDate(yesterday.getDate() - 1);
    return isSameDay(d1, yesterday);
};

const initialProgress: AzkarProgress = {
    counts: new Array(zikrList.length).fill(0),
    totalCounts: {},
    unlockedAchievements: [],
    streak: 0,
    lastVisit: new Date().toISOString()
};

interface AzkarProps {
    onClose: () => void;
}

const Azkar: React.FC<AzkarProps> = ({ onClose }) => {
  const { t, language } = useContext(LanguageContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState<AzkarProgress>(initialProgress);
  const [showCompleteShockwave, setShowCompleteShockwave] = useState(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState<string | null>(null);
  const [swipeDirection, setSwipeDirection] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false); // For auto-pagination
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    audioContextRef.current = createAudioContext();
  }, []);

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('azkarProgress');
      const today = new Date();
      let newProgress: AzkarProgress = { ...initialProgress, streak: 1, lastVisit: today.toISOString() };

      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        
        if (Array.isArray(parsed)) { 
            newProgress.counts = parsed;
        } else {
            newProgress = { ...newProgress, ...parsed };
        }

        const lastVisitDate = new Date(newProgress.lastVisit);
        
        if (isYesterday(lastVisitDate, today)) {
            newProgress.streak = (newProgress.streak || 0) + 1;
        } else if (!isSameDay(lastVisitDate, today)) {
            newProgress.streak = 1; 
        }
        newProgress.lastVisit = today.toISOString();
      }
      setProgress(newProgress);
    } catch (error) {
        console.error("Failed to load Azkar progress from localStorage", error);
        setProgress({...initialProgress, streak: 1, lastVisit: new Date().toISOString()});
    }
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem('azkarProgress', JSON.stringify(progress));
    } catch (error) {
        console.error("Failed to save Azkar progress to localStorage", error);
    }
  }, [progress]);
  
  const currentZikr = zikrList[currentIndex];
  const currentCount = progress.counts[currentIndex] || 0;
  
  const paginate = useCallback((indexChange: number) => {
    setIsCompleting(false);
    setSwipeDirection(indexChange);
    setCurrentIndex(prev => (prev + indexChange + zikrList.length) % zikrList.length);
  }, []);
  
  useEffect(() => {
    if (isCompleting) {
        const timer = setTimeout(() => {
            paginate(1);
        }, 1200);
        return () => clearTimeout(timer);
    }
  }, [isCompleting, paginate]);

  const handleCount = () => {
    if (currentCount >= currentZikr.targetCount) return;
    
    playChime(audioContextRef.current);

    const newProgress: AzkarProgress = { ...progress };
    newProgress.counts = [...progress.counts];
    newProgress.counts[currentIndex]++;
    newProgress.totalCounts = { ...progress.totalCounts };
    newProgress.totalCounts[currentZikr.key] = (newProgress.totalCounts[currentZikr.key] || 0) + 1;

    for (const achievement of achievements) {
        if (!newProgress.unlockedAchievements.includes(achievement.id) && achievement.check(newProgress)) {
            newProgress.unlockedAchievements = [...newProgress.unlockedAchievements, achievement.id];
            setUnlockedAchievement(achievement.id);
        }
    }
    
    setProgress(newProgress);
    
    if (newProgress.counts[currentIndex] === currentZikr.targetCount) {
      setShowCompleteShockwave(true);
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      setIsCompleting(true);
    } else {
      if (navigator.vibrate) navigator.vibrate(20);
    }
  };

  const resetCount = useCallback(() => {
    setProgress(p => {
        const newCounts = [...p.counts];
        if (newCounts[currentIndex] > 0) {
          if (navigator.vibrate) navigator.vibrate(50);
        }
        newCounts[currentIndex] = 0;
        return { ...p, counts: newCounts };
    });
  }, [currentIndex]);
  
  const progressPercentage = (currentCount / currentZikr.targetCount) * 100;
  
  const zikrKey = `azkar${currentZikr.key.charAt(0).toUpperCase() + currentZikr.key.slice(1)}` as keyof typeof t;
  const zikrText = t[zikrKey];
  const zikrTranslationKey = `${String(zikrKey)}Translation` as keyof typeof t;
  const zikrTranslation = t[zikrTranslationKey];

  const zikrFontSizeClass = zikrText.length > 70 ? 'text-lg md:text-xl' : zikrText.length > 40 ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl';
  const translationFontSizeClass = zikrText.length > 70 ? 'text-sm' : 'text-lg';
  
  const prevAction = () => paginate(-1);
  const nextAction = () => paginate(1);

  return (
    <motion.div
        variants={backdrop}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
    >
      <motion.div
        variants={modal}
        className="relative w-full max-w-md h-[95vh] max-h-[700px] bg-zinc-900 text-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-zinc-800"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-zinc-800 z-10 flex-shrink-0">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-zinc-200">{t.azkarTitle}</h2>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-sky-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow flex-shrink-0">
                      <FiZap size={14} />
                      <span className="whitespace-nowrap">{progress.streak} {t.azkarStreak}</span>
                    </div>
                    <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white rounded-full transition-colors">
                        <FiX size={24} />
                    </button>
                </div>
            </div>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center text-center relative w-full overflow-hidden px-6">
            <AnimatePresence initial={false} custom={swipeDirection}>
                <motion.div
                    key={currentIndex}
                    custom={swipeDirection}
                    variants={zikrVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipePower = offset.x * velocity.x;
                        if (swipePower < -1000) { nextAction(); } 
                        else if (swipePower > 1000) { prevAction(); }
                    }}
                    className="w-full absolute"
                >
                    <p className={`${zikrFontSizeClass} font-semibold mb-2 ${language === 'ar' ? 'font-serif leading-relaxed' : ''}`}>{zikrText}</p>
                    <p className={`${translationFontSizeClass} text-zinc-400 opacity-80`}>{zikrTranslation}</p>
                </motion.div>
            </AnimatePresence>
        </div>
        
        <div className="relative flex justify-center items-center my-8 flex-shrink-0">
            <AnimatePresence>
              {showCompleteShockwave && (
                <motion.div
                  className="absolute w-44 h-44 rounded-full border-4 border-sky-400"
                  initial={{ scale: 0.8, opacity: 1 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  onAnimationComplete={() => setShowCompleteShockwave(false)}
                />
              )}
            </AnimatePresence>
            
            <svg className="absolute w-60 h-60" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" className="stroke-white/10" strokeWidth="3" fill="none" />
                <motion.circle cx="50" cy="50" r="45" stroke="#0ea5e9" strokeWidth="3" fill="none" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - progressPercentage / 100} initial={{ strokeDashoffset: 1 }} animate={{ strokeDashoffset: 1 - progressPercentage / 100 }} transition={{ duration: 0.5 }} transform="rotate(-90 50 50)" />
            </svg>

            <motion.button 
                onClick={handleCount}
                className="relative w-44 h-44 rounded-full flex flex-col justify-center items-center select-none focus:outline-none group bg-zinc-800 border border-zinc-700 shadow-xl"
                whileTap={{ scale: 0.95 }}
            >
                <AnimatePresence mode="wait">
                    {currentCount >= currentZikr.targetCount ? (
                        <motion.div
                            key="check"
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 90 }}
                            transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 15 }}
                        >
                            <FiCheck size={72} className="text-green-500" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="counter"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="flex flex-col justify-center items-center"
                        >
                            <span className="text-6xl font-bold tracking-tighter">{currentCount}</span>
                            <span className="text-zinc-400">/ {currentZikr.targetCount}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.button>
            <AnimatePresence>
                {currentCount === 0 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }} exit={{ opacity: 0, y: 10 }} className="absolute -bottom-10 flex items-center gap-2 text-zinc-400 text-sm animate-pulse">
                        <FaHandPointer />
                        <span>{t.azkarTapToCount}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
        
        <div className="p-4 m-4 bg-zinc-800 rounded-xl flex items-center justify-between flex-shrink-0 border border-zinc-700">
            <button onClick={prevAction} className="p-3 text-zinc-300 hover:text-white hover:bg-white/10 rounded-full transition-colors" aria-label={t.azkarPrev}>
                <FiChevronLeft size={24} />
            </button>
            <button onClick={resetCount} className="p-3 text-zinc-300 hover:text-white hover:bg-white/10 rounded-full transition-colors" aria-label={t.azkarReset}>
                <FiRefreshCw size={20}/>
            </button>
            <button onClick={nextAction} className="p-3 text-zinc-300 hover:text-white hover:bg-white/10 rounded-full transition-colors" aria-label={t.azkarNext}>
                 <FiChevronRight size={24} />
            </button>
        </div>

        <AnimatePresence>
            {unlockedAchievement && (
                <AchievementToast 
                    achievementId={unlockedAchievement}
                    onClose={() => setUnlockedAchievement(null)} 
                />
            )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Azkar;