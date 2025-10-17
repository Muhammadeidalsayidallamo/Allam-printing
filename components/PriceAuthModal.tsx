import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiKey, FiAlertCircle } from 'react-icons/fi';
import { LanguageContext } from '../App';

const validPasswords = ['allahuakbar', '01208805931', 'allah', 'الله اكبر', 'الله'];

interface PriceAuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const backdrop = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
};

const modal = {
    hidden: { y: "50px", opacity: 0, scale: 0.9 },
    visible: { y: "0", opacity: 1, scale: 1, transition: { delay: 0.2, type: 'spring', damping: 25, stiffness: 300 } },
};

const PriceAuthModal: React.FC<PriceAuthModalProps> = ({ onClose, onSuccess }) => {
    const { t } = useContext(LanguageContext);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [shake, setShake] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validPasswords.includes(password.trim().toLowerCase())) {
            onSuccess();
        } else {
            setError(t.priceAuthError);
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
    };

    const shakeVariants = {
        shake: {
            x: [0, -10, 10, -10, 10, 0],
            transition: { duration: 0.5 }
        },
        initial: {}
    };

    return (
        <motion.div
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-[70] bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                variants={{...modal, ...shakeVariants}}
                animate={shake ? "shake" : "visible"}
                exit="hidden"
                className="relative bg-zinc-900 p-8 rounded-lg w-full max-w-sm border border-zinc-700"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-zinc-400 hover:text-white transition-colors z-10">
                    <FiX size={24} />
                </button>
                
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center bg-sky-500/10 text-sky-400 rounded-full">
                        <FiKey size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{t.priceAuthTitle}</h3>
                    <p className="text-zinc-300 mb-6">{t.priceAuthSubtitle}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                         <input 
                            type="password" 
                            placeholder={t.priceAuthPassword}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if(error) setError('');
                            }}
                            className={`w-full bg-zinc-800 border ${error ? 'border-red-500' : 'border-zinc-700'} text-white rounded-md py-3 px-4 transition-all outline-none focus:border-sky-500 focus:ring-0`}
                            required 
                            autoFocus
                        />
                    </div>
                    {error && (
                        <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center gap-2 text-sm text-red-400"
                        >
                           <FiAlertCircle size={14} /> {error}
                        </motion.p>
                    )}
                     <button 
                        type="submit" 
                        className="w-full text-lg btn-primary"
                    >
                        <span className="flex items-center justify-center gap-2">
                            {t.priceAuthSubmit}
                        </span>
                    </button>
                </form>

            </motion.div>
        </motion.div>
    );
};

export default PriceAuthModal;