import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, CheckCircle, Package, Truck, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

const Cotizador = () => {
    const [formData, setFormData] = useState({
        cliente_id: '',
        destinatario_nombre: '',
        direccion_destino: '',
        bultos: 1,
        km: 0,
        zona_id: '',
        urgente: false
    });
    const [zonas, setZonas] = useState<any[]>([]);
    const [clientes, setClientes] = useState<any[]>([]);
    const [cotizacion, setCotizacion] = useState<any>(null);
    const [mensaje, setMensaje] = useState('');
    const [isCalculating, setIsCalculating] = useState(false);

    useEffect(() => {
        fetch('http://localhost:3000/api/zonas').then(res => res.json()).then(setZonas);
        fetch('http://localhost:3000/api/clientes').then(res => res.json()).then(setClientes);
    }, []);

    const handleCotizar = async () => {
        if (!formData.zona_id || formData.km <= 0) return;
        setIsCalculating(true);
        const res = await fetch('http://localhost:3000/api/envios/cotizar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const data = await res.json();
        setTimeout(() => {
            setCotizacion(data);
            setIsCalculating(false);
        }, 600);
    };

    const handleCrearEnvio = async () => {
        const res = await fetch('http://localhost:3000/api/envios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (res.ok) {
            setMensaje('Envío registrado con éxito');
            setTimeout(() => setMensaje(''), 4000);
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
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Información de Origen</h3>
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
                                    <input
                                        type="text"
                                        className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50"
                                        placeholder="Av. Principal 123"
                                        value={formData.direccion_destino}
                                        onChange={e => setFormData({ ...formData, direccion_destino: e.target.value })}
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
                            className="w-full grad-slate hover:opacity-90 text-white font-black py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3"
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
                                        <span>Ajuste Zona ({formData.zona_id})</span>
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
                                    className="w-full grad-orange text-white font-black py-6 rounded-3xl flex items-center justify-center gap-3 hover:shadow-glow transition-all"
                                >
                                    GENERAR ORDEN <ArrowRight size={20} />
                                </motion.button>

                                {mensaje && (
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="mt-6 flex items-center gap-2 justify-center text-green-400 font-bold text-sm bg-green-400/10 p-4 rounded-2xl border border-green-400/20"
                                    >
                                        <CheckCircle size={18} /> {mensaje}
                                    </motion.div>
                                )}
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
