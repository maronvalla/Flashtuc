import { Request, Response } from 'express';
import prisma from '../db';

export const createRuta = async (req: Request, res: Response) => {
    const { fecha, chofer_nombre } = req.body;
    try {
        const ruta = await prisma.ruta.create({
            data: {
                fecha: new Date(fecha),
                chofer_nombre,
                estado: 'PROGRAMADA'
            }
        });
        res.status(201).json(ruta);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear ruta' });
    }
};

export const getRutas = async (req: Request, res: Response) => {
    try {
        const rutas = await prisma.ruta.findMany({ include: { envios: true } });
        res.json(rutas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener rutas' });
    }
};

export const asignarEnvioARuta = async (req: Request, res: Response) => {
    const { id } = req.params; // Ruta ID
    const { envio_ids } = req.body; // Array de IDs de envíos
    try {
        await prisma.envio.updateMany({
            where: { id: { in: envio_ids.map(Number) } },
            data: { ruta_id: Number(id), estado: 'EN_RUTA' }
        });
        const updatedRuta = await prisma.ruta.findUnique({
            where: { id: Number(id) },
            include: { envios: true }
        });
        res.json(updatedRuta);
    } catch (error) {
        res.status(500).json({ error: 'Error al asignar envíos a la ruta' });
    }
};

export const optimizarRuta = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const ruta = await prisma.ruta.findUnique({
            where: { id: Number(id) },
            include: { envios: true }
        });

        if (!ruta) return res.status(404).json({ error: 'Ruta no encontrada' });

        const envios = [...ruta.envios];
        const enviosOrdenados = [];
        let currentPos = { lat: -26.808, lng: -65.217 }; // San Miguel de Tucumán (Centro)

        while (envios.length > 0) {
            let nearestIndex = 0;
            let minDistance = Infinity;

            for (let i = 0; i < envios.length; i++) {
                const d = Math.sqrt(
                    Math.pow(envios[i].lat - currentPos.lat, 2) +
                    Math.pow(envios[i].lng - currentPos.lng, 2)
                );
                if (d < minDistance) {
                    minDistance = d;
                    nearestIndex = i;
                }
            }

            const nearest = envios.splice(nearestIndex, 1)[0];
            enviosOrdenados.push(nearest);
            currentPos = { lat: nearest.lat, lng: nearest.lng };
        }

        res.json({ message: 'Ruta optimizada con Nearest-Neighbor', envios: enviosOrdenados });
    } catch (error) {
        res.status(500).json({ error: 'Error al optimizar ruta' });
    }
};

export const updateRuta = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { chofer_nombre, estado, fecha } = req.body;
    try {
        const updateData: any = {};
        if (chofer_nombre !== undefined) updateData.chofer_nombre = chofer_nombre;
        if (estado !== undefined) updateData.estado = estado;
        if (fecha !== undefined) updateData.fecha = new Date(fecha);

        const updatedRuta = await prisma.ruta.update({
            where: { id: Number(id) },
            data: updateData,
            include: { envios: true }
        });

        // Si la ruta inicia, pasamos todos sus envíos a 'EN_RUTA' (por si alguno quedó en PENDIENTE)
        if (estado === 'EN_CURSO') {
            await prisma.envio.updateMany({
                where: { ruta_id: Number(id) },
                data: { estado: 'EN_RUTA' }
            });
        }

        res.json(updatedRuta);
    } catch (error) {
        console.error('Error updating route:', error);
        res.status(500).json({ error: 'Error al actualizar ruta' });
    }
};
