import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { LanguageContext } from '../App';
import { FiExternalLink } from 'react-icons/fi';

const DesignVisualizer: React.FC = () => {
  const { t } = useContext(LanguageContext);

  return (
    <section id="visualizer" className="py-20 md:py-28 section-bg-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">{t.visualizerTitle}</h2>
                <p className="text-lg text-slate-400 mb-8">{t.visualizerSubtitle}</p>
                <a
                    href="https://www.printful.com/mockup-generator"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 btn-primary text-lg"
                >
                    {t.visualizerCta} <FiExternalLink />
                </a>
            </motion.div>
             <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:block"
            >
                <img 
                    src="https://wsrv.nl/?url=images.pexels.com/photos/7764611/pexels-photo-7764611.jpeg%3Fauto%3Dcompress%26cs%3Dtinysrgb%26w%3D1260%26h%3D750%26dpr%3D1&w=800&q=85&output=webp" 
                    alt="A person wearing a custom-printed t-shirt, demonstrating a design mockup from a visualizer tool."
                    className="rounded-2xl shadow-xl"
                    loading="lazy"
                    decoding="async"
                    width="800"
                    height="533"
                />
            </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DesignVisualizer;