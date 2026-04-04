# 📊 SISTEMA DE CONTROL DE INVENTARIO – INGRESOS, SALIDAS y RESUMEN

## 📌 DESCRIPCIÓN GENERAL

Este sistema consta de **tres hojas de Excel** que trabajan en conjunto para llevar un control completo del inventario de productos congelados (principalmente pescados y mariscos). Cada hoja tiene una función específica dentro del flujo de trabajo.

---

## 1️⃣ HOJA `INGRESOS.xlsx` – "LO QUE ENTRA"

### Función principal:

Registrar **todo el producto que llega al inventario**, ya sea por producción propia, compras a proveedores, traslados internos o cualquier otra vía de entrada.

### ¿Qué tipo de movimientos registra?

- Producción de producto terminado
- Compras a proveedores externos
- Reingresos de producto que había salido
- Traslados desde otras bodegas o áreas

### Columnas principales y su significado:

| Columna | Nombre | Qué registra |
|---------|--------|--------------|
| A | ITEMS | Número de línea o identificador único del registro |
| B | FECHAEMP | Fecha en que el producto ingresó al inventario |
| C | LOTE | Número de lote de producción o compra |
| D | CODIGO | Código único del producto |
| E | CAJA | Número o identificador de la caja |
| F | ESPECIE | Tipo de pescado (ATUN, MAHI MAHI, PARGO, etc.) |
| G | PRODUCTO | Descripción detallada del corte o presentación |
| H | CALIDAD | Clasificación de calidad (A, B, C, IND, etc.) |
| I | FECHA ELAB | Fecha de elaboración o producción |
| J | FECHAVENCI | Fecha de vencimiento (generalmente 1 año después) |
| K | CAJA2 | Copia del número de caja (para referencia) |
| L | TALLA | Tamaño del producto (58, 8UP, 35, etc.) |
| M | UDS | Número de unidades o piezas |
| N | LIBRAS | Peso total en libras |
| O | PROMEDIO | Peso promedio por unidad (`LIBRAS / UDS`) |
| P | QUEES | Tipo de movimiento (INVFISICO, PRODUCCION, etc.) |
| Q | EMPAQUE | Tipo de empaque (CAJA LBS LIBRE, GRANEL, etc.) |
| R | CUARTO | Número de cuarto de refrigeración/congelación |
| S | POSICION | Posición específica dentro del cuarto |
| T | TARIMA | Número de tarima o pallet donde se almacena |

### Ejemplo de un registro típico:

```
ITEMS: 2
FECHAEMP: 2025-12-22
LOTE: 64/25
CODIGO: 010903060401
ESPECIE: ATUN
PRODUCTO: LOMO SIN PIEL, CON CO
LIBRAS: 47
CUARTO: 1
TARIMA: 1
```

> **Conclusión:** `INGRESOS.xlsx` es el **libro de entradas** del almacén.

---

## 2️⃣ HOJA `SALIDAS.xlsx` – "LO QUE SALE"

### Función principal:

Registrar **todo el producto que se retira del inventario**, ya sea por venta, uso interno, muestras, desperdicio o cualquier otro motivo.

### ¿Qué tipo de movimientos registra?

- Ventas a clientes (supermercados, restaurantes, distribuidores)
- Envíos a producción para transformación
- Muestras gratis para clientes potenciales
- Desperdicio o merma
- Traslados a otras bodegas

### Columnas principales y su significado:

| Columna | Nombre | Qué registra |
|---------|--------|--------------|
| A | ITEMS | Número de línea o identificador único del registro |
| B | FECHA | Fecha en que el producto salió del inventario |
| C | LOTE | Número de lote del producto que sale |
| D | CODIGO | Código único del producto |
| E | CAJA | Número o identificador de la caja que sale |
| F | ESPECIE | Tipo de pescado |
| G | PRODUCTO | Descripción detallada del corte o presentación |
| H | CALIDAD | Clasificación de calidad |
| I | FECHA ELAB | Fecha de elaboración original |
| J | FECHAVENCI | Fecha de vencimiento |
| K | CAJA2 | Copia del número de caja |
| L | TALLA | Tamaño del producto |
| M | UDS | Número de unidades que salen |
| N | LIBRAS | Peso total en libras que sale |
| O | PROMEDIO | Peso promedio por unidad |
| P | QUEES | Tipo de movimiento (VENTA, MUESTRAS, CORTE, etc.) |
| Q | EMPAQUE | Tipo de empaque |
| R | CUARTO | Cuarto de origen (de dónde se sacó) |
| S | POSICION | Posición de origen |
| T | TARIMA | Tarima de origen |
| U | CLIENTE | Cliente o destino del producto |
| V | N°DOC | Número de documento (factura, orden, etc.) |

### Ejemplo de un registro típico:

```
ITEMS: 1
FECHA: 2025-12-23
CODIGO: 081402070201
ESPECIE: MAHI MAHI
LIBRAS: 40.3
CLIENTE: TROPIMAR
N°DOC: 327
```

> **Conclusión:** `SALIDAS.xlsx` es el **libro de salidas** del almacén.

---

## 3️⃣ HOJA `RESUMEN.xlsx` – "EL ESTADO ACTUAL"

### Función principal:

Mostrar de forma **consolidada y automática** el **stock disponible hoy** de cada producto, basado en la suma de todos los ingresos menos todas las salidas.

### ¿Qué hace esta hoja?

- Automáticamente **suma todos los ingresos** de `INGRESOS.xlsx` para cada código de producto
- Automáticamente **suma todas las salidas** de `SALIDAS.xlsx` para cada código de producto
- **Calcula el stock actual** = Ingresos - Salidas
- Permite **consultar rápidamente** cuánto hay disponible sin tener que revisar las hojas de detalle

### Columnas principales y su significado:

| Columna | Nombre | Qué registra |
|---------|--------|--------------|
| A | ITEM | Número correlativo del producto en el resumen |
| B | CODIGO | Código único del producto (clave de búsqueda) |
| C | ESPECIE | Tipo de pescado |
| D | PRODUCTO | Descripción detallada del producto |
| E | CALIDAD | Clasificación de calidad |
| F | ESTADO | Estado del producto (IQF, IVP, etc.) |
| G | TALLA | Tamaño del producto |
| H | EMPAQUE | Tipo de empaque |
| I | INGRESOS | SUMA total de libras que han entrado (fórmula automática) |
| J | SALIDAS | SUMA total de libras que han salido (fórmula automática) |
| K | STOCK | **INGRESOS - SALIDAS** (stock actual disponible) |
| L | LB | Unidad de medida (siempre "LB") |
| M | Observacion organoleptica Actual | Notas sobre color, olor, textura (control de calidad) |

### Ejemplo de un registro típico:

```
CODIGO: 010102011303
ESPECIE: ATUN
PRODUCTO: ENTERO SIN VISCERAS, SIN AGALLAS
STOCK: 84.4 LB (cálculo automático)
```

### Fórmulas clave que usa:

```excel
INGRESOS = SUMIFS([1]INGRESOS!$N$2:$N$10022, [1]INGRESOS!$D$2:$D$10022, $B6)
SALIDAS  = SUMIFS([2]SALIDAS!$N$2:$N$10069, [2]SALIDAS!$D$2:$D$10069, $B6)
STOCK    = INGRESOS - SALIDAS
```

> **Conclusión:** `RESUMEN.xlsx` es el **tablero de control** que muestra el inventario actual.

---

## 🔗 CÓMO FUNCIONAN EN CONJUNTO

### Analogía simple:

Imagina un almacén físico:

| Hoja | Rol | Analogía |
|------|-----|----------|
| `INGRESOS.xlsx` | Entradas | 📥 El mazo de cartas que llegan a la mesa |
| `SALIDAS.xlsx` | Salidas | 📤 Las cartas que se retiran de la mesa |
| `RESUMEN.xlsx` | Stock actual | 📊 Las cartas que quedan en la mesa **AHORA** |

### Flujo de trabajo típico:

```
1. PRODUCCIÓN o COMPRA
   ↓
2. Se registra en INGRESOS.xlsx (entra al inventario)
   ↓
3. VENTA o USO INTERNO
   ↓
4. Se registra en SALIDAS.xlsx (sale del inventario)
   ↓
5. RESUMEN.xlsx actualiza automáticamente el stock
   ↓
6. Se consulta RESUMEN para saber disponibilidad
```

### Ejemplo práctico con un producto específico:

| Paso | Hoja | Acción | Libras |
|------|------|--------|--------|
| 1 | INGRESOS | Entraron 100 lb de Atún (producción del día) | +100 |
| 2 | SALIDAS | Se vendieron 30 lb a supermercado | -30 |
| 3 | SALIDAS | Se enviaron 10 lb a cocina para pruebas | -10 |
| 4 | RESUMEN | Stock disponible para nuevas ventas | **= 60 lb** |

---

## ✅ RESUMEN FINAL (TABLA COMPARATIVA)

| Pregunta | INGRESOS.xlsx | SALIDAS.xlsx | RESUMEN.xlsx |
|----------|---------------|--------------|--------------|
| **¿Qué registra?** | Todo lo que **ENTRA** | Todo lo que **SALE** | **STOCK** actual |
| **¿Cuándo se usa?** | Cuando llega producto nuevo | Cuando sale producto | Cuando se necesita saber disponibilidad |
| **¿Qué calcula?** | Suma de entradas por producto | Suma de salidas por producto | Entradas - Salidas |
| **¿Es histórico o actual?** | 📜 Histórico | 📜 Histórico | 📊 Actual (en tiempo real) |
| **¿Se modifica manualmente?** | ✅ Sí (cada entrada) | ✅ Sí (cada salida) | ❌ No (se calcula automáticamente) |

---

## 🎯 CONCLUSIÓN

En conjunto, estas tres hojas forman un **sistema completo de control de inventario** que permite:

- ✅ Saber qué ha entrado y cuándo
- ✅ Saber qué ha salido, a dónde y bajo qué documento
- ✅ Saber cuánto tienes disponible **AHORA** de cada producto
- ✅ Mantener trazabilidad total de cada lote
- ✅ Tomar decisiones de compra, producción y venta con información precisa

```
INGRESOS → SALIDAS → RESUMEN = El ciclo completo de vida del inventario.
```

la seccion ""

Carpeta con tres archivos que es mi sistema de inventario, archivo ingresos, archivos salidas, estos dos archivos vinculados con Resumen. En el resumen hay una columna de código esa es la columna que la hoja Resumen usa para buscar y sumar en las dos hojas salidas y entrada y después en resumen con una operación de restar las salidas me da el inventario.  Esto quiero mejorarlo que sea posible ver el inventario de que cajas componen el inventario actual, además de solo saber que cantidad tengo. Como veras toda caja empacada tiene un numero único irrepetible y las salidas las hago por cajas igual, tengo la base para saber que cajas componen mi inventario actual, pero con mis limitaciones de conocimiento no he logrado hacerlo, además quiero agregarle otras cosas que después podemos hablarlo.

Los otros archivos son uno es o son todas la planillas de producción donde en sitio o terreno capturo la información en forma escrita, tanto la estadística de proceso como la de costos involucrados que esta al pie de la hoja, todo esto me gustaría capturarla en forma digital de ser $ posible. 

Después esta información una a una digito la información en el otro archivo donde genero el informe de producción de cada lote que incluye mano de obra, materia prima, insumos etc., la ultima hoja resume todos.

Que me gustaría?, capturar la información directamente donde se genera, se valla generando un base de datos de donde pueda extraer el informe de producción con costos y el inventario.

Toda la información que contienen las planillas o registros quiero mantenerlas por trazabilidad y poder si quiero buscar un numero de caja especifica me de toda la información de esa caja, proveedor, lote, fechas de elaboración etc., esto lo estoy haciendo hoy con filtros etc., pero quiero no estar digitando repetitivamente la información
en lo posible.

Espero te sirva la información y si puedes cuando la veas pm, hacemos una video llamada y hablamos mas sobre ello
