"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/api/health', (req, res) => {
    res.status(200).json({ ok: true });
});
app.get('/', (req, res) => {
    res.send('FlashTuc Backend Running');
});
const clientRoutes_1 = __importDefault(require("./routes/clientRoutes"));
const zoneRoutes_1 = __importDefault(require("./routes/zoneRoutes"));
const tariffRoutes_1 = __importDefault(require("./routes/tariffRoutes"));
const envioRoutes_1 = __importDefault(require("./routes/envioRoutes"));
const rutaRoutes_1 = __importDefault(require("./routes/rutaRoutes"));
const liquidacionRoutes_1 = __importDefault(require("./routes/liquidacionRoutes"));
app.use('/api/clientes', clientRoutes_1.default);
app.use('/api/zonas', zoneRoutes_1.default);
app.use('/api/tarifas', tariffRoutes_1.default);
app.use('/api/envios', envioRoutes_1.default);
app.use('/api/rutas', rutaRoutes_1.default);
app.use('/api/liquidaciones', liquidacionRoutes_1.default);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
