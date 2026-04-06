# 📘 GUÍA DE USO - INGRESOS

## ¿Qué es la sección Ingresos?

Ingresos es el **libro de entradas** del sistema. Aquí se registra **todo el producto que llega al inventario**, ya sea por producción propia, compras a proveedores o traslados internos.

Cada registro de ingreso representa un lote de producto que entra al almacén con toda su información: especie, calidad, peso, fechas de elaboración y vencimiento, ubicación de almacenamiento, etc.

---

## Flujo de Trabajo

### 1. Crear un Ingreso Manualmente

1. Ve a **Ingresos** en el menú lateral.
2. Haz clic en **"Nuevo Ingreso"**.
3. Se abre un formulario con 5 secciones:
   - **Información Básica**: Items, Fecha Embarque, Lote, Código
   - **Producto**: Especie, Producto, Calidad, Talla
   - **Cantidades y Pesos**: Caja, UDS, Libras, Promedio (auto)
   - **Fechas**: Fecha Elaboración, Fecha Vencimiento
   - **Almacenamiento**: Quees, Empaque, Cuarto, Posición, Tarima
4. Los campos marcados con **\*** son obligatorios.
5. **CAJA2** y **PROMEDIO** se calculan automáticamente:
   - `CAJA2 = CAJA`
   - `PROMEDIO = LIBRAS / UDS`
6. Haz clic en **"Guardar Ingreso"**.

### 2. Importar desde Excel

1. Haz clic en el botón **"Importar"** en la barra de herramientas.
2. Selecciona tu archivo `.xlsx` o `.xls`.
3. El sistema lee automáticamente las columnas del archivo.
4. Se muestra un reporte de resultados:
   - ✅ Registros importados exitosamente
   - ⚠️ Errores por fila (si los hay)
5. El archivo se procesa fila por fila, validando campos requeridos.

**Estructura esperada del Excel:**

| Columna | Campo | Requerido |
|---------|-------|-----------|
| A | ITEMS | No |
| B | FECHAEMP | ✅ |
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

### 3. Editar un Ingreso

- Haz clic en el ícono ✏️ **Editar** en la fila correspondiente.
- Modifica los campos necesarios.
- Haz clic en **"Actualizar Ingreso"**.

### 4. Eliminar un Ingreso

- Haz clic en el ícono 🗑️ **Eliminar** en la fila correspondiente.
- Confirma la eliminación en el modal.
- El registro se elimina permanentemente.

---

## Fórmulas Automáticas

| Campo | Fórmula | Descripción |
|-------|---------|-------------|
| **CAJA2** | `= CAJA` | Réplica del número de caja |
| **PROMEDIO** | `= LIBRAS / UDS` | Peso promedio por unidad |

Estas fórmulas se ejecutan automáticamente al guardar, no necesitas calcularlas manualmente.

---

## Impacto en el Resto del Sistema

Cuando creas, editas o eliminas un Ingreso, ocurre lo siguiente **automáticamente**:

1. **Se generan cajas individuales** → Cada caja del ingreso se registra en la tabla `cajas_inventario` con estado `EN_STOCK`. Si el ingreso tiene `CAJA = 100`, se crean 100 registros de cajas.

2. **Se recalcula el Resumen** → El sistema suma todas las libras de este código de producto y actualiza la hoja Resumen (`INGRESOS = suma total de libras`).

3. **El stock se actualiza** → Como `STOCK = INGRESOS - SALIDAS`, al aumentar los ingresos, el stock disponible aumenta automáticamente.

---

## Búsqueda y Filtrado

- **Buscador en tiempo real**: Escribe por lote, código, especie, producto, calidad o talla.
- **Paginación**: Selecciona cuántos registros mostrar por página (5, 10, 25, 50, 100).
- **Ordenamiento**: Haz clic en los encabezados de columna para ordenar ascendente/descendente.

---

## Ejemplo Práctico

```
INGRESO:
  LOTE: 64/25
  CODIGO: 010903060401
  ESPECIE: ATUN
  PRODUCTO: LOMO SIN PIEL, CON CO
  CAJA: 500
  LIBRAS: 47,000
  UDS: 7,000
  CALIDAD: A
  TALLA: 58

RESULTADO:
  → Se crean 500 registros de cajas (EN_STOCK)
  → Cada caja tiene ~94 libras (47,000 / 500)
  → PROMEDIO = 6.71 (47,000 / 7,000)
  → El Resumen actualiza: INGRESOS de código 010903060401 += 47,000 LB
```

---

## Comandos Útiles

```bash
# Sincronizar manualmente el inventario de cajas desde todos los ingresos
docker-compose exec app php artisan inventario:sync
```

---

## Preguntas Frecuentes

**¿Puedo importar el mismo archivo dos veces?**
Sí, pero se duplicarán los registros. Verifica antes de importar.

**¿Qué pasa si importo un ingreso con un código que ya existe?**
Se agrega como un nuevo registro. El Resumen suma las libras de ambos.

**¿Las fórmulas se recalculan solas?**
Sí. CAJA2 y PROMEDIO se calculan automáticamente al guardar.
