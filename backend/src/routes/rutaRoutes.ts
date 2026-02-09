import { Router } from 'express';
import { createRuta, getRutas, asignarEnvioARuta, optimizarRuta, updateRuta } from '../controllers/rutaController';

const router = Router();

router.post('/', createRuta);
router.get('/', getRutas);
router.post('/:id/asignar', asignarEnvioARuta);
router.post('/:id/optimize', optimizarRuta);
router.put('/:id', updateRuta);

export default router;
