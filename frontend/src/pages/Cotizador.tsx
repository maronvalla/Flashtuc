import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Package, Truck, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { api } from '../lib/api';
import toast from 'react-hot-toast';
import LocationPicker from '../components/LocationPicker';

const Cotizador = () => {
    const [formData, setFormData] = useState<any>({
        cliente_id: '',
        cliente_nuevo: null, // { nombre: '', dni: '', telefono: '' }
        destinatario_nombre: '',
        direccion_destino: '',
        bultos: 1,
        km: 0,
        zona_id: '',
        urgente: false,
        lat: 0,
        lng: 0
    });
    const [zonas, setZonas] = useState<any[]>([]);
    const [clientes, setClientes] = useState<any[]>([]);
    const [cotizacion, setCotizacion] = useState<any>(null);
    const [isCalculating, setIsCalculating] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [zonasData, clientesData] = await Promise.all([
                    api.getZones(),
                    api.getCustomers()
                ]);
                setZonas(zonasData);
                setClientes(clientesData);
            } catch (err: any) {
                toast.error('Error al cargar datos iniciales');
            }
        };
        loadInitialData();
    }, []);

    const handleCotizar = async () => {
        if (!formData.zona_id || formData.km <= 0) {
            toast.error('Por favor completa zona y KMs');
            return;
        }
        setIsCalculating(true);
        const t = toast.loading('Calculando tarifa...');
        try {
            const payload = {
                ...formData,
                zona_id: parseInt(formData.zona_id),
                bultos: parseInt(formData.bultos.toString()),
                km: parseFloat(formData.km.toString())
            };
            if (formData.cliente_id) payload.cliente_id = parseInt(formData.cliente_id);

            const data = await api.cotizarShipment(payload);
            setCotizacion(data);
            toast.success('Cotización generada', { id: t });
        } catch (err: any) {
            toast.error('Error al cotizar: ' + err.message, { id: t });
        } finally {
            setIsCalculating(false);
        }
    };

    const handleCrearEnvio = async () => {
        const t = toast.loading('Registrando envío...');
        try {
            const payload = {
                ...formData,
                zona_id: parseInt(formData.zona_id),
                bultos: parseInt(formData.bultos.toString()),
                km: parseFloat(formData.km.toString())
            };
            if (formData.cliente_id) payload.cliente_id = parseInt(formData.cliente_id);

            await api.createShipment(payload);
            toast.success('Envío registrado con éxito', { id: t });
            setCotizacion(null);
            setFormData({
                cliente_id: '',
                destinatario_nombre: '',
                direccion_destino: '',
                bultos: 1,
                km: 0,
                zona_id: '',
                urgente: false
            });
        } catch (err: any) {
            toast.error('Error al registrar envío: ' + err.message, { id: t });
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10">
            <header>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Cotizador</h2>
                <p className="text-slate-500 font-medium">Calcula costos y genera órdenes de envío al instante.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                <div className="lg:col-span-3 space-y-8">
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-premium border border-slate-100 space-y-6">
                        <section className="space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Información de Origen</h3>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="casual_check"
                                        checked={!!formData.cliente_nuevo}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setFormData({
                                                    ...formData,
                                                    cliente_id: '',
                                                    cliente_nuevo: { nombre: '', dni: '', telefono: '' }
                                                });
                                            } else {
                                                const { cliente_nuevo, ...rest } = formData;
                                                setFormData(rest);
                                            }
                                        }}
                                        className="w-4 h-4 accent-orange-500 cursor-pointer"
                                    />
                                    <label htmlFor="casual_check" className="text-[10px] font-black text-slate-500 uppercase cursor-pointer select-none">Cliente Casual</label>
                                </div>
                            </div>

                            {!formData.cliente_nuevo ? (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Cliente Remitente</label>
                                    <select
                                        className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none font-medium transition-all"
                                        value={formData.cliente_id}
                                        onChange={e => setFormData({ ...formData, cliente_id: e.target.value })}
                                    >
                                        <option value="">Seleccionar Cliente</option>
                                        {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                    </select>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Nombre Completo</label>
                                        <input
                                            type="text"
                                            className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none font-medium"
                                            placeholder="Nombre del Cliente"
                                            value={formData.cliente_nuevo.nombre}
                                            onChange={e => setFormData({
                                                ...formData,
                                                cliente_nuevo: { ...formData.cliente_nuevo, nombre: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">DNI / CUIT</label>
                                        <input
                                            type="text"
                                            className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none font-medium"
                                            placeholder="Documento"
                                            value={formData.cliente_nuevo.dni}
                                            onChange={e => setFormData({
                                                ...formData,
                                                cliente_nuevo: { ...formData.cliente_nuevo, dni: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Teléfono (Opcional)</label>
                                        <input
                                            type="text"
                                            className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none font-medium"
                                            placeholder="Contacto"
                                            value={formData.cliente_nuevo.telefono}
                                            onChange={e => setFormData({
                                                ...formData,
                                                cliente_nuevo: { ...formData.cliente_nuevo, telefono: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>
                            )}
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Destino y Carga</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Nombre Destinatario</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50"
                                        placeholder="Ejem: Juan Pérez"
                                        value={formData.destinatario_nombre}
                                        onChange={e => setFormData({ ...formData, destinatario_nombre: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Dirección Exacta</label>
                                    <LocationPicker
                                        value={formData.direccion_destino}
                                        onChange={(address, lat, lng) => setFormData({
                                            ...formData,
                                            direccion_destino: address,
                                            lat,
                                            lng
                                        })}
                                        placeholder="Buscar dirección o marcar en mapa..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Zona</label>
                                    <select
                                        className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50"
                                        value={formData.zona_id}
                                        onChange={e => setFormData({ ...formData, zona_id: e.target.value })}
                                    >
                                        <option value="">Zona</option>
                                        {zonas.map(z => <option key={z.id} value={z.id}>{z.nombre}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Bultos</label>
                                    <input
                                        type="number"
                                        className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50"
                                        value={formData.bultos}
                                        onChange={e => setFormData({ ...formData, bultos: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">KMs</label>
                                    <input
                                        type="number"
                                        className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50"
                                        value={formData.km}
                                        onChange={e => setFormData({ ...formData, km: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                                    formData.urgente ? "bg-orange-500 text-white" : "bg-slate-200 text-slate-400"
                                )}>
                                    <Truck size={20} />
                                </div>
                                <div>
                                    <p className="font-black text-slate-800 leading-none">Envío Prioritario</p>
                                    <span className="text-[10px] font-bold text-slate-400">Entrega en menos de 24hs</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setFormData({ ...formData, urgente: !formData.urgente })}
                                className={cn(
                                    "w-14 h-8 rounded-full relative p-1 transition-all",
                                    formData.urgente ? "bg-orange-500" : "bg-slate-300"
                                )}
                            >
                                <div className={cn(
                                    "w-6 h-6 bg-white rounded-full transition-all shadow-sm",
                                    formData.urgente ? "translate-x-6" : "translate-x-0"
                                )} />
                            </button>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={handleCotizar}
                            disabled={isCalculating}
                            className="w-full bg-slate-900 hover:opacity-90 text-white font-black py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3"
                        >
                            {isCalculating ? "Calculando..." : <><Calculator size={20} /> Calcular Tarifa</>}
                        </motion.button>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        {cotizacion ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-slate-950 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden h-fit sticky top-10"
                            >
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/20 blur-3xl rounded-full" />

                                <h3 className="text-xl font-black mb-8 flex items-center gap-2">
                                    <Package className="text-orange-500" /> Resumen de Pago
                                </h3>

                                <div className="space-y-5 mb-10">
                                    <div className="flex justify-between items-center text-slate-400 font-bold text-sm">
                                        <span>Base Operativa</span>
                                        <span className="text-white">${cotizacion.desglose.base}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-400 font-bold text-sm">
                                        <span>Extra por {formData.bultos} Bultos</span>
                                        <span className="text-white">${cotizacion.desglose.porBulto}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-400 font-bold text-sm">
                                        <span>Recargo por Distancia</span>
                                        <span className="text-white">${cotizacion.desglose.porKm}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-400 font-bold text-sm">
                                        <span>Ajuste Zona</span>
                                        <span className="text-orange-400">x {cotizacion.desglose.multiplicadorZona}</span>
                                    </div>
                                    {formData.urgente && (
                                        <div className="flex justify-between items-center text-orange-500 font-black text-xs uppercase tracking-widest mt-4 pt-4 border-t border-white/10">
                                            <span>Prioridad GOLD</span>
                                            <span>x {cotizacion.desglose.multiplicadorUrgente}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-10 text-center">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Total Final Estimado</p>
                                    <p className="text-7xl font-black text-white tracking-tighter">
                                        <span className="text-3xl font-bold opacity-30 mr-1">$</span>
                                        {cotizacion.total}
                                    </p>
                                </div>

                                <motion.button
                                    whileHover={{ y: -5 }}
                                    onClick={handleCrearEnvio}
                                    className="w-full bg-orange-500 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-3 hover:shadow-glow transition-all"
                                >
                                    GENERAR ORDEN <ArrowRight size={20} />
                                </motion.button>
                            </motion.div>
                        ) : (
                            <div className="h-[600px] border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 text-slate-400">
                                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                    <Calculator size={40} className="opacity-20 text-slate-900" />
                                </div>
                                <p className="font-black text-slate-900 text-lg mb-2">Listo para cotizar</p>
                                <p className="text-sm font-medium leading-relaxed">Completa el formulario de la izquierda para ver el desglose y generar la orden.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Cotizador;

