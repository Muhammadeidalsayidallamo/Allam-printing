import React, { useState, useMemo, useContext, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { LanguageContext } from '../App';
import { FiLayers, FiPrinter, FiAlertTriangle, FiTag, FiDollarSign, FiPercent, FiMessageSquare, FiLock, FiClock } from 'react-icons/fi';
import StaggeredText from './StaggeredText';

type RecommendationType = 'dtf' | 'screen' | 'both' | 'none';
type DesignSizeType = 'small' | 'medium' | 'large';
type InkType = 'waterBased' | 'plastisol';
type FabricType = 'cotton' | 'polyester' | 'blend';
type AntiMigrationOption = 'none' | 'shopProvided' | 'clientProvided';


interface Recommendation {
    type: RecommendationType;
    titleKey: string;
    reasonKey: string;
    icon: React.ReactNode;
}

const pricingTiers = {
  waterBased: {
    small: { base: 4.5, color: 2.25 },
    medium: { base: 6.5, color: 2.75 },
    large: { base: 8.25, color: 3.25 },
  },
  plastisol: {
    small: { base: 5.5, color: 3.25 },
    medium: { base: 7.5, color: 3.75 },
    large: { base: 9.25, color: 4.25 },
  }
};

const SegmentedControl = ({ label, name, options, selected, onChange }: any) => (
    <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">{label}</label>
        <div className="flex gap-1 rounded-lg bg-zinc-800 p-1 border border-zinc-700">
            {options.map(({ value, labelKey }: { value: string, labelKey: string }) => (
                <label key={value} className={`relative flex-1 text-center cursor-pointer px-4 py-2 text-sm rounded-md transition-colors font-semibold ${selected === value ? 'text-white' : 'text-zinc-300 hover:text-white'}`}>
                    <input type="radio" name={name} value={value} checked={selected === value} onChange={onChange} className="sr-only" />
                    <span className="relative z-10">{labelKey}</span>
                    {selected === value && (
                         <motion.div
                            layoutId={`${name}-active-bg`}
                            className="absolute inset-0 z-0 bg-sky-500 rounded-md shadow-lg shadow-sky-500/20"
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        />
                    )}
                </label>
            ))}
        </div>
    </div>
);

const ToggleSwitch = ({ label, checked, onChange }: any) => (
    <label className="flex items-center justify-between cursor-pointer text-sm text-zinc-300 w-full">
        <span>{label}</span>
        <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${checked ? 'bg-sky-500' : 'bg-zinc-700'}`}>
          <motion.div
            layout
            className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
            transition={{ type: 'spring', stiffness: 700, damping: 30 }}
            style={{ x: checked ? '24px' : '0px' }}
          />
        </div>
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
    </label>
);


const AnimatedCounter = ({ value, prefix = '', suffix = '', precision = 2 }) => {
    const spring = useSpring(value, { mass: 0.8, stiffness: 100, damping: 20 });
    const display = useTransform(spring, (current) => {
        const formatter = new Intl.NumberFormat(undefined, {
            minimumFractionDigits: precision,
            maximumFractionDigits: precision,
        });
        return `${prefix}${formatter.format(Number(current))}${suffix}`;
    });
  
    useEffect(() => {
      spring.set(value);
    }, [spring, value]);
  
    return <motion.span>{display}</motion.span>;
};


interface PrintRecommenderProps {
  isPriceAuthenticated: boolean;
  onUnlockPrices: () => void;
  priceAuthTimer: number;
}

const PrintRecommender: React.FC<PrintRecommenderProps> = ({ isPriceAuthenticated, onUnlockPrices, priceAuthTimer }) => {
    const { t, language } = useContext(LanguageContext);
    const [quantity, setQuantity] = useState<number | ''>(100);
    const [colors, setColors] = useState<number | ''>(3);
    const [designSize, setDesignSize] = useState<DesignSizeType>('medium');
    const [inkType, setInkType] = useState<InkType>('waterBased');
    const [isComplexDesign, setIsComplexDesign] = useState(false);
    const [fabricType, setFabricType] = useState<FabricType>('cotton');
    const [antiMigrationOption, setAntiMigrationOption] = useState<AntiMigrationOption>('none');
    const [isWinterFabric, setIsWinterFabric] = useState(false);

    useEffect(() => {
      if (fabricType === 'cotton') {
        setAntiMigrationOption('none');
      }
    }, [fabricType]);

    const recommendation: Recommendation = useMemo(() => {
        const qty = Number(quantity);
        const clrs = Number(colors);

        if (!qty || !clrs || qty <= 0 || clrs <= 0) {
            return { type: 'none', titleKey: '', reasonKey: '', icon: null };
        }

        if (qty < 100) {
            if (clrs > 6) {
                 return { type: 'dtf', titleKey: 'recDTF', reasonKey: 'recReasonDTFLotsOfColors', icon: <FiPrinter size={32} /> };
            }
            return { type: 'dtf', titleKey: 'recDTF', reasonKey: 'recReasonDTFSmallQty', icon: <FiPrinter size={32} /> };
        }
        if (qty >= 100) {
            if (clrs >= 1 && clrs <= 3) {
                return { type: 'screen', titleKey: 'recScreenPrint', reasonKey: 'recReasonScreenPrintLargeQty', icon: <FiLayers size={32} /> };
            }
            if (clrs >= 4 && clrs <= 6) {
                return { type: 'both', titleKey: 'recBoth', reasonKey: 'recReasonBothMediumQty', icon: <><FiPrinter size={24} /> <FiLayers size={24} /></> };
            }
            if (clrs > 6) {
                return { type: 'both', titleKey: 'recBoth', reasonKey: 'recReasonComplexColors', icon: <><FiPrinter size={24} /> <FiLayers size={24} /></> };
            }
        }

        return { type: 'none', titleKey: '', reasonKey: '', icon: null };
    }, [quantity, colors]);

    const calculatedPrice = useMemo(() => {
        const qty = Number(quantity);
        const clrs = Number(colors);
        if (!qty || !clrs || qty <= 0 || clrs <= 0) {
            return { piece: 0, total: 0, discount: 0, discountAmount: 0 };
        }
        
        const tier = pricingTiers[inkType][designSize];
        let pricePerPieceBeforeDiscount = tier.base + (clrs * tier.color);

        if (isComplexDesign) {
            pricePerPieceBeforeDiscount += (clrs * 0.75);
        }

        if (isWinterFabric) {
            pricePerPieceBeforeDiscount += 0.75;
        }

        if (fabricType === 'polyester' || fabricType === 'blend') {
            if (antiMigrationOption === 'shopProvided') {
                pricePerPieceBeforeDiscount += 3;
            } else if (antiMigrationOption === 'clientProvided') {
                pricePerPieceBeforeDiscount += 1.5;
            }
        }

        let discount = 0;
        if (qty >= 2000) {
            discount = 7;
        } else if (qty >= 500) {
            discount = 6;
        } else if (qty >= 220) {
            discount = 5;
        }

        const totalBeforeDiscount = pricePerPieceBeforeDiscount * qty;
        const discountAmount = totalBeforeDiscount * (discount / 100);
        const totalPrice = totalBeforeDiscount - discountAmount;
        const finalPricePerPiece = qty > 0 ? totalPrice / qty : 0;
        
        return { piece: finalPricePerPiece, total: totalPrice, discount, discountAmount };

    }, [quantity, colors, designSize, inkType, isComplexDesign, fabricType, antiMigrationOption, isWinterFabric]);
    
    const inputClasses = "w-full bg-zinc-800 border-2 border-zinc-700 focus:border-sky-500 focus:ring-sky-500 focus:ring-1 text-slate-100 rounded-md py-3 px-4 transition-all outline-none font-bold text-lg text-center";
    const labelClasses = "block text-sm font-medium text-zinc-300 mb-2";

    const sizeOptions = [
        { value: 'small', labelKey: t.pricingSizeSmall },
        { value: 'medium', labelKey: t.pricingSizeMedium },
        { value: 'large', labelKey: t.pricingSizeLarge },
    ];

    const inkOptions = [
        { value: 'waterBased', labelKey: t.pricingWaterBasedTitle },
        { value: 'plastisol', labelKey: t.pricingPlastisolTitle },
    ];

    const fabricOptions = [
        { value: 'cotton', labelKey: t.fabricCotton },
        { value: 'polyester', labelKey: t.fabricPolyester },
        { value: 'blend', labelKey: t.fabricBlend },
    ];
    
    const antiMigrationOptions = [
        { value: 'shopProvided', labelKey: t.antiMigrationShop },
        { value: 'clientProvided', labelKey: t.antiMigrationClient },
    ];


    return (
        <section id="pricing" className="py-20 md:py-28 section-bg-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className="text-center mb-12"
                >
                    <StaggeredText text={t.recommenderTitle} as="h2" className="text-4xl md:text-5xl font-extrabold text-white" />
                    <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">{t.recommenderSubtitle}</p>
                </div>

                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                    {/* INPUTS */}
                    <motion.div 
                        className="content-card p-8 space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <h3 className="text-2xl font-bold text-center text-white">{t.calculatorInputTitle}</h3>
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="quantity" className={labelClasses}>{t.recommenderQuantityLabel}</label>
                                <input 
                                    type="number" 
                                    id="quantity" 
                                    className={inputClasses}
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value === '' ? '' : parseInt(e.target.value))}
                                    min="1"
                                    placeholder="e.g., 100"
                                />
                            </div>
                            <div>
                                <label htmlFor="colors" className={labelClasses}>{t.recommenderColorsLabel}</label>
                                <input 
                                    type="number" 
                                    id="colors" 
                                    className={inputClasses}
                                    value={colors}
                                    onChange={(e) => setColors(e.target.value === '' ? '' : parseInt(e.target.value))}
                                    min="1"
                                    placeholder="e.g., 3"
                                />
                            </div>
                        </div>

                        <SegmentedControl label={t.calculatorFabricType} name="fabricType" options={fabricOptions} selected={fabricType} onChange={(e: any) => setFabricType(e.target.value)} />
                        
                        <AnimatePresence>
                        {(fabricType === 'polyester' || fabricType === 'blend') && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: '24px' }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <SegmentedControl label={t.calculatorAntiMigration} name="antiMigration" options={antiMigrationOptions} selected={antiMigrationOption} onChange={(e: any) => setAntiMigrationOption(e.target.value)} />
                            </motion.div>
                        )}
                        </AnimatePresence>

                        <SegmentedControl label={t.calculatorDesignSize} name="designSize" options={sizeOptions} selected={designSize} onChange={(e: any) => setDesignSize(e.target.value)} />
                        <SegmentedControl label={t.calculatorInkType} name="inkType" options={inkOptions} selected={inkType} onChange={(e: any) => setInkType(e.target.value)} />
                        
                        <div className="pt-4 border-t border-zinc-700/50 space-y-4">
                            <ToggleSwitch label={t.calculatorWinterFabric} checked={isWinterFabric} onChange={(e: any) => setIsWinterFabric(e.target.checked)} />
                             <ToggleSwitch label={t.calculatorComplexDesign} checked={isComplexDesign} onChange={(e: any) => setIsComplexDesign(e.target.checked)} />
                        </div>
                    </motion.div>
                    
                    {/* RESULTS */}
                    <div className="space-y-6 sticky top-24">
                        <div className="content-card p-8 min-h-[300px]">
                            <h3 className="text-2xl font-bold text-center text-white mb-6">{t.calculatorResultTitle}</h3>
                            <AnimatePresence mode="wait">
                                {recommendation.type !== 'none' ? (
                                    <motion.div
                                        key={recommendation.type + calculatedPrice.total + calculatedPrice.discount}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.4 }}
                                        className="space-y-6"
                                    >
                                        <div className="text-center bg-zinc-800 p-4 rounded-xl border border-zinc-700">
                                            <h4 className="font-bold text-zinc-400 text-sm uppercase tracking-wider">{t.recommenderResultTitle}</h4>
                                            <div className={`flex items-center justify-center gap-3 my-2 font-bold text-xl text-sky-400`}>
                                            <span>{recommendation.icon}</span>
                                            <span>{t[recommendation.titleKey as keyof typeof t]}</span>
                                            </div>
                                            <p className="text-zinc-300 text-sm">{t[recommendation.reasonKey as keyof typeof t]}</p>
                                        </div>

                                        {(recommendation.type === 'screen' || recommendation.type === 'both') && calculatedPrice.total > 0 && (
                                           <div className="relative">
                                                {isPriceAuthenticated && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="mb-4 text-center"
                                                    >
                                                        <div className="inline-flex items-center gap-3 rounded-full bg-zinc-800 border border-zinc-700 px-6 py-2 text-white">
                                                            <FiClock className="text-sky-500" />
                                                            <span className="font-mono text-2xl font-bold tracking-wider text-gradient">
                                                                0:{priceAuthTimer.toString().padStart(2, '0')}
                                                            </span>
                                                            <span className="text-sm text-zinc-400">Remaining</span>
                                                        </div>
                                                    </motion.div>
                                                )}
                                                <div className={`transition-all duration-300 ${!isPriceAuthenticated ? 'blur-md select-none pointer-events-none' : ''}`}>
                                                    <div className="grid grid-cols-2 gap-4 text-center">
                                                        <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700">
                                                            <h4 className="font-bold text-zinc-400 text-sm uppercase tracking-wider flex items-center justify-center gap-2"><FiTag size={14}/> {t.calculatorPricePerPiece}</h4>
                                                            <p className="text-3xl font-bold text-white mt-2 text-gradient">
                                                            ~<AnimatedCounter value={calculatedPrice.piece} precision={2} /> <span className="text-base font-medium text-zinc-400">{t.pricingEGPCurrency}</span>
                                                            </p>
                                                        </div>
                                                        <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700">
                                                            <h4 className="font-bold text-zinc-400 text-sm uppercase tracking-wider flex items-center justify-center gap-2"><FiDollarSign size={14}/> {t.calculatorTotalPrice}</h4>
                                                            <p className="text-3xl font-bold text-white mt-2 text-gradient">
                                                                ~<AnimatedCounter value={calculatedPrice.total} precision={0} /> <span className="text-base font-medium text-zinc-400">{t.pricingEGPCurrency}</span>
                                                            </p>
                                                            {calculatedPrice.discount > 0 && (
                                                                <motion.div 
                                                                    initial={{opacity: 0}} animate={{opacity: 1}}
                                                                    className="text-xs text-green-400 mt-1 font-semibold flex flex-col items-center justify-center gap-0"
                                                                >
                                                                <span className="flex items-center gap-1">
                                                                    <FiPercent size={12}/> {t.calculatorDiscountApplied.replace('{discount}', calculatedPrice.discount.toString())}
                                                                </span>
                                                                <motion.span 
                                                                        initial={{opacity: 0}} animate={{opacity: 1, transition: {delay: 0.2}}}
                                                                        className="opacity-80"
                                                                    >
                                                                    {t.calculatorDiscountValue.replace('{amount}', new Intl.NumberFormat(language, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(calculatedPrice.discountAmount))}
                                                                </motion.span>
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                {!isPriceAuthenticated && (
                                                    <motion.div 
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/70 backdrop-blur-sm rounded-2xl z-20"
                                                    >
                                                        <FiLock size={40} className="text-zinc-500 mb-4" />
                                                        <button
                                                            onClick={onUnlockPrices}
                                                            className="btn-primary font-bold text-lg"
                                                        >
                                                            <span className="flex items-center justify-center gap-2">
                                                                {t.unlockPrices}
                                                            </span>
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </div>
                                        )}
                                        {recommendation.type === 'dtf' && (
                                            <div className="text-center text-sm text-sky-200 bg-sky-900/30 p-4 rounded-lg border border-sky-700 space-y-3">
                                            <p>{t.calculatorDtfPriceNote}</p>
                                                <a href="https://www.facebook.com/Allam.Clothing.Printing/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-md transition-colors text-xs">
                                                <FiMessageSquare size={14} /> {t.heroCtaQuote}
                                                </a>
                                            </div>
                                        )}
                                    </motion.div>
                                ) : (
                                    <div className="text-center text-zinc-400 py-16">
                                        <p>{t.calculatorInitialPrompt}</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-200 p-4 rounded-r-lg flex items-start gap-4"
                        >
                            <FiAlertTriangle className="w-6 h-6 flex-shrink-0 mt-1 text-yellow-500" />
                            <div>
                                <p className="font-semibold text-sm">{t.pricingDisclaimer}</p>
                            </div>
                        </motion.div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default PrintRecommender;