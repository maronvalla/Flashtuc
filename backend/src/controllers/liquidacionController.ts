import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createLiquidacion = async (req: Request, res: Response) => {
    const { cliente_id, envios_ids } = req.body;
    try {
        // Obtenemos los envíos para calcular el monto total
        const envios = await prisma.envio.findMany({
            where: { id: { in: envios_ids.map(Number) } }
        });

        const montoTotal = envios.reduce((acc, current) => acc + current.tarifa_total, 0);

        const liquidacion = await prisma.liquidacion.create({
            data: {
                cliente_id: Number(cliente_id),
                monto: montoTotal,
                envios: {
                    connect: envios_ids.map((id: number) => ({ id: Number(id) }))
                }
            },
            include: { envios: true }
        });

        res.status(201).json(liquidacion);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear liquidación' });
    }
};

export const getLiquidaciones = async (req: Request, res: Response) => {
    try {
        const liquidaciones = await prisma.liquidacion.findMany({
            include: { cliente: true, envios: true }
        });
        res.json(liquidaciones);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener liquidaciones' });
    }
};
