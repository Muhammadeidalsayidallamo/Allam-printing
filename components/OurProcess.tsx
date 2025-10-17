import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { LanguageContext } from '../App';
import { FiFileText, FiEdit3, FiPrinter, FiCheckSquare, FiPackage } from 'react-icons/fi';
import StaggeredText from './StaggeredText';

const OurProcess: React.FC = () => {
    const { t } = useContext(LanguageContext);

    const steps = [
        { icon: <FiFileText size={24} />, titleKey: 'processStep1Title', descKey: 'processStep1Desc' },
        { icon: <FiEdit3 size={24} />, titleKey: 'processStep2Title', descKey: 'processStep2Desc' },
        { icon: <FiPrinter size={24} />, titleKey: 'processStep3Title', descKey: 'processStep3Desc' },
        { icon: <FiCheckSquare size={24} />, titleKey: 'processStep4Title', descKey: 'processStep4Desc' },
        { icon: <FiPackage size={24} />, titleKey: 'processStep5Title', descKey: 'processStep5Desc' },
    ];

    const contentVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100 } },
    };
    const contentVariantsRtl = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100 } },
    };


    return (
        <section id="process" className="py-20 md:py-28 section-bg-dark">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <StaggeredText text={t.processTitle} as="h2" className="text-4xl md:text-5xl font-extrabold text-white" />
                    <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">{t.processSubtitle}</p>
                </div>
                
                <div className="relative process-timeline">
                    {steps.map((step, index) => (
                        <div key={index} className="relative md:w-1/2 md:py-4 pl-16 md:pl-0 md:[&:nth-child(odd)]:pr-8 md:[&:nth-child(even)]:ml-[50%] md:[&:nth-child(even)]:pl-8 mb-12">
                            <motion.div 
                                className="absolute left-0 top-0 md:left-1/2 transform -translate-x-1/2 w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center text-white z-10"
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true, amount: 0.8 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                            >
                                {step.icon}
                            </motion.div>
                            <motion.div 
                                className="content-card p-6"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.5 }}
                                variants={index % 2 === 0 ? contentVariants : contentVariantsRtl}
                            >
                                <h3 className="text-xl font-bold text-white mb-2">{t[step.titleKey as keyof typeof t]}</h3>
                                <p className="text-zinc-400 text-sm">{t[step.descKey as keyof typeof t]}</p>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OurProcess;