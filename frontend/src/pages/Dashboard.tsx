import { motion } from 'framer-motion';
import {
    Users,
    Truck,
    Map,
    CreditCard,
    ArrowUpRight,
    TrendingUp,
    Activity
} from 'lucide-react';

const StatCard = ({ title, value, icon, color }: { title: string, value: string, icon: any, color: string }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-[2rem] shadow-premium border border-slate-100 flex flex-col justify-between h-48 group transition-all"
    >
        <div className="flex justify-between items-start">
            <div className={`p-4 rounded-2xl ${color} text-white shadow-lg`}>
                {icon}
            </div>
            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                <TrendingUp size={12} />
                <span className="text-[10px] font-black">+12.5%</span>
            </div>
        </div>
        <div>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
        </div>
    </motion.div>
);

const Dashboard = () => {
    return (
        <div className="space-y-10">
            <header>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard</h2>
                <p className="text-slate-500 font-medium">Bienvenido de nuevo, aquí tienes el resumen de hoy.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Envíos Activos" value="128" icon={<Truck size={24} />} color="bg-orange-500" />
                <StatCard title="Total Clientes" value="1,042" icon={<Users size={24} />} color="bg-slate-900" />
                <StatCard title="Rutas de Hoy" value="12" icon={<Map size={24} />} color="bg-blue-600" />
                <StatCard title="Facturación" value="$42.5k" icon={<CreditCard size={24} />} color="bg-emerald-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-premium border border-slate-100">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black flex items-center gap-2">
                            <Activity className="text-orange-500" /> Actividad Reciente
                        </h3>
                        <button className="text-orange-600 font-bold text-sm flex items-center gap-1 hover:underline">
                            Ver todo <ArrowUpRight size={14} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center font-bold text-slate-400">
                                        #{1020 + i}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">Envío a Sucursal Centro</h4>
                                        <p className="text-xs text-slate-500">Actualizado hace 5 min • <strong>En Ruta</strong></p>
                                    </div>
                                </div>
                                <span className="text-sm font-black text-slate-800">$2,450.00</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grad-slate text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between h-[450px]">
                    <div className="absolute top-0 right-0 p-8">
                        <div className="w-20 h-20 bg-white/10 rounded-full blur-3xl" />
                    </div>

                    <div>
                        <h3 className="text-2xl font-black mb-2">Optimización IA</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">Prueba nuestra nueva herramienta de IA para reducir costos de combustible.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1">Ahorro Estimado</p>
                            <p className="text-2xl font-black">15% Mensual</p>
                        </div>

                        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl transition-all shadow-glow">
                            PROBAR AHORA
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
