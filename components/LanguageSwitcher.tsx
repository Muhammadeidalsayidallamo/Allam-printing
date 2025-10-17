import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageContext } from '../App';
import type { Language } from '../types';

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useContext(LanguageContext);
    const [isOpen, setIsOpen] = useState(false);

    const languages: { code: Language; flag: string; name: string }[] = [
        { code: 'ar', flag: '🇪🇬', name: 'العربية' },
        { code: 'en', flag: '🇬🇧', name: 'English' },
        { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
        { code: 'fr', flag: '🇫🇷', name: 'Français' },
    ];

    const selectedLang = languages.find(l => l.code === language);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 rounded-md transition-colors"
            >
                <span>{selectedLang?.flag}</span>
                <span className="hidden sm:inline">{selectedLang?.name}</span>
            </button>
            <AnimatePresence>
            {isOpen && (
                <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 right-0 ltr:right-0 rtl:left-0 z-20 w-36 bg-zinc-900 border border-zinc-700 rounded-md shadow-lg overflow-hidden"
                >
                    {languages.map(lang => (
                        <li key={lang.code}>
                            <button
                                onClick={() => {
                                    setLanguage(lang.code);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 rtl:space-x-reverse ${language === lang.code ? 'bg-sky-500 text-white' : 'text-zinc-200 hover:bg-zinc-700'}`}
                            >
                                <span>{lang.flag}</span>
                                <span>{lang.name}</span>
                            </button>
                        </li>
                    ))}
                </motion.ul>
            )}
            </AnimatePresence>
        </div>
    );
};

export default LanguageSwitcher;