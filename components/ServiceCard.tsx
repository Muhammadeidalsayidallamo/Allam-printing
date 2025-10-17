import React, { memo } from 'react';
import { motion, type Variants } from 'framer-motion';

const cardVariants: Variants = {
  offscreen: {
    y: 50,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

const ServiceCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  bullets: string[];
}> = memo(({ icon, title, description, bullets }) => {
  return (
    <motion.div
      variants={cardVariants}
      className="content-card content-card-hover p-8 h-full flex flex-col relative"
    >
      <div className="text-sky-500 mb-4">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-zinc-400 mb-6 flex-grow">{description}</p>
      <ul className="space-y-3 text-zinc-300">
        {bullets.map((bullet, index) => (
          <li key={index} className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
});

export default ServiceCard;