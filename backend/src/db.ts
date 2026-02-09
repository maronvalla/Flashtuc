import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Prisma will use the DATABASE_URL from .env or environment variables.
// The URL should be: file:./data/flashtuc.sqlite
// We initialize the client here to share it across the app.
const prisma = new PrismaClient();

export default prisma;
