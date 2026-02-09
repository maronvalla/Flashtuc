import { NavLink, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Settings,
    Calculator,
    Truck,
    Map,
    CreditCard,
    LayoutDashboard,
    Bell,
    Search,
    ChevronRight,
    LogOut,
    User
} from 'lucide-react';
import { cn } from '../lib/utils';

const SidebarItem = ({ item }: { item: any }) => (
    <NavLink
        to={item.path}
        className={({ isActive }) =>
            cn(
                "group flex items-center justify-between px-6 py-3 mx-2 rounded-2xl transition-all duration-300 mb-1",
                isActive
                    ? "bg-orange-500 text-white shadow-[0_8px_20px_-6px_rgba(249,115,22,0.5)]"
                    : "text-slate-400 hover:bg-slate-800/40 hover:text-white"
            )
        }
    >
        <div className="flex items-center gap-3">
            <span className={cn(
                "transition-transform duration-300 group-hover:scale-110",
                "flex items-center justify-center w-8 h-8"
            )}>
                {item.icon}
            </span>
            <span className="font-semibold text-sm tracking-tight">{item.label}</span>
        </div>
        <ChevronRight size={14} className="opacity-0 group-hover:opacity-40 transition-opacity translate-x-1 group-hover:translate-x-0 transition-transform" />
    </NavLink>
);

const Sidebar = () => {
    const navItems = [
        { icon: <LayoutDashboard size={18} strokeWidth={2.5} />, label: 'Dashboard', path: '/' },
        { icon: <Users size={18} strokeWidth={2.5} />, label: 'Clientes', path: '/clientes' },
        { icon: <Truck size={18} strokeWidth={2.5} />, label: 'Envíos', path: '/envios' },
        { icon: <Map size={18} strokeWidth={2.5} />, label: 'Rutas', path: '/rutas' },
        { icon: <Calculator size={18} strokeWidth={2.5} />, label: 'Cotizador', path: '/cotizador' },
        { icon: <CreditCard size={18} strokeWidth={2.5} />, label: 'Liquidaciones', path: '/liquidaciones' },
        { icon: <Settings size={18} strokeWidth={2.5} />, label: 'Configuración', path: '/configuracion' },
    ];

    return (
        <aside className="w-72 bg-slate-950 text-white h-screen fixed left-0 top-0 overflow-hidden flex flex-col border-r border-white/5 shadow-2xl z-50">
            <div className="p-8 mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-linear-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 rotate-3 group cursor-pointer hover:rotate-0 transition-transform">
                        <Truck size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter text-white leading-none">FlashTuc</h1>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500/90 italic">Premium Fleet</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto pt-2 scrollbar-none">
                <div className="px-6 mb-4">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Operación Central</p>
                </div>
                {navItems.slice(0, 5).map((item) => (
                    <SidebarItem key={item.path} item={item} />
                ))}

                <div className="px-6 mt-8 mb-4">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Administración</p>
                </div>
                {navItems.slice(5).map((item) => (
                    <SidebarItem key={item.path} item={item} />
                ))}
            </nav>

            <div className="p-6 mt-auto">
                <div className="bg-slate-900/40 rounded-[2rem] p-5 border border-white/5 backdrop-blur-sm space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-white/5">
                            <User size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-white truncate">Exequiel</p>
                            <p className="text-[10px] font-bold text-slate-500 truncate uppercase tracking-tighter">Administrador</p>
                        </div>
                    </div>
                    <button className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-orange-500/10 hover:text-orange-500 text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                        <LogOut size={12} /> Salir del Sistema
                    </button>
                </div>
            </div>
        </aside>
    );
};

const Topbar = () => (
    <header className="h-20 bg-white/80 backdrop-blur-xl fixed top-0 right-0 left-72 z-40 border-b border-slate-100 flex items-center justify-between px-10">
        <div className="flex items-center gap-4 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100 w-full max-w-md group focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
            <Search size={18} className="text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            <input
                type="text"
                placeholder="Buscar por ID, cliente o zona..."
                className="bg-transparent border-none outline-none text-sm w-full font-semibold placeholder:text-slate-400"
            />
        </div>

        <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
                <button className="w-10 h-10 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-orange-600 transition-all flex items-center justify-center relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-orange-600 rounded-full border-2 border-white animate-pulse"></span>
                </button>
            </div>

            <div className="h-8 w-px bg-slate-100 mx-2"></div>

            <div className="flex items-center gap-3 group cursor-pointer active:scale-95 transition-transform">
                <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-slate-800 to-slate-950 p-[1.5px] border border-white/10 shadow-lg">
                    <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center text-white text-xs font-black ring-1 ring-white/5">
                        FT
                    </div>
                </div>
            </div>
        </div>
    </header>
);

const Layout = () => {
    return (
        <div className="min-h-screen bg-[#fcfdfe] font-sans text-slate-900 antialiased selection:bg-orange-100 selection:text-orange-900">
            <Sidebar />
            <div className="ml-72 flex flex-col min-h-screen">
                <Topbar />
                <main className="mt-20 p-12 flex-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -10 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default Layout;
