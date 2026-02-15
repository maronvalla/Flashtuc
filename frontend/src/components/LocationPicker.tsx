import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, MapPin, X, Loader2, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
    value: string;
    onChange: (address: string, lat: number, lng: number) => void;
    placeholder?: string;
    className?: string;
}

const AUTHORIZED_ZONES = [
    'San Miguel de Tucumán',
    'Yerba Buena',
    'Manantial',
    'El Manantial'
];

const LocationPicker = ({ value, onChange, placeholder = "Dirección...", className }: LocationPickerProps) => {
    const [query, setQuery] = useState(value);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);
    const mapRef = useRef<any>(null);

    // Update internal query if external value changes (and is different)
    useEffect(() => {
        if (value !== query) {
            setQuery(value);
        }
    }, [value]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.length > 3 && !markerPos) { // Only search if we aren't already locked to a marker
                searchAddress(query);
            } else {
                setSuggestions([]);
            }
        }, 800);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const searchAddress = async (q: string) => {
        setIsSearching(true);
        try {
            // Restrict to Argentina, specifically Tucuman if possible via viewbox but for now countrycodes=ar
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q + ", Tucuman")}&limit=5&countrycodes=ar&addressdetails=1`);
            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSearching(false);
        }
    };

    const validateZone = (addressDetail: any) => {
        // Nominatim address properties vary: city, town, village, suburb
        const city = addressDetail.city || addressDetail.town || addressDetail.village || addressDetail.suburb || '';

        const removeAccents = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const normalizedCity = removeAccents(city.toLowerCase());

        const isValid = AUTHORIZED_ZONES.some(zone => {
            return normalizedCity.includes(removeAccents(zone.toLowerCase()));
        });

        return { isValid, city };
    };

    const handleSelectSuggestion = (s: any) => {
        const { isValid, city } = validateZone(s.address);

        if (!isValid) {
            toast.error(`Zona no disponible: ${city || 'Fuera de cobertura'}`);
            return;
        }

        const lat = parseFloat(s.lat);
        const lng = parseFloat(s.lon);

        setQuery(s.display_name);
        setSuggestions([]);
        setMarkerPos([lat, lng]);
        onChange(s.display_name, lat, lng);
    };

    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
            const data = await response.json();

            const { isValid, city } = validateZone(data.address);
            if (!isValid) {
                toast.error(`Zona no disponible: ${city || 'Fuera de cobertura'}`);
                // We allow moving the map, but we don't select the address
                return;
            }

            setQuery(data.display_name);
            onChange(data.display_name, lat, lng);
            return true; // Success
        } catch (error) {
            console.error('Error in reverse geocoding:', error);
            return false;
        }
    };

    // Map Click Component
    const MapEvents = () => {
        useMapEvents({
            click: async (e) => {
                const { lat, lng } = e.latlng;
                setMarkerPos([lat, lng]);
                await reverseGeocode(lat, lng);
            }
        });
        return null;
    };

    return (
        <div className={cn("relative", className)}>
            <div className="relative">
                <input
                    value={query}
                    onChange={e => {
                        setQuery(e.target.value);
                        setMarkerPos(null); // Reset marker lock if typing
                    }}
                    placeholder={placeholder}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-12 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-slate-700 placeholder:text-slate-400"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <MapPin size={18} />
                </div>

                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {query && (
                        <button
                            onClick={() => {
                                setQuery('');
                                setMarkerPos(null);
                                onChange('', 0, 0);
                            }}
                            className="p-1 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    )}
                    <button
                        onClick={() => setShowMap(true)}
                        className="p-2 bg-slate-100 hover:bg-orange-50 text-slate-500 hover:text-orange-500 rounded-xl transition-all"
                        title="Abrir Mapa"
                    >
                        <Navigation size={16} />
                    </button>
                </div>

                {isSearching && (
                    <div className="absolute right-14 top-1/2 -translate-y-1/2">
                        <Loader2 className="animate-spin text-orange-500" size={16} />
                    </div>
                )}
            </div>

            <AnimatePresence>
                {suggestions.length > 0 && !markerPos && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 max-h-60 overflow-y-auto custom-scrollbar"
                    >
                        {suggestions.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => handleSelectSuggestion(s)}
                                className="w-full text-left px-5 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-none duration-200"
                            >
                                <p className="text-xs font-bold text-slate-700 truncate">{s.display_name}</p>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Map Modal */}
            <AnimatePresence>
                {showMap && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-[2rem] w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl overflow-hidden relative"
                        >
                            <div className="bg-slate-900 text-white px-8 py-5 flex items-center justify-between shrink-0">
                                <div>
                                    <h3 className="font-black uppercase tracking-widest text-sm">Seleccionar Ubicación</h3>
                                    <p className="text-[10px] text-slate-400 font-medium">Click en el mapa para marcar el punto exacto</p>
                                </div>
                                <button
                                    onClick={() => setShowMap(false)}
                                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 relative z-0">
                                <MapContainer
                                    center={markerPos || [-26.8083, -65.2176]} // Default to Tucuman center
                                    zoom={15}
                                    style={{ height: '100%', width: '100%' }}
                                    ref={mapRef}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    {markerPos && <Marker position={markerPos} />}
                                    <MapEvents />
                                </MapContainer>
                            </div>

                            <div className="p-6 bg-white border-t border-slate-100 flex justify-end">
                                <button
                                    onClick={() => setShowMap(false)}
                                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
                                >
                                    Confirmar Ubicación
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LocationPicker;
