-- CreateTable
CREATE TABLE "Cliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "dni_cuit" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT,
    "direccion" TEXT,
    "zona_id" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Cliente_zona_id_fkey" FOREIGN KEY ("zona_id") REFERENCES "Zona" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Zona" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "multiplicador" REAL NOT NULL DEFAULT 1.0
);

-- CreateTable
CREATE TABLE "Tarifa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "base" REAL NOT NULL DEFAULT 0,
    "precio_por_bulto" REAL NOT NULL DEFAULT 0,
    "precio_por_km" REAL NOT NULL DEFAULT 0,
    "multiplicador_urgente" REAL NOT NULL DEFAULT 1.0,
    "activa" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Envio" (
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

-- CreateTable
CREATE TABLE "Ruta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fecha" DATETIME NOT NULL,
    "chofer_nombre" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PROGRAMADA',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "envio_id" INTEGER NOT NULL,
    "monto_total" REAL NOT NULL,
    "monto_remitente" REAL NOT NULL,
    "monto_empresa" REAL NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Pago_envio_id_fkey" FOREIGN KEY ("envio_id") REFERENCES "Envio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Liquidacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cliente_id" INTEGER NOT NULL,
    "monto" REAL NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Liquidacion_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Pago_envio_id_key" ON "Pago"("envio_id");
