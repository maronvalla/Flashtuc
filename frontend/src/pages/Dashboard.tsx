import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Truck,
    Map,
    CreditCard,
    ArrowUpRight,
    TrendingUp,
    Activity,
    Clock,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

const StatCard = ({ title, value, icon: Icon, trend, colorClass }: { title: string, value: string, icon: any, trend: string, colorClass: string }) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between h-48 group transition-all hover:shadow-xl hover:shadow-slate-200/50"
    >
        <div className="flex justify-between items-start">
            <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-current/20 transition-transform group-hover:rotate-6",
                colorClass
            )}>
                <Icon size={24} strokeWidth={2.5} />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                <TrendingUp size={12} strokeWidth={3} />
                <span className="text-[10px] font-black">{trend}</span>
            </div>
        </div>
        <div>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-1">{title}</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
        </div>
    </motion.div>
);

const ActivityItem = ({ title, time, status, amount }: { title: string, time: string, status: string, amount: string }) => (
    <div className="flex items-center justify-between p-5 rounded-3xl bg-white border border-slate-50 hover:border-orange-200 hover:shadow-md transition-all cursor-pointer group">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-orange-50">
                {status === 'EN_RUTA' ? <Truck className="text-blue-500" size={20} /> :
                    status === 'ENTREGADO' ? <CheckCircle2 className="text-emerald-500" size={20} /> :
                        <Clock className="text-slate-400" size={20} />}
            </div>
            <div>
                <h4 className="font-bold text-slate-900 text-sm leading-tight mb-1">{title}</h4>
                <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                    <Clock size={10} />
                    <span>{time}</span>
                    <span className="text-slate-200">•</span>
                    <span className={cn(
                        "px-2 py-0.5 rounded-md",
                        status === 'EN_RUTA' ? "bg-blue-50 text-blue-600" :
                            status === 'ENTREGADO' ? "bg-emerald-50 text-emerald-600" :
                                "bg-slate-50 text-slate-500"
                    )}>{status}</span>
                </div>
            </div>
        </div>
        <div className="text-right">
            <span className="text-sm font-black text-slate-900">${amount}</span>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">ARS</p>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState<any>({
        enviosActivos: 0,
        totalClientes: 0,
        rutasHoy: 0,
        facturacion: 0
    });
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.getStats();
                setStats(data.stats);
                setRecentActivity(data.recentActivity);
            } catch (error) {
                console.error('Error fetching stats:', error);
                toast.error('Error al cargar estadísticas');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
    };

    const getTimeAgo = (dateString: string) => {
        const diff = new Date().getTime() - new Date(dateString).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 60) return `Hace ${minutes} min`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `Hace ${hours} h`;
        return `Hace ${Math.floor(hours / 24)} d`;
    };

    return (
        <div className="space-y-12">
            <header className="flex items-end justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Resumen en tiempo real</span>
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Dashboard</h2>
                </div>
                <div className="hidden md:flex gap-3">
                    <button className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">Descargar Reporte</button>
                    <button className="px-6 py-3 bg-orange-500 rounded-2xl text-xs font-black text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">Nueva Orden</button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Envíos Activos" value={stats.enviosActivos.toString()} icon={Truck} trend="--" colorClass="bg-orange-500" />
                <StatCard title="Total Clientes" value={stats.totalClientes.toString()} icon={Users} trend="--" colorClass="bg-slate-900" />
                <StatCard title="Rutas de Hoy" value={stats.rutasHoy.toString()} icon={Map} trend="--" colorClass="bg-blue-600" />
                <StatCard title="Facturación" value={formatCurrency(stats.facturacion)} icon={CreditCard} trend="--" colorClass="bg-emerald-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center px-4">
                        <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                            <Activity className="text-orange-500" size={20} /> Actividad Reciente
                        </h3>
                        <button className="text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-orange-600 transition-colors flex items-center gap-1">
                            Ver Historial <ArrowUpRight size={14} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {recentActivity.map((envio, idx) => (
                            <ActivityItem
                                key={envio.id}
                                title={`${envio.destinatario_nombre} - ${envio.zona?.nombre || 'S/Z'}`}
                                time={getTimeAgo(envio.createdAt)}
                                status={envio.estado}
                                amount={envio.tarifa_total?.toString() || '0'}
                            />
                        ))}
                        {recentActivity.length === 0 && (
                            <div className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                No hay actividad reciente
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-lg font-black text-slate-900 px-4">Estado del Sistema</h3>
                    <div className="bg-slate-950 text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between h-[480px]">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/20 rounded-full blur-[80px]"></div>

                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 backdrop-blur-md">
                                <AlertCircle className="text-orange-500" size={24} />
                            </div>
                            <h4 className="text-2xl font-black mb-3 leading-tight tracking-tight">Optimización de Flota Activa</h4>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                {stats.rutasHoy > 0
                                    ? `Hay ${stats.rutasHoy} rutas activas hoy. Se recomienda verificar la optimización para asegurar puntualidad.`
                                    : "No hay rutas activas en este momento. Inicia la planificación del día."}
                            </p>
                        </div>

                        <div className="relative z-10 space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Eficiencia Logística</span>
                                    <span className="text-xs font-black text-orange-400">100%</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <div className="h-full w-full bg-linear-to-r from-orange-400 to-orange-600 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.4)]"></div>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl transition-all shadow-glow-white uppercase text-[10px] tracking-[0.2em]"
                            >
                                Ver Rutas
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
