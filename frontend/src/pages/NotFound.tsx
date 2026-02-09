import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Truck } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative mb-8"
            >
                <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full" />
                <Truck size={120} className="text-orange-500 relative animate-bounce" />
                <h1 className="text-[12rem] font-black text-slate-900/5 absolute -top-12 left-1/2 -translate-x-1/2 select-none">
                    404
                </h1>
            </motion.div>

            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
                ¡Ruta no encontrada!
            </h2>
            <p className="text-slate-500 font-medium max-w-md mb-12">
                Parece que te has desviado del camino. La página que buscas no existe o ha sido movida a otro cuadrante.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase text-xs tracking-widest border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
                >
                    <ArrowLeft size={16} /> Volver Atrás
                </button>
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all shadow-glow"
                >
                    <Home size={16} /> Ir al Dashboard
                </button>
            </div>
        </div>
    );
};

export default NotFound;
