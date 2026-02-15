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
    X,
    Loader2
} from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

const Envios = () => {
    const [envios, setEnvios] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clientes, setClientes] = useState<any[]>([]);
    const [zonas, setZonas] = useState<any[]>([]);

    // Form State
    const [newEnvio, setNewEnvio] = useState<any>({
        cliente_id: '',
        cliente_nuevo: null, // { nombre: '', dni: '', telefono: '' }
        destinatario_nombre: '',
        destinatario_telefono: '',
        direccion_destino: '',
        bultos: 1,
        kg: 1,
        zona_id: '',
        urgente: false,
        lat: 0,
        lng: 0,
        cod_monto: 0
    });

    // Autocomplete State
    const [addressQuery, setAddressQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isSearchingAddress, setIsSearchingAddress] = useState(false);

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

    // Address Autocomplete Logic (using Nominatim - OpenStreetMap)
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (addressQuery.length > 3) {
                searchAddress(addressQuery);
            } else {
                setSuggestions([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [addressQuery]);

    const searchAddress = async (query: string) => {
        setIsSearchingAddress(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=ar`);
            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error('Error searching address:', error);
        } finally {
            setIsSearchingAddress(false);
        }
    };

    const handleSelectAddress = (suggestion: any) => {
        setNewEnvio({
            ...newEnvio,
            direccion_destino: suggestion.display_name,
            lat: parseFloat(suggestion.lat),
            lng: parseFloat(suggestion.lon)
        });
        setAddressQuery(suggestion.display_name);
        setSuggestions([]);
    };

    const handleCreateEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        const t = toast.loading('Creando envío...');
        try {
            const payload = {
                ...newEnvio,
                zona_id: parseInt(newEnvio.zona_id),
                bultos: parseInt(newEnvio.bultos.toString()),
                km: parseFloat(newEnvio.kg.toString()),
                cod_monto: parseFloat(newEnvio.cod_monto.toString())
            };
            if (newEnvio.cliente_id) payload.cliente_id = parseInt(newEnvio.cliente_id);

            await api.createShipment(payload);
            toast.success('Envío creado correctamente', { id: t });
            setIsModalOpen(false);
            resetForm();
            fetchData();
        } catch (err: any) {
            toast.error('Error al crear envío: ' + err.message, { id: t });
        }
    };

    const resetForm = () => {
        setNewEnvio({
            cliente_id: '',
            cliente_nuevo: null,
            destinatario_nombre: '',
            destinatario_telefono: '',
            direccion_destino: '',
            bultos: 1,
            kg: 1,
            zona_id: '',
            urgente: false,
            lat: 0,
            lng: 0,
            cod_monto: 0
        });
        setAddressQuery('');
        setSuggestions([]);
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
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Envíos</h2>
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

            <div className="bg-white rounded-[2.5rem] shadow-premium border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 font-mono">
                    <div className="flex items-center gap-4 bg-slate-50 px-6 py-3.5 rounded-2xl flex-1 max-w-xl border border-slate-100 group focus-within:ring-4 focus-within:ring-orange-500/5 transition-all">
                        <Search size={20} className="text-slate-400 group-focus-within:text-orange-500" />
                        <input
                            type="text"
                            placeholder="Buscar por cliente, destinatario o ID de orden..."
                            className="bg-transparent border-none outline-none text-xs font-black uppercase w-full placeholder:text-slate-400 tracking-wider"
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
                                                <span className="text-[10px] font-black text-slate-900 leading-none font-mono">#{envio.id}</span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-black text-slate-900 text-sm leading-tight mb-1 truncate uppercase">{envio.destinatario_nombre}</p>
                                                <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                                                    <MapPin size={10} className="text-orange-500" />
                                                    <span className="truncate italic">{envio.direccion_destino}</span>
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
                                                <p className="text-xs font-black text-slate-800 mb-0.5 uppercase">{envio.cliente?.nombre || 'S/N'}</p>
                                                <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest">{envio.zona?.nombre || 'Z-N'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex flex-wrap gap-2">
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 transition-colors group-hover:bg-white border border-slate-100 rounded-lg text-[9px] font-black text-slate-600 uppercase font-mono">
                                                <Package size={10} /> {envio.bultos} Bultos
                                            </div>
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 transition-colors group-hover:bg-white border border-slate-100 rounded-lg text-[9px] font-black text-slate-600 uppercase font-mono">
                                                <Clock size={10} /> {envio.km} KG
                                            </div>
                                            {envio.urgente && (
                                                <span className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-[9px] font-black uppercase shadow-lg shadow-orange-500/20">Urgente</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right font-mono">
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
                            <p className="font-black text-slate-900 text-xl tracking-tight uppercase">Registro Limpio</p>
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
                            className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden border border-slate-100 h-[90vh] flex flex-col"
                        >
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between shrink-0">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Nuevo Envío</h3>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Registrar orden logística</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-orange-50 hover:text-orange-500 transition-all"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <form onSubmit={handleCreateEnvio} className="px-8 py-6 space-y-5 flex-1 overflow-y-auto custom-scrollbar">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cliente / Remitente</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="casual_check_envios"
                                                checked={!!newEnvio.cliente_nuevo}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setNewEnvio({
                                                            ...newEnvio,
                                                            cliente_id: '',
                                                            cliente_nuevo: { nombre: '', dni: '', telefono: '' }
                                                        });
                                                    } else {
                                                        const { cliente_nuevo, ...rest } = newEnvio;
                                                        setNewEnvio(rest);
                                                    }
                                                }}
                                                className="w-4 h-4 accent-orange-500 cursor-pointer"
                                            />
                                            <label htmlFor="casual_check_envios" className="text-[10px] font-black text-slate-500 uppercase cursor-pointer select-none">Cliente Casual</label>
                                        </div>
                                    </div>

                                    {!newEnvio.cliente_nuevo ? (
                                        <select
                                            required
                                            value={newEnvio.cliente_id}
                                            onChange={(e) => setNewEnvio({ ...newEnvio, cliente_id: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all appearance-none"
                                        >
                                            <option value="">Seleccionar...</option>
                                            {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                        </select>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="md:col-span-2">
                                                <input
                                                    required
                                                    type="text"
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all"
                                                    placeholder="Nombre Completo"
                                                    value={newEnvio.cliente_nuevo.nombre}
                                                    onChange={e => setNewEnvio({
                                                        ...newEnvio,
                                                        cliente_nuevo: { ...newEnvio.cliente_nuevo, nombre: e.target.value }
                                                    })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    required
                                                    type="text"
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all"
                                                    placeholder="DNI / CUIT"
                                                    value={newEnvio.cliente_nuevo.dni}
                                                    onChange={e => setNewEnvio({
                                                        ...newEnvio,
                                                        cliente_nuevo: { ...newEnvio.cliente_nuevo, dni: e.target.value }
                                                    })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all"
                                                    placeholder="Teléfono (Opc.)"
                                                    value={newEnvio.cliente_nuevo.telefono}
                                                    onChange={e => setNewEnvio({
                                                        ...newEnvio,
                                                        cliente_nuevo: { ...newEnvio.cliente_nuevo, telefono: e.target.value }
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Zona de Entrega</label>
                                        <select
                                            required
                                            value={newEnvio.zona_id}
                                            onChange={(e) => setNewEnvio({ ...newEnvio, zona_id: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all appearance-none"
                                        >
                                            <option value="">Seleccionar...</option>
                                            {zonas.map(z => <option key={z.id} value={z.id}>{z.nombre}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 font-mono">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bultos</label>
                                        <input
                                            type="number"
                                            value={newEnvio.bultos}
                                            onChange={(e) => setNewEnvio({ ...newEnvio, bultos: parseInt(e.target.value) })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-black outline-none focus:ring-4 focus:ring-orange-500/5 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2 font-mono">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Peso (KG Est.)</label>
                                        <input
                                            type="number"
                                            value={newEnvio.kg}
                                            onChange={(e) => setNewEnvio({ ...newEnvio, kg: parseFloat(e.target.value) })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-black outline-none focus:ring-4 focus:ring-orange-500/5 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Destinatario</label>
                                    <input
                                        required
                                        value={newEnvio.destinatario_nombre}
                                        onChange={(e) => setNewEnvio({ ...newEnvio, destinatario_nombre: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all uppercase"
                                        placeholder="Ej: JUAN PEREZ"
                                    />
                                </div>

                                <div className="space-y-2 relative">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dirección de Destino</label>
                                    <div className="relative">
                                        <input
                                            required
                                            value={addressQuery}
                                            onChange={(e) => setAddressQuery(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all italic"
                                            placeholder="Escribe para buscar dirección..."
                                        />
                                        {isSearchingAddress && (
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                <Loader2 className="animate-spin text-orange-500" size={18} />
                                            </div>
                                        )}
                                    </div>

                                    <AnimatePresence>
                                        {suggestions.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-premium border border-slate-100 max-h-48 overflow-y-auto"
                                            >
                                                {suggestions.map((s, i) => (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() => handleSelectAddress(s)}
                                                        className="w-full text-left px-6 py-4 text-xs font-bold text-slate-700 hover:bg-slate-50 border-b border-slate-50 last:border-none transition-colors"
                                                    >
                                                        {s.display_name}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Teléfono Destinatario</label>
                                        <input
                                            value={newEnvio.destinatario_telefono}
                                            onChange={(e) => setNewEnvio({ ...newEnvio, destinatario_telefono: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-black outline-none focus:ring-4 focus:ring-orange-500/5 transition-all font-mono"
                                            placeholder="381 xxxxxxx"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 font-mono">Monto COD ($)</label>
                                        <input
                                            type="number"
                                            value={newEnvio.cod_monto}
                                            onChange={(e) => setNewEnvio({ ...newEnvio, cod_monto: parseFloat(e.target.value) })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-black outline-none focus:ring-4 focus:ring-orange-500/5 transition-all font-mono"
                                            placeholder="ARS"
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
                                    <label htmlFor="urgente" className="text-xs font-black text-slate-600 uppercase tracking-tight cursor-pointer italic">Envío de Prioridad (Urgente)</label>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all mt-2"
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
                        <h3 className="text-3xl font-black tracking-tight mb-3 italic transition-all hover:text-orange-400 cursor-default">Reportes de Rendimiento</h3>
                        <p className="text-slate-400 font-medium">Analiza la rentabilidad por zona y optimiza tus costos operativos con nuestras métricas avanzadas.</p>
                    </div>
                    <button className="px-10 py-5 bg-white text-slate-950 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-glow-white">
                        Explorar Análisis
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Envios;
