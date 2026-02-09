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
exports.deleteZone = exports.updateZone = exports.createZone = exports.getZoneById = exports.getZones = void 0;
const db_1 = __importDefault(require("../db"));
const getZones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const zones = yield db_1.default.zona.findMany();
        res.json(zones);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching zones' });
    }
});
exports.getZones = getZones;
const getZoneById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const zone = yield db_1.default.zona.findUnique({
            where: { id: Number(id) },
        });
        if (zone) {
            res.json(zone);
        }
        else {
            res.status(404).json({ error: 'Zone not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching zone' });
    }
});
exports.getZoneById = getZoneById;
const createZone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, multiplicador } = req.body;
    try {
        const newZone = yield db_1.default.zona.create({
            data: {
                nombre,
                multiplicador: parseFloat(multiplicador),
            },
        });
        res.status(201).json(newZone);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating zone' });
    }
});
exports.createZone = createZone;
const updateZone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nombre, multiplicador } = req.body;
    try {
        const updatedZone = yield db_1.default.zona.update({
            where: { id: Number(id) },
            data: {
                nombre,
                multiplicador: parseFloat(multiplicador),
            },
        });
        res.json(updatedZone);
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating zone' });
    }
});
exports.updateZone = updateZone;
const deleteZone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield db_1.default.zona.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting zone' });
    }
});
exports.deleteZone = deleteZone;
