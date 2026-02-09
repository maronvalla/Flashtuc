import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTariffs = async (req: Request, res: Response) => {
    try {
        const tariffs = await prisma.tarifa.findMany();
        res.json(tariffs);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching tariffs' });
    }
};

export const createTariff = async (req: Request, res: Response) => {
    const { nombre, base, precio_por_bulto, precio_por_km, multiplicador_urgente, activa } = req.body;
    try {
        const newTariff = await prisma.tarifa.create({
            data: {
                nombre,
                base: parseFloat(base),
                precio_por_bulto: parseFloat(precio_por_bulto),
                precio_por_km: parseFloat(precio_por_km),
                multiplicador_urgente: parseFloat(multiplicador_urgente),
                activa: activa ?? true,
            },
        });
        res.status(201).json(newTariff);
    } catch (error) {
        res.status(500).json({ error: 'Error creating tariff' });
    }
};

export const updateTariff = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nombre, base, precio_por_bulto, precio_por_km, multiplicador_urgente, activa } = req.body;
    try {
        const updatedTariff = await prisma.tarifa.update({
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
    } catch (error) {
        res.status(500).json({ error: 'Error updating tariff' });
    }
};

export const deleteTariff = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.tarifa.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting tariff' });
    }
};
