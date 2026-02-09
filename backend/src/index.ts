import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './db';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.status(200).json({ ok: true });
});

app.get('/', (req, res) => {
    res.send('FlashTuc Backend Running');
});

import clientRoutes from './routes/clientRoutes';
import zoneRoutes from './routes/zoneRoutes';
import tariffRoutes from './routes/tariffRoutes';
import envioRoutes from './routes/envioRoutes';
import rutaRoutes from './routes/rutaRoutes';
import liquidacionRoutes from './routes/liquidacionRoutes';

app.use('/api/clientes', clientRoutes);
app.use('/api/zonas', zoneRoutes);
app.use('/api/tarifas', tariffRoutes);
app.use('/api/envios', envioRoutes);
app.use('/api/rutas', rutaRoutes);
app.use('/api/liquidaciones', liquidacionRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
