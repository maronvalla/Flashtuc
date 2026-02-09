import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Map, Plus, Play, Truck, MapPin, ChevronRight, Calendar } from 'lucide-react';

const Rutas = () => {
    const [rutas, setRutas] = useState<any[]>([]);
    const [enviosSinRuta, setEnviosSinRuta] = useState<any[]>([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/rutas').then(res => res.json()).then(setRutas);
        fetch('http://localhost:3000/api/envios').then(res => res.json()).then(data => {
            setEnviosSinRuta(data.filter((e: any) => !e.ruta_id));
        });
    }, []);

    const handleCrearRuta = async () => {
        const res = await fetch('http://localhost:3000/api/rutas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fecha: new Date(), chofer_nombre: 'Chofer Default' })
        });
        if (res.ok) {
            const newRuta = await res.json();
            setRutas([...rutas, newRuta]);
        }
    };

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Hojas de Ruta</h2>
                    <p className="text-slate-500 font-medium">Asignación y optimización de despachos diarios.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCrearRuta}
                    className="grad-slate text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl transition-all"
                >
                    <Plus size={20} /> Nueva Hoja de Ruta
                </motion.button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                    {rutas.map((ruta, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={ruta.id}
                            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-premium overflow-hidden group"
                        >
                            <div className="p-8 pb-4 flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100">
                                        <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Día</span>
                                        <span className="text-2xl font-black text-slate-800 leading-none">{new Date(ruta.fecha).getDate()}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-800">{ruta.chofer_nombre}</h3>
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-xs mt-1">
                                            <Calendar size={12} />
                                            <span>{new Date(ruta.fecha).toLocaleDateString()}</span>
                                            <span className="text-slate-200">•</span>
                                            <span>ID: #{ruta.id}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-200">
                                    {ruta.estado}
                                </span>
                            </div>

                            <div className="px-8 py-6 space-y-3 bg-slate-50/30">
                                {ruta.envios?.map((e: any) => (
                                    <div key={e.id} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-orange-200 transition-all shadow-sm group/item cursor-pointer">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center font-black text-slate-300 text-xs">
                                            #{e.id}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-black text-slate-800 leading-none mb-1">{e.destinatario_nombre}</p>
                                            <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                                                <MapPin size={8} /> {e.direccion_destino}
                                            </p>
                                        </div>
                                        <button className="p-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                            <ChevronRight size={18} className="text-orange-500" />
                                        </button>
                                    </div>
                                ))}
                                {(!ruta.envios || ruta.envios.length === 0) && (
                                    <div className="text-center py-10 text-slate-300 flex flex-col items-center gap-2 border-2 border-dashed border-slate-100 rounded-[2rem] bg-white/50">
                                        <Map size={32} className="opacity-10" />
                                        <p className="text-sm font-black">Sin envíos asignados</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 pt-4">
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    className="w-full grad-orange text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-glow uppercase text-xs tracking-[0.2em]"
                                >
                                    <Play size={16} fill="currentColor" /> INICIAR LOGÍSTICA
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="lg:col-span-4 h-fit sticky top-10 space-y-6">
                    <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Truck size={100} className="rotate-12" />
                        </div>
                        <h3 className="text-2xl font-black mb-1 flex items-center gap-2">
                            Despachos
                        </h3>
                        <p className="text-slate-400 text-sm font-medium mb-10">Pendientes de asignación hoy.</p>

                        <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 scrollbar-none">
                            {enviosSinRuta.map(e => (
                                <motion.div
                                    layout
                                    key={e.id}
                                    className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:border-orange-500/50 transition-all cursor-pointer group backdrop-blur-sm"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="font-black text-sm truncate pr-4">{e.destinatario_nombre}</p>
                                        <span className="text-[9px] font-black bg-white/10 px-2 py-0.5 rounded text-orange-400">ID {e.id}</span>
                                    </div>
                                    <p className="text-[10px] font-medium text-slate-500 truncate mb-4">{e.direccion_destino}</p>
                                    <div className="flex justify-between items-center border-t border-white/5 pt-4">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{e.zona.nombre}</span>
                                        <button className="text-[10px] font-black text-orange-500 hover:text-orange-400 uppercase tracking-widest">Asignar <Plus size={10} className="inline ml-1" /></button>
                                    </div>
                                </motion.div>
                            ))}
                            {enviosSinRuta.length === 0 && (
                                <p className="text-center py-20 text-slate-600 font-bold italic text-sm">Perfecto, todo asignado.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rutas;
