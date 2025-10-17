import React, { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiX } from 'react-icons/fi';
import { LanguageContext } from '../App';
import { achievements } from '../data/achievements';

interface AchievementToastProps {
    achievementId: string;
    onClose: () => void;
}

const AchievementToast: React.FC<AchievementToastProps> = ({ achievementId, onClose }) => {
    const { t } = useContext(LanguageContext);
    const achievement = achievements.find(a => a.id === achievementId);

    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!achievement) return null;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.5 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-sm bg-gradient-to-br from-sky-500 to-blue-600 text-white p-4 rounded-xl shadow-lg flex items-start gap-4 z-50"
        >
            <div className="flex-shrink-0 text-sky-200">
                <FiAward size={28} />
            </div>
            <div className="flex-grow min-w-0 rtl:text-right">
                <h4 className="font-bold">{t[achievement.titleKey as keyof typeof t]}</h4>
                <p className="text-sm text-sky-100">{t[achievement.descriptionKey as keyof typeof t]}</p>
            </div>
            <button onClick={onClose} className="flex-shrink-0 p-1 text-sky-200 hover:text-white">
                <FiX size={18} />
            </button>
        </motion.div>
    );
};

export default AchievementToast;