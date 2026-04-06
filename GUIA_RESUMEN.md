# 📘 GUÍA DE USO - RESUMEN

## ¿Qué es la sección Resumen?

Resumen es el **tablero de control** del inventario. Muestra de forma **consolidada y automática** el **stock disponible hoy** de cada producto.

No se edita manualmente para calcular stock — el sistema lo hace automáticamente usando las fórmulas:

```
INGRESOS = SUMA de todas las libras que han entrado (por código)
SALIDAS  = SUMA de todas las libras que han salido (por código)
STOCK    = INGRESOS - SALIDAS
```

---

## Flujo de Trabajo

### 1. Cómo se Genera el Resumen

El Resumen se genera y actualiza **automáticamente** cada vez que:

| Acción | Qué sucede |
|--------|------------|
| Creas un Ingreso | Se suma `LIBRAS` al total de INGRESOS del código correspondiente |
| Eliminas un Ingreso | Se restan las `LIBRAS` del total de INGRESOS |
| Creas una Salida | Se suma `LIBRAS` al total de SALIDAS del código correspondiente |
| Eliminas una Salida | Se restan las `LIBRAS` del total de SALIDAS |
| Importas Excel en Ingresos | Se recalcula todo después de la importación |
| Importas Excel en Salidas | Se recalcula todo después de la importación |

**No necesitas hacer nada manualmente.** El sistema escucha los cambios y actualiza.

### 2. Crear un Registro Manualmente

Aunque el Resumen se genera automáticamente, puedes crear registros manuales:

1. Ve a **Resumen** en el menú lateral.
2. Haz clic en **"Nuevo Registro"**.
3. Completa los campos:
   - **Identificación**: Item, Código, Especie, Producto
   - **Características**: Calidad, Estado, Talla, Empaque
   - **Stock**: Ingresos, Salidas (el STOCK se calcula solo)
   - **Observaciones**: Notas organolépticas
4. Haz clic en **"Guardar Resumen"**.

### 3. Importar desde Excel

1. Haz clic en **"Importar"**.
2. Selecciona el archivo `.xlsx`.
3. El sistema detecta automáticamente los encabezados.
4. Si un código ya existe, **actualiza** el registro (upsert).
5. Si no existe, **crea** uno nuevo.

**Estructura esperada del Excel:**

| Columna | Campo | Notas |
|---------|-------|-------|
| A | ITEM | Correlativo |
| B | CODIGO | **Clave única** |
| C | ESPECIE | Tipo de pescado |
| D | PRODUCTO | Descripción |
| E | CALIDAD | Clasificación |
| F | ESTADO | IQF, IVP, BLOQUE |
| G | TALLA | Tamaño |
| H | EMPAQUE | Tipo |
| I | INGRESOS | Total libras entrantes |
| J | SALIDAS | Total libras salientes |
| K | STOCK | `= INGRESOS - SALIDAS` (auto) |
| L | LB | Unidad (siempre "LB") |
| M | OBSERVACION | Notas de calidad |

---

## Fórmulas Automáticas

| Campo | Fórmula | Descripción |
|-------|---------|-------------|
| **STOCK** | `= INGRESOS - SALIDAS` | Stock disponible actual |

El stock se recalcula automáticamente cada vez que cambian los ingresos o salidas.

---

## Cómo Funciona la Sincronización Automática

El sistema usa un mecanismo de **eventos** en los modelos:

```
┌─────────────────────────────────────────────────┐
│                 EVENTO TRIGGER                  │
├─────────────────────────────────────────────────┤
│  Ingreso::saved()  →  Resumen::syncFromIngreso()│
│  Ingreso::deleted() → Resumen::syncFromIngreso()│
│  Salida::saved()   →  Resumen::syncFromSalida() │
│  Salida::deleted() →  Resumen::syncFromSalida() │
└─────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────┐
│              RESUMEN ACTUALIZADO                │
├─────────────────────────────────────────────────┤
│  INGRESOS = SUM(libras) WHERE codigo = X        │
│  SALIDAS  = SUM(libras) WHERE codigo = X        │
│  STOCK    = INGRESOS - SALIDAS (auto)           │
└─────────────────────────────────────────────────┘
```

### Métodos Internos

| Método | Qué hace |
|--------|----------|
| `Resumen::syncFromIngreso($ingreso)` | Recalcula el resumen para el código del ingreso afectado |
| `Resumen::syncFromSalida($salida)` | Recalcula el resumen para el código de la salida afectada |
| `Resumen::syncAll()` | Recalcula TODOS los códigos desde cero |

---

## Comando de Sincronización

Si en algún momento los datos no coinciden, puedes forzar una sincronización completa:

```bash
docker-compose exec app php artisan inventario:sync
```

Este comando:
1. Elimina todos los registros de `cajas_inventario`
2. Vuelve a crear todas las cajas desde los Ingresos
3. Marca las cajas vendidas desde las Salidas
4. El Resumen se actualiza automáticamente por los eventos

---

## Búsqueda y Filtrado

- **Buscador**: Filtra por código, especie, producto, calidad o talla.
- **Paginación**: 5, 10, 25, 50, 100 registros.
- **Ordenamiento**: Por defecto ordenado por código ascendente.

---

## Ejemplo Práctico

```
CÓDIGO: 010102011303
ESPECIE: ATUN
PRODUCTO: ENTERO SIN VISCERAS, SIN AGALLAS

INGRESOS HISTÓRICOS:
  → Ingreso #1: 500 LB (2025-01-15)
  → Ingreso #2: 300 LB (2025-02-20)
  → Ingreso #3: 200 LB (2025-03-10)
  TOTAL INGRESOS: 1,000 LB

SALIDAS HISTÓRICAS:
  → Salida #1: 150 LB → Cliente A (2025-02-01)
  → Salida #2: 100 LB → Cliente B (2025-03-15)
  TOTAL SALIDAS: 250 LB

RESUMEN:
  INGRESOS: 1,000 LB
  SALIDAS:  250 LB
  STOCK:    750 LB ← Se calcula automáticamente
```

---

## Estados del Producto

| Estado | Significado |
|--------|-------------|
| IQF | Individual Quick Frozen (congelado individual) |
| IVP | Individually Vacuum Packed (empacado al vacío) |
| BLOQUE | Congelado en bloque |

---

## Preguntas Frecuentes

**¿Puedo editar el STOCK manualmente?**
No. El STOCK se calcula automáticamente como `INGRESOS - SALIDAS`. Si cambias Ingresos o Salidas manualmente, el stock se recalcula.

**¿Qué pasa si borro un Ingreso?**
El stock se recalcula automáticamente restando las libras de ese ingreso.

**¿El Resumen puede quedar desactualizado?**
Solo si hay un error del sistema. Si notas inconsistencias, ejecuta `php artisan inventario:sync`.

**¿Puedo ver qué cajas componen el stock de un producto?**
Sí. Ve a **Inventario de Cajas** (`/inventario-cajas`) y filtra por especie o código.
