"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const envioController_1 = require("../controllers/envioController");
const router = (0, express_1.Router)();
router.post('/cotizar', envioController_1.cotizarEnvio);
router.post('/', envioController_1.createEnvio);
router.get('/', envioController_1.getEnvios);
exports.default = router;
