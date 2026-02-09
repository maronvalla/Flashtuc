import { Router } from 'express';
import { cotizarEnvio, createEnvio, getEnvios } from '../controllers/envioController';

const router = Router();

router.post('/cotizar', cotizarEnvio);
router.post('/', createEnvio);
router.get('/', getEnvios);

export default router;
