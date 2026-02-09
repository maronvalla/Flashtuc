"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optimizarRuta = exports.asignarEnvioARuta = exports.getRutas = exports.createRuta = void 0;
const db_1 = __importDefault(require("../db"));
const createRuta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fecha, chofer_nombre } = req.body;
    try {
        const ruta = yield db_1.default.ruta.create({
            data: {
                fecha: new Date(fecha),
                chofer_nombre,
                estado: 'PROGRAMADA'
            }
        });
        res.status(201).json(ruta);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear ruta' });
    }
});
exports.createRuta = createRuta;
const getRutas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rutas = yield db_1.default.ruta.findMany({ include: { envios: true } });
        res.json(rutas);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener rutas' });
    }
});
exports.getRutas = getRutas;
const asignarEnvioARuta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Ruta ID
    const { envio_ids } = req.body; // Array de IDs de envíos
    try {
        yield db_1.default.envio.updateMany({
            where: { id: { in: envio_ids.map(Number) } },
            data: { ruta_id: Number(id), estado: 'EN_RUTA' }
        });
        const updatedRuta = yield db_1.default.ruta.findUnique({
            where: { id: Number(id) },
            include: { envios: true }
        });
        res.json(updatedRuta);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al asignar envíos a la ruta' });
    }
});
exports.asignarEnvioARuta = asignarEnvioARuta;
const optimizarRuta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const ruta = yield db_1.default.ruta.findUnique({
            where: { id: Number(id) },
            include: { envios: true }
        });
        if (!ruta)
            return res.status(404).json({ error: 'Ruta no encontrada' });
        const envios = [...ruta.envios];
        const enviosOrdenados = [];
        let currentPos = { lat: -26.808, lng: -65.217 }; // San Miguel de Tucumán (Centro)
        while (envios.length > 0) {
            let nearestIndex = 0;
            let minDistance = Infinity;
            for (let i = 0; i < envios.length; i++) {
                const d = Math.sqrt(Math.pow(envios[i].lat - currentPos.lat, 2) +
                    Math.pow(envios[i].lng - currentPos.lng, 2));
                if (d < minDistance) {
                    minDistance = d;
                    nearestIndex = i;
                }
            }
            const nearest = envios.splice(nearestIndex, 1)[0];
            enviosOrdenados.push(nearest);
            currentPos = { lat: nearest.lat, lng: nearest.lng };
        }
        res.json({ message: 'Ruta optimizada con Nearest-Neighbor', envios: enviosOrdenados });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al optimizar ruta' });
    }
});
exports.optimizarRuta = optimizarRuta;
