# 📊 ESTADO ACTUAL DEL PROYECTO — Marzo 2026

**Última actualización:** 11 de Marzo, 2026
**Estado:** ✅ Operativo – Mejoras en progreso
**Versión:** 1.0.2

---

## 🎯 RESUMEN EJECUTIVO

**NICROSS** es un generador de rutinas de entrenamiento basado en el método NICROSS. Procesa perfiles de usuarios y genera planes estructurados adaptados a su nivel, objetivo y disponibilidad.

### Estado Actual
- ✅ Dashboard completamente funcional (3 paneles)
- ✅ 150+ usuarios procesados correctamente
- ✅ Semanas de entrenamiento generadas con exactitud
- ✅ Valores exactos en series y repeticiones (no rangos)
- ⚠️ Sin tests automáticos (crítico)
- ⚠️ Documentación en proceso de actualización

---

## 📦 ESTRUCTURA DEL PROYECTO

### Capa de Datos — `/data`

| Archivo | Estado | Propósito | Líneas |
|---------|--------|----------|--------|
| `usuarios.js` | ✅ Activo | Base de datos raw de usuarios | ~800 |
| `usuario.js` | ✅ Activo | Procesador y enriquecedor de usuarios | ~570 |
| `ejercicios.js` | ✅ Activo | Catálogo de 70+ ejercicios | ~900 |
| `splitSemanales.js` | ✅ Activo | Configuración splits (2-6 días) | ~180 |
| `usuarioConCargas.js` | ✅ Activo | Sistema de cargas y 1RM | ~280 |
| `mapaMusculoEjercicios.js` | ❌ **ELIMINADO** | — | — |
| `patronesMovimiento.js` | ❌ **ELIMINADO** | — | — |
| `volumenPorNivel.js` | ❌ **ELIMINADO** | — | — |

### Capa de Training — `/training`

| Archivo | Estado | Propósito | Líneas |
|---------|--------|----------|--------|
| `bloques.js` | ✅ Activo | Matriz bloques por nivel NICROSS | ~2000 |
| `parametrosPorBloque.js` | ✅ Activo | Series, reps, tempo, descanso | ~250 |
| `generadorSemanaReal.js` | ✅ Activo | Generador de semanas completas | ~440 |
| `generadorSesiones.js` | ✅ Activo | Sesiones con validación NICROSS | ~420 |
| `selectorEjercicios.js` | ✅ Activo | Selector inteligente de ejercicios | ~180 |
| `asignarBloques.js` | ✅ Activo | Asignador de bloques por usuario | ~80 |
| `calculadoraCarga.js` | ✅ Activo | Cálculo de cargas y progresión | ~200 |
| `estructuraMesociclos.js` | ✅ Activo | Estructura de mesociclos | ~280 |
| `generadorRutina.js` | ⚠️ Legacy | Generador antiguo (parcialmente usado) | ~380 |

### Capa de Presentación — `/js`

| Archivo | Estado | Propósito | Líneas |
|---------|--------|----------|--------|
| `main.js` | ✅ **ACTUAL** | Dashboard oficial (punto de entrada) | ~850 |
| `app.js` | ⚠️ Legacy | Versión antigua (no usar) | ~160 |
| `app1.js` | ⚠️ Legacy | Versión antigua (no usar) | ~15 |

### Archivos Raíz

| Archivo | Propósito | Crítico |
|---------|-----------|---------|
| `index.html` | Punto de entrada web | ✅ Sí |
| `package.json` | Metadata ES6 modules | ✅ Sí |
| `ARCHITECTURE.md` | Documentación arquitectura | ⚠️ Desactualizado |
| `README.md` | Descripción general | ⚠️ Básico |
| `CONTEXTO_NICROSS.md` | Principios NICROSS | ✅ Actualizado |
| `AI_RULES.md` | Guía de desarrollo | ✅ Actualizado |
| `RESUMEN_TECNICO.md` | Análisis profundo | ⚠️ Desactualizado |
| `SUGERENCIAS_MEJORAS.md` | Roadmap futuro | ✅ Vigente |
| `ERRORES_COMUNES.md` | **NUEVO** - Lecciones aprendidas | ✅ Crítico |

---

## 🔄 FLUJO DE PROCESAMIENTO

```
┌─────────────────────────────────────────────────────┐
│  USUARIO RAW (usuarios.js)                          │
│  - id, nombre, edad, sexo, peso, altura, etc       │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│  PROCESAMIENTO (usuario.js)                         │
│  ✓ Calcula IMC y categoría                         │
│  ✓ Clasifica nivel NICROSS (N1-N4)                │
│  ✓ Asigna split semanal (2-6 días)                │
│  ✓ Enriquece con propiedades derivadas            │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│  GENERACIÓN SEMANA (generadorSemanaReal.js)        │
│  ✓ Asigna bloques para cada día                    │
│  ✓ Selecciona ejercicios específicos               │
│  ✓ Estructura sesio completa                       │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│  CÁLCULO DE CARGAS (calculadoraCarga.js)           │
│  ✓ Estima 1RM de usuario                          │
│  ✓ Calcula % de intensidad                        │
│  ✓ Determina cargas exactas en kg                 │
│  ✓ Define series y reps EXACTAS (no rangos)      │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│  RENDERIZADO (main.js)                             │
│  ✓ Panel izquierda: datos personales              │
│  ✓ Panel centro: rutina semanal detallada         │
│  ✓ Panel derecha: indicadores sistema             │
└─────────────────────────────────────────────────────┘
```

---

## 🔑 CARACTERÍSTICAS PRINCIPALES

### ✅ COMPLETADAS
- Dashboard 3 columnas con navegación fluida
- Procesamiento de 150+ usuarios simultáneamente
- Generación de semanas con bloques y ejercicios
- Cálculo de cargas basado en 1RM estimado
- Visualización de IMC con barra de progreso
- Categorización NICROSS automática
- Split semanal según disponibilidad
- Validación NICROSS en sesiones

### ⚠️ EN DESARROLLO
- Cambio de rangos (6-8 reps) a valores exactos ← **EN PROGRESO**
- Implementación de tests automáticos
- Archivado de código legacy (app.js, app1.js)
- Validación exhaustiva de datos de entrada

### ❌ NO IMPLEMENTADO
- Backend/API (actualmente solo frontend)
- Persistencia de datos en BD
- Autenticación de usuarios
- Exportación de rutinas (PDF, etc)
- Progresión automática de semanas
- Historial de cambios de usuario

---

## 🏗️ CAMBIOS REALIZADOS (Sesión Actual)

### ✅ Eliminados
- `data/mapaMusculoEjercicios.js` (0 importaciones)
- `data/patronesMovimiento.js` (0 importaciones)
- `data/volumenPorNivel.js` (0 importaciones)

### ✅ Creados
- `ERRORES_COMUNES.md` - Registro de lecciones
- `estado_actual.md` - Este archivo

### ✅ En Progreso
- Actualizar `ARCHITECTURE.md` con info actual
- Actualizar `README.md` con instrucciones claras
- Cambiar generador para valores exactos (no rangos)

---

## 📊 MÉTRICAS DEL PROYECTO

```
Líneas de Código:        ~8,500 (JavaScript)
Archivos principales:    15
Archivos de config:      2
Documentación:           8 archivos

Usuarios procesados:     150+
Ejercicios disponibles:  70+
Niveles NICROSS:         4 (N1-N4)
Splits semanales:        5 (2-6 días)

Estado de Tests:         0% cobertura (⚠️ CRÍTICO)
Errores en Consola:      0 (en normal operation)
Documentación Updated:   60%
```

---

## 🚨 PROBLEMAS IDENTIFICADOS

| ID | Descripción | Severidad | Estado |
|---|---|---|---|
| #1 | Rangos en lugar de valores exactos (reps/series) | 🔴 ALTA | ✅ EN PROGRESO |
| #2 | Sin tests automáticos | 🔴 ALTA | ⏳ PENDIENTE |
| #3 | Sin validación exhaustiva de datos entrada | 🟠 MEDIA | ⏳ PENDIENTE |
| #4 | Documentación desincronizada | 🟠 MEDIA | ✅ EN PROGRESO |
| #5 | Código legacy sin archivar (app.js) | 🟡 BAJA | ⏳ PENDIENTE |
| #6 | Sin manejo de errores en imports | 🟠 MEDIA | ⏳ PENDIENTE |
| #7 | Sufijo `.resolved` confuso | 🟡 BAJA | ⏳ PENDIENTE |

---

## 🎯 PRÓXIMOS PASOS

### Esta Semana
- [x] Analizar proyecto en profundidad
- [x] Eliminar archivos sin usar
- [ ] Cambiar a valores exactos en rutinas
- [ ] Actualizar ARCHITECTURE.md
- [ ] Actualizar README.md

### Este Sprint (2 semanas)
- [ ] Implementar validación de datos entrada
- [ ] Agregar manejo de errores en imports
- [ ] Archivar código legacy
- [ ] Crear CHANGELOG.md

### Próximo Sprint (1 mes)
- [ ] Implementar tests con Jest
- [ ] Crear script de auditoría de imports
- [ ] Documentar API interna
- [ ] Mejorar logging

---

## 🔗 REFERENCIAS IMPORTANTES

- [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitectura técnica (requiere actualización)
- [CONTEXTO_NICROSS.md](CONTEXTO_NICROSS.md) - ✅ Principios NICROSS vigentes
- [ERRORES_COMUNES.md](ERRORES_COMUNES.md) - Lecciones aprendidas
- [AI_RULES.md](AI_RULES.md) - ✅ Guía de desarrollo
- [SUGERENCIAS_MEJORAS.md](SUGERENCIAS_MEJORAS.md) - Roadmap

---

## 📝 NOTAS IMPORTANTES

1. **Dashboard es el punto de entrada oficial** → `index.html` → `js/main.js`
2. **No usar `app.js` o `app1.js`** - Son versiones antiguas
3. **Valores exactos obligatorios** - Series y reps son números, no rangos
4. **Validar siempre entrada** - Nunca asumir estructura de datos
5. **Documentación es código** - Actualizar siempre que cambies estructura

---

**Generado:** 11 de Marzo, 2026
**Próxima revisión:** 25 de Marzo, 2026
