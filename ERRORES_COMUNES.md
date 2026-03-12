# 🚨 REGISTRO DE ERRORES COMUNES — NICROSS

**Última actualización:** Marzo 2026
**Propósito:** Documento vivo para registrar errores, bugs y lecciones aprendidas para evitar repetirlos.

---

## ❌ ERRORES IDENTIFICADOS EN EL PROYECTO

### 1. Archivos en Desuso Sin Eliminar
**Problema:** 3 archivos definidos pero nunca importados
- `data/mapaMusculoEjercicios.js`
- `data/patronesMovimiento.js`
- `data/volumenPorNivel.js`

**Impacto:** Confusión, código muerto, falso sentido de completitud, mantenimiento innecesario

**Solución Aplicada:**
- ✅ Archivos eliminados del repositorio

**Lección:** Realizar auditoría de imports/exports cada mes. No dejar código muerto.

---

### 2. Documentación Desactualizada
**Problema:** Documentación lista archivos como "no usados" sin verificación automática

**Impacto:** Confusión sobre estado real del proyecto

**Solución Aplicada:**
- ✅ Ejecutar grep search para verificar imports
- ✅ Crear archivo estado_actual.md con estado verificado

**Lección:** La documentación debe validarse, no escribirse de memoria. Usar scripts de validación.

---

### 3. Nombres de Archivos Confusos
**Problema:** `analisis_proyecto.md.resolved` tiene sufijo extraño e indefinido

**Impacto:** Ambigüedad sobre si debe ignorarse o usarse

**Solución Propuesta:**
- ✅ Usar convención clara: `DEPRECATED_`, `ARCHIVE_`, o carpeta `/archived/`
- ❌ NUNCA usar sufijos ambiguos: `.resolved`, `.old`, `.bak`, `.tmp`

**Lección:** Nomenclatura consistente es crítica para mantenibilidad.

---

### 4. Múltiples Puntos de Entrada
**Problema:** `app.js`, `app1.js`, `main.js` — no está claro cuál es oficial

**Impacto:** Confusión al debuggear, diferentes comportamientos

**Solución Aplicada:**
- ✅ Documentar que `main.js` es el punto de entrada actual
- ⚠️ PENDIENTE: Archivar `app.js` y `app1.js` en `/legacy/`

**Lección:** Un solo punto de entrada por aplicación.

---

### 5. Rangos en Lugar de Valores Exactos
**Problema:** Rutinas muestran "6-8 reps" en lugar de valor exacto

**Impacto:** Usuario no sabe exactamente cuántas reps hacer, confusión en ejecución

**Solución Aplicada:**
- ✅ Cambiar generador para calcular valor exacto
- ✅ Series y reps ahora son números precisos, no rangos

**Lección:** Datos de usuario → decisiones exactas. No dejar ambigüedad en lo que se ejecuta.

---

### 6. Validación Inexistente en Pipeline
**Problema:** Usuario sin `experiencia_anios` causa errores silenciosos

**Impacto:** Dashboard renderiza pero cálculos fallan internamente

**Solución Propuesta:**
```javascript
// Validación obligatoria en data/usuario.js
const usuario_validado = {
  ...usuario,
  experiencia_anios: usuario.experiencia_anios ?? 0,
  dias_entrenamiento: Math.max(1, usuario.dias_entrenamiento ?? 2),
  peso_kg: usuario.peso_kg ?? 70,
  altura_cm: usuario.altura_cm ?? 170,
};
```

**Lección:** NUNCA asumir estructura de datos. Siempre validar entrada.

---

### 7. Sin Manejo de Errores en Imports
**Problema:** Si falla un import, dashboard colapsa silenciosamente

**Impacto:** Debug muy difícil, usuario no sabe qué falló

**Solución Propuesta:**
```javascript
// main.js - Rodear imports con try/catch
try {
  const { usuario } = await import('../data/usuario.js');
  // ...
} catch (error) {
  console.error('❌ Error al cargar usuarios:', error);
  document.querySelector('#panel-left').innerHTML = 
    '<p style="color:red">🚨 Error cargando datos</p>';
}
```

**Lección:** Frontend siempre necesita manejo de errores.

---

### 8. Sin Validación de Niveles NICROSS
**Problema:** Usuario con `nivel_nicross = "INVALIDO"` causa errores

**Impacto:** Generador falla sin mensaje claro

**Solución Propuesta:**
```javascript
const NIVELES_VALIDOS = ['N1_sedentario', 'N2_inicial_activo', 'N3_intermedio', 'N4_avanzado'];

if (!NIVELES_VALIDOS.includes(usuario.nivel_nicross)) {
  console.error(`Nivel inválido: ${usuario.nivel_nicross}`);
  usuario.nivel_nicross = 'N3_intermedio'; // fallback
}
```

**Lección:** Whitelist de valores válidos es obligatorio.

---

### 9. Sin Logging Estructurado
**Problema:** console.log dispersos sin contexto

**Impacto:** Difícil rastrear qué está pasando

**Solución Propuesta:**
```javascript
const LOG = {
  info: (msg, data) => console.log(`ℹ️ [INFO] ${msg}`, data),
  error: (msg, err) => console.error(`❌ [ERROR] ${msg}`, err),
  debug: (msg, data) => console.debug(`🔍 [DEBUG] ${msg}`, data),
  warn: (msg, data) => console.warn(`⚠️ [WARN] ${msg}`, data)
};
```

**Lección:** Logging estructurado = debug más rápido.

---

### 10. Sin Tests Automáticos
**Problema:** Cambios rompen cosas sin que se note

**Impacto:** Bugs en producción, refactorización imposible

**Solución Propuesta:**
```javascript
// test/usuario.test.js
import { usuario } from '../data/usuario.js';

describe('Usuario Processor', () => {
  test('Todos usuarios deben tener IMC', () => {
    usuario.forEach(u => {
      expect(u.imc).toBeDefined();
      expect(u.imc.imc).toBeGreaterThan(0);
    });
  });
  
  test('Nivel NICROSS debe ser válido', () => {
    const NIVELES = ['N1_sedentario', 'N2_inicial_activo', 'N3_intermedio', 'N4_avanzado'];
    usuario.forEach(u => {
      expect(NIVELES).toContain(u.nivel_nicross);
    });
  });
  
  test('Series y reps deben ser números exactos', () => {
    usuario.forEach(u => {
      u.semana_entrenamiento?.dias?.forEach(dia => {
        dia.bloques?.forEach(bloque => {
          bloque.ejercicios?.forEach(ej => {
            expect(Number.isInteger(ej.series)).toBe(true);
            expect(Number.isInteger(ej.repeticiones_min)).toBe(true);
          });
        });
      });
    });
  });
});
```

**Lección:** Tests = documentación ejecutable. Obligarios para cambios.

---

## ✅ CHECKLIST PREVENTIVO

### Antes de Hacer Cambios
- [ ] Documentación sincronizada con código actual
- [ ] No hay imports no utilizados (grep search)
- [ ] Todos los archivos tienen un propósito claro
- [ ] Valores exactos, no rangos ambiguos

### Antes de Commit
- [ ] Sin archivos con sufijos `.old`, `.bak`, `.resolved`, `.tmp`
- [ ] Validar estructura de datos de entrada
- [ ] Agregar console.error, no solo console.log
- [ ] Documentar por qué existe cada archivo

### Antes de Merge a Main
- [ ] Tests pasan (cuando existan)
- [ ] Sin warnings de linting
- [ ] Documentación actualizada
- [ ] Estado_actual.md verificado

### Mensualmente (Auditoría)
- [ ] Grep search de imports no usados
- [ ] Sincronizar README y ARCHITECTURE
- [ ] Revisar carpeta /data por archivos obsoletos
- [ ] Verificar que Dashboard muestra datos correctamente

---

## 📊 MÉTRICAS PARA MONITOREAR

```
Cobertura de Tests:     0% → Meta: 60%
Archivos Muertos:       3 → Meta: 0
Errores en Consola:     ? → Meta: 0
Documentación Outdated: 30% → Meta: <5%
Importancia Crítica:    ALTA
```

---

## 🔗 REFERENCIAS RELACIONADAS

- [estado_actual.md](estado_actual.md) - Estado actual verificado
- [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitectura técnica
- [CONTEXTO_NICROSS.md](CONTEXTO_NICROSS.md) - Principios NICROSS
- [AI_RULES.md](AI_RULES.md) - Guía de desarrollo
