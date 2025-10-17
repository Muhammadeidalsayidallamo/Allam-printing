import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { LanguageContext } from '../App';
import type { BlogPost } from '../types';

interface BlogModalProps {
  post: BlogPost;
  onClose: () => void;
}

const backdrop = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
};

const modal = {
    hidden: { y: "50px", opacity: 0 },
    visible: { y: "0", opacity: 1, transition: { delay: 0.2 } },
};

const BlogModal: React.FC<BlogModalProps> = ({ post, onClose }) => {
    const { language } = useContext(LanguageContext);

    return (
        <motion.div
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                variants={modal}
                className="bg-zinc-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl relative border border-zinc-800"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-zinc-500 hover:text-zinc-200 z-10">
                    <FiX size={24} />
                </button>
                <img src={post.image} alt={post.title[language]} className="w-full h-64 object-cover rounded-t-2xl" />
                <div className="p-8 md:p-12">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">{post.title[language]}</h2>
                    <div className="prose lg:prose-xl prose-invert max-w-none text-zinc-300 whitespace-pre-line leading-relaxed">
                        {post.content[language]}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default BlogModal;