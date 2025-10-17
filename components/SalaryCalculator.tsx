import React, { useState, useMemo, useContext, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { LanguageContext } from '../App';
import { FiKey, FiAlertCircle, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { FaCalendarCheck, FaBusinessTime, FaStopwatch, FaCoins, FaPiggyBank, FaFileInvoiceDollar, FaUserSlash } from 'react-icons/fa';
import StaggeredText from './StaggeredText';

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

const validPasswords = ['01208805931', '2002'];

const SalaryCalculator: React.FC = () => {
    const { t } = useContext(LanguageContext);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [shake, setShake] = useState(false);

    // Calculator inputs
    const [dailyWage, setDailyWage] = useState<number | ''>('');
    const [workDays, setWorkDays] = useState<number | ''>(26);
    const [lateHours, setLateHours] = useState<number | ''>('');
    const [lateMinutes, setLateMinutes] = useState<number | ''>('');
    const [overtimeHours, setOvertimeHours] = useState<number | ''>('');
    const [overtimeMinutes, setOvertimeMinutes] = useState<number | ''>('');
    const [overtimeMultiplier, setOvertimeMultiplier] = useState<number | ''>(1.5);
    const [unauthorizedAbsence, setUnauthorizedAbsence] = useState<number | ''>('');
    const [otherDeductions, setOtherDeductions] = useState<number | ''>('');


    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        if (validPasswords.includes(password.trim())) {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError(t.salaryAuthError);
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
    };
    
    const { 
        hourlyRate, 
        overtimeRate, 
        baseSalary, 
        lateDeduction, 
        absenceDeduction,
        overtimePay, 
        netSalary 
    } = useMemo(() => {
        const dw = Number(dailyWage) || 0;
        const wd = Number(workDays) || 0;
        const lh = Number(lateHours) || 0;
        const lm = Number(lateMinutes) || 0;
        const oh = Number(overtimeHours) || 0;
        const om = Number(overtimeMinutes) || 0;
        const otm = Number(overtimeMultiplier) || 1.5;
        const ua = Number(unauthorizedAbsence) || 0;
        const od = Number(otherDeductions) || 0;


        if (dw <= 0) return { hourlyRate: 0, overtimeRate: 0, baseSalary: 0, lateDeduction: 0, absenceDeduction: 0, overtimePay: 0, netSalary: 0 };

        const hourlyRate = dw / 8; // Assuming 8-hour workday
        const overtimeRate = hourlyRate * otm;

        const baseSalary = dw * wd;

        const totalLateMinutes = (lh * 60) + lm;
        const lateDeduction = (totalLateMinutes / 60) * hourlyRate;

        const totalOvertimeMinutes = (oh * 60) + om;
        const overtimePay = (totalOvertimeMinutes / 60) * overtimeRate;

        const absenceDeduction = ua * dw * 2;

        const netSalary = baseSalary - lateDeduction - absenceDeduction - od + overtimePay;

        return { hourlyRate, overtimeRate, baseSalary, lateDeduction, absenceDeduction, overtimePay, netSalary };
    }, [dailyWage, workDays, lateHours, lateMinutes, overtimeHours, overtimeMinutes, overtimeMultiplier, unauthorizedAbsence, otherDeductions]);

    const inputClasses = "w-full bg-zinc-800 border-2 border-zinc-700 text-white rounded-md py-3 px-4 transition-all outline-none font-bold text-lg focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-center";
    const labelClasses = "block text-sm font-medium text-zinc-400 mb-2 flex items-center justify-center gap-2";
    
    const shakeVariants = {
        shake: {
            x: [0, -10, 10, -10, 10, 0],
            transition: { duration: 0.5 }
        },
        initial: {}
    };

    if (!isAuthenticated) {
        return (
            <section id="salary-calculator" className="py-20 md:py-28 section-bg-alt">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[400px]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        variants={shakeVariants}
                        className="relative content-card p-8 rounded-2xl w-full max-w-md"
                    >
                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center bg-sky-500/10 text-sky-300 rounded-full">
                                <FiKey size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{t.salaryAuthTitle}</h3>
                            <p className="text-gray-300 mb-6">{t.salaryAuthSubtitle}</p>
                        </div>
                        <form onSubmit={handleAuth} className="space-y-4">
                            <input 
                                type="password" 
                                placeholder={t.salaryAuthPassword}
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); if(error) setError(''); }}
                                className={`w-full bg-zinc-800 border-2 ${error ? 'border-red-500' : 'border-zinc-700'} text-white rounded-md py-3 px-4 transition-all outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-center`} 
                                required 
                                autoFocus
                            />
                            {error && (
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 text-sm text-red-400">
                                   <FiAlertCircle size={14} /> {error}
                                </motion.p>
                            )}
                            <button type="submit" className="w-full text-lg btn-primary">
                                <span className="flex items-center justify-center gap-2">{t.salaryAuthSubmit}</span>
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>
        );
    }


    return (
        <section id="salary-calculator" className="py-20 md:py-28 section-bg-alt">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12">
                    <StaggeredText text={t.salaryTitle} as="h2" className="text-4xl md:text-5xl font-extrabold text-white" />
                    <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">{t.salarySubtitle}</p>
                </div>
                
                <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start max-w-7xl mx-auto">
                    {/* Inputs */}
                    <motion.div 
                        className="content-card p-8 rounded-2xl space-y-4 lg:col-span-2"
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
                    >
                        <h3 className="text-2xl font-bold text-center text-white mb-4">{t.calculatorInputTitle}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}><FaCoins/> {t.salaryDailyWage}</label>
                                <input type="number" value={dailyWage} onChange={e => setDailyWage(e.target.value === '' ? '' : parseFloat(e.target.value))} className={inputClasses} placeholder="0" />
                            </div>
                            <div>
                                <label className={labelClasses}><FaCalendarCheck/> {t.salaryWorkDays}</label>
                                <input type="number" value={workDays} onChange={e => setWorkDays(e.target.value === '' ? '' : parseFloat(e.target.value))} className={inputClasses} placeholder="0" />
                            </div>
                        </div>
                        <div>
                             <label className={labelClasses}><FaStopwatch/> {t.salaryLateTime}</label>
                             <div className="grid grid-cols-2 gap-4">
                                <input type="number" value={lateHours} onChange={e => setLateHours(e.target.value === '' ? '' : parseFloat(e.target.value))} className={inputClasses} placeholder={t.salaryHours} />
                                <input type="number" value={lateMinutes} onChange={e => setLateMinutes(e.target.value === '' ? '' : parseFloat(e.target.value))} className={inputClasses} placeholder={t.salaryMinutes} />
                            </div>
                        </div>
                        <div>
                             <label className={labelClasses}><FaBusinessTime/> {t.salaryOvertime}</label>
                             <div className="grid grid-cols-2 gap-4">
                                <input type="number" value={overtimeHours} onChange={e => setOvertimeHours(e.target.value === '' ? '' : parseFloat(e.target.value))} className={inputClasses} placeholder={t.salaryHours} />
                                <input type="number" value={overtimeMinutes} onChange={e => setOvertimeMinutes(e.target.value === '' ? '' : parseFloat(e.target.value))} className={inputClasses} placeholder={t.salaryMinutes} />
                            </div>
                        </div>
                         <div>
                            <label className={labelClasses}><FiTrendingUp/> {t.salaryOvertimeMultiplier}</label>
                            <input
                                type="number"
                                value={overtimeMultiplier}
                                onChange={e => setOvertimeMultiplier(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                className={inputClasses}
                                placeholder="1.5"
                                step="0.1"
                                min="0"
                            />
                        </div>
                         <div className="pt-4 border-t border-zinc-700/50 space-y-4">
                            <div>
                                <label className={labelClasses}><FaUserSlash/> {t.salaryAbsenceDays}</label>
                                <input type="number" value={unauthorizedAbsence} onChange={e => setUnauthorizedAbsence(e.target.value === '' ? '' : parseFloat(e.target.value))} className={inputClasses} placeholder="0" />
                                <p className="text-xs text-center text-gray-400 mt-2">{t.salaryAbsenceDaysNote}</p>
                            </div>
                             <div>
                                <label className={labelClasses}><FaFileInvoiceDollar/> {t.salaryOtherDeductions}</label>
                                <input type="number" value={otherDeductions} onChange={e => setOtherDeductions(e.target.value === '' ? '' : parseFloat(e.target.value))} className={inputClasses} placeholder="0" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Results */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="content-card p-8 rounded-2xl">
                             <h3 className="text-2xl font-bold text-center text-white mb-6">{t.salaryCalculationResult}</h3>
                             <div className="grid grid-cols-2 gap-4 text-center mb-6">
                                <div className="bg-zinc-800 p-3 rounded-xl border border-zinc-700">
                                    <h4 className="font-bold text-gray-400 text-xs uppercase tracking-wider">{t.salaryHourlyRate}</h4>
                                    <p className="text-xl font-bold text-white mt-1">
                                        <AnimatedCounter value={hourlyRate} precision={2} /> <span className="text-sm font-medium text-gray-400">{t.egpUnit}</span>
                                    </p>
                                </div>
                                <div className="bg-zinc-800 p-3 rounded-xl border border-zinc-700">
                                    <h4 className="font-bold text-gray-400 text-xs uppercase tracking-wider">{t.salaryOvertimeRate}</h4>
                                    <p className="text-xl font-bold text-white mt-1">
                                        <AnimatedCounter value={overtimeRate} precision={2} /> <span className="text-sm font-medium text-gray-400">{t.egpUnit}</span>
                                    </p>
                                </div>
                             </div>

                             <div className="space-y-4">
                                <div className="flex justify-between items-center bg-zinc-800 p-4 rounded-xl">
                                    <h4 className="font-semibold text-gray-300 flex items-center gap-2"><FaCoins/> {t.salaryBaseSalary}</h4>
                                    <p className="text-2xl font-bold text-white">
                                        + <AnimatedCounter value={baseSalary} precision={2} /> <span className="text-base text-gray-400">{t.egpUnit}</span>
                                    </p>
                                </div>
                                <AnimatePresence>
                                {overtimePay > 0 && (
                                    <motion.div 
                                        initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} exit={{opacity: 0, height: 0}}
                                        className="flex justify-between items-center bg-zinc-800 p-4 rounded-xl"
                                    >
                                        <h4 className="font-semibold text-green-400 flex items-center gap-2"><FiTrendingUp /> {t.salaryTotalOvertime}</h4>
                                        <p className="text-2xl font-bold text-green-400">
                                           + <AnimatedCounter value={overtimePay} precision={2} /> <span className="text-base">{t.egpUnit}</span>
                                        </p>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                                <AnimatePresence>
                                {lateDeduction > 0 && (
                                    <motion.div 
                                        initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} exit={{opacity: 0, height: 0}}
                                        className="flex justify-between items-center bg-zinc-800 p-4 rounded-xl"
                                    >
                                        <h4 className="font-semibold text-red-400 flex items-center gap-2"><FiTrendingDown/> {t.salaryLateTimeDeduction}</h4>
                                        <p className="text-2xl font-bold text-red-400">
                                        - <AnimatedCounter value={lateDeduction} precision={2} /> <span className="text-base">{t.egpUnit}</span>
                                        </p>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                                <AnimatePresence>
                                {absenceDeduction > 0 && (
                                    <motion.div 
                                        initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} exit={{opacity: 0, height: 0}}
                                        className="flex justify-between items-center bg-zinc-800 p-4 rounded-xl"
                                    >
                                        <h4 className="font-semibold text-red-400 flex items-center gap-2"><FiTrendingDown/> {t.salaryAbsenceDeduction}</h4>
                                        <p className="text-2xl font-bold text-red-400">
                                        - <AnimatedCounter value={absenceDeduction} precision={2} /> <span className="text-base">{t.egpUnit}</span>
                                        </p>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                                <AnimatePresence>
                                {Number(otherDeductions) > 0 && (
                                    <motion.div 
                                        initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} exit={{opacity: 0, height: 0}}
                                        className="flex justify-between items-center bg-zinc-800 p-4 rounded-xl"
                                    >
                                        <h4 className="font-semibold text-red-400 flex items-center gap-2"><FiTrendingDown/> {t.salaryOtherDeductions}</h4>
                                        <p className="text-2xl font-bold text-red-400">
                                        - <AnimatedCounter value={Number(otherDeductions)} precision={2} /> <span className="text-base">{t.egpUnit}</span>
                                        </p>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                             </div>
                             
                             <div className="mt-6 p-6 rounded-2xl bg-sky-500/10 border-2 border-sky-500 flex justify-between items-center">
                                 <h4 className="text-xl font-bold text-white flex items-center gap-3"><FaPiggyBank size={24}/> {t.salaryNetSalary}</h4>
                                 <p className="text-4xl font-extrabold text-white">
                                     <AnimatedCounter value={netSalary} precision={2} /> <span className="text-2xl text-gray-300">{t.egpUnit}</span>
                                 </p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SalaryCalculator;