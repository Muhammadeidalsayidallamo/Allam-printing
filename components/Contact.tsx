import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { LanguageContext } from '../App';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';
import { FaMoneyBillWave, FaUniversity } from 'react-icons/fa';
import StaggeredText from './StaggeredText';

const ContactInfo: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="flex items-start space-x-4 rtl:space-x-reverse">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-sky-500/10 text-sky-400 rounded-xl">
            {icon}
        </div>
        <div>
            <h3 className="font-bold text-lg text-white">{title}</h3>
            <div className="text-zinc-300">{children}</div>
        </div>
    </div>
);


const Contact: React.FC = () => {
    const { t } = useContext(LanguageContext);

    return (
        <section id="contact" className="py-20 md:py-28 section-bg-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 <div
                    className="text-center mb-12"
                >
                    <StaggeredText text={t.contactTitle} as="h2" className="text-4xl md:text-5xl font-extrabold text-white" />
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    <motion.div
                         initial={{ opacity: 0, x: -50 }}
                         whileInView={{ opacity: 1, x: 0 }}
                         viewport={{ once: true, amount: 0.3 }}
                         transition={{ duration: 0.8 }}
                         className="space-y-8"
                    >
                        <ContactInfo icon={<FiMapPin size={24}/>} title={t.contactAddress}>
                            <a href="https://maps.app.goo.gl/e77WkL8rYn9D9x4f6" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
                                {t.contactAddressValue}
                            </a>
                        </ContactInfo>
                         <ContactInfo icon={<FiPhone size={24}/>} title={t.contactPhone}>
                            <div className="flex flex-col space-y-1">
                                <a href="https://wa.me/201012379950" className="hover:text-sky-400" target="_blank" rel="noopener noreferrer">+20 101 237 9950</a>
                                <a href="tel:+201551659399" className="hover:text-sky-400">+20 155 165 9399</a>
                            </div>
                        </ContactInfo>
                         <ContactInfo icon={<FiMail size={24}/>} title={t.contactEmail}>
                            <div className="flex flex-col space-y-1">
                                <a href="mailto:sonmoon606@gmail.com" className="hover:text-sky-400">sonmoon606@gmail.com</a>
                                <a href="mailto:muhammadeidalsayidallamo@gmail.com" className="hover:text-sky-400">muhammadeidalsayidallamo@gmail.com</a>
                            </div>
                        </ContactInfo>
                        <ContactInfo icon={<FiClock size={24}/>} title={t.contactWorkingHoursTitle}>
                            <p>{t.contactWorkingHoursDays}: {t.contactWorkingHoursTime}</p>
                            <p>{t.contactWorkingHoursFriday}</p>
                        </ContactInfo>
                        
                        <div>
                             <h3 className="text-xl font-bold text-white mb-4">{t.paymentMethodsTitle}</h3>
                             <div className="flex flex-wrap items-center gap-4 text-zinc-400">
                                 <div className="flex items-center gap-2 p-2 bg-zinc-800 rounded-md">
                                    <FaMoneyBillWave className="text-green-500"/>
                                    <span>{t.paymentCash}</span>
                                 </div>
                                  <div className="flex items-center gap-2 p-2 bg-zinc-800 rounded-md">
                                    <FiPhone className="text-red-600"/>
                                    <span>{t.paymentVodafone}</span>
                                  </div>
                                   <div className="flex items-center gap-2 p-2 bg-zinc-800 rounded-md">
                                     <span className="font-bold text-blue-500">IP</span>
                                     <span>{t.paymentInstapay}</span>
                                  </div>
                                  <div className="flex items-center gap-2 p-2 bg-zinc-800 rounded-md">
                                    <FaUniversity className="text-zinc-300"/>
                                     <span>{t.paymentBank}</span>
                                  </div>
                             </div>
                        </div>

                    </motion.div>
                     <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8 }}
                        className="h-96 lg:h-auto rounded-2xl overflow-hidden shadow-lg"
                     >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13735.08631168931!2d31.5768561!3d30.4184323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f7e2c9a9d7b275%3A0x6e737c151e2bf208!2sGheitah%2C%2Markaz%2belbeis%2C%20Ash%20Sharqia%20Governorate!5e0!3m2!1sen!2seg"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Our Location"
                            className="invert"
                        ></iframe>
                     </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;