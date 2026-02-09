import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, User, MapPin, Search, Filter, MoreHorizontal, ChevronRight } from 'lucide-react';

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
            case 'PENDIENTE': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'EN_RUTA': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'ENTREGADO': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Registro de Envíos</h2>
                    <p className="text-slate-500 font-medium">Control total sobre tus despachos y estados.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                        <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold">Todos</button>
                        <button className="px-4 py-2 text-slate-400 rounded-lg text-xs font-bold hover:text-slate-600">Pendientes</button>
                    </div>
                </div>
            </header>

            <div className="bg-white rounded-[2.5rem] shadow-premium border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl flex-1 max-w-md">
                        <Search size={18} className="text-slate-400" />
                        <input type="text" placeholder="Buscar por destinatario o ID..." className="bg-transparent border-none outline-none text-sm font-medium w-full" />
                    </div>
                    <button className="p-3 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100">
                        <Filter size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Orden / Destino</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Remitente</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Servicio</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Monto</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Estado</th>
                                <th className="px-8 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 uppercase-none">
                            {envios.map((envio, index) => (
                                <motion.tr
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    key={envio.id}
                                    className="group hover:bg-slate-50/50 transition-colors"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold group-hover:bg-white transition-all">
                                                #{envio.id}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 leading-none mb-1">{envio.destinatario_nombre}</p>
                                                <div className="flex items-center gap-1 text-slate-400">
                                                    <MapPin size={10} />
                                                    <span className="text-[10px] font-bold">{envio.direccion_destino}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-xs font-black text-slate-800">{envio.cliente.nombre}</p>
                                        <p className="text-[10px] font-bold text-orange-500">{envio.zona.nombre}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded border border-slate-200">{envio.bultos} B</span>
                                            <span className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded border border-slate-200">{envio.km} KM</span>
                                            {envio.urgente && (
                                                <span className="text-[10px] font-black bg-orange-500 text-white px-2 py-1 rounded shadow-premium">GOLD</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right font-black text-slate-900">${envio.tarifa_total}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border tracking-wider uppercase ${getStatusStyle(envio.estado)}`}>
                                            {envio.estado}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {envios.length === 0 && !loading && (
                    <div className="py-32 text-center flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                            <Truck size={40} className="text-slate-200" />
                        </div>
                        <p className="font-black text-slate-900">Historial vacío</p>
                        <p className="text-sm font-medium text-slate-400">No se encontraron envíos registrados para este periodo.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Envios;
