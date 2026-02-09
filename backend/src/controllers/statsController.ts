import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStats = async (req: Request, res: Response) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const [
            enviosActivos,
            totalClientes,
            rutasHoy,
            facturacion
        ] = await Promise.all([
            prisma.envio.count({
                where: {
                    estado: {
                        in: ['PENDIENTE', 'EN_RUTA']
                    }
                }
            }),
            prisma.cliente.count(),
            prisma.ruta.count({
                where: {
                    fecha: {
                        gte: today,
                        lt: tomorrow
                    }
                }
            }),
            prisma.envio.aggregate({
                _sum: {
                    tarifa_total: true
                }
            })
        ]);

        // Recent activity: last 5 shipments
        const recentActivity = await prisma.envio.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                zona: true
            }
        });

        res.json({
            stats: {
                enviosActivos,
                totalClientes,
                rutasHoy,
                facturacion: facturacion._sum.tarifa_total || 0
            },
            recentActivity
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
};
