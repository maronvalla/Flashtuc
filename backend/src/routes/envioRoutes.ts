import { Router } from 'express';
import { cotizarEnvio, createEnvio, getEnvios, updateEnvio } from '../controllers/envioController';

const router = Router();

router.post('/cotizar', cotizarEnvio);
router.post('/', createEnvio);
router.get('/', getEnvios);
router.put('/:id', updateEnvio);

export default router;
