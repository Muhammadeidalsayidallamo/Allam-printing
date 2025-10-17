import React, { memo } from 'react';
import { motion, type Variants } from 'framer-motion';

interface StaggeredTextProps {
  text: string;
  as?: React.ElementType;
  className?: string;
}

const containerVariants: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
  hidden: {}
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 200,
    },
  },
};

const StaggeredText: React.FC<StaggeredTextProps> = ({ text, as: Component = 'h2', className }) => {
  const words = text.split(' ');

  return (
    <Component className={className}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        aria-label={text}
        style={{ display: 'inline-block' }}
      >
        {words.map((word, index) => (
          <motion.span
            key={index}
            variants={wordVariants}
            style={{ display: 'inline-block', marginRight: '0.25em' }}
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Component>
  );
};

export default memo(StaggeredText);