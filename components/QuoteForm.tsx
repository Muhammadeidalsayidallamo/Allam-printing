import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageContext } from '../App';
import { FiSend, FiUploadCloud, FiCheckCircle, FiLoader } from 'react-icons/fi';
import StaggeredText from './StaggeredText';

const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const QuoteForm: React.FC = () => {
    const { t } = useContext(LanguageContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [fileName, setFileName] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        // Simulate a network request
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        } else {
            setFileName('');
        }
    };
    
    const inputClasses = "w-full bg-zinc-800 border border-zinc-700 focus:border-sky-500 focus:ring-0 text-zinc-100 rounded-md py-3 px-4 transition-colors outline-none";
    const labelClasses = "block text-sm font-medium text-zinc-300 mb-2";

    return (
        <section id="quote" className="py-20 md:py-28 section-bg-alt">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className="text-center mb-12"
                >
                    <StaggeredText text={t.quoteFormTitle} as="h2" className="text-4xl md:text-5xl font-extrabold text-white" />
                    <p className="mt-4 text-lg text-zinc-400">{t.quoteFormSubtitle}</p>
                </div>

                <div className="max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6 }}
                        className="content-card p-8"
                    >
                        {isSubmitted ? (
                            <div className="text-center py-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1, transition: { type: 'spring', stiffness: 200, damping: 10 } }}
                                >
                                    <FiCheckCircle className="mx-auto text-green-500 text-6xl mb-4" />
                                </motion.div>
                                <motion.h3 
                                    initial={{ opacity: 0, y:10 }}
                                    animate={{ opacity: 1, y:0, transition: { delay: 0.2 } }}
                                    className="text-2xl font-bold text-white mb-2"
                                >
                                    {t.quoteFormSuccessTitle}
                                </motion.h3>
                                <motion.p 
                                    initial={{ opacity: 0, y:10 }}
                                    animate={{ opacity: 1, y:0, transition: { delay: 0.3 } }}
                                    className="text-zinc-400"
                                >
                                    {t.quoteFormSuccessMessage}
                                </motion.p>
                            </div>
                        ) : (
                            <motion.form 
                                onSubmit={handleSubmit} 
                                className="space-y-6"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ staggerChildren: 0.1 }}
                            >
                                <motion.div variants={fieldVariants}>
                                    <label htmlFor="fullName" className={labelClasses}>{t.quoteFormFullName}</label>
                                    <input type="text" id="fullName" className={inputClasses} required />
                                </motion.div>
                                <motion.div variants={fieldVariants} className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="phone" className={labelClasses}>{t.quoteFormPhone}</label>
                                        <input type="tel" id="phone" className={inputClasses} required />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className={labelClasses}>{t.quoteFormEmail}</label>
                                        <input type="email" id="email" className={inputClasses} required />
                                    </div>
                                </motion.div>
                                <motion.div variants={fieldVariants} className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="printType" className={labelClasses}>{t.quoteFormPrintType}</label>
                                        <select id="printType" className={inputClasses} required>
                                            <option>{t.quoteFormPrintTypeScreen}</option>
                                            <option>{t.quoteFormPrintTypeDTF}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="quantity" className={labelClasses}>{t.quoteFormQuantity}</label>
                                        <input type="number" id="quantity" className={inputClasses} required />
                                    </div>
                                </motion.div>
                                <motion.div variants={fieldVariants}>
                                    <label className={labelClasses}>{t.quoteFormUpload}</label>
                                    <label htmlFor="designFile" className="relative flex items-center justify-center w-full h-32 px-4 transition bg-zinc-800 border-2 border-dashed border-zinc-700 rounded-md appearance-none cursor-pointer hover:border-sky-500 focus-within:border-sky-500 focus-within:ring-0">
                                        <span className="flex items-center space-x-2 rtl:space-x-reverse text-zinc-400">
                                            <FiUploadCloud className="w-6 h-6"/>
                                            <span className="font-medium">
                                                {fileName || t.quoteFormUploadPlaceholder}
                                            </span>
                                        </span>
                                        <input type="file" id="designFile" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
                                    </label>
                                </motion.div>
                                <motion.div variants={fieldVariants}>
                                    <label htmlFor="message" className={labelClasses}>{t.quoteFormMessage}</label>
                                    <textarea id="message" rows={4} className={inputClasses}></textarea>
                                </motion.div>
                                <motion.div variants={fieldVariants}>
                                    <button 
                                        type="submit" 
                                        className="w-full text-lg btn-primary disabled:opacity-70 disabled:cursor-not-allowed"
                                        disabled={isSubmitting}
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                        <AnimatePresence mode="wait">
                                            {isSubmitting ? (
                                                <motion.div key="loader" initial={{opacity:0, scale:0.5}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.5}}>
                                                    <FiLoader className="animate-spin" />
                                                </motion.div>
                                            ) : (
                                                <motion.div key="icon" initial={{opacity:0, scale:0.5}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.5}}>
                                                    <FiSend />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                            <span>
                                                {isSubmitting ? t.quoteFormSubmit.replace('Request', 'ing...') : t.quoteFormSubmit}
                                            </span>
                                        </span>
                                    </button>
                                </motion.div>
                            </motion.form>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default QuoteForm;