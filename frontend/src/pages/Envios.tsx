import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin,
    Search,
    Filter,
    MoreHorizontal,
    Package,
    User,
    Clock,
    Plus,
    X
} from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

const Envios = () => {
    const [envios, setEnvios] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEnvio, setNewEnvio] = useState({
        cliente_id: '',
        destinatario_nombre: '',
        direccion_destino: '',
        bultos: 1,
        kg: 1,
        zona_id: '',
        urgente: false
    });
    const [clientes, setClientes] = useState<any[]>([]);
    const [zonas, setZonas] = useState<any[]>([]);

    const fetchData = async () => {
        try {
            const [enviosData, clientesData, zonasData] = await Promise.all([
                api.getShipments(),
                api.getCustomers(),
                api.getZones()
            ]);
            setEnvios(enviosData);
            setClientes(clientesData);
            setZonas(zonasData);
        } catch (err: any) {
            toast.error('Error al cargar datos: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        const t = toast.loading('Creando envío...');
        try {
            await api.createShipment({
                ...newEnvio,
                cliente_id: parseInt(newEnvio.cliente_id),
                zona_id: parseInt(newEnvio.zona_id),
                bultos: parseInt(newEnvio.bultos.toString()),
                km: parseFloat(newEnvio.kg.toString()) // kg corresponds to km in backend for now
            });
            toast.success('Envío creado correctamente', { id: t });
            setIsModalOpen(false);
            setNewEnvio({
                cliente_id: '',
                destinatario_nombre: '',
                direccion_destino: '',
                bultos: 1,
                kg: 1,
                zona_id: '',
                urgente: false
            });
            fetchData();
        } catch (err: any) {
            toast.error('Error al crear envío: ' + err.message, { id: t });
        }
    };

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

                <div className="flex items-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsModalOpen(true)}
                        className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-orange-500/20 transition-all hover:bg-orange-600"
                    >
                        <Plus size={18} strokeWidth={3} /> Nuevo Envío
                    </motion.button>
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
                                                <p className="text-xs font-black text-slate-800 mb-0.5">{envio.cliente?.nombre || 'S/N'}</p>
                                                <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest">{envio.zona?.nombre || 'Z-N'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex flex-wrap gap-2">
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 transition-colors group-hover:bg-white border border-slate-100 rounded-lg text-[9px] font-black text-slate-600 uppercase">
                                                <Package size={10} /> {envio.bultos} Bultos
                                            </div>
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 transition-colors group-hover:bg-white border border-slate-100 rounded-lg text-[9px] font-black text-slate-600 uppercase">
                                                <Clock size={10} /> {envio.kg} KG
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
                                No se encontraron envíos registrados. Comienza creando una nueva orden.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="mt-4 px-8 py-3.5 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all"
                        >
                            Crear Primer Envío
                        </button>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden border border-slate-100"
                        >
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Nuevo Envío</h3>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Registrar orden logística</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-orange-50 hover:text-orange-500 transition-all"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <form onSubmit={handleCreateEnvio} className="p-8 space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 text-sans">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cliente / Remitente</label>
                                        <select
                                            required
                                            value={newEnvio.cliente_id}
                                            onChange={(e) => setNewEnvio({ ...newEnvio, cliente_id: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all"
                                        >
                                            <option value="">Seleccionar...</option>
                                            {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Zona de Entrega</label>
                                        <select
                                            required
                                            value={newEnvio.zona_id}
                                            onChange={(e) => setNewEnvio({ ...newEnvio, zona_id: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all"
                                        >
                                            <option value="">Seleccionar...</option>
                                            {zonas.map(z => <option key={z.id} value={z.id}>{z.nombre}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Destinatario</label>
                                    <input
                                        required
                                        value={newEnvio.destinatario_nombre}
                                        onChange={(e) => setNewEnvio({ ...newEnvio, destinatario_nombre: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all"
                                        placeholder="Ej: Juan Pérez"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dirección de Destino</label>
                                    <input
                                        required
                                        value={newEnvio.direccion_destino}
                                        onChange={(e) => setNewEnvio({ ...newEnvio, direccion_destino: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all"
                                        placeholder="Ej: Av. Alem 123, Tucumán"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bultos</label>
                                        <input
                                            type="number"
                                            value={newEnvio.bultos}
                                            onChange={(e) => setNewEnvio({ ...newEnvio, bultos: parseInt(e.target.value) })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Peso (KG Est.)</label>
                                        <input
                                            type="number"
                                            value={newEnvio.kg}
                                            onChange={(e) => setNewEnvio({ ...newEnvio, kg: parseFloat(e.target.value) })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 px-1">
                                    <input
                                        type="checkbox"
                                        id="urgente"
                                        checked={newEnvio.urgente}
                                        onChange={(e) => setNewEnvio({ ...newEnvio, urgente: e.target.checked })}
                                        className="w-5 h-5 accent-orange-500"
                                    />
                                    <label htmlFor="urgente" className="text-xs font-bold text-slate-600 uppercase tracking-tight cursor-pointer">Envío de Prioridad (Urgente)</label>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-orange-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all mt-2"
                                >
                                    Confirmar Envío
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
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
