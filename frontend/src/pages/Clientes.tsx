import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    Calendar,
    X
} from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

const Clientes = () => {
    const [clientes, setClientes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newClient, setNewClient] = useState({ nombre: '', dni_cuit: '', email: '', telefono: '', direccion: '' });

    const fetchClientes = async () => {
        try {
            const data = await api.getCustomers();
            setClientes(data);
        } catch (err: any) {
            toast.error('Error al cargar clientes: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    const handleCreateClient = async (e: React.FormEvent) => {
        e.preventDefault();
        const t = toast.loading('Creando cliente...');
        try {
            await api.createCustomer(newClient);
            toast.success('Cliente creado correctamente', { id: t });
            setIsModalOpen(false);
            setNewClient({ nombre: '', dni_cuit: '', email: '', telefono: '', direccion: '' });
            fetchClientes();
        } catch (err: any) {
            toast.error('Error al crear cliente: ' + err.message, { id: t });
        }
    };

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
                    onClick={() => setIsModalOpen(true)}
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
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-10 py-4 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:bg-slate-800 transition-all font-sans"
                        >
                            Registrar Cliente Ahora
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
                            className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100"
                        >
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Nuevo Cliente</h3>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Alta de cuenta corporativa</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-orange-50 hover:text-orange-500 transition-all"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <form onSubmit={handleCreateClient} className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre o Razón Social</label>
                                    <input
                                        required
                                        value={newClient.nombre}
                                        onChange={(e) => setNewClient({ ...newClient, nombre: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/20 transition-all"
                                        placeholder="Ej: Logística S.A."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">DNI / CUIT</label>
                                    <input
                                        required
                                        value={newClient.dni_cuit}
                                        onChange={(e) => setNewClient({ ...newClient, dni_cuit: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all"
                                        placeholder="20-12345678-9"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Teléfono</label>
                                        <input
                                            value={newClient.telefono}
                                            onChange={(e) => setNewClient({ ...newClient, telefono: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all"
                                            placeholder="381655..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                                        <input
                                            type="email"
                                            value={newClient.email}
                                            onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all"
                                            placeholder="contacto@..."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dirección Fiscal</label>
                                    <input
                                        value={newClient.direccion}
                                        onChange={(e) => setNewClient({ ...newClient, direccion: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all"
                                        placeholder="Calle 123, Tucumán"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-orange-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all mt-4"
                                >
                                    Confirmar Registro
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Clientes;
