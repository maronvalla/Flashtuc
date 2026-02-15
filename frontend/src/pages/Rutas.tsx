import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Map,
    Plus,
    Play,
    Truck,
    MapPin,
    Calendar,
    CheckCircle2,
    Package,
    Navigation2,
    CheckCircle,
    XCircle,
    RotateCcw,
    Flag,
    Trash2
} from 'lucide-react';
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
            toast.error('Error al cargar rutas/envíos');
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

    const handleIniciarOperativo = async (id: number) => {
        const t = toast.loading('Iniciando operativo de ruta...');
        try {
            await api.updateRoute(id.toString(), { estado: 'EN_CURSO' });
            toast.success('Ruta en curso', { id: t });
            fetchData();
        } catch (err: any) {
            toast.error('Error al iniciar operativo', { id: t });
        }
    };

    const handleFinalizarOperativo = async (id: number) => {
        const t = toast.loading('Finalizando hoja de ruta...');
        try {
            await api.updateRoute(id.toString(), { estado: 'FINALIZADA' });
            toast.success('Hoja de ruta finalizada', { id: t });
            fetchData();
        } catch (err: any) {
            toast.error('Error al finalizar operativo', { id: t });
        }
    };

    const handleOptimizarRuta = async (id: number) => {
        const t = toast.loading('Calculando ruta más eficiente...');
        try {
            await api.optimizeRoute(id.toString());
            toast.success('Recorrido optimizado', { id: t });
            fetchData();
        } catch (err: any) {
            toast.error('Error al optimizar recorrido', { id: t });
        }
    };

    const handleEliminarRuta = async (id: number) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta hoja de ruta? Los envíos volverán a estar pendientes.')) return;

        const t = toast.loading('Eliminando hoja de ruta...');
        try {
            await api.deleteRoute(id.toString());
            toast.success('Ruta eliminada', { id: t });
            fetchData();
        } catch (err: any) {
            toast.error('Error al eliminar ruta', { id: t });
        }
    };

    const handleSiguienteEstado = async (envio: any) => {
        const estadosOrder = ['PENDIENTE', 'ENTREGADO', 'CANCELADO'];
        const currentIndex = estadosOrder.indexOf(envio.estado);
        const nextEstado = estadosOrder[(currentIndex + 1) % estadosOrder.length];

        const t = toast.loading(`Cambiando a ${nextEstado}...`);
        try {
            await api.updateShipment(envio.id.toString(), { estado: nextEstado });
            toast.success(`Envío ${nextEstado} `, { id: t });
            fetchData();
        } catch (err: any) {
            toast.error('Error al actualizar estado', { id: t });
        }
    };

    const getEnvioStatusIcon = (estado: string) => {
        switch (estado) {
            case 'ENTREGADO': return <CheckCircle size={16} className="text-emerald-500" />;
            case 'CANCELADO': return <XCircle size={16} className="text-rose-500" />;
            case 'PENDIENTE':
            case 'EN_RUTA': return <RotateCcw size={16} className="text-amber-500" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-12 pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Logística Activa</span>
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Hojas de Ruta</h2>
                    <p className="text-slate-500 font-medium mt-1">Planificación dinámica y optimización de rutas diarias.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCrearRuta}
                    className="bg-slate-950 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-slate-900/20 transition-all font-mono italic"
                >
                    <Plus size={20} strokeWidth={3} /> Nueva Hoja de Ruta
                </motion.button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-10">
                    <AnimatePresence mode='popLayout'>
                        {rutas.map((ruta, idx) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                key={ruta.id}
                                className={cn(
                                    "bg-white rounded-[3.5rem] border border-slate-100 shadow-premium overflow-hidden group transition-all relative",
                                    ruta.estado === 'EN_CURSO' && "ring-2 ring-emerald-500/20 shadow-xl shadow-emerald-500/5"
                                )}
                            >
                                <div className="p-10 pb-6 flex justify-between items-start">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-3xl flex flex-col items-center justify-center transition-transform group-hover:rotate-1 group-hover:bg-white group-hover:border-white shadow-sm">
                                            <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1 font-mono">Día</span>
                                            <span className="text-3xl font-black text-slate-900 leading-none font-mono tracking-tighter">{new Date(ruta.fecha).getDate()}</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">{ruta.chofer_nombre}</h3>
                                                <div className={cn("w-1.5 h-1.5 rounded-full", ruta.estado === 'EN_CURSO' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300')}></div>
                                            </div>
                                            <div className="flex items-center gap-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest font-mono">
                                                <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full italic">
                                                    <Calendar size={12} />
                                                    <span>{new Date(ruta.fecha).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full italic">
                                                    <Truck size={12} />
                                                    <span>ID #{ruta.id}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-3">
                                        <span className={cn(
                                            "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm font-mono italic",
                                            ruta.estado === 'EN_CURSO' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                ruta.estado === 'PROGRAMADA' ? "bg-orange-50 text-orange-600 border-orange-100" :
                                                    "bg-slate-50 text-slate-500 border-slate-100"
                                        )}>
                                            {ruta.estado}
                                        </span>
                                        {ruta.estado === 'PROGRAMADA' && (
                                            <div className="flex items-center gap-3">
                                                {ruta.envios?.length > 1 && (
                                                    <button
                                                        onClick={() => handleOptimizarRuta(ruta.id)}
                                                        className="flex items-center gap-2 text-[9px] font-black text-orange-500 uppercase tracking-widest hover:text-orange-600 transition-all font-mono"
                                                    >
                                                        <Navigation2 size={12} fill="currentColor" /> Optimizar Recorrido
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleEliminarRuta(ruta.id)}
                                                    className="flex items-center gap-2 text-[9px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-600 transition-all font-mono"
                                                >
                                                    <Trash2 size={12} /> Eliminar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="px-10 py-6 space-y-3">
                                    {ruta.envios?.sort((a: any, b: any) => a.posicion - b.posicion).map((e: any, i: number) => (
                                        <motion.div
                                            layout
                                            key={e.id}
                                            onClick={() => ruta.estado === 'EN_CURSO' && handleSiguienteEstado(e)}
                                            className={cn(
                                                "flex items-center gap-5 p-5 border border-slate-100 rounded-3xl transition-all group/item cursor-pointer relative overflow-hidden",
                                                e.estado === 'ENTREGADO' ? "bg-emerald-50/30 border-emerald-100 opacity-60" :
                                                    e.estado === 'CANCELADO' ? "bg-rose-50/30 border-rose-100 grayscale opacity-60" :
                                                        "bg-slate-50/50 hover:bg-white hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5"
                                            )}
                                        >
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-slate-300 text-xs border border-slate-100 transition-colors group-hover/item:border-orange-100 font-mono shrink-0">
                                                {ruta.estado === 'EN_CURSO' ? getEnvioStatusIcon(e.estado) : `#${i + 1} `}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={cn(
                                                    "text-base font-black text-slate-900 leading-tight mb-1 uppercase tracking-tight truncate",
                                                    e.estado === 'ENTREGADO' && "line-through text-slate-400"
                                                )}>
                                                    {e.destinatario_nombre}
                                                </p>
                                                <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest italic">
                                                    <MapPin size={10} className="text-orange-500" />
                                                    <span className="truncate">{e.direccion_destino}</span>
                                                </div>
                                            </div>
                                            {ruta.estado === 'EN_CURSO' && (
                                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-3 py-1.5 bg-white rounded-xl border border-slate-100">
                                                    {e.estado}
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                    {(!ruta.envios || ruta.envios.length === 0) && (
                                        <div className="text-center py-16 text-slate-300 flex flex-col items-center gap-4 border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/30">
                                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
                                                <Map size={24} className="opacity-20" />
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono italic">Sin despachos asignados</p>
                                        </div>
                                    )}
                                </div>

                                <div className="p-10 pt-4 flex gap-4">
                                    {ruta.estado === 'PROGRAMADA' && (
                                        <motion.button
                                            whileHover={{ scale: 1.01, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleIniciarOperativo(ruta.id)}
                                            className="grow bg-slate-900 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-slate-900/20 uppercase text-[10px] tracking-[0.3em] font-mono italic"
                                        >
                                            <Play size={16} fill="currentColor" strokeWidth={0} /> Iniciar Operativo
                                        </motion.button>
                                    )}

                                    {ruta.estado === 'EN_CURSO' && (
                                        <>
                                            <motion.button
                                                whileHover={{ scale: 1.01, y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleFinalizarOperativo(ruta.id)}
                                                className="grow bg-emerald-600 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-900/20 uppercase text-[10px] tracking-[0.3em] font-mono italic"
                                            >
                                                <Flag size={16} /> Finalizar Hoja de Ruta
                                            </motion.button>
                                        </>
                                    )}

                                    {ruta.estado === 'FINALIZADA' && (
                                        <div className="grow bg-slate-50 text-slate-400 font-black py-6 rounded-3xl flex items-center justify-center gap-3 border border-slate-100 uppercase text-[10px] tracking-[0.3em] font-mono italic">
                                            <div className="flex items-center gap-3">
                                                <span><CheckCircle2 size={16} /> Operativo Completado</span>
                                                <button
                                                    onClick={() => handleEliminarRuta(ruta.id)}
                                                    className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-full text-rose-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all"
                                                    title="Eliminar Registro"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {rutas.length === 0 && !loading && (
                        <div className="text-center py-60 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center gap-6">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                <Truck size={48} strokeWidth={1} />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Sin actividad logística</h4>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Genera una nueva hoja de ruta para empezar</p>
                            </div>
                            <button
                                onClick={handleCrearRuta}
                                className="mt-4 px-10 py-4 bg-orange-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all font-mono"
                            >
                                Iniciar Planificación
                            </button>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4 h-fit sticky top-28 space-y-8">
                    <div className="bg-slate-950 text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden ring-1 ring-white/5">
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-500/10 rounded-full blur-[60px]"></div>

                        <div className="relative z-10">
                            <h3 className="text-3xl font-black mb-1 flex items-center gap-3 tracking-tighter uppercase italic">
                                Pendientes
                            </h3>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-12 font-mono">Cola de Asignación</p>

                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
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
                                                <p className="font-black text-sm truncate pr-4 uppercase tracking-tight">{e.destinatario_nombre}</p>
                                            </div>
                                            <span className="text-[9px] font-black bg-white/10 px-2 py-0.5 rounded text-orange-400 tracking-tighter whitespace-nowrap font-mono">ID {e.id}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-6 italic">
                                            <MapPin size={10} className="text-slate-600" />
                                            <p className="text-[10px] font-bold text-slate-500 truncate tracking-tight">{e.direccion_destino}</p>
                                        </div>
                                        <div className="flex justify-between items-center pt-5 border-t border-white/5">
                                            <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest font-mono italic">{e.zona?.nombre || 'S/Z'}</span>
                                            {rutas.filter(r => r.estado === 'PROGRAMADA').length > 0 && (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleAsignarEnvio(e.id, rutas.filter(r => r.estado === 'PROGRAMADA')[0].id)}
                                                        className="flex items-center gap-1.5 text-[9px] font-black text-white px-3 py-1.5 bg-white/10 rounded-lg hover:bg-orange-500 transition-all uppercase tracking-widest font-mono"
                                                    >
                                                        Asignar <Plus size={10} strokeWidth={3} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                                {enviosSinRuta.length === 0 && (
                                    <div className="text-center py-24">
                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5 shadow-inner">
                                            <CheckCircle2 className="text-emerald-500/50" size={24} />
                                        </div>
                                        <p className="text-slate-500 font-black italic text-sm uppercase tracking-tighter">Perfecto, todo asignado.</p>
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
