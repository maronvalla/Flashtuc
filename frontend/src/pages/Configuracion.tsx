import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layers, DollarSign, Plus, Check, Trash2, Edit3, Shield } from 'lucide-react';

const Configuracion = () => {
    const [zonas, setZonas] = useState<any[]>([]);
    const [tarifas, setTarifas] = useState<any[]>([]);

    useEffect(() => {
        Promise.all([
            fetch('http://localhost:3000/api/zonas').then(res => res.json()),
            fetch('http://localhost:3000/api/tarifas').then(res => res.json())
        ]).then(([zData, tData]) => {
            setZonas(zData);
            setTarifas(tData);
        }).catch(err => console.error(err));
    }, []);

    return (
        <div className="space-y-12 pb-20">
            <header>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Configuración</h2>
                <p className="text-slate-500 font-medium">Define los parámetros de tu red de logística.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <section className="space-y-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                            <Layers className="text-orange-500" /> Cobertura y Zonas
                        </h2>
                        <button className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg">
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-premium border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre de Zona</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Factor</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 font-medium text-sm">
                                    {zonas.map(zona => (
                                        <tr key={zona.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-8 py-6 font-bold text-slate-800 uppercase tracking-wide">{zona.nombre}</td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full text-xs font-black">x {zona.multiplicador}</span>
                                            </td>
                                            <td className="px-8 py-6 text-right space-x-2">
                                                <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><Edit3 size={16} /></button>
                                                <button className="p-2 text-slate-300 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <section className="space-y-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                            <DollarSign className="text-orange-500" /> Tarifas Activas
                        </h2>
                        <button className="flex items-center gap-2 bg-orange-500 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-glow">
                            Nueva Lista <Plus size={16} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {tarifas.map((tarifa, idx) => (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={tarifa.id}
                                className="bg-slate-950 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-8 transform group-hover:scale-110 transition-transform">
                                    <Shield size={60} className="text-white/5" />
                                </div>

                                <div className="flex justify-between items-start mb-10">
                                    <div>
                                        <h3 className="text-2xl font-black mb-1">{tarifa.nombre}</h3>
                                        <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-1 w-fit">
                                            <Check size={10} /> Vigente
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base</p>
                                        <p className="text-3xl font-black">${tarifa.base}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-orange-500/30 transition-all">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] mb-1">Bulto Extra</p>
                                        <p className="text-lg font-black text-orange-400">${tarifa.precio_por_bulto}</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-orange-500/30 transition-all">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] mb-1">Precio x KM</p>
                                        <p className="text-lg font-black text-orange-400">${tarifa.precio_por_km}</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-orange-500/30 transition-all">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] mb-1">Prioridad</p>
                                        <p className="text-lg font-black text-orange-400">x {tarifa.multiplicador_urgente}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Configuracion;
