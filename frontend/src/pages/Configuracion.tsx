import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, DollarSign, Plus, Check, Trash2, Edit3, Shield, X, Save } from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

const Configuracion = () => {
    const [zonas, setZonas] = useState<any[]>([]);
    const [tarifas, setTarifas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modals
    const [showZonaModal, setShowZonaModal] = useState(false);
    const [showTarifaModal, setShowTarifaModal] = useState(false);
    const [editingZona, setEditingZona] = useState<any>(null);
    const [editingTarifa, setEditingTarifa] = useState<any>(null);

    // Forms
    const [zonaForm, setZonaForm] = useState({ nombre: '', multiplicador: 1 });
    const [tarifaForm, setTarifaForm] = useState({
        nombre: '',
        base: 0,
        precio_por_bulto: 0,
        precio_por_km: 0,
        multiplicador_urgente: 1.5,
        activa: true
    });

    const fetchData = async () => {
        try {
            const [zData, tData] = await Promise.all([
                api.getZones(),
                api.getTariffs()
            ]);
            setZonas(zData);
            setTarifas(tData);
        } catch (err) {
            toast.error('Error al cargar datos de configuración');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveZona = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingZona) {
                await api.updateZone(editingZona.id, zonaForm);
                toast.success('Zona actualizada');
            } else {
                await api.createZone(zonaForm);
                toast.success('Zona creada');
            }
            setShowZonaModal(false);
            setEditingZona(null);
            setZonaForm({ nombre: '', multiplicador: 1 });
            fetchData();
        } catch (err) {
            toast.error('Error al guardar zona');
        }
    };

    const handleDeleteZona = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta zona?')) return;
        try {
            await api.deleteZone(id);
            toast.success('Zona eliminada');
            fetchData();
        } catch (err) {
            toast.error('Error al eliminar zona');
        }
    };

    const handleSaveTarifa = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingTarifa) {
                await api.updateTariff(editingTarifa.id, tarifaForm);
                toast.success('Tarifa actualizada');
            } else {
                await api.createTariff(tarifaForm);
                toast.success('Tarifa creada');
            }
            setShowTarifaModal(false);
            setEditingTarifa(null);
            setTarifaForm({
                nombre: '',
                base: 0,
                precio_por_bulto: 0,
                precio_por_km: 0,
                multiplicador_urgente: 1.5,
                activa: true
            });
            fetchData();
        } catch (err) {
            toast.error('Error al guardar tarifa');
        }
    };

    const handleDeleteTarifa = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta tarifa?')) return;
        try {
            await api.deleteTariff(id);
            toast.success('Tarifa eliminada');
            fetchData();
        } catch (err) {
            toast.error('Error al eliminar tarifa');
        }
    };

    if (loading) return <div className="p-12 text-center font-black animate-pulse uppercase tracking-[0.3em] text-slate-300">Cargando Configuración...</div>

    return (
        <div className="space-y-12 pb-20">
            <header>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Configuración</h2>
                <p className="text-slate-500 font-medium">Gestiona las zonas de cobertura y el tarifario logístico.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* ZONES SECTION */}
                <section className="space-y-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 lowercase italic">
                            <Layers className="text-orange-500" /> Cobertura y Zonas
                        </h2>
                        <button
                            onClick={() => {
                                setEditingZona(null);
                                setZonaForm({ nombre: '', multiplicador: 1 });
                                setShowZonaModal(true);
                            }}
                            className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg"
                        >
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
                                <tbody className="divide-y divide-slate-50 font-medium text-sm text-slate-600">
                                    {zonas.map(zona => (
                                        <tr key={zona.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-8 py-6 font-bold text-slate-800 uppercase tracking-wide">{zona.nombre}</td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full text-xs font-black">x {zona.multiplicador}</span>
                                            </td>
                                            <td className="px-8 py-6 text-right space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingZona(zona);
                                                        setZonaForm({ nombre: zona.nombre, multiplicador: zona.multiplicador });
                                                        setShowZonaModal(true);
                                                    }}
                                                    className="p-2 text-slate-300 hover:text-slate-900 transition-colors"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteZona(zona.id)}
                                                    className="p-2 text-slate-300 hover:text-red-600 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {zonas.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-8 py-10 text-center text-slate-400 font-medium italic">No hay zonas configuradas</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* TARIFFS SECTION */}
                <section className="space-y-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 lowercase italic">
                            <DollarSign className="text-orange-500" /> Tarifas Activas
                        </h2>
                        <button
                            onClick={() => {
                                setEditingTarifa(null);
                                setTarifaForm({
                                    nombre: '',
                                    base: 0,
                                    precio_por_bulto: 0,
                                    precio_por_km: 0,
                                    multiplicador_urgente: 1.5,
                                    activa: true
                                });
                                setShowTarifaModal(true);
                            }}
                            className="flex items-center gap-2 bg-orange-500 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-glow"
                        >
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
                                <div className="absolute top-0 right-0 p-8 transform group-hover:scale-110 transition-transform flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingTarifa(tarifa);
                                            setTarifaForm({
                                                nombre: tarifa.nombre,
                                                base: tarifa.base,
                                                precio_por_bulto: tarifa.precio_por_bulto,
                                                precio_por_km: tarifa.precio_por_km,
                                                multiplicador_urgente: tarifa.multiplicador_urgente,
                                                activa: tarifa.activa
                                            });
                                            setShowTarifaModal(true);
                                        }}
                                        className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTarifa(tarifa.id)}
                                        className="p-2 bg-white/10 rounded-lg hover:bg-red-500/50 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    <Shield size={60} className="text-white/5 absolute -right-4 -top-4 pointer-events-none" />
                                </div>

                                <div className="flex justify-between items-start mb-10">
                                    <div>
                                        <h3 className="text-2xl font-black mb-1">{tarifa.nombre}</h3>
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border flex items-center gap-1 w-fit ${tarifa.activa ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'
                                            }`}>
                                            {tarifa.activa ? <Check size={10} /> : <X size={10} />} {tarifa.activa ? 'Vigente' : 'Inactiva'}
                                        </span>
                                    </div>
                                    <div className="text-right pr-12">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base</p>
                                        <p className="text-3xl font-black">${tarifa.base}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-orange-500/30 transition-all font-mono">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] mb-1">Bulto Extra</p>
                                        <p className="text-lg font-black text-orange-400">${tarifa.precio_por_bulto}</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-orange-500/30 transition-all font-mono">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] mb-1">Precio x KM</p>
                                        <p className="text-lg font-black text-orange-400">${tarifa.precio_por_km}</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-orange-500/30 transition-all font-mono">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] mb-1">Prioridad</p>
                                        <p className="text-lg font-black text-orange-400">x {tarifa.multiplicador_urgente}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {tarifas.length === 0 && (
                            <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-400 font-medium">
                                No se encontraron listas de precios activas
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* ZONA MODAL */}
            <AnimatePresence>
                {showZonaModal && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black text-slate-900">{editingZona ? 'Editar' : 'Nueva'} Zona</h3>
                                <button onClick={() => setShowZonaModal(false)} className="text-slate-400 hover:text-slate-900"><X /></button>
                            </div>
                            <form onSubmit={handleSaveZona} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Nombre de la Zona</label>
                                    <input
                                        type="text"
                                        required
                                        value={zonaForm.nombre}
                                        onChange={e => setZonaForm({ ...zonaForm, nombre: e.target.value })}
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-orange-500 font-bold"
                                        placeholder="Ej: Córdoba Capital"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Multiplicador (Gasto/Renta)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={zonaForm.multiplicador}
                                        onChange={e => setZonaForm({ ...zonaForm, multiplicador: parseFloat(e.target.value) })}
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-orange-500 font-bold"
                                    />
                                </div>
                                <button className="w-full bg-slate-900 text-white p-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg flex items-center justify-center gap-2">
                                    <Save size={16} /> {editingZona ? 'Actualizar' : 'Guardar'} Zona
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* TARIFA MODAL */}
            <AnimatePresence>
                {showTarifaModal && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-[2.5rem] p-10 w-full max-w-xl shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black text-slate-900">{editingTarifa ? 'Editar' : 'Nueva'} Tarifa</h3>
                                <button onClick={() => setShowTarifaModal(false)} className="text-slate-400 hover:text-slate-900"><X /></button>
                            </div>
                            <form onSubmit={handleSaveTarifa} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Etiqueta de Lista</label>
                                        <input
                                            type="text"
                                            required
                                            value={tarifaForm.nombre}
                                            onChange={e => setTarifaForm({ ...tarifaForm, nombre: e.target.value })}
                                            className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-orange-500 font-bold"
                                            placeholder="Ej: Tarifas Verano 2024"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Precio Base ($)</label>
                                        <input
                                            type="number"
                                            required
                                            value={tarifaForm.base}
                                            onChange={e => setTarifaForm({ ...tarifaForm, base: parseFloat(e.target.value) })}
                                            className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-orange-500 font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Precio x Bulto ($)</label>
                                        <input
                                            type="number"
                                            required
                                            value={tarifaForm.precio_por_bulto}
                                            onChange={e => setTarifaForm({ ...tarifaForm, precio_por_bulto: parseFloat(e.target.value) })}
                                            className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-orange-500 font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Precio x KM ($)</label>
                                        <input
                                            type="number"
                                            required
                                            value={tarifaForm.precio_por_km}
                                            onChange={e => setTarifaForm({ ...tarifaForm, precio_por_km: parseFloat(e.target.value) })}
                                            className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-orange-500 font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Multiplicador Urgente</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={tarifaForm.multiplicador_urgente}
                                            onChange={e => setTarifaForm({ ...tarifaForm, multiplicador_urgente: parseFloat(e.target.value) })}
                                            className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-orange-500 font-bold"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl">
                                    <input
                                        type="checkbox"
                                        id="activa"
                                        checked={tarifaForm.activa}
                                        onChange={e => setTarifaForm({ ...tarifaForm, activa: e.target.checked })}
                                        className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                                    />
                                    <label htmlFor="activa" className="text-xs font-black text-slate-600 uppercase tracking-widest">Marcar como lista activa</label>
                                </div>
                                <button className="w-full bg-slate-900 text-white p-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg flex items-center justify-center gap-2">
                                    <Save size={16} /> {editingTarifa ? 'Actualizar' : 'Guardar'} Lista
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Configuracion;
