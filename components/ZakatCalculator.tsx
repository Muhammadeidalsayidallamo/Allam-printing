import React, { useState, useMemo, useContext, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { LanguageContext } from '../App';
import { FiTrendingUp, FiCheckCircle, FiXCircle, FiInfo } from 'react-icons/fi';
import { FaDonate, FaFileInvoiceDollar, FaHandHoldingHeart, FaStarOfLife, FaSeedling, FaChartLine, FaGem } from 'react-icons/fa';
import StaggeredText from './StaggeredText';

type CalculatorMode = 'zakat' | 'sadaqa';

const SegmentedControl = ({ options, selected, onChange, name }: any) => (
    <div className="flex gap-1 rounded-lg bg-zinc-800 p-1 border border-zinc-700 w-full max-w-xs mx-auto">
        {options.map(({ value, labelKey, icon }: any) => (
            <label key={value} className={`relative flex-1 text-center cursor-pointer px-4 py-2 text-sm rounded-md transition-colors font-semibold ${selected === value ? 'text-white' : 'text-zinc-300 hover:text-white'}`}>
                <input type="radio" name={name} value={value} checked={selected === value} onChange={onChange} className="sr-only" />
                <span className="relative z-10 flex items-center justify-center gap-2">{icon} {labelKey}</span>
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
);

const AnimatedCounter = ({ value, prefix = '', suffix = '', precision = 2, isHasanat = false }) => {
    const spring = useSpring(value, { mass: 0.8, stiffness: 100, damping: 20 });
    const display = useTransform(spring, (current) => {
        const num = Number(current);
        if (isHasanat && num >= 1_000_000) {
            return `${prefix}${(num / 1_000_000).toFixed(1)}M${suffix}`;
        }
        if (isHasanat && num >= 1_000) {
            return `${prefix}${(num / 1_000).toFixed(1)}K${suffix}`;
        }
        const formatter = new Intl.NumberFormat(undefined, {
            minimumFractionDigits: precision,
            maximumFractionDigits: precision,
        });
        return `${prefix}${formatter.format(num)}${suffix}`;
    });
  
    useEffect(() => {
      spring.set(value);
    }, [spring, value]);
  
    return <motion.span>{display}</motion.span>;
};

const ToggleSwitch = ({ label, checked, onChange, disabled = false }: any) => (
    <label className={`flex items-center justify-between text-xs text-gray-300 w-full ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
        <span>{label}</span>
        <div className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${checked ? 'bg-sky-500' : 'bg-zinc-700'}`}>
          <motion.div
            layout
            className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md"
            transition={{ type: 'spring', stiffness: 700, damping: 30 }}
            style={{ x: checked ? '20px' : '0px' }}
          />
        </div>
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" disabled={disabled} />
    </label>
);


const ZakatCalculator: React.FC = () => {
    const { t } = useContext(LanguageContext);
    const [mode, setMode] = useState<CalculatorMode>('zakat');

    // Zakat inputs
    const [cash, setCash] = useState<number | ''>('');
    const [goldGrams, setGoldGrams] = useState<number | ''>('');
    const [silverGrams, setSilverGrams] = useState<number | ''>('');
    const [investments, setInvestments] = useState<number | ''>('');
    const [inventory, setInventory] = useState<number | ''>('');
    const [debts, setDebts] = useState<number | ''>('');
    
    // Gold Price State Management
    const [liveGoldPrice, setLiveGoldPrice] = useState<number | ''>('');
    const [manualGoldPrice, setManualGoldPrice] = useState<number | ''>('');
    const [isUsingManualPrice, setIsUsingManualPrice] = useState(false);
    const [isLoadingGoldPrice, setIsLoadingGoldPrice] = useState(true);

    // Sadaqa input
    const [sadaqaAmount, setSadaqaAmount] = useState<number | ''>('');

    useEffect(() => {
        const fetchGoldAndCurrencyRates = async () => {
            setIsLoadingGoldPrice(true);
            try {
                const [goldResponse, currencyResponse] = await Promise.all([
                    fetch('https://api.gold-api.com/price/XAU'),
                    fetch('https://open.er-api.com/v6/latest/USD')
                ]);

                if (!goldResponse.ok || !currencyResponse.ok) throw new Error('Failed to fetch market data');
                
                const goldData = await goldResponse.json();
                const currencyData = await currencyResponse.json();

                const goldPriceUsdPerOunce = goldData.price;
                if (!goldPriceUsdPerOunce) throw new Error('Gold price not found');
                
                const usdToEgpRate = currencyData.rates.EGP;
                if (!usdToEgpRate) throw new Error('EGP rate not found');

                const goldPriceEgpPerGram = (goldPriceUsdPerOunce / 31.1035) * usdToEgpRate;
                setLiveGoldPrice(parseFloat(goldPriceEgpPerGram.toFixed(2)));

            } catch (error) {
                console.error("Error fetching live gold/currency data:", error);
                setLiveGoldPrice(3600); // Set a fallback on error
            } finally {
                setIsLoadingGoldPrice(false);
            }
        };
        fetchGoldAndCurrencyRates();
    }, []);

    const effectiveGoldPrice = useMemo(() => {
        return isUsingManualPrice ? Number(manualGoldPrice) : Number(liveGoldPrice);
    }, [isUsingManualPrice, manualGoldPrice, liveGoldPrice]);

    const { nisab, totalWealth, zakatAmount, isZakatDue } = useMemo(() => {
        const gp = effectiveGoldPrice || 0;
        const nisab = gp * 85;

        const totalAssets = (Number(cash) || 0) + 
                             ((Number(goldGrams) || 0) * gp) +
                             (Number(investments) || 0) +
                             (Number(inventory) || 0);

        const totalWealth = totalAssets - (Number(debts) || 0);
        const isZakatDue = totalWealth >= nisab && totalWealth > 0;
        const zakatAmount = isZakatDue ? totalWealth * 0.025 : 0;

        return { nisab, totalWealth, zakatAmount, isZakatDue };
    }, [cash, goldGrams, investments, inventory, debts, effectiveGoldPrice]);
    
    const handleManualPriceToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isManual = e.target.checked;
        setIsUsingManualPrice(isManual);
        if (isManual && manualGoldPrice === '' && liveGoldPrice !== '') {
            // Pre-fill manual input with live price for user convenience
            setManualGoldPrice(liveGoldPrice);
        }
    };

    const hasanatMultiplier = 700;
    const zakatHasanat = zakatAmount * hasanatMultiplier;
    const sadaqaHasanat = (Number(sadaqaAmount) || 0) * hasanatMultiplier;
    
    const inputClasses = "w-full bg-zinc-800 border-2 border-zinc-700 text-white rounded-md py-3 px-4 transition-all outline-none font-bold text-lg focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-center";
    const labelClasses = "block text-sm font-medium text-zinc-400 mb-2 text-center";

    const calculatorOptions = [
        { value: 'zakat', labelKey: t.zakatTab, icon: <FaDonate /> },
        { value: 'sadaqa', labelKey: t.sadaqaTab, icon: <FaHandHoldingHeart /> },
    ];
    
    const virtues = [
        { icon: <FaSeedling className="text-sky-300" />, labelKey: 'virtuesZakatLabel', textKey: 'virtuesZakatText' },
        { icon: <FaHandHoldingHeart className="text-pink-300" />, labelKey: 'virtuesSadaqaLabel', textKey: 'virtuesSadaqaText' },
        { icon: <FaGem className="text-purple-300" />, labelKey: 'virtuesHasanahTitle', textKey: 'virtuesHasanahText' },
        { icon: <FaChartLine className="text-yellow-300" />, labelKey: 'virtuesBusinessMotivationTitle', textKey: 'virtuesBusinessMotivation', isSpecial: true }
    ];

    return (
        <section id="zakat" className="py-20 md:py-28 section-bg-dark">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12">
                    <StaggeredText text={t.zakatTitle} as="h2" className="text-4xl md:text-5xl font-extrabold text-white" />
                    <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">{t.zakatSubtitle}</p>
                </div>
                
                <div className="mb-10">
                    <SegmentedControl options={calculatorOptions} selected={mode} onChange={(e: any) => setMode(e.target.value)} name="calculatorMode" />
                </div>
                
                <AnimatePresence mode="wait">
                <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                >
                {mode === 'zakat' ? (
                    <>
                     <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
                        {/* Zakat Inputs */}
                        <motion.div 
                            className="content-card p-8 rounded-2xl space-y-4 lg:col-span-2"
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
                        >
                            <h3 className="text-2xl font-bold text-center text-white mb-4">{t.zakatConfigTitle}</h3>
                            <div>
                                <label className={labelClasses}>{t.zakatCashLabel}</label>
                                <input type="number" value={cash} onChange={e => setCash(e.target.value === '' ? '' : parseFloat(e.target.value))} className={inputClasses} placeholder="0" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClasses}>{t.zakatGoldLabel}</label>
                                    <input type="number" value={goldGrams} onChange={e => setGoldGrams(e.target.value === '' ? '' : parseFloat(e.target.value))} className={inputClasses} placeholder="0" />
                                </div>
                                <div className="space-y-2">
                                    <label className={`${labelClasses} flex items-center justify-center gap-2`}>
                                        {t.zakatGoldPriceLabel}
                                        <motion.span 
                                            key={isLoadingGoldPrice ? 'loading' : (isUsingManualPrice ? 'manual' : 'live')}
                                            initial={{opacity: 0, scale: 0.5}} animate={{opacity: 1, scale: 1}}
                                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${isLoadingGoldPrice ? 'bg-zinc-600 animate-pulse' : (isUsingManualPrice ? 'bg-yellow-500 text-white' : 'bg-sky-500 text-white')}`}
                                        >
                                            {isLoadingGoldPrice ? '...' : (isUsingManualPrice ? 'MANUAL' : 'LIVE')}
                                        </motion.span>
                                    </label>
                                    <input 
                                        type="number" 
                                        value={isUsingManualPrice ? manualGoldPrice : liveGoldPrice}
                                        placeholder={isLoadingGoldPrice ? t.zakatFetchingPrice : '...'}
                                        onChange={e => { if (isUsingManualPrice) { setManualGoldPrice(e.target.value === '' ? '' : parseFloat(e.target.value)) }}}
                                        readOnly={!isUsingManualPrice}
                                        disabled={isLoadingGoldPrice}
                                        className={`${inputClasses} ${!isUsingManualPrice ? 'cursor-not-allowed opacity-70' : ''}`}
                                    />
                                    <ToggleSwitch
                                        label={t.zakatManualPriceToggle}
                                        checked={isUsingManualPrice}
                                        onChange={handleManualPriceToggle}
                                        disabled={isLoadingGoldPrice}
                                    />
                                </div>
                            </div>
                             <div>
                                <label className={labelClasses}>{t.zakatInvestmentsLabel}</label>
                                <input type="number" value={investments} onChange={e => setInvestments(e.target.value === '' ? '' : parseFloat(e.target.value))} className={inputClasses} placeholder="0" />
                            </div>
                            <div>
                                <label className={labelClasses}>{t.zakatBusinessGoodsLabel}</label>
                                <input type="number" value={inventory} onChange={e => setInventory(e.target.value === '' ? '' : parseFloat(e.target.value))} className={inputClasses} placeholder="0" />
                            </div>
                             <div>
                                <label className={labelClasses}>{t.zakatDebtsLabel}</label>
                                <input type="number" value={debts} onChange={e => setDebts(e.target.value === '' ? '' : parseFloat(e.target.value))} className={inputClasses} placeholder="0" />
                            </div>
                        </motion.div>

                        {/* Zakat Results */}
                        <div className="lg:col-span-3 space-y-6">
                            <div className="content-card p-8 rounded-2xl min-h-[300px]">
                                <h3 className="text-2xl font-bold text-center text-white mb-6">{t.zakatResultTitle}</h3>
                                <div className="grid md:grid-cols-2 gap-4 text-center">
                                     <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700">
                                        <h4 className="font-bold text-gray-400 text-sm uppercase tracking-wider flex items-center justify-center gap-2"><FaFileInvoiceDollar size={14}/> {t.zakatNisabThresholdLabel}</h4>
                                        <p className="text-2xl font-bold text-white mt-2">
                                        <AnimatedCounter value={nisab} precision={0} /> <span className="text-base font-medium text-gray-400">{t.egpUnit}</span>
                                        </p>
                                    </div>
                                     <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700">
                                        <h4 className="font-bold text-gray-400 text-sm uppercase tracking-wider flex items-center justify-center gap-2"><FiTrendingUp size={14}/> {t.zakatTotalWealthLabel}</h4>
                                        <p className="text-2xl font-bold text-white mt-2">
                                        <AnimatedCounter value={totalWealth} precision={0} /> <span className="text-base font-medium text-gray-400">{t.egpUnit}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 text-center">
                                {isZakatDue ? (
                                    <div className="text-green-500 font-bold text-xl flex items-center justify-center gap-2"><FiCheckCircle /> {t.zakatDueLabel}</div>
                                ) : (
                                    <>
                                        <div className="text-yellow-500 font-bold text-xl flex items-center justify-center gap-2"><FiXCircle /> {t.zakatNotDueLabel}</div>
                                        {totalWealth > 0 && <p className="text-gray-400 text-sm mt-1">{t.zakatNotDueReason}</p>}
                                    </>
                                )}
                                </div>
                                
                                {isZakatDue && (
                                    <div className="mt-6 grid md:grid-cols-2 gap-4 text-center">
                                         <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 ring-2 ring-sky-500">
                                            <h4 className="font-bold text-gray-400 text-sm uppercase tracking-wider flex items-center justify-center gap-2"><FaDonate size={14}/> {t.zakatAmountPayableLabel}</h4>
                                            <p className="text-4xl font-bold text-white mt-2">
                                            <AnimatedCounter value={zakatAmount} precision={2} /> <span className="text-lg font-medium text-gray-400">{t.egpUnit}</span>
                                            </p>
                                        </div>
                                         <div className="bg-sky-900/30 p-4 rounded-xl border border-sky-700">
                                            <h4 className="font-bold text-sky-200 text-sm uppercase tracking-wider flex items-center justify-center gap-2"><FaStarOfLife size={14}/> {t.zakatHasanatEarnedLabel}</h4>
                                            <p className="text-4xl font-bold text-sky-300 mt-2">
                                            <AnimatedCounter value={zakatHasanat} precision={0} isHasanat={true} /> <span className="text-lg font-medium text-sky-400">{t.hasanatUnit}</span>
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 text-center text-xs text-zinc-400">
                                <FiInfo className="inline mr-1" />
                                {t.zakatApiDisclaimer}
                            </div>
                        </div>
                     </div>
                    </>
                ) : ( // Sadaqa mode
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                        {/* Sadaqa Input */}
                        <motion.div 
                            className="content-card p-8 rounded-2xl space-y-4"
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
                        >
                            <h3 className="text-2xl font-bold text-center text-white mb-4">{t.sadaqaTab}</h3>
                            <div>
                                <label className={labelClasses}>{t.sadaqaAmountLabel}</label>
                                <input type="number" value={sadaqaAmount} onChange={e => setSadaqaAmount(e.target.value === '' ? '' : parseFloat(e.target.value))} className={inputClasses} placeholder="0" />
                            </div>
                        </motion.div>

                        {/* Sadaqa Result */}
                        <div className="space-y-6">
                            <div className="content-card p-8 rounded-2xl">
                                <h3 className="text-2xl font-bold text-center text-white mb-6">{t.sadaqaHasanatEarnedLabel}</h3>
                                {Number(sadaqaAmount) > 0 ? (
                                    <div className="bg-sky-900/30 p-4 rounded-xl ring-2 ring-sky-500 text-center">
                                        <h4 className="font-bold text-sky-200 text-sm uppercase tracking-wider flex items-center justify-center gap-2"><FaStarOfLife size={14}/> {t.sadaqaHasanatEarnedLabel}</h4>
                                        <p className="text-4xl font-bold text-sky-300 mt-2">
                                        <AnimatedCounter value={sadaqaHasanat} precision={0} isHasanat={true} /> <span className="text-lg font-medium">{t.hasanatUnit}</span>
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-center text-zinc-400 py-8">{t.sadaqaPrompt}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                </motion.div>
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mt-16 max-w-5xl mx-auto"
                >
                    <h3 className="text-3xl font-bold text-center text-white mb-8">{t.virtuesTitle}</h3>
                    <div className="space-y-6">
                        {virtues.map(virtue => (
                            <div key={virtue.labelKey} className={`content-card p-6 flex items-start gap-4 ${virtue.isSpecial ? 'bg-sky-900/20 border-sky-800' : ''}`}>
                                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-zinc-800 rounded-xl">{virtue.icon}</div>
                                <div>
                                    <h4 className="font-bold text-lg text-white mb-1">{t[virtue.labelKey as keyof typeof t]}</h4>
                                    <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed">{t[virtue.textKey as keyof typeof t]}</p>
                                    {virtue.labelKey === 'virtuesHasanahTitle' && <p className="mt-4 text-sm font-semibold text-gray-200 whitespace-pre-line">{t.virtuesHasanahCta}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-zinc-400 text-center mt-4">{t.hasanatExplanation}</p>
                </motion.div>

            </div>
        </section>
    );
};

export default ZakatCalculator;