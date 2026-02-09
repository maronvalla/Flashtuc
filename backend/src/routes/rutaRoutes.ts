import { Router } from 'express';
import { createRuta, getRutas, asignarEnvioARuta, optimizarRuta } from '../controllers/rutaController';

const router = Router();

router.post('/', createRuta);
router.get('/', getRutas);
router.post('/:id/asignar', asignarEnvioARuta);
router.post('/:id/optimizar', optimizarRuta);

export default router;
