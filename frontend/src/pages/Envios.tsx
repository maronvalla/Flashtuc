import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    MapPin,
    Search,
    Filter,
    MoreHorizontal,
    ArrowUpDown,
    Package,
    User,
    Clock
} from 'lucide-react';


const Envios = () => {
    const [envios, setEnvios] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3000/api/envios')
            .then(res => res.json())
            .then(data => {
                setEnvios(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    const getStatusStyle = (estado: string) => {
        switch (estado) {
            case 'PENDIENTE': return 'bg-amber-50 text-amber-600 border-amber-100 ring-4 ring-amber-500/5';
            case 'EN_RUTA': return 'bg-blue-50 text-blue-600 border-blue-100 ring-4 ring-blue-500/5';
            case 'ENTREGADO': return 'bg-emerald-50 text-emerald-600 border-emerald-100 ring-4 ring-emerald-500/5';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Logística Activa</span>
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Envíos</h2>
                    <p className="text-slate-500 font-medium mt-1">Gestión avanzada de pedidos y seguimiento en tiempo real.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
                        <button className="px-6 py-2.5 bg-white text-slate-950 shadow-sm rounded-xl text-xs font-black uppercase tracking-tight transition-all">Todos</button>
                        <button className="px-6 py-2.5 text-slate-500 rounded-xl text-xs font-black uppercase tracking-tight hover:text-slate-800 transition-all">En Ruta</button>
                    </div>
                </div>
            </header>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4 bg-slate-50 px-6 py-3.5 rounded-2xl flex-1 max-w-xl border border-slate-100 group focus-within:ring-4 focus-within:ring-orange-500/5 transition-all">
                        <Search size={20} className="text-slate-400 group-focus-within:text-orange-500" />
                        <input
                            type="text"
                            placeholder="Buscar por cliente, destinatario o ID de orden..."
                            className="bg-transparent border-none outline-none text-sm font-semibold w-full placeholder:text-slate-400"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
                            <Filter size={14} /> Filtros
                        </button>
                        <button className="flex items-center gap-2 px-5 py-3.5 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">
                            Exportar <ArrowUpDown size={14} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto overflow-y-hidden">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Orden / Destino</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Información Remitente</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Detalles Carga</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 text-right">Total Pedido</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Estado Logístico</th>
                                <th className="px-8 py-6 border-b border-slate-100"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {envios.map((envio, index) => (
                                <motion.tr
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.04 }}
                                    key={envio.id}
                                    className="group hover:bg-slate-50/30 transition-colors"
                                >
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-[1.25rem] flex flex-col items-center justify-center transition-all group-hover:bg-white group-hover:shadow-lg group-hover:shadow-slate-200/50 group-hover:-translate-y-1">
                                                <Package size={20} className="text-slate-300 mb-0.5" />
                                                <span className="text-[10px] font-black text-slate-900 leading-none">#{envio.id}</span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-black text-slate-900 text-sm leading-tight mb-1 truncate">{envio.destinatario_nombre}</p>
                                                <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                                                    <MapPin size={10} className="text-orange-500" />
                                                    <span className="truncate">{envio.direccion_destino}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                <User size={14} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-800 mb-0.5">{envio.cliente.nombre}</p>
                                                <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest">{envio.zona.nombre}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex flex-wrap gap-2">
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 transition-colors group-hover:bg-white border border-slate-100 rounded-lg text-[9px] font-black text-slate-600 uppercase">
                                                <Package size={10} /> {envio.bultos} Bultos
                                            </div>
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 transition-colors group-hover:bg-white border border-slate-100 rounded-lg text-[9px] font-black text-slate-600 uppercase">
                                                <Clock size={10} /> {envio.km} KM
                                            </div>
                                            {envio.urgente && (
                                                <span className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-[9px] font-black uppercase shadow-lg shadow-orange-500/20">Urgente</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="inline-block">
                                            <span className="text-lg font-black text-slate-950 tracking-tighter">${envio.tarifa_total}</span>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter -mt-1">ARS</p>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center">
                                            <span className={`px-4 py-2 rounded-xl text-[10px] font-black border tracking-[0.1em] uppercase ${getStatusStyle(envio.estado)}`}>
                                                {envio.estado}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-right">
                                        <button className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center text-slate-400">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {envios.length === 0 && !loading && (
                    <div className="py-40 text-center flex flex-col items-center gap-5">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                            <Package size={40} className="text-slate-200" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="font-black text-slate-900 text-xl tracking-tight">Registro Limpio</p>
                            <p className="text-sm font-medium text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
                                No se encontraron envíos registrados. Comienza creando una nueva orden desde el Cotizador.
                            </p>
                        </div>
                        <button className="mt-4 px-8 py-3.5 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all">
                            Ir al Cotizador
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-slate-950 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-orange-500/20 via-transparent to-transparent"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-4">Administración Central</h4>
                        <h3 className="text-3xl font-black tracking-tight mb-3">Reportes de Rendimiento Semanal</h3>
                        <p className="text-slate-400 font-medium">Analiza la rentabilidad por zona y optimiza tus costos operativos con nuestras métricas avanzadas.</p>
                    </div>
                    <button className="px-10 py-5 bg-white text-slate-950 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-glow-white">
                        Explorar Análisis
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Envios;
