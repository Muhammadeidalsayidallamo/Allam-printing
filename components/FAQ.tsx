import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageContext } from '../App';
import { FiChevronDown, FiCheck } from 'react-icons/fi';
import StaggeredText from './StaggeredText';

const AccordionItem: React.FC<{ question: string; answer: string; index: number; }> = ({ question, answer, index }) => {
    const [isOpen, setIsOpen] = useState(false);
    const contentId = `faq-content-${index}`;

    return (
        <div className={`border-b border-zinc-800`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-5 px-6"
                aria-expanded={isOpen}
                aria-controls={contentId}
            >
                <h3 className={`text-lg font-semibold transition-colors duration-300 ${isOpen ? 'text-sky-400' : 'text-white'}`}>{question}</h3>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-zinc-500 ml-4 flex-shrink-0"
                >
                    <FiChevronDown size={20} />
                </motion.div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        id={contentId}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="pb-5 px-6 text-zinc-400 whitespace-pre-line prose prose-invert max-w-none">
                           {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQ: React.FC = () => {
    const { t } = useContext(LanguageContext);
    
    const faqData = [];
    for (let i = 1; i <= 50; i++) {
        const qKey = `faqQ${i}`;
        const aKey = `faqA${i}`;
        if (t[qKey] && t[aKey]) {
            faqData.push({ question: t[qKey], answer: t[aKey] });
        } else {
            break; 
        }
    }

    const whyUsPoints = t.faqWhyChooseUsPoints.split('\n');

    return (
        <section id="faq" className="py-20 md:py-28 section-bg-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className="text-center mb-12"
                >
                    <StaggeredText text={t.faqTitle} as="h2" className="text-4xl md:text-5xl font-extrabold text-white" />
                    <p className="mt-4 text-lg text-zinc-400">{t.faqSubtitle}</p>
                </div>

                <div className="max-w-3xl mx-auto bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
                    {faqData.map((item, index) => (
                       <AccordionItem key={index} index={index} question={item.question} answer={item.answer} />
                    ))}
                </div>

                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-16 max-w-4xl mx-auto"
                    >
                    <div className="bg-zinc-900 rounded-lg p-8 text-center border border-zinc-800">
                        <h3 className="text-3xl font-bold text-white mb-4">{t.faqWhyChooseUsTitle}</h3>
                        <p className="text-lg text-zinc-300 mb-6 whitespace-pre-line">{t.faqWhyChooseUsIntro}</p>
                        <div className="grid sm:grid-cols-2 gap-4 text-left my-8">
                           {whyUsPoints.map((point, index) => (
                               <div key={index} className="flex items-start space-x-3 rtl:space-x-reverse">
                                   <FiCheck className="text-green-500 mt-1 flex-shrink-0" size={20}/>
                                   <span className="text-zinc-200">{point.replace('✅', '').trim()}</span>
                               </div>
                           ))}
                        </div>
                        <p className="text-lg text-zinc-300 font-semibold whitespace-pre-line">{t.faqWhyChooseUsOutro}</p>
                    </div>

                    <div className="mt-8 text-center">
                         <h4 className="text-2xl font-bold text-gray-100">{t.faqFinalMessageTitle}</h4>
                         <p className="mt-2 text-gray-400 whitespace-pre-line">{t.faqFinalMessageBody}</p>
                         <p className="mt-4 font-semibold text-gray-300 whitespace-pre-line">{t.faqFinalMessageContact}</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FAQ;