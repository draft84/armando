# 📘 GUÍA DE USO - SALIDAS

## ¿Qué es la sección Salidas?

Salidas es el **libro de salidas** del sistema. Aquí se registra **todo el producto que se retira del inventario**, ya sea por venta a clientes, uso interno, muestras, desperdicio o traslados.

Cada registro de salida documenta qué producto salió, cuánto, cuándo, a quién y bajo qué documento.

---

## Flujo de Trabajo

### 1. Crear una Salida Manualmente

1. Ve a **Salidas** en el menú lateral.
2. Haz clic en **"Nueva Salida"**.
3. Se abre un formulario con 6 secciones:
   - **Información Básica**: Items, Fecha, Lote, Código
   - **Producto**: Especie, Producto, Calidad, Talla
   - **Cantidades y Pesos**: Caja, UDS, Libras, Promedio (auto)
   - **Fechas**: Fecha Elaboración, Fecha Vencimiento
   - **Almacenamiento**: Quees, Empaque, Cuarto, Posición, Tarima
   - **Cliente y Documento**: Cliente, N° Doc
4. Los campos marcados con **\*** son obligatorios.
5. **CAJA2** y **PROMEDIO** se calculan automáticamente.
6. Haz clic en **"Guardar Salida"**.

### 2. Importar desde Excel

1. Haz clic en el botón **"Importar"** en la barra de herramientas.
2. Selecciona tu archivo `.xlsx` o `.xls`.
3. El sistema lee el archivo optimizado para evitar problemas de memoria.
4. Se valida cada fila y se muestra un reporte.

**Estructura esperada del Excel:**

| Columna | Campo | Requerido |
|---------|-------|-----------|
| A | ITEMS | No |
| B | FECHA | ✅ |
| C | LOTE | ✅ |
| D | CODIGO | ✅ |
| E | CAJA | ✅ |
| F | ESPECIE | No |
| G | PRODUCTO | No |
| H | CALIDAD | No |
| I | FECHA ELAB | ✅ |
| J | FECHAVENCI | ✅ |
| K | CAJA2 | Auto |
| L | TALLA | No |
| M | UDS | No |
| N | LIBRAS | No |
| O | PROMEDIO | Auto |
| P | QUEES | No |
| Q | EMPAQUE | No |
| R | CUARTO | No |
| S | POSICION | No |
| T | TARIMA | No |
| U | CLIENTE | No |
| V | N°DOC | No |

### 3. Editar una Salida

- Haz clic en ✏️ **Editar** en la fila correspondiente.
- Modifica los campos necesarios.
- Haz clic en **"Actualizar Salida"**.

### 4. Eliminar una Salida

- Haz clic en 🗑️ **Eliminar** en la fila correspondiente.
- Confirma la eliminación.
- **Las cajas afectadas vuelven a EN_STOCK** automáticamente.

---

## Fórmulas Automáticas

| Campo | Fórmula | Descripción |
|-------|---------|-------------|
| **CAJA2** | `= CAJA` | Réplica del número de caja |
| **PROMEDIO** | `= LIBRAS / UDS` | Peso promedio por unidad |
| **CUARTO** | `= LEN(CALIDAD)` | Se calcula si no se proporciona |

---

## Impacto en el Resto del Sistema

Cuando creas, editas o eliminas una Salida, ocurre lo siguiente **automáticamente**:

### Al CREAR una Salida:
1. **Se marcan cajas como VENDIDAS** → El sistema busca las cajas `EN_STOCK` del mismo código de producto, ordenadas por fecha de elaboración más antigua (FIFO), y las marca como `VENDIDA`.
2. **Se vinculan con el cliente** → Cada caja vendida registra el cliente y N° documento.
3. **Se recalcula el Resumen** → `SALIDAS = suma total de libras salidas` para ese código.
4. **El stock disminuye** → `STOCK = INGRESOS - SALIDAS`.

### Al ELIMINAR una Salida:
1. **Las cajas vuelven a EN_STOCK** → Se restauran las cajas que fueron marcadas como vendidas.
2. **El Resumen se recalcula** → Las salidas disminuyen, el stock aumenta.

### FIFO (First In, First Out):
El sistema usa el criterio **FIFO** para seleccionar qué cajas vender: las que entraron primero (fecha de elaboración más antigua) son las primeras en marcarse como vendidas. Esto es importante para la trazabilidad y control de vencimientos.

---

## Búsqueda y Filtrado

- **Buscador en tiempo real**: Busca por lote, código, especie, producto, calidad, talla, **cliente** o **N° documento**.
- **Paginación**: 5, 10, 25, 50, 100 registros por página.
- **Ordenamiento**: Clic en encabezados para ordenar.

---

## Ejemplo Práctico

```
SALIDA:
  LOTE: 61/25
  CODIGO: 081402070201
  ESPECIE: MAHI MAHI
  CLIENTE: TROPIMAR
  N°DOC: 327
  CAJA: 3855
  LIBRAS: 40.30
  UDS: 15

RESULTADO:
  → Se buscan 3,855 cajas EN_STOCK del código 081402070201 (FIFO)
  → Se marcan como VENDIDA con cliente "TROPIMAR" y doc "327"
  → El Resumen actualiza: SALIDAS de código 081402070201 += 40.30 LB
  → El stock disponible disminuye 40.30 LB
```

---

## Tipos de Salida (QUEES)

| Valor | Significado |
|-------|-------------|
| VENTA | Venta a cliente |
| MUESTRAS | Muestras para clientes |
| CORTE 1 X 2 | Corte para procesamiento |
| PORCIONADO | Producto porcionado |
| INVFISICO | Inventario físico (ajuste) |
| INVQUIMICO | Inventario químico |

---

## Comandos Útiles

```bash
# Reconstruir todo el inventario de cajas
docker-compose exec app php artisan inventario:sync
```

---

## Preguntas Frecuentes

**¿Qué pasa si no hay suficientes cajas en stock?**
Se marcan todas las disponibles. El sistema no impide la salida, pero el stock mostrará negativo.

**¿Puedo saber a qué cliente se vendió una caja específica?**
Sí. Ve a **Buscar Caja** (`/buscar-caja`) e ingresa el número de caja.

**¿Las salidas afectan el Resumen inmediatamente?**
Sí. Cada vez que creas, editas o eliminas una salida, el Resumen se recalcula automáticamente.
