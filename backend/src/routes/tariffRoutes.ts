import { Router } from 'express';
import { createTariff, deleteTariff, getTariffs, updateTariff } from '../controllers/tariffController';

const router = Router();

router.get('/', getTariffs);
router.post('/', createTariff);
router.put('/:id', updateTariff);
router.delete('/:id', deleteTariff);

export default router;
