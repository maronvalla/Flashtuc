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
exports.getEnvios = exports.createEnvio = exports.cotizarEnvio = void 0;
const db_1 = __importDefault(require("../db"));
const cotizarEnvio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { km, bultos, zona_id, urgente } = req.body;
    try {
        const tarifa = yield db_1.default.tarifa.findFirst({ where: { activa: true } });
        const zona = yield db_1.default.zona.findUnique({ where: { id: Number(zona_id) } });
        if (!tarifa || !zona) {
            return res.status(404).json({ error: 'Tarifa o Zona no encontrada' });
        }
        const base = tarifa.base;
        const porBulto = bultos * tarifa.precio_por_bulto;
        const porKm = km * tarifa.precio_por_km;
        const multiUrgente = urgente ? tarifa.multiplicador_urgente : 1;
        const subtotal = (base + porBulto + porKm) * zona.multiplicador;
        const total = subtotal * multiUrgente;
        res.json({
            desglose: {
                base,
                porBulto,
                porKm,
                multiplicadorZona: zona.multiplicador,
                multiplicadorUrgente: multiUrgente
            },
            total: Number(total.toFixed(2))
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al calcular cotización' });
    }
});
exports.cotizarEnvio = cotizarEnvio;
const createEnvio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cliente_id, destinatario_nombre, destinatario_telefono, direccion_destino, bultos, km, zona_id, urgente, cod_monto } = req.body;
    try {
        // En un caso real, recalculamos la tarifa aquí para seguridad
        const tarifa = yield db_1.default.tarifa.findFirst({ where: { activa: true } });
        const zona = yield db_1.default.zona.findUnique({ where: { id: Number(zona_id) } });
        if (!tarifa || !zona)
            return res.status(404).json({ error: 'Tarifa/Zona no encontrada' });
        const total = ((tarifa.base + (bultos * tarifa.precio_por_bulto) + (km * tarifa.precio_por_km)) * zona.multiplicador) * (urgente ? tarifa.multiplicador_urgente : 1);
        const comisionEmpresa = (cod_monto || 0) * 0.05; // 5% de comisión por manejo de efectivo
        const pagoEmpresa = total + comisionEmpresa;
        const pagoRemitente = (cod_monto || 0) - comisionEmpresa;
        const envio = yield db_1.default.envio.create({
            data: {
                cliente_id: Number(cliente_id),
                destinatario_nombre,
                destinatario_telefono,
                direccion_destino,
                bultos: Number(bultos),
                km: Number(km),
                zona_id: Number(zona_id),
                urgente: !!urgente,
                tarifa_total: total,
                cod_monto: Number(cod_monto || 0),
                pago_empresa: pagoEmpresa,
                pago_remitente: pagoRemitente,
                lat: Number(req.body.lat || 0),
                lng: Number(req.body.lng || 0),
                estado: 'PENDIENTE'
            }
        });
        res.status(201).json(envio);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear envío' });
    }
});
exports.createEnvio = createEnvio;
const getEnvios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const envios = yield db_1.default.envio.findMany({
            include: { cliente: true, zona: true, ruta: true }
        });
        res.json(envios);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener envíos' });
    }
});
exports.getEnvios = getEnvios;
