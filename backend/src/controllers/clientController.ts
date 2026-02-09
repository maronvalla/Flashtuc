import { Request, Response } from 'express';
import prisma from '../db';

export const getClients = async (req: Request, res: Response) => {
    try {
        const clients = await prisma.cliente.findMany({ include: { zona: true } });
        res.json(clients);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching clients' });
    }
};

export const getClientById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const client = await prisma.cliente.findUnique({
            where: { id: Number(id) },
            include: { zona: true },
        });
        if (client) {
            res.json(client);
        } else {
            res.status(404).json({ error: 'Client not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching client' });
    }
};

export const createClient = async (req: Request, res: Response) => {
    const { nombre, dni_cuit, telefono, email, direccion, zona_id } = req.body;
    try {
        const newClient = await prisma.cliente.create({
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
    } catch (error) {
        res.status(500).json({ error: 'Error creating client' });
    }
};

export const updateClient = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nombre, dni_cuit, telefono, email, direccion, zona_id } = req.body;
    try {
        const updatedClient = await prisma.cliente.update({
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
    } catch (error) {
        res.status(500).json({ error: 'Error updating client' });
    }
};

export const deleteClient = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.cliente.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting client' });
    }
};
