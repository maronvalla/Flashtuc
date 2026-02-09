import { Request, Response } from 'express';
import prisma from '../db';

export const getZones = async (req: Request, res: Response) => {
    try {
        const zones = await prisma.zona.findMany();
        res.json(zones);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching zones' });
    }
};

export const getZoneById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const zone = await prisma.zona.findUnique({
            where: { id: Number(id) },
        });
        if (zone) {
            res.json(zone);
        } else {
            res.status(404).json({ error: 'Zone not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching zone' });
    }
};

export const createZone = async (req: Request, res: Response) => {
    const { nombre, multiplicador } = req.body;
    try {
        const newZone = await prisma.zona.create({
            data: {
                nombre,
                multiplicador: parseFloat(multiplicador),
            },
        });
        res.status(201).json(newZone);
    } catch (error) {
        res.status(500).json({ error: 'Error creating zone' });
    }
};

export const updateZone = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nombre, multiplicador } = req.body;
    try {
        const updatedZone = await prisma.zona.update({
            where: { id: Number(id) },
            data: {
                nombre,
                multiplicador: parseFloat(multiplicador),
            },
        });
        res.json(updatedZone);
    } catch (error) {
        res.status(500).json({ error: 'Error updating zone' });
    }
};

export const deleteZone = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.zona.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting zone' });
    }
};
