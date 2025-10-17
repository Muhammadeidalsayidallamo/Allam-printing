import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { LanguageContext } from '../App';

const ExitIntentPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useContext(LanguageContext);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.8, y: -50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: -50 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
                onClick={e => e.stopPropagation()}
            >
                 <button onClick={onClose} className="absolute top-3 right-3 rtl:right-auto rtl:left-3 text-zinc-400 hover:text-zinc-200">
                    <FiX size={20} />
                </button>
                <h3 className="text-2xl font-bold text-white mb-3">{t.exitPopupTitle}</h3>
                <p className="text-zinc-400 mb-6">{t.exitPopupText}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <input type="text" placeholder={t.quoteFormFullName} className="w-full bg-zinc-800 border-2 border-zinc-700 focus:border-sky-500 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-sky-500/50 transition" required />
                     <input type="tel" placeholder={t.quoteFormPhone} className="w-full bg-zinc-800 border-2 border-zinc-700 focus:border-sky-500 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-sky-500/50 transition" required />
                     <button type="submit" className="w-full btn-primary">
                        {t.exitPopupCta}
                     </button>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default ExitIntentPopup;