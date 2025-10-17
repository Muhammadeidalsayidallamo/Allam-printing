import React, { useContext, memo } from 'react';
import { motion } from 'framer-motion';
import { LanguageContext } from '../App';
import type { BlogPost, Page } from '../types';
import { FiArrowRight, FiCalendar } from 'react-icons/fi';

interface BlogCardProps {
  post: BlogPost;
  onNavigate: (page: Page, data?: any) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onNavigate }) => {
  const { language, dir, t } = useContext(LanguageContext);

  const formattedDate = new Date(post.date).toLocaleDateString(language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div 
        className="group h-full content-card content-card-hover overflow-hidden"
        onClick={() => onNavigate('article', post)}
    >
        <div 
            className="h-full flex flex-col cursor-pointer"
        >
          <div className="overflow-hidden relative">
            <img 
                src={post.image} 
                alt={post.title[language]} 
                className="w-full h-56 object-cover" 
                loading="lazy"
                width="400"
                height="224"
            />
            <div className="absolute top-4 right-4 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded-md">{post.category[language]}</div>
          </div>
          <div className="p-6 flex flex-col flex-grow">
            <div className="flex items-center text-sm text-zinc-400 mb-2">
                <FiCalendar className="mr-2 rtl:ml-2 rtl:mr-0" />
                <span>{formattedDate}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 flex-grow group-hover:text-sky-400 transition-colors">{post.title[language]}</h3>
            <p className="text-zinc-400 mb-4 text-sm">{post.excerpt[language]}</p>
            <div className="mt-auto flex items-center text-sky-400 font-bold group-hover:text-sky-300">
              <span>{t.articleBack.replace('Blog', 'More')}</span>
              <FiArrowRight className={`ml-2 rtl:mr-2 rtl:ml-0 transform transition-transform duration-300 ${dir === 'ltr' ? 'group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`} />
            </div>
          </div>
        </div>
    </div>
  );
};

export default memo(BlogCard);