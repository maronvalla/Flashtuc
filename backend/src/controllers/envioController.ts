import { Request, Response } from 'express';
import prisma from '../db';

export const cotizarEnvio = async (req: Request, res: Response) => {
    const { km, bultos, zona_id, urgente } = req.body;

    try {
        const tarifa = await prisma.tarifa.findFirst({ where: { activa: true } });
        const zona = await prisma.zona.findUnique({ where: { id: Number(zona_id) } });

        if (!tarifa || !zona) {
            return res.status(404).json({ error: 'Tarifa o Zona no encontrada' });
        }

        const base = tarifa.base;
        const porBulto = bultos * tarifa.precio_por_bulto;
        const porKm = km * tarifa.precio_por_km;
        const multiUrgente = urgente ? tarifa.multiplicador_urgente : 1;

        const subtotal = (base + porBulto + porKm) * zona.multiplicador;
        const total = subtotal * multiUrgente;

        res.json({
            desglose: {
                base,
                porBulto,
                porKm,
                multiplicadorZona: zona.multiplicador,
                multiplicadorUrgente: multiUrgente
            },
            total: Number(total.toFixed(2))
        });
    } catch (error) {
        console.error('Error in cotizarEnvio:', error);
        res.status(500).json({ error: 'Error al calcular cotización' });
    }
};

export const createEnvio = async (req: Request, res: Response) => {
    const { cliente_id, destinatario_nombre, destinatario_telefono, direccion_destino, bultos, km, zona_id, urgente, cod_monto } = req.body;

    try {
        // En un caso real, recalculamos la tarifa aquí para seguridad
        const tarifa = await prisma.tarifa.findFirst({ where: { activa: true } });
        const zona = await prisma.zona.findUnique({ where: { id: Number(zona_id) } });

        if (!tarifa || !zona) return res.status(404).json({ error: 'Tarifa/Zona no encontrada' });

        const total = ((tarifa.base + (bultos * tarifa.precio_por_bulto) + (km * tarifa.precio_por_km)) * zona.multiplicador) * (urgente ? tarifa.multiplicador_urgente : 1);

        const comisionEmpresa = (cod_monto || 0) * 0.05; // 5% de comisión por manejo de efectivo
        const pagoEmpresa = total + comisionEmpresa;
        const pagoRemitente = (cod_monto || 0) - comisionEmpresa;

        const envio = await prisma.envio.create({
            data: {
                cliente_id: Number(cliente_id),
                destinatario_nombre,
                destinatario_telefono,
                direccion_destino,
                bultos: Number(bultos),
                km: Number(km),
                zona_id: Number(zona_id),
                urgente: !!urgente,
                tarifa_total: total,
                cod_monto: Number(cod_monto || 0),
                pago_empresa: pagoEmpresa,
                pago_remitente: pagoRemitente,
                lat: Number(req.body.lat || 0),
                lng: Number(req.body.lng || 0),
                estado: 'PENDIENTE'
            }
        });

        res.status(201).json(envio);
    } catch (error) {
        console.error('Error in createEnvio:', error);
        res.status(500).json({ error: 'Error al crear envío' });
    }
};

export const getEnvios = async (req: Request, res: Response) => {
    try {
        const envios = await prisma.envio.findMany({
            include: { cliente: true, zona: true, ruta: true }
        });
        res.json(envios);
    } catch (error) {
        console.error('Error in getEnvios:', error);
        res.status(500).json({ error: 'Error al obtener envíos' });
    }
};
export const updateEnvio = async (req: Request, res: Response) => {
    const { id } = req.params;
    const {
        cliente_id, destinatario_nombre, destinatario_telefono,
        direccion_destino, bultos, km, zona_id, urgente,
        cod_monto, estado, ruta_id, lat, lng
    } = req.body;

    try {
        const updateData: any = {};
        if (cliente_id !== undefined) updateData.cliente_id = Number(cliente_id);
        if (destinatario_nombre !== undefined) updateData.destinatario_nombre = destinatario_nombre;
        if (destinatario_telefono !== undefined) updateData.destinatario_telefono = destinatario_telefono;
        if (direccion_destino !== undefined) updateData.direccion_destino = direccion_destino;
        if (bultos !== undefined) updateData.bultos = Number(bultos);
        if (km !== undefined) updateData.km = Number(km);
        if (zona_id !== undefined) updateData.zona_id = Number(zona_id);
        if (urgente !== undefined) updateData.urgente = !!urgente;
        if (cod_monto !== undefined) updateData.cod_monto = Number(cod_monto);
        if (estado !== undefined) updateData.estado = estado;
        if (ruta_id !== undefined) updateData.ruta_id = ruta_id ? Number(ruta_id) : null;
        if (lat !== undefined) updateData.lat = Number(lat);
        if (lng !== undefined) updateData.lng = Number(lng);

        const envio = await prisma.envio.update({
            where: { id: Number(id) },
            data: updateData
        });

        res.json(envio);
    } catch (error) {
        console.error('Error in updateEnvio:', error);
        res.status(500).json({ error: 'Error al actualizar envío' });
    }
};
