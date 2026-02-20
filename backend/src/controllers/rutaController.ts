import { Request, Response } from 'express';
import prisma from '../db';

const DEFAULT_DEPOT = { lat: -26.8241, lng: -65.2226 }; // San Miguel de Tucuman (center approx)

const isValidCoordinate = (lat: unknown, lng: unknown) => {
    const nLat = Number(lat);
    const nLng = Number(lng);
    return Number.isFinite(nLat) && Number.isFinite(nLng) && !(nLat === 0 && nLng === 0);
};

const haversineKm = (aLat: number, aLng: number, bLat: number, bLng: number) => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const earthRadiusKm = 6371;
    const dLat = toRad(bLat - aLat);
    const dLng = toRad(bLng - aLng);
    const lat1 = toRad(aLat);
    const lat2 = toRad(bLat);
    const h =
        Math.sin(dLat / 2) ** 2 +
        Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    return 2 * earthRadiusKm * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

const pathDistanceFromOrigin = (path: any[], origin: { lat: number; lng: number }) => {
    if (!path.length) return 0;
    let total = 0;
    let current = origin;
    for (const stop of path) {
        total += haversineKm(current.lat, current.lng, Number(stop.lat), Number(stop.lng));
        current = { lat: Number(stop.lat), lng: Number(stop.lng) };
    }
    return total;
};

const nearestNeighborOrder = (stops: any[], origin: { lat: number; lng: number }) => {
    const remaining = [...stops];
    const ordered: any[] = [];
    let current = origin;

    while (remaining.length > 0) {
        let nearestIndex = 0;
        let minDistance = Infinity;

        for (let i = 0; i < remaining.length; i++) {
            const d = haversineKm(current.lat, current.lng, Number(remaining[i].lat), Number(remaining[i].lng));
            if (d < minDistance) {
                minDistance = d;
                nearestIndex = i;
            }
        }

        const next = remaining.splice(nearestIndex, 1)[0];
        ordered.push(next);
        current = { lat: Number(next.lat), lng: Number(next.lng) };
    }

    return ordered;
};

const twoOptImprove = (initialOrder: any[], origin: { lat: number; lng: number }) => {
    if (initialOrder.length < 4) return initialOrder;

    let best = [...initialOrder];
    let improved = true;
    let loops = 0;

    while (improved && loops < 8) {
        improved = false;
        loops += 1;

        for (let i = 0; i < best.length - 2; i++) {
            for (let k = i + 1; k < best.length - 1; k++) {
                const candidate = [
                    ...best.slice(0, i),
                    ...best.slice(i, k + 1).reverse(),
                    ...best.slice(k + 1)
                ];

                if (pathDistanceFromOrigin(candidate, origin) + 0.001 < pathDistanceFromOrigin(best, origin)) {
                    best = candidate;
                    improved = true;
                }
            }
        }
    }

    return best;
};

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
        const rutas = await prisma.ruta.findMany({
            include: {
                envios: {
                    include: { zona: true },
                    orderBy: { posicion: 'asc' }
                }
            }
        });
        res.json(rutas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener rutas' });
    }
};

export const asignarEnvioARuta = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { envio_ids } = req.body;

    try {
        const rutaId = Number(id);
        if (!Array.isArray(envio_ids) || envio_ids.length === 0) {
            return res.status(400).json({ error: 'Debe enviar al menos un envio para asignar' });
        }

        const normalizedIds = envio_ids.map(Number).filter((n: number) => Number.isInteger(n) && n > 0);
        if (normalizedIds.length !== envio_ids.length) {
            return res.status(400).json({ error: 'IDs de envio invalidos' });
        }

        const maxPos = await prisma.envio.aggregate({
            where: { ruta_id: rutaId },
            _max: { posicion: true }
        });
        let currentPos = maxPos._max.posicion || 0;

        await prisma.$transaction(
            normalizedIds.map((envioId: number) => {
                currentPos += 1;
                return prisma.envio.update({
                    where: { id: envioId },
                    data: {
                        ruta_id: rutaId,
                        posicion: currentPos,
                        estado: 'PENDIENTE'
                    }
                });
            })
        );

        const updatedRuta = await prisma.ruta.findUnique({
            where: { id: rutaId },
            include: {
                envios: {
                    include: { zona: true },
                    orderBy: { posicion: 'asc' }
                }
            }
        });

        res.json(updatedRuta);
    } catch (error) {
        console.error('Error in asignarEnvioARuta:', error);
        res.status(500).json({ error: 'Error al asignar envios a la ruta' });
    }
};

export const optimizarRuta = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const ruta = await prisma.ruta.findUnique({
            where: { id: Number(id) },
            include: { envios: { include: { zona: true } } }
        });

        if (!ruta) return res.status(404).json({ error: 'Ruta no encontrada' });
        if (!ruta.envios.length) return res.status(400).json({ error: 'La ruta no tiene envios asignados' });

        const enviosGeolocalizados = ruta.envios.filter((e) => isValidCoordinate(e.lat, e.lng));
        const enviosSinCoords = ruta.envios.filter((e) => !isValidCoordinate(e.lat, e.lng));

        const bodyStartLat = Number(req.body?.start_lat);
        const bodyStartLng = Number(req.body?.start_lng);
        const customOrigin =
            Number.isFinite(bodyStartLat) &&
            Number.isFinite(bodyStartLng) &&
            !(bodyStartLat === 0 && bodyStartLng === 0)
                ? { lat: bodyStartLat, lng: bodyStartLng }
                : null;
        const origin = customOrigin || DEFAULT_DEPOT;

        let enviosOrdenadosGeoloc: any[] = [];
        if (enviosGeolocalizados.length > 0) {
            const initialPath = nearestNeighborOrder(enviosGeolocalizados, origin);
            enviosOrdenadosGeoloc = twoOptImprove(initialPath, origin);
        }

        const sinCoordsOrdenados = [...enviosSinCoords].sort((a, b) => {
            const zonaA = a.zona?.nombre || '';
            const zonaB = b.zona?.nombre || '';
            if (zonaA !== zonaB) return zonaA.localeCompare(zonaB, undefined, { sensitivity: 'base' });

            const dirA = a.direccion_destino || '';
            const dirB = b.direccion_destino || '';
            return dirA.localeCompare(dirB, undefined, { numeric: true, sensitivity: 'base' });
        });

        const enviosOrdenados = [...enviosOrdenadosGeoloc, ...sinCoordsOrdenados];
        if (!enviosOrdenados.length) {
            return res.status(400).json({ error: 'No hay envios validos para optimizar' });
        }

        await prisma.$transaction(
            enviosOrdenados.map((envio, idx) =>
                prisma.envio.update({
                    where: { id: envio.id },
                    data: { posicion: idx + 1 }
                })
            )
        );

        if (ruta.estado === 'EN_CURSO') {
            await prisma.envio.updateMany({
                where: { id: { in: enviosOrdenados.map((e) => e.id) }, estado: 'PENDIENTE' },
                data: { estado: 'EN_RUTA' }
            });
        } else {
            await prisma.envio.updateMany({
                where: { id: { in: enviosOrdenados.map((e) => e.id) }, estado: 'EN_RUTA' },
                data: { estado: 'PENDIENTE' }
            });
        }

        const totalDistanceKm = Number(pathDistanceFromOrigin(enviosOrdenadosGeoloc, origin).toFixed(2));

        res.json({
            message: 'Ruta optimizada con exito',
            metadata: {
                algorithm: enviosGeolocalizados.length > 0 ? 'nearest-neighbor + 2-opt' : 'zona + direccion',
                totalStops: enviosOrdenados.length,
                geolocatedStops: enviosGeolocalizados.length,
                unlocatedStops: enviosSinCoords.length,
                totalDistanceKm,
                origin
            },
            envios: enviosOrdenados.map((e, idx) => ({ ...e, posicion: idx + 1 }))
        });
    } catch (error) {
        console.error('Error in optimizarRuta:', error);
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
            include: {
                envios: {
                    include: { zona: true },
                    orderBy: { posicion: 'asc' }
                }
            }
        });

        if (estado === 'EN_CURSO') {
            await prisma.envio.updateMany({
                where: { ruta_id: Number(id), estado: 'PENDIENTE' },
                data: { estado: 'EN_RUTA' }
            });
        }

        res.json(updatedRuta);
    } catch (error) {
        console.error('Error updating route:', error);
        res.status(500).json({ error: 'Error al actualizar ruta' });
    }
};

export const deleteRuta = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.envio.updateMany({
            where: { ruta_id: Number(id) },
            data: {
                ruta_id: null,
                estado: 'PENDIENTE',
                posicion: 0
            }
        });

        await prisma.ruta.delete({
            where: { id: Number(id) }
        });

        res.json({ message: 'Ruta eliminada correctamente' });
    } catch (error) {
        console.error('Error deleting route:', error);
        res.status(500).json({ error: 'Error al eliminar ruta' });
    }
};
