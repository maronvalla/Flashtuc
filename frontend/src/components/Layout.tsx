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
    ChevronRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const SidebarItem = ({ item }: { item: any }) => (
    <NavLink
        to={item.path}
        className={({ isActive }) =>
            cn(
                "group flex items-center justify-between px-6 py-3.5 mx-2 rounded-2xl transition-all duration-300 mb-1",
                isActive
                    ? "bg-orange-500 text-white shadow-glow"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
            )
        }
    >
        <div className="flex items-center gap-3">
            <span className="transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
            <span className="font-medium text-sm">{item.label}</span>
        </div>
        <ChevronRight size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
    </NavLink>
);

const Sidebar = () => {
    const navItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
        { icon: <Users size={20} />, label: 'Clientes', path: '/clientes' },
        { icon: <Truck size={20} />, label: 'Envíos', path: '/envios' },
        { icon: <Map size={20} />, label: 'Rutas', path: '/rutas' },
        { icon: <Calculator size={20} />, label: 'Cotizador', path: '/cotizador' },
        { icon: <CreditCard size={20} />, label: 'Liquidaciones', path: '/liquidaciones' },
        { icon: <Settings size={20} />, label: 'Configuración', path: '/configuracion' },
    ];

    return (
        <aside className="w-72 bg-slate-950 text-white h-screen fixed left-0 top-0 overflow-hidden flex flex-col border-r border-slate-900 shadow-2xl z-50">
            <div className="p-8 pb-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 grad-orange rounded-xl flex items-center justify-center shadow-glow">
                        <Truck size={22} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-white leading-none">FlashTuc</h1>
                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-500/80">Logística Elite</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto pt-2 scrollbar-none">
                {navItems.map((item) => (
                    <SidebarItem key={item.path} item={item} />
                ))}
            </nav>

            <div className="p-6">
                <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Soporte</p>
                    <p className="text-xs text-white underline cursor-pointer hover:text-orange-400">Ayuda y Documentación</p>
                </div>
            </div>
        </aside>
    );
};

const Topbar = () => (
    <header className="h-20 glass fixed top-0 right-0 left-72 z-40 border-b border-white/20 flex items-center justify-between px-10">
        <div className="flex items-center gap-4 bg-slate-100/50 px-4 py-2 rounded-xl border border-slate-200/50 w-96">
            <Search size={18} className="text-slate-400" />
            <input
                type="text"
                placeholder="Buscar envío, cliente o ruta..."
                className="bg-transparent border-none outline-none text-sm w-full font-medium"
            />
        </div>

        <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-500 hover:text-orange-600 transition-colors">
                <Bell size={22} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-600 rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                <div className="text-right">
                    <p className="text-sm font-bold leading-none">Admin FlashTuc</p>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Superusuario</span>
                </div>
                <div className="w-10 h-10 rounded-full grad-slate border-2 border-white shadow-sm flex items-center justify-center text-white font-bold">
                    A
                </div>
            </div>
        </div>
    </header>
);

const Layout = () => {
    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 overflow-x-hidden">
            <Sidebar />
            <div className="ml-72 flex flex-col min-h-screen">
                <Topbar />
                <main className="mt-20 p-10 flex-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
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
