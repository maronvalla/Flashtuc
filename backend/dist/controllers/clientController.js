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
exports.deleteClient = exports.updateClient = exports.createClient = exports.getClientById = exports.getClients = void 0;
const db_1 = __importDefault(require("../db"));
const getClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clients = yield db_1.default.cliente.findMany({ include: { zona: true } });
        res.json(clients);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching clients' });
    }
});
exports.getClients = getClients;
const getClientById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const client = yield db_1.default.cliente.findUnique({
            where: { id: Number(id) },
            include: { zona: true },
        });
        if (client) {
            res.json(client);
        }
        else {
            res.status(404).json({ error: 'Client not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching client' });
    }
});
exports.getClientById = getClientById;
const createClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, dni_cuit, telefono, email, direccion, zona_id } = req.body;
    try {
        const newClient = yield db_1.default.cliente.create({
            data: {
                nombre,
                dni_cuit,
                telefono,
                email,
                direccion,
                zona_id: zona_id ? Number(zona_id) : undefined,
            },
        });
        res.status(201).json(newClient);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating client' });
    }
});
exports.createClient = createClient;
const updateClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nombre, dni_cuit, telefono, email, direccion, zona_id } = req.body;
    try {
        const updatedClient = yield db_1.default.cliente.update({
            where: { id: Number(id) },
            data: {
                nombre,
                dni_cuit,
                telefono,
                email,
                direccion,
                zona_id: zona_id ? Number(zona_id) : undefined,
            },
        });
        res.json(updatedClient);
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating client' });
    }
});
exports.updateClient = updateClient;
const deleteClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield db_1.default.cliente.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting client' });
    }
});
exports.deleteClient = deleteClient;
