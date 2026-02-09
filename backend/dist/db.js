"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const client_1 = require("@prisma/client");
// Ensure the data directory exists
const dataDir = path_1.default.join(process.cwd(), "data");
if (!fs_1.default.existsSync(dataDir)) {
    fs_1.default.mkdirSync(dataDir, { recursive: true });
}
// Prisma will use the DATABASE_URL from .env or environment variables.
// The URL should be: file:./data/flashtuc.sqlite
// We initialize the client here to share it across the app.
const prisma = new client_1.PrismaClient();
exports.default = prisma;
