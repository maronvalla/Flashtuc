-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Envio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cliente_id" INTEGER NOT NULL,
    "destinatario_nombre" TEXT NOT NULL,
    "destinatario_telefono" TEXT,
    "direccion_destino" TEXT NOT NULL,
    "bultos" INTEGER NOT NULL,
    "km" REAL NOT NULL,
    "zona_id" INTEGER NOT NULL,
    "urgente" BOOLEAN NOT NULL DEFAULT false,
    "tarifa_total" REAL NOT NULL,
    "cod_monto" REAL NOT NULL DEFAULT 0,
    "pago_empresa" REAL NOT NULL DEFAULT 0,
    "pago_remitente" REAL NOT NULL DEFAULT 0,
    "lat" REAL NOT NULL DEFAULT 0,
    "lng" REAL NOT NULL DEFAULT 0,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "ruta_id" INTEGER,
    "liquidacion_id" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Envio_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Envio_zona_id_fkey" FOREIGN KEY ("zona_id") REFERENCES "Zona" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Envio_ruta_id_fkey" FOREIGN KEY ("ruta_id") REFERENCES "Ruta" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Envio_liquidacion_id_fkey" FOREIGN KEY ("liquidacion_id") REFERENCES "Liquidacion" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Envio" ("bultos", "cliente_id", "cod_monto", "createdAt", "destinatario_nombre", "destinatario_telefono", "direccion_destino", "estado", "id", "km", "liquidacion_id", "ruta_id", "tarifa_total", "updatedAt", "urgente", "zona_id") SELECT "bultos", "cliente_id", "cod_monto", "createdAt", "destinatario_nombre", "destinatario_telefono", "direccion_destino", "estado", "id", "km", "liquidacion_id", "ruta_id", "tarifa_total", "updatedAt", "urgente", "zona_id" FROM "Envio";
DROP TABLE "Envio";
ALTER TABLE "new_Envio" RENAME TO "Envio";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
