import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, FileText, CheckCircle, Download, TrendingUp, Wallet } from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

const Liquidaciones = () => {
    const [liquidaciones, setLiquidaciones] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const data = await api.getLiquidations();
            setLiquidaciones(data);
        } catch (err: any) {
            toast.error('Error al cargar liquidaciones');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const totalLiquidado = liquidaciones.reduce((sum, l) => sum + l.monto, 0);

    return (
        <div className="space-y-10">
            <header>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Liquidaciones</h2>
                <p className="text-slate-500 font-medium">Historial de pagos y balances consolidados.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2 bg-slate-950 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-between h-72">
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/10 rounded-full blur-[80px]" />
                    <Wallet size={100} className="absolute right-10 top-10 text-white/5 -rotate-12" />
                    <div>
                        <p className="text-orange-500 font-black uppercase tracking-[0.2em] text-[10px] mb-2">Total Consolidado</p>
                        <h4 className="text-6xl font-black tracking-tighter">$ {totalLiquidado.toLocaleString()}</h4>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative z-10 w-fit bg-white text-slate-950 px-10 py-4 rounded-2xl font-black text-sm transition-all shadow-xl hover:bg-orange-500 hover:text-white"
                    >
                        NUEVA LIQUIDACIÓN
                    </motion.button>
                </div>

                <div className="bg-white p-8 rounded-[3rem] shadow-premium border border-slate-100 flex flex-col justify-between h-72">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl w-fit">
                        <TrendingUp size={28} />
                    </div>
                    <div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Crecimiento Mensual</p>
                        <h4 className="text-4xl font-black text-slate-800">+14%</h4>
                        <p className="text-xs text-emerald-600 font-bold mt-2">$+12,400 vs mes anterior</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[3rem] shadow-premium border border-slate-100 flex flex-col justify-between h-72">
                    <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl w-fit">
                        <FileText size={28} />
                    </div>
                    <div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Planillas Emitidas</p>
                        <h4 className="text-4xl font-black text-slate-800">{liquidaciones.length}</h4>
                        <p className="text-xs text-slate-500 font-medium mt-2">Documentos listos para descarga</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                    Ultimas Operaciones
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {liquidaciones.map((liq, idx) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            key={liq.id}
                            className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-premium flex flex-col justify-between hover:shadow-xl transition-all h-[400px] group"
                        >
                            <div className="flex justify-between items-start">
                                <div className="p-5 bg-slate-50 text-slate-900 rounded-[2rem] group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                    <FileText size={32} />
                                </div>
                                <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full uppercase tracking-widest border border-emerald-200">
                                    <CheckCircle size={10} className="inline mr-1" /> Completada
                                </span>
                            </div>

                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Liquidación <span className="text-slate-900">#0{liq.id}</span></p>
                                <h3 className="text-2xl font-black text-slate-800 mb-6">{liq.cliente?.nombre || 'S/N'}</h3>
                                <div className="flex justify-between items-end border-t border-slate-50 pt-8">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Total Acreedor</p>
                                        <p className="text-4xl font-black text-slate-800">${liq.monto.toLocaleString()}</p>
                                    </div>
                                    <button className="p-4 bg-slate-50 text-slate-400 hover:text-white hover:bg-slate-950 rounded-2xl transition-all shadow-sm">
                                        <Download size={22} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {liquidaciones.length === 0 && !loading && (
                        <div className="col-span-full py-40 border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center text-slate-300">
                            <CreditCard size={64} className="opacity-10 mb-4" />
                            <p className="font-black">No hay liquidaciones generadas aún.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Liquidaciones;
