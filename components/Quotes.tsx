import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageContext } from '../App';
import { quotes as allQuotes } from '../data/quotes';

const Quotes: React.FC = () => {
    const { language } = useContext(LanguageContext);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % allQuotes.length);
        }, 8000);
        return () => clearInterval(interval);
    }, []);
    
    const quote = allQuotes[index];

    return (
        <section className="py-20 md:py-28 section-bg-alt">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative max-w-4xl mx-auto h-48 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 1 }}
                            className="absolute text-center"
                        >
                            <p className="text-2xl md:text-3xl font-medium italic text-zinc-200">
                                "{quote[language === 'ar' ? 'ar' : 'en'].split('–')[0].trim()}"
                            </p>
                            <p className="mt-4 text-lg text-zinc-400">
                                – {quote[language === 'ar' ? 'ar' : 'en'].split('–')[1].trim()}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default Quotes;