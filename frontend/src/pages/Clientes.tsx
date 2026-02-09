import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    Search,
    Filter,
    Phone,
    Mail,
    MapPin,
    ChevronRight,
    MoreHorizontal,
    UserCircle2,
    Building2,
    Calendar
} from 'lucide-react';


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
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Directorio Base</span>
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Clientes</h2>
                    <p className="text-slate-500 font-medium mt-1">Gestión centralizada de cuentas y contactos corporativos.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-orange-500 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-orange-500/20 transition-all hover:bg-orange-600"
                >
                    <Plus size={20} strokeWidth={3} /> Nuevo Cliente
                </motion.button>
            </header>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4 bg-slate-50 px-6 py-3.5 rounded-2xl flex-1 max-w-xl border border-slate-100 group focus-within:ring-4 focus-within:ring-orange-500/5 transition-all">
                        <Search size={20} className="text-slate-400 group-focus-within:text-orange-500" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, empresa o contacto..."
                            className="bg-transparent border-none outline-none text-sm font-semibold w-full placeholder:text-slate-400"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
                            <Filter size={14} /> Filtrar Directorio
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">CUPÓN / RAZÓN SOCIAL</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">DATOS DE CONTACTO</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">DIRECCIÓN FISCAL</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">FECHA ALTA</th>
                                <th className="px-8 py-6 border-b border-slate-100"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {clientes.map((cliente, index) => (
                                <motion.tr
                                    initial={{ opacity: 0, scale: 0.99 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.03 }}
                                    key={cliente.id}
                                    className="group hover:bg-slate-50/30 transition-colors cursor-pointer"
                                >
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-3xl flex items-center justify-center transition-all group-hover:bg-white group-hover:shadow-lg group-hover:border-white group-hover:-translate-y-1">
                                                <UserCircle2 size={24} className="text-slate-400 group-hover:text-orange-500 transition-colors" />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 text-base leading-tight mb-1">{cliente.nombre}</p>
                                                <div className="flex items-center gap-1.5 text-[9px] font-black text-orange-500 uppercase tracking-[0.2em]">
                                                    <Building2 size={10} />
                                                    ID C-{cliente.id}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2 text-slate-600 font-semibold text-xs transition-colors group-hover:text-slate-900">
                                                <Phone size={12} className="text-slate-300 group-hover:text-orange-400" />
                                                {cliente.telefono || 'Sin teléfono'}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400 font-medium text-xs">
                                                <Mail size={12} className="text-slate-300" />
                                                {cliente.email || 'contacto@empresa.com'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-tight">
                                            <MapPin size={12} className="text-slate-300" />
                                            {cliente.direccion || 'Dirección no registrada'}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg w-fit">
                                            <Calendar size={12} className="text-slate-300" />
                                            {cliente.createdAt ? new Date(cliente.createdAt).toLocaleDateString() : '01/02/2026'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-white hover:shadow-md transition-all flex items-center justify-center text-slate-400 hover:text-orange-500 border border-transparent hover:border-slate-100">
                                                <MoreHorizontal size={18} />
                                            </button>
                                            <button className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center text-slate-400 border border-transparent shadow-sm">
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {clientes.length === 0 && !loading && (
                    <div className="py-40 text-center flex flex-col items-center gap-6">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border border-white shadow-xl">
                            <UserCircle2 size={40} className="text-slate-200" strokeWidth={1} />
                        </div>
                        <div>
                            <p className="font-black text-slate-900 text-xl tracking-tight">No hay clientes activos</p>
                            <p className="text-sm font-medium text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
                                Tu base de datos está vacía. Registra tu primer cliente para comenzar a gestionar envíos y rutas.
                            </p>
                        </div>
                        <button className="px-10 py-4 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:bg-slate-800 transition-all">
                            Registrar Cliente Ahora
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Clientes;
