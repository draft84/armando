# 📋 PLAN DE DESARROLLO - Sistema de Inventario por Cajas

## 📌 ANÁLISIS DE REQUERIMIENTOS

Según la descripción del usuario en SISTEMA.md, el sistema actual funciona pero necesita mejoras clave:

### Problema actual:
- El RESUMEN muestra **cuántas libras** hay de cada producto (STOCK = INGRESOS - SALIDAS)
- Pero **NO muestra qué cajas específicas** componen ese inventario
- Cada caja tiene un **número único irrepetible** que permite trazabilidad completa
- Las salidas se hacen por cajas → se puede saber exactamente qué cajas quedan

### Visión del usuario:
> *"Quiero mejorar que sea posible ver el inventario de qué cajas componen el inventario actual, además de solo saber qué cantidad tengo."*

> *"Toda la información que contienen las planillas quiero mantenerlas por trazabilidad y poder buscar un número de caja específica y me dé toda la información de esa caja: proveedor, lote, fechas, etc."*

> *"Capturar la información directamente donde se genera, se vaya generando una base de datos de donde pueda extraer el informe de producción con costos y el inventario."*

---

## 📝 LISTA DE TAREAS

### FASE 1: Trazabilidad de Cajas (Prioridad ALTA)

- [ ] **1.1** Crear tabla `cajas_inventario` que rastree el estado actual de cada caja
  - Campos: `id`, `caja_numero` (único), `codigo_producto`, `lote`, `especie`, `producto`, `calidad`, `talla`, `empaque`, `libras`, `uds`, `promedio`, `fecha_elab`, `fechavenci`, `cuarto`, `posicion`, `tarima`, `estado` (EN_STOCK / VENDIDA / USADA), `ingreso_id`, `salida_id`, `cliente` (si fue vendida), `created_at`, `updated_at`

- [ ] **1.2** Adaptar el modelo Ingreso para crear registros de cajas al importar/crear
  - Cada registro de Ingreso genera N registros en `cajas_inventario` (donde N = número de cajas)
  - Estado inicial: `EN_STOCK`

- [ ] **1.3** Adaptar el modelo Salida para marcar cajas como vendidas/usadas
  - Al crear una Salida, buscar cajas con estado `EN_STOCK` del mismo código/lote
  - Cambiar estado a `VENDIDA` o `USADA` y vincular `salida_id` y `cliente`

- [ ] **1.4** Nueva página: "Inventario de Cajas" (`/inventario-cajas`)
  - Tabla que muestra TODAS las cajas que están actualmente EN STOCK
  - Filtros por: especie, codigo, lote, calidad, talla, cuarto, tarima
  - Columnas: CAJA, CODIGO, ESPECIE, PRODUCTO, CALIDAD, TALLA, LIBRAS, LOTE, FECHA ELAB, VENCIMIENTO, CUARTO, TARIMA
  - Botón para ver detalle de una caja específica

- [ ] **1.5** Nueva página: "Buscar Caja" (`/buscar-caja`)
  - Buscador por número de caja
  - Muestra toda la historia de la caja: cuándo entró, cuándo salió (si aplica), a quién se vendió

- [ ] **1.6** Actualizar el Resumen para mostrar composición de cajas
  - Al hacer clic en un producto del Resumen, mostrar qué cajas componen ese stock
  - Modal o página de detalle con las cajas específicas

### FASE 2: Actualizar lógica del Resumen

- [ ] **2.1** El cálculo STOCK = INGRESOS - SALIDAS ya funciona ✅
  - Pero ahora debe usar la tabla `cajas_inventario` como fuente de verdad
  - INGRESOS = SUM(libras) WHERE estado = 'EN_STOCK' (histórico de entradas)
  - SALIDAS = SUM(libras) WHERE estado = 'VENDIDA'/'USADA'

- [ ] **2.2** Comando artisan: `php artisan inventario:sync`
  - Reconstruye la tabla `cajas_inventario` desde cero usando datos de Ingresos y Salidas
  - Útil para migrar datos existentes o reparar inconsistencias

### FASE 3: Planillas de Producción (Futuro)

- [ ] **3.1** Crear módulo "Planillas de Producción"
  - Tabla `planillas_produccion` para capturar datos en sitio/terreno
  - Campos básicos: lote, fecha, especie, producto, calidad, cantidad cajas, pesos, operarios, observaciones

- [ ] **3.2** Tabla `costos_produccion` vinculada a planillas
  - Mano de obra, materia prima, insumos, costos por lote

- [ ] **3.3** Generador de Informes de Producción
  - Informe por lote que incluya: mano de obra, materia prima, insumos, costos totales

- [ ] **3.4** Al registrar una planilla → automáticamente genera los Ingresos correspondientes
  - Elimina la doble digitación de datos

### FASE 4: Mejoras Generales

- [ ] **4.1** Implementar historial de movimientos por caja
  - Timeline: cuándo entró, si se movió de posición, cuándo salió, a quién

- [ ] **4.2** Alertas de vencimiento
  - Notificar cuando cajas están próximas a vencer

- [ ] **4.3** Reporte de trazabilidad completa
  - PDF/Excel con toda la historia de un lote o caja específica

- [ ] **4.4** Dashboard mejorado con datos de cajas
  - Total cajas en stock, cajas por cuarto, cajas próximas a vencer

---

## 🏗️ ESTRUCTURA DE BASE DE DATOS PROPUESTA

### Tabla: `cajas_inventario`
```sql
CREATE TABLE cajas_inventario (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    caja_numero     BIGINT          NOT NULL UNIQUE COMMENT 'Número único de caja',
    codigo_producto VARCHAR(50)     NOT NULL COMMENT 'Código del producto',
    lote            VARCHAR(50)     NOT NULL,
    especie         VARCHAR(100)    NOT NULL,
    producto        VARCHAR(255)    NOT NULL,
    calidad         VARCHAR(20)     NOT NULL,
    talla           VARCHAR(20),
    empaque         VARCHAR(100),
    libras          DECIMAL(10,2),
    uds             INT,
    promedio        DECIMAL(10,2),
    fecha_elab      DATETIME,
    fechavenci      DATETIME,
    cuarto          INT,
    posicion        VARCHAR(50),
    tarima          INT,
    estado          ENUM('EN_STOCK', 'VENDIDA', 'USADA', 'MERMA', 'MUESTRA') DEFAULT 'EN_STOCK',
    ingreso_id      BIGINT UNSIGNED COMMENT 'Referencia al ingreso que la creó',
    salida_id       BIGINT UNSIGNED COMMENT 'Referencia a la salida que la retiró',
    cliente         VARCHAR(255)    COMMENT 'Cliente al que se vendió',
    ndoc            VARCHAR(100)    COMMENT 'Número de documento de salida',
    observaciones   TEXT,
    created_at      TIMESTAMP NULL,
    updated_at      TIMESTAMP NULL,
    
    INDEX idx_estado (estado),
    INDEX idx_codigo (codigo_producto),
    INDEX idx_lote (lote),
    INDEX idx_especie (especie),
    INDEX idx_caja_numero (caja_numero)
);
```

---

## 📊 FLUJO DE TRABAJO ACTUAL vs PROPUESTO

### ACTUAL (como funciona hoy):
```
INGRESOS (libras por código) ──┐
                               ├──→ RESUMEN (STOCK = Σlibras INGRESOS - Σlibras SALIDAS)
SALIDAS (libras por código)  ──┘

Problema: Sabemos CUÁNTAS libras hay, pero NO SABEMOS cuáles cajas son.
```

### PROPUESTO:
```
INGRESOS (libras por código) ──┐
                               ├──→ RESUMEN (STOCK = Σlibras INGRESOS - Σlibras SALIDAS)
SALIDAS (libras por código)  ──┘
         │                              │
         └──→ CAJAS_INVENTARIO ←────────┘
                    │
                    ├──→ Inventario de Cajas (qué cajas están EN STOCK)
                    ├──→ Trazabilidad (historia completa de cada caja)
                    └──→ Búsqueda por número de caja
```

---

## 🎯 PRIORIDAD DE IMPLEMENTACIÓN

| Fase | Prioridad | Impacto | Complejidad |
|------|-----------|---------|-------------|
| **Fase 1** - Trazabilidad de Cajas | 🔴 ALTA | Muy alto | Media |
| **Fase 2** - Actualizar lógica Resumen | 🔴 ALTA | Alto | Baja |
| **Fase 3** - Planillas de Producción | 🟡 MEDIA | Alto | Alta |
| **Fase 4** - Mejoras Generales | 🟢 BAJA | Medio | Media |

---

## ⚡ DEPENDENCIAS

- Fase 1 es prerrequisito para Fase 2 y Fase 4
- Fase 3 es independiente pero complementa el sistema
- Fase 4 requiere Fase 1 completada
