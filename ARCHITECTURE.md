# 🏗️ ARCHITECTURE.md — Arquitectura NICROSS

**Última actualización:** Marzo 2026
**Versión:** 1.0.2

---

## 📋 TABLA DE CONTENIDOS

1. [Visión General](#visión-general)
2. [Capas de Arquitectura](#capas-de-arquitectura)
3. [Pipeline de Procesamiento](#pipeline-de-procesamiento)
4. [Módulos Principales](#módulos-principales)
5. [Flujos de Datos](#flujos-de-datos)
6. [Principios de Diseño](#principios-de-diseño)

---

## 🎯 VISIÓN GENERAL

**NICROSS** es un generador de rutinas de entrenamiento con arquitectura **modular funcional** basada en ES6+ JavaScript. El sistema transforma datos de usuario en planes de entrenamiento estructurados y personalizados.

```
Usuario Base  →  Procesamiento  →  Rutina Exacta
   (Raw)         (Enriquecimiento)   (Ejecutable)
```

---

## 🏭 CAPAS DE ARQUITECTURA

### Layer 1: Datos (`/data`)
**Responsabilidad:** Proveer datos procesados y enriquecidos.

| Módulo | Propósito | Entrada | Salida |
|--------|-----------|---------|--------|
| `usuarios.js` | BD raw de usuarios | — | `users[]` |
| `usuario.js` | Procesador principal | `users[]` | `usuario[]` (enriquecido) |
| `ejercicios.js` | Catálogo de ejercicios | — | `ejercicios[]` |
| `splitSemanales.js` | Configuración splits | — | `splitsSemanales{}` |
| `usuarioConCargas.js` | Sistema de cargas | usuario | usuario + cargas |

### Layer 2: Training (`/training`)
**Responsabilidad:** Generar rutinas y calcular parámetros.

| Módulo | Propósito | Entrada | Salida |
|--------|-----------|---------|--------|
| `bloques.js` | Matriz bloques/nivel | — | `bloques{}` |
| `parametrosPorBloque.js` | Series, reps, tempo | bloque, nivel | parámetros exactos |
| `generadorSemanaReal.js` | Generador semanas | usuario, split | semana completa |
| `generadorSesiones.js` | Sesiones detalladas | usuario, bloques | ejercicios con cargas |
| `calculadoraCarga.js` | Cálculo de cargas | 1RM, % | carga exacta en kg |
| `selectorEjercicios.js` | Selector inteligente | nivel, patron | ejercicios filtrados |
| `asignarBloques.js` | Asignador bloques | usuario, split | bloques/día |
| `estructuraMesociclos.js` | Mesociclos | tipo, semanas | estructura mesociclo |

### Layer 3: Presentación (`/js`)
**Responsabilidad:** Renderizar UI y manejar interacción.

| Módulo | Estado | Propósito |
|--------|--------|----------|
| `main.js` | ✅ ACTUAL | Dashboard oficial (punto entrada) |
| `app.js` | ⚠️ LEGACY | Versión antigua (no usar) |
| `app1.js` | ⚠️ LEGACY | Versión antigua (no usar) |

---

## 🔄 PIPELINE DE PROCESAMIENTO

### Fase 1: Importación y Validación

```javascript
// data/usuario.js
const users = usuarios rojos sin procesar
  ↓
VALIDACIÓN: 
  - Verificar campos obligatorios
  - Defaults para valores faltantes
  - Whitelist valores válidos
  ↓
usuario[] = usuarios procesados
```

### Fase 2: Enriquecimiento

```javascript
usuario base
  ↓ calcularIMC()          → usuario.imc = { imc: 25.3, categoria: "sobrepeso" }
  ↓ clasificarNivelNicross() → usuario.nivel_nicross = "N3_intermedio"
  ↓ sugerirTipoEntrenamiento() → usuario.split_semanal = "push_pull_legs"
  ↓ enriquecerBloques()    → usuario.bloques_dia = [...]
  ↓
usuario enriquecido (propriedades derivadas)
```

### Fase 3: Generación de Semana

```javascript
usuario enriquecido + split semanal
  ↓ generarSemanaCompleta()
  ↓
POR CADA DÍA:
  - Asignar bloque (foco del día)
  - Seleccionar ejercicios del catálogo
  - Calcular series/reps EXACTAS
  - Determinar cargas en kg
  - Definir descansos y tempo
  ↓
semana_entrenamiento = [dia1, dia2, ..., dia5]
```

### Fase 4: Renderizado

```javascript
usuario enriquecido + semana_entrenamiento
  ↓ main.js → renderLeft()     → Panel izquierda (datos usuario)
  ↓ main.js → renderCenter()   → Panel centro (rutina semanal)
  ↓ main.js → renderRight()    → Panel derecha (sistema)
  ↓
Dashboard interactivo
```

---

## 📦 MÓDULOS PRINCIPALES

### `data/usuario.js`

**Punto de entrada de datos.**

```javascript
// Flujo
import { users } from "../usuarios.js"
import { splitsSemanales } from "../splitSemanales.js"
import { bloques } from "../training/bloques.js"

// Procesamiento
users.map(u => ({
  ...u,
  imc: calcularIMC(u),
  nivel_nicross: clasificarNivelNicross(u),
  split_semanal: sugerirTipoEntrenamiento(u),
  bloques_dia: bloques[u.nivel_nicross]
}))

// Exportación
export { usuario }
```

### `training/generadorSemanaReal.js`

**Generador de semanas completas.**

```javascript
export function generarSemanaCompleta(usuario, nivelNicross, splitSemanal, parametrosPorBloque)

// Retorna:
{
  resumen: { total_dias: 5, total_series: 95 },
  dias: [
    {
      foco: "empuje_horizontal",
      bloques: [
        {
          tipo: "fuerza",
          ejercicios: [
            {
              nombre: "Press Banca",
              patron: "empuje_horizontal",
              series: 4,           // EXACTO, no rango
              repeticiones_min: 5, // EXACTO
              repeticiones_max: 5, // EXACTO (igual que min)
              carga_kg: 100,
              descanso_seg: 180,
              tempo: { excentric: 2, pause: 1, concentric: 1 }
            }
          ]
        }
      ]
    },
    // ... 4 días más
  ]
}
```

### `training/calculadoraCarga.js`

**Cálculo de cargas exactas.**

```javascript
// Entradas
usuario.peso_kg = 85
usuario.nivel = "N3_intermedio"
patron = "empuje_horizontal"
1RM_estimado = 120 kg

// Proceso
porcentaje_intensidad = 85% (según bloque y nivel)
carga_exacta = 120 * 0.85 = 102 kg
redondeo = 100 kg (múltiplo de 2.5)

// Salida
{ carga_kg: 100, reps: 5, series: 4 }
```

---

## 📊 FLUJOS DE DATOS

### Flujo 1: Usuario → Dashboard

```
usuarios.js (BD)
    ↓
usuario.js (enriquecimiento)
    ↓
main.js (carga en memoria)
    ↓
renderLeft()   → Panel izquierda (datos personales)
renderCenter() → Panel centro (rutina semanal)
renderRight()  → Panel derecha (indicadores)
    ↓
Dashboard HTML
```

### Flujo 2: Bloque → Ejercicios

```
bloques.js (matriz N1-N4 × focos)
    ↓
bloques[N3_intermedio][empuje_horizontal] = ["Bloque_Fuerza", "Bloque_Hipertrofia"]
    ↓
selectorEjercicios.js (filtra por nivel)
    ↓
ejercicios[] seleccionados
    ↓
parametrosPorBloque.js (series, reps, tempo)
    ↓
valores exactos para sesión
```

### Flujo 3: 1RM → Cargas

```
usuario.cargas_maximas = { empuje_horizontal: 120 }
    ↓
calculadoraCarga.js (calcula %)
    ↓
carga_kg = 1RM × porcentaje
    ↓
Redondeo a múltiplo 2.5
    ↓
carga_exacta (ej: 100 kg, no rango)
```

---

## 🎨 PRINCIPIOS DE DISEÑO

### 1. **Separación de Responsabilidades**
Cada módulo tiene **un único propósito** claro.
- `/data` = datos
- `/training` = lógica
- `/js` = presentación

### 2. **Inmutabilidad de Datos**
Los datos originales NUNCA se modifican, se crean nuevos objetos.

```javascript
// ✅ CORRECTO
const usuario_enriquecido = {
  ...usuario,
  imc: { imc: 25.3, categoria: "sobrepeso" }
}

// ❌ INCORRECTO
usuario.imc = { ... }  // Modifica original
```

### 3. **Funciones Puras**
Funciones sin efectos secundarios.

```javascript
// ✅ PURA
function calcularIMC(peso_kg, altura_cm) {
  return peso_kg / ((altura_cm / 100) ** 2)
}

// ❌ IMPURA (efecto secundario)
function calcularIMC(usuario) {
  usuario.imc = ...  // Modifica entrada
}
```

### 4. **Composición Funcional**
Pipelines de funciones simples.

```javascript
usuario
  |> calcularIMC()
  |> clasificarNivelNicross()
  |> sugerirTipoEntrenamiento()
  |> enriquecerBloques()
```

### 5. **Valores Exactos, No Rangos**
Series y reps son números precisos.

```javascript
// ✅ EXACTO
{ series: 4, reps: 6, carga_kg: 100 }

// ❌ RANGO (ambiguo)
{ series: "3-4", reps: "6-8", carga_kg: "90-100" }
```

### 6. **Fallos Ruidosos**
Errores visibles, no silenciosos.

```javascript
// Validar siempre
if (!usuario.experiencia_anios) {
  console.error("⚠️ Usuario sin experiencia definida")
  usuario.experiencia_anios = 0 // default
}
```

---

## 🔗 DEPENDENCIAS ENTRE MÓDULOS

```
index.html
    ↓
js/main.js (punto entrada)
    ├── data/usuario.js
    │   ├── data/usuarios.js
    │   ├── data/splitSemanales.js
    │   └── training/bloques.js
    ├── data/splitSemanales.js
    ├── training/generadorSemanaReal.js
    │   ├── training/parametrosPorBloque.js
    │   ├── data/ejercicios.js
    │   └── training/bloques.js
    └── training/parametrosPorBloque.js
```

**Nota:** Los archivos `mapaMusculoEjercicios.js`, `patronesMovimiento.js` y `volumenPorNivel.js` han sido **eliminados** (no tenían dependencias).

---

## 📚 REFERENCIAS

- [estado_actual.md](estado_actual.md) - Estado del proyecto
- [CONTEXTO_NICROSS.md](CONTEXTO_NICROSS.md) - Principios NICROSS
- [ERRORES_COMUNES.md](ERRORES_COMUNES.md) - Lecciones aprendidas
- [AI_RULES.md](AI_RULES.md) - Guía de desarrollo
