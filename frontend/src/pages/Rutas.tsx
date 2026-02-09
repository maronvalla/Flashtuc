import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Map, Plus, Play, Truck, MapPin, ChevronRight, Calendar, CheckCircle2, Package } from 'lucide-react';
import { cn } from '../lib/utils';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

const Rutas = () => {
    const [rutas, setRutas] = useState<any[]>([]);
    const [enviosSinRuta, setEnviosSinRuta] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [rutasData, enviosData] = await Promise.all([
                api.getRoutes(),
                api.getShipments()
            ]);
            setRutas(rutasData);
            setEnviosSinRuta(enviosData.filter((e: any) => !e.ruta_id));
        } catch (err: any) {
            toast.error('Error al cargar rutas/envios');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCrearRuta = async () => {
        const t = toast.loading('Creando hoja de ruta...');
        try {
            await api.createRoute({
                fecha: new Date().toISOString(),
                chofer_nombre: 'Pendiente de Asignar'
            });
            toast.success('Hoja de ruta creada', { id: t });
            fetchData();
        } catch (err: any) {
            toast.error('Error al crear ruta', { id: t });
        }
    };

    const handleAsignarEnvio = async (envioId: number, rutaId: number) => {
        const t = toast.loading('Asignando envío...');
        try {
            await api.updateShipment(envioId.toString(), { ruta_id: rutaId });
            toast.success('Envío asignado', { id: t });
            fetchData();
        } catch (err: any) {
            toast.error('Error al asignar', { id: t });
        }
    };

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Logística Activa</span>
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Hojas de Ruta</h2>
                    <p className="text-slate-500 font-medium mt-1">Planificación dinámica y optimización de rutas diarias.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCrearRuta}
                    className="bg-slate-950 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-slate-900/20 transition-all"
                >
                    <Plus size={20} strokeWidth={3} /> Nueva Hoja de Ruta
                </motion.button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-8">
                    {rutas.map((ruta, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, ease: "easeOut" }}
                            key={ruta.id}
                            className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 transition-all"
                        >
                            <div className="p-10 pb-6 flex justify-between items-start">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-3xl flex flex-col items-center justify-center transition-transform group-hover:rotate-1 group-hover:bg-white group-hover:shadow-lg group-hover:shadow-slate-100 group-hover:border-white">
                                        <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Día</span>
                                        <span className="text-3xl font-black text-slate-900 leading-none">{new Date(ruta.fecha).getDate()}</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{ruta.chofer_nombre}</h3>
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                        </div>
                                        <div className="flex items-center gap-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                                                <Calendar size={12} />
                                                <span>{new Date(ruta.fecha).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                                                <Truck size={12} />
                                                <span>ID #{ruta.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <span className={cn(
                                    "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm",
                                    ruta.estado === 'ACTIVA' || ruta.estado === 'EN_CURSO' ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-slate-50 text-slate-500 border-slate-100"
                                )}>
                                    {ruta.estado}
                                </span>
                            </div>

                            <div className="px-10 py-6 space-y-3">
                                {ruta.envios?.map((e: any) => (
                                    <div key={e.id} className="flex items-center gap-5 p-5 bg-slate-50/50 border border-slate-100 rounded-3xl hover:bg-white hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5 transition-all group/item cursor-pointer">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-slate-300 text-xs border border-slate-100 transition-colors group-hover/item:border-orange-100">
                                            #{e.id}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-base font-black text-slate-900 leading-tight mb-1">{e.destinatario_nombre}</p>
                                            <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                                <MapPin size={10} className="text-orange-500" />
                                                <span className="truncate max-w-[200px]">{e.direccion_destino}</span>
                                            </div>
                                        </div>
                                        <button className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 opacity-0 group-hover/item:opacity-100 transition-all hover:text-orange-500 hover:border-orange-200">
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                ))}
                                {(!ruta.envios || ruta.envios.length === 0) && (
                                    <div className="text-center py-16 text-slate-300 flex flex-col items-center gap-4 border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/30">
                                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
                                            <Map size={24} className="opacity-20" />
                                        </div>
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Sin despachos asignados</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-10 pt-4">
                                <motion.button
                                    whileHover={{ scale: 1.01, y: -2 }}
                                    className="w-full bg-slate-900 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-slate-900/20 uppercase text-[10px] tracking-[0.3em]"
                                >
                                    <Play size={16} fill="currentColor" strokeWidth={0} /> Iniciar Operativo
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                    {rutas.length === 0 && !loading && (
                        <div className="text-center py-40 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                            <Truck size={48} className="mx-auto text-slate-200 mb-4" />
                            <p className="text-slate-500 font-black">No hay hojas de ruta generadas</p>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4 h-fit sticky top-28 space-y-8">
                    <div className="bg-slate-950 text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden ring-1 ring-white/5">
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-500/10 rounded-full blur-[60px]"></div>

                        <div className="relative z-10">
                            <h3 className="text-3xl font-black mb-1 flex items-center gap-3 tracking-tighter">
                                Pendientes
                            </h3>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-12">Cola de Asignación</p>

                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 scrollbar-none">
                                {enviosSinRuta.map(e => (
                                    <motion.div
                                        layout
                                        key={e.id}
                                        className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:border-orange-500/50 hover:bg-white/10 transition-all cursor-pointer group backdrop-blur-md"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                                    <Package size={14} />
                                                </div>
                                                <p className="font-black text-sm truncate pr-4">{e.destinatario_nombre}</p>
                                            </div>
                                            <span className="text-[9px] font-black bg-white/10 px-2 py-0.5 rounded text-orange-400 tracking-tighter whitespace-nowrap">ID {e.id}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-6">
                                            <MapPin size={10} className="text-slate-600" />
                                            <p className="text-[10px] font-bold text-slate-400 truncate tracking-tight">{e.direccion_destino}</p>
                                        </div>
                                        <div className="flex justify-between items-center pt-5 border-t border-white/5">
                                            <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">{e.zona?.nombre || 'S/Z'}</span>
                                            {rutas.length > 0 && (
                                                <button
                                                    onClick={() => handleAsignarEnvio(e.id, rutas[rutas.length - 1].id)}
                                                    className="flex items-center gap-1.5 text-[9px] font-black text-white px-3 py-1.5 bg-white/10 rounded-lg hover:bg-orange-500 transition-all uppercase tracking-widest"
                                                >
                                                    Asignar <Plus size={10} strokeWidth={3} />
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                                {enviosSinRuta.length === 0 && (
                                    <div className="text-center py-20">
                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                                            <CheckCircle2 className="text-orange-500/50" size={24} />
                                        </div>
                                        <p className="text-slate-500 font-bold italic text-sm">Perfecto, todo asignado.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rutas;
