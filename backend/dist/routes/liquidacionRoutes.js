"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const liquidacionController_1 = require("../controllers/liquidacionController");
const router = (0, express_1.Router)();
router.post('/', liquidacionController_1.createLiquidacion);
router.get('/', liquidacionController_1.getLiquidaciones);
exports.default = router;
