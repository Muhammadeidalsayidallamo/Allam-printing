import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { LanguageContext } from '../App';


const Logo = () => {
    const { t } = useContext(LanguageContext);
    return (
        <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="loaderLogoTitle">
            <title id="loaderLogoTitle">{t.appName} Logo Animation</title>
            <defs>
                <linearGradient id="logo-grad-premium-loader" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" /> 
                    <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
            </defs>
            <g>
                <motion.path 
                    d="M30 65 L50 25 L70 65" 
                    stroke="currentColor" 
                    strokeWidth="8" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: 'easeInOut', delay: 0.5 }}
                />
                <motion.path 
                    d="M15 65 L85 65" 
                    stroke="url(#logo-grad-premium-loader)" 
                    strokeWidth="10" 
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: 'circOut', delay: 1.2 }}
                />
            </g>
        </svg>
    )
};


const Loader: React.FC = () => {
    const { t } = useContext(LanguageContext);
    return (
        <motion.div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
            <div className="flex flex-col items-center">
                <motion.div
                    className="text-white"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <Logo />
                </motion.div>
                
                <motion.div
                    className="mt-6 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2, duration: 0.8 }}
                >
                   <p className="font-sans text-2xl font-bold text-white">{t.appName}</p>
                   <p className="font-sans text-sm text-zinc-400 mt-1">Your Story in Every Print</p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Loader;