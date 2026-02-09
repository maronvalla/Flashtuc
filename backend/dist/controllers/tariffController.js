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
exports.deleteTariff = exports.updateTariff = exports.createTariff = exports.getTariffs = void 0;
const db_1 = __importDefault(require("../db"));
const getTariffs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tariffs = yield db_1.default.tarifa.findMany();
        res.json(tariffs);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching tariffs' });
    }
});
exports.getTariffs = getTariffs;
const createTariff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, base, precio_por_bulto, precio_por_km, multiplicador_urgente, activa } = req.body;
    try {
        const newTariff = yield db_1.default.tarifa.create({
            data: {
                nombre,
                base: parseFloat(base),
                precio_por_bulto: parseFloat(precio_por_bulto),
                precio_por_km: parseFloat(precio_por_km),
                multiplicador_urgente: parseFloat(multiplicador_urgente),
                activa: activa !== null && activa !== void 0 ? activa : true,
            },
        });
        res.status(201).json(newTariff);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating tariff' });
    }
});
exports.createTariff = createTariff;
const updateTariff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nombre, base, precio_por_bulto, precio_por_km, multiplicador_urgente, activa } = req.body;
    try {
        const updatedTariff = yield db_1.default.tarifa.update({
            where: { id: Number(id) },
            data: {
                nombre,
                base: parseFloat(base),
                precio_por_bulto: parseFloat(precio_por_bulto),
                precio_por_km: parseFloat(precio_por_km),
                multiplicador_urgente: parseFloat(multiplicador_urgente),
                activa,
            },
        });
        res.json(updatedTariff);
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating tariff' });
    }
});
exports.updateTariff = updateTariff;
const deleteTariff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield db_1.default.tarifa.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting tariff' });
    }
});
exports.deleteTariff = deleteTariff;
