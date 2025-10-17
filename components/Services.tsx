import React, { useContext, memo } from 'react';
import { motion } from 'framer-motion';
import { LanguageContext } from '../App';
import { FiLayers, FiPrinter } from 'react-icons/fi';
import StaggeredText from './StaggeredText';
import ServiceCard from './ServiceCard';

const Services: React.FC = () => {
    const { t } = useContext(LanguageContext);
    
  const services = [
    {
      icon: <FiLayers size={32} />,
      title: t.servicesScreenPrintingTitle,
      description: t.servicesScreenPrintingDesc,
      bullets: [
        t.servicesScreenPrintingBullet1,
        t.servicesScreenPrintingBullet2,
        t.servicesScreenPrintingBullet3,
      ],
    },
    {
      icon: <FiPrinter size={32} />,
      title: t.servicesDtfTitle,
      description: t.servicesDtfDesc,
      bullets: [
        t.servicesDtfBullet1,
        t.servicesDtfBullet2,
        t.servicesDtfBullet3,
      ],
    },
  ];

  return (
    <section id="services" className="py-20 md:py-28 section-bg-alt">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="text-center mb-12"
        >
          <StaggeredText text={t.servicesTitle} as="h2" className="text-4xl md:text-5xl font-extrabold text-white" />
          <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">{t.servicesSubtitle}</p>
        </div>
        
        <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ staggerChildren: 0.2 }}
            className="grid md:grid-cols-2 gap-8 lg:gap-12"
        >
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </motion.div>

         <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
         >
           <a
             href="#gallery"
             className="btn-primary"
           >
             {t.servicesCta}
           </a>
         </motion.div>
      </div>
    </section>
  );
};

export default Services;