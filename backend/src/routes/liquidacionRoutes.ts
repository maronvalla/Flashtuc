import { Router } from 'express';
import { createLiquidacion, getLiquidaciones } from '../controllers/liquidacionController';

const router = Router();

router.post('/', createLiquidacion);
router.get('/', getLiquidaciones);

export default router;
