import React, { useContext, memo } from 'react';
import { motion } from 'framer-motion';
import { LanguageContext } from '../App';
import { FaCheckCircle, FaAward, FaTruck, FaHeadset, FaHandshake } from 'react-icons/fa';
import StaggeredText from './StaggeredText';

const features = [
  { icon: <FaAward size={28}/>, key: 'whyQuality', className: 'lg:col-span-2' },
  { icon: <FaCheckCircle size={28}/>, key: 'whyCommitment' },
  { icon: <FaTruck size={28}/>, key: 'whyMaterials' },
  { icon: <FaHeadset size={28}/>, key: 'whySupport', className: 'lg:col-span-2' },
  { icon: <FaHandshake size={28}/>, key: 'whyPricing' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
};

const FeatureCard: React.FC<{ feature: { icon: React.ReactNode; key: string; }; className?: string; }> = memo(({ feature, className = "" }) => {
    const { t } = useContext(LanguageContext);

    return (
        <motion.div 
            variants={itemVariants} 
            className={`group ${className}`}
        >
            <div
                className="content-card content-card-hover p-6 rounded-xl flex flex-col items-center text-center h-full"
            >
                <div 
                    className="flex-shrink-0 w-16 h-16 mb-4 flex items-center justify-center text-sky-500 rounded-full"
                >
                    {feature.icon}
                </div>
                <div>
                    <h3 className="font-bold text-lg text-white mb-2">{t[`${feature.key}Title` as keyof typeof t]}</h3>
                    <p className="text-zinc-400 text-sm">{t[`${feature.key}Desc` as keyof typeof t]}</p>
                </div>
            </div>
        </motion.div>
    );
});


const WhyChooseUs: React.FC = () => {
    const { t } = useContext(LanguageContext);

    return (
        <motion.section 
            id="why-us" 
            className="py-20 md:py-28 section-bg-light"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                 <div
                    className="text-center mb-16"
                >
                    <StaggeredText text={t.whyTitle} as="h2" className="text-4xl md:text-5xl font-extrabold text-white" />
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {features.map((feature) => (
                        <FeatureCard key={feature.key} feature={feature} className={feature.className} />
                    ))}
                </motion.div>

                 <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-16 text-center max-w-3xl mx-auto p-8 bg-zinc-900 rounded-lg border border-zinc-800"
                    >
                    <h3 className="text-2xl font-bold text-white mb-3">{t.whyConclusionTitle}</h3>
                    <p className="text-lg text-zinc-300">{t.whyConclusionText}</p>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default WhyChooseUs;