import React, { useContext } from 'react';
import { LanguageContext } from '../App';
import { partners as allPartners } from '../data/partners';
import StaggeredText from './StaggeredText';

const Partners: React.FC = () => {
    const { t } = useContext(LanguageContext);
    // Duplicate the partners to create a seamless loop
    const duplicatedPartners = [...allPartners, ...allPartners];

    return (
        <section className="py-20 md:py-28 section-bg-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className="text-center mb-12"
                >
                    <StaggeredText text={t.partnersTitle} as="h2" className="text-4xl md:text-5xl font-extrabold text-white" />
                    <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">{t.partnersSubtitle}</p>
                </div>
                
                <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                    <ul 
                        className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll"
                    >
                       {duplicatedPartners.map((partner, index) => (
                           <li key={index}>
                               <img 
                                   src={partner.logo} 
                                   alt={partner.name} 
                                   className="h-10 w-auto grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 invert" 
                                   loading="lazy" 
                                   decoding="async"
                                   width="128"
                                   height="40"
                                />
                           </li>
                       ))}
                    </ul>
                </div>

                 <style>{`
                    @keyframes infinite-scroll {
                      from { transform: translateX(0); }
                      to { transform: translateX(-50%); }
                    }
                    .animate-infinite-scroll {
                       animation: infinite-scroll 60s linear infinite;
                    }
                `}</style>
            </div>
        </section>
    );
};

export default Partners;