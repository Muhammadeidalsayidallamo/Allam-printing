import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { FaPrayingHands, FaQuran } from 'react-icons/fa';
import { LanguageContext, AzkarModalContext } from '../App';

const FloatingSpiritualButtons: React.FC = () => {
    const { t } = useContext(LanguageContext);
    const azkarContext = useContext(AzkarModalContext);

    if (!azkarContext) return null;

    const { openAzkar } = azkarContext;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.5,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.5, y: 50 },
        visible: { opacity: 1, scale: 1, y: 0 },
    };

    return (
        <motion.div 
            className="fixed bottom-6 left-6 z-40 flex flex-col gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.button
                onClick={openAzkar}
                className="w-16 h-16 bg-sky-600 hover:bg-sky-700 rounded-full flex items-center justify-center shadow-lg text-white"
                aria-label={t.azkarOpen}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                variants={itemVariants}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
                <FaPrayingHands size={28} />
            </motion.button>
            <motion.a
                href="https://quran.com/ar"
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 bg-zinc-800 hover:bg-zinc-700 rounded-full flex items-center justify-center shadow-lg text-white"
                aria-label={t.quranLink}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                variants={itemVariants}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
                <FaQuran size={28} />
            </motion.a>
        </motion.div>
    );
};

export default FloatingSpiritualButtons;