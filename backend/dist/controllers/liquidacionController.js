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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLiquidaciones = exports.createLiquidacion = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createLiquidacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cliente_id, envios_ids } = req.body;
    try {
        // Obtenemos los envíos para calcular el monto total
        const envios = yield prisma.envio.findMany({
            where: { id: { in: envios_ids.map(Number) } }
        });
        const montoTotal = envios.reduce((acc, current) => acc + current.tarifa_total, 0);
        const liquidacion = yield prisma.liquidacion.create({
            data: {
                cliente_id: Number(cliente_id),
                monto: montoTotal,
                envios: {
                    connect: envios_ids.map((id) => ({ id: Number(id) }))
                }
            },
            include: { envios: true }
        });
        res.status(201).json(liquidacion);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear liquidación' });
    }
});
exports.createLiquidacion = createLiquidacion;
const getLiquidaciones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const liquidaciones = yield prisma.liquidacion.findMany({
            include: { cliente: true, envios: true }
        });
        res.json(liquidaciones);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener liquidaciones' });
    }
});
exports.getLiquidaciones = getLiquidaciones;
