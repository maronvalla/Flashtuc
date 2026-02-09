import { Router } from 'express';
import { getZones, getZoneById, createZone, updateZone, deleteZone } from '../controllers/zoneController';

const router = Router();

router.get('/', getZones);
router.get('/:id', getZoneById);
router.post('/', createZone);
router.put('/:id', updateZone);
router.delete('/:id', deleteZone);

export default router;
