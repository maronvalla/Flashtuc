import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, User, Phone, Mail, MapPin, Search, Filter } from 'lucide-react';

const Clientes = () => {
    const [clientes, setClientes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3000/api/clientes')
            .then(res => res.json())
            .then(data => {
                setClientes(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Clientes</h2>
                    <p className="text-slate-500 font-medium">Gestiona tu base de datos de remitentes.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-glow"
                >
                    <Plus size={20} /> Nuevo Cliente
                </motion.button>
            </header>

            <div className="flex gap-4 p-2 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl">
                    <Search size={18} className="text-slate-400" />
                    <input type="text" placeholder="Filtrar por nombre, DNI o ciudad..." className="bg-transparent outline-none text-sm font-medium w-full" />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all">
                    <Filter size={18} /> Filtros
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white rounded-3xl border border-slate-100 animate-pulse" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clientes.map((cliente, index) => (
                        <motion.div
                            key={cliente.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white p-8 rounded-[2rem] shadow-premium border border-slate-100 hover:border-orange-200 transition-all flex flex-col group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] flex items-center justify-center pt-2 pl-2 transition-colors group-hover:bg-orange-50">
                                <p className="font-black text-slate-300 group-hover:text-orange-200">#0{cliente.id}</p>
                            </div>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-slate-900 rounded-2xl text-white shadow-lg transition-transform group-hover:scale-110">
                                    <User size={24} />
                                </div>
                                <div className="max-w-[150px]">
                                    <h3 className="font-black text-xl text-slate-800 leading-tight truncate">{cliente.nombre}</h3>
                                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">ID: {cliente.dni_cuit}</p>
                                </div>
                            </div>

                            <div className="space-y-4 text-slate-600 flex-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                        <Phone size={14} />
                                    </div>
                                    <span className="text-sm font-medium">{cliente.telefono || 'Sin teléfono'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                        <Mail size={14} />
                                    </div>
                                    <span className="text-sm font-medium truncate">{cliente.email || 'Sin email'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                        <MapPin size={14} />
                                    </div>
                                    <span className="text-sm font-medium">{cliente.direccion || 'Sin dirección'}</span>
                                </div>
                            </div>

                            <button className="w-full mt-8 py-3 rounded-xl border border-slate-100 font-black text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">
                                Ver Detalle
                            </button>
                        </motion.div>
                    ))}
                    {clientes.length === 0 && (
                        <div className="col-span-full py-24 text-center text-slate-300 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                            <User size={64} className="mx-auto mb-4 opacity-10" />
                            <p className="font-black text-lg">No hay clientes registrados aún.</p>
                            <p className="text-sm font-medium">Haz click en "Nuevo Cliente" para empezar.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Clientes;
