# 📘 GUÍA DE USO - INVENTARIO DE CAJAS

## ¿Qué es el Inventario de Cajas?

El Inventario de Cajas es la funcionalidad que te permite saber **exactamente qué cajas componen el inventario actual**, no solo cuántas libras tienes.

Cada caja empacada tiene un **número único** que la identifica. El sistema rastrea cada caja individualmente desde que entra al inventario hasta que sale, permitiéndote:

- ✅ Saber qué cajas están actualmente en stock
- ✅ Buscar cualquier caja por su número y ver toda su historia
- ✅ Saber a qué cliente se vendió una caja específica
- ✅ Conocer la ubicación de cada caja (cuarto, tarima, posición)

---

## Flujo de Trabajo

### 1. Cómo se Generan las Cajas

Las cajas **no se crean manualmente**. Se generan automáticamente cada vez que registras un Ingreso:

```
INGRESO con CAJA = 500
         ↓
Se crean 500 registros individuales en cajas_inventario
Cada uno con:
  - número de caja secuencial
  - mismo código, lote, especie, etc.
  - libras proporcionales (total_libras / 500)
  - estado: EN_STOCK
```

### 2. Cómo se Marcan las Cajas como Vendidas

Cuando registras una Salida, el sistema automáticamente:

1. Busca las cajas `EN_STOCK` del mismo **código de producto**.
2. Las ordena por **fecha de elaboración** (las más antiguas primero → FIFO).
3. Marca la cantidad necesaria como `VENDIDA`.
4. Registra el **cliente** y **N° documento** en cada caja.

```
SALIDA con CAJA = 100, Cliente: TROPIMAR
         ↓
Se buscan 100 cajas EN_STOCK del mismo código (FIFO)
Se actualizan:
  - estado: EN_STOCK → VENDIDA
  - cliente: TROPIMAR
  - ndoc: N° documento de la salida
```

### 3. Ver el Inventario de Cajas

1. Ve a **Inventario Cajas** en el menú lateral.
2. Verás una tabla con **todas las cajas que están EN STOCK**.
3. Las columnas incluyen: CAJA, CÓDIGO, ESPECIE, PRODUCTO, CALIDAD, TALLA, LIBRAS, LOTE, VENCIMIENTO, CUARTO, TARIMA.

#### Filtros Disponibles

| Filtro | Qué hace |
|--------|----------|
| **Buscador** | Busca por número de caja, código, lote, especie o producto |
| **Especie** | Filtra por tipo de pescado (ATUN, MAHI MAHI, etc.) |
| **Lote** | Filtra por número de lote |
| **Cuarto** | Filtra por cuarto de almacenamiento |

#### Paginación
Selecciona cuántas cajas mostrar: 10, 25, 50, 100.

### 4. Buscar una Caja por Número

1. Ve a **Inventario Cajas** → botón **"🔍 Buscar por N° Caja"** o directamente a `/buscar-caja`.
2. Ingresa el **número de caja**.
3. Presiona Enter o haz clic en **Buscar**.
4. Se muestra:
   - **Estado actual**: EN STOCK o VENDIDA (con cliente)
   - **Toda la información**: código, especie, producto, calidad, peso, lote, fechas, ubicación
   - **Historial completo**: cuándo entró, cuándo salió, a quién

#### Ejemplo de resultado:

```
┌─────────────────────────────────────────────────┐
│  Caja N° 5842                    ✅ EN STOCK    │
├─────────────────────────────────────────────────┤
│  Código:      010903060401                      │
│  Especie:     ATUN                              │
│  Producto:    LOMO SIN PIEL, CON CO             │
│  Calidad:     A                                 │
│  Talla:       58                                │
│  Libras:      94.00                             │
│  Lote:        64/25                             │
│  Fecha Elab:  17/12/2025                        │
│  Vencimiento: 17/12/2026                        │
│  Cuarto:      3                                 │
│  Tarima:      8                                 │
├─────────────────────────────────────────────────┤
│  📋 Historial de la Caja                        │
│                                                 │
│  📦 Ingresó al inventario                       │
│     Lote 64/25 — 17/12/2025                     │
│                                                 │
│  ⏳ Aún en stock                                │
│     Esta caja sigue disponible en el inventario  │
└─────────────────────────────────────────────────┘
```

### 5. Ver Detalle de una Caja

Desde la tabla de Inventario de Cajas, haz clic en el **número de caja** para ver el detalle completo.

---

## Estados de una Caja

| Estado | Significado |
|--------|-------------|
| **EN_STOCK** | La caja está disponible en el inventario |
| **VENDIDA** | La caja fue vendida/entregada a un cliente |
| **USADA** | La caja fue usada internamente |
| **MERMA** | La caja fue descartada por daño |
| **MUESTRA** | La caja fue enviada como muestra |
| **ELIMINADA** | El ingreso origen fue eliminado |

---

## Impacto en el Resto del Sistema

### Relación con Ingresos:
- Cada Ingreso genera N registros de cajas (donde N = valor del campo CAJA).
- Si eliminas un Ingreso, sus cajas se marcan como `ELIMINADA`.

### Relación con Salidas:
- Cada Salida marca N cajas como `VENDIDA` (criterio FIFO).
- Si eliminas una Salida, las cajas afectadas vuelven a `EN_STOCK`.

### Relación con Resumen:
- `STOCK = Σlibras de cajas EN_STOCK`
- El Resumen refleja exactamente lo que hay en el inventario de cajas.

---

## Ejemplo Práctico Completo

```
DÍA 1: Producción
  INGRESO: 1,000 cajas de ATUN (código 010903060401), 50,000 LB
  → Se crean 1,000 cajas (N° 1-1000) con estado EN_STOCK

DÍA 5: Venta
  SALIDA: 200 cajas a TROPIMAR
  → Se marcan cajas 1-200 como VENDIDA (FIFO, más antiguas)
  → Cajas 201-1000 siguen EN_STOCK

DÍA 10: Producción
  INGRESO: 500 cajas de ATUN (mismo código), 25,000 LB
  → Se crean 500 cajas nuevas (N° 1001-1500) con estado EN_STOCK

DÍA 15: Consulta
  INVENTARIO DE CAJAS muestra:
    → 800 cajas EN_STOCK del código 010903060401
    → Cajas 201-1000 (primer lote) + 1001-1500 (segundo lote)
    → Total: 37,500 LB disponibles

  BUSCAR CAJA #150:
    → Estado: VENDIDA
    → Cliente: TROPIMAR
    → Fecha de venta: DÍA 5

  BUSCAR CAJA #500:
    → Estado: EN_STOCK
    → Ubicación: Cuarto 3, Tarima 8
```

---

## Comando de Sincronización

Si necesitas reconstruir todo el inventario de cajas desde cero:

```bash
docker-compose exec app php artisan inventario:sync
```

Esto:
1. Elimina todos los registros de cajas existentes
2. Vuelve a crear todas las cajas desde los Ingresos
3. Marca las cajas vendidas desde las Salidas
4. Muestra un resumen final

---

## Trazabilidad Completa

Con el Inventario de Cajas puedes responder preguntas como:

| Pregunta | Dónde encontrarla |
|----------|-------------------|
| ¿Qué cajas de Atún tengo disponibles? | Inventario Cajas → filtro Especie: ATUN |
| ¿En qué cuarto está la caja #5842? | Buscar Caja → ingresa 5842 |
| ¿A quién le vendí la caja #3210? | Buscar Caja → muestra cliente |
| ¿Cuántas cajas del lote 64/25 quedan? | Inventario Cajas → filtro Lote: 64/25 |
| ¿Cuántas libras totales tengo en stock? | Tarjeta superior "Libras en Stock" |
| ¿Qué cajas están próximas a vencer? | Inventario Cajas → ordenar por Vencimiento |

---

## Preguntas Frecuentes

**¿Los números de caja se repiten entre productos diferentes?**
Sí. El número de caja es único por producto. Puede haber caja #1 de ATUN y caja #1 de MAHI MAHI.

**¿Qué pasa si importo el mismo Ingreso dos veces?**
Se duplican las cajas. Verifica antes de importar.

**¿Puedo crear cajas manualmente sin un Ingreso?**
No. Las cajas solo se crean a través de Ingresos.

**¿Cómo sé qué cajas están en cada cuarto?**
Ve a Inventario Cajas y usa el filtro **Cuarto**.

**¿Se puede exportar la lista de cajas?**
Actualmente se puede ver en pantalla. La exportación se puede agregar en el futuro.
