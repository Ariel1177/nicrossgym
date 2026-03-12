# 📊 CARGA DINÁMICA DE DATOS — Guía de Uso

**Versión:** 1.0  
**Próposito:** Modificar propiedades de `user_001` y ver los cambios en la rutina generada sin alterar el sistema

---

## 🚀 INICIO RÁPIDO

### Paso 1: Abre el formulario HTML

```bash
# Con Live Server en VS Code:
Botón derecho en datos.html → Open with Live Server
```

O directamente en el navegador:
```
file:///c:/Users/ariel/Downloads/nicrossgym-main/datos.html
```

### Paso 2: Completa el formulario

El formulario tiene 5 secciones:

1. **📏 Datos Antropométricos**
   - Peso (kg): 30-200 kg
   - Altura (cm): 130-230 cm
   - Edad: 15-100 años

2. **💪 Perfil de Entrenamiento**
   - Experiencia (años)
   - Días por semana (2-6)
   - Tiempo por sesión (min)
   - Nivel declarado

3. **🎯 Objetivo y Equipamiento**
   - Objetivo: hipertrofia, fuerza, perder grasa, etc
   - Equipamiento: gimnasio completo, mancuernas, etc

4. **⚠️ Limitaciones** (opcional)
   - Lesiones u otros limitantes

5. **💪 Fuerzas Máximas (1RM)**
   - Empuje horizontal (press banca)
   - Tracción horizontal (remo)
   - Empuje vertical (press militar)
   - Tracción vertical (dominadas)
   - Cuádriceps (sentadilla)
   - Cadena posterior (peso muerto)
   - Glúteos (hip thrust)

### Paso 3: Guarda los datos

Click en botón **"✓ Guardar y Cargar"**

Verás:
- ✅ Un mensaje de éxito
- Una tabla en consola (F12) mostrando qué datos cambiaron
- Un resumen completo de los valores guardados

### Paso 4: Genera la rutina modificada

En la consola (F12), ejecuta:

```javascript
// Opción 1: Node.js (desde terminal)
node js/app1.js

// Opción 2: En navegador (copia y pega en consola)
// ... (verifica que datos.html esté abierto en otra pestaña)
```

---

## 📂 ARCHIVOS CREADOS

### `carga_de_datos.js`
Módulo con 6 funciones principales:

```javascript
obtenerDatosDelFormulario()        // Lee datos del HTML
guardarDatosEnLocalStorage(datos)  // Guarda en localStorage
cargarDatosDelLocalStorage()       // Carga desde localStorage
aplicarDatosAlUsuario()            // Aplica a user_001
recalcularPropiedadesUsuario()     // Recalcula IMC, nivel NICROSS
validarDatos(datos)                // Valida rangos
mostrarResumenDatos()              // Muestra cambios en consola
```

### `datos.html`
Formulario visual limpio y moderno para ingresar datos.

### Cambios en `js/app1.js`
- Carga `carga_de_datos.js`
- Detecta datos guardados en localStorage
- Aplica cambios a `usuarioActual` antes de generar rutina
- Muestra en consola si se aplicaron cambios

---

## 💡 EJEMPLO DE USO

**Escenario:** Quiero ver cómo cambia la rutina si cambio de 5 a 3 días de entrenamiento

### Paso 1: Abre `datos.html`
```
http://localhost:5500/datos.html  (con Live Server)
```

### Paso 2: Cambia "Días/Semana" de 5 a 3
```
Busca el selector "Días/Semana"
Selecciona "3 días"
```

### Paso 3: Guarda
```
Click en "✓ Guardar y Cargar"

Consola mostrará:
✅ Datos guardados en localStorage:
{
  "dias_entrenamiento": 3,
  "peso_kg": 85,
  ...
}

📊 RESUMEN DE DATOS CARGADOS:
  DIAS_ENTRENAMIENTO: 5 → 3  ← CAMBIO DETECTADO
  ...
```

### Paso 4: Abre app1.js
```
node js/app1.js
```

Consola mostrará:
```
╔════════════════════════════════════════════════════════════════════════╗
║  ⚡ DATOS MODIFICADOS DETECTADOS — Aplicando cambios a user_001       ║
╚════════════════════════════════════════════════════════════════════════╝

✅ CAMBIOS APLICADOS CORRECTAMENTE
  • Peso: 85 kg
  • Altura: 180 cm
  • Edad: 28 años
  • Experiencia: 2 años
  • Días/semana: 3  ← APLICADO
  • Objetivo: hipertrofia
  • Equipamiento: gimnasio_completo

💡 TIP: Verás una rutina diferente abajo basada en estos nuevos datos

[RUTINA GENERADA CON 3 DÍAS EN LUGAR DE 5]
```

---

## 🔄 CÓMO FUNCIONA INTERNAMENTE

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuario completa datos.html (formulario)                 │
├─────────────────────────────────────────────────────────────┤
│ 2. Click "Guardar" → guardarDatosEnLocalStorage()           │
├─────────────────────────────────────────────────────────────┤
│ 3. Datos guardados en:                                      │
│    localStorage['usuario_modificado'] = JSON                │
├─────────────────────────────────────────────────────────────┤
│ 4. Ejecuta: node js/app1.js (o en navegador)                │
├─────────────────────────────────────────────────────────────┤
│ 5. app1.js detecta datos en localStorage                    │
├─────────────────────────────────────────────────────────────┤
│ 6. aplicarDatosAlUsuario(user_001, datosModificados)        │
├─────────────────────────────────────────────────────────────┤
│ 7. recalcularPropiedadesUsuario(user_001) [IMC, nivel]      │
├─────────────────────────────────────────────────────────────┤
│ 8. generarSemanaCompleta(user_001_modificado)               │
├─────────────────────────────────────────────────────────────┤
│ 9. Rutina diferente genera basada en nuevos valores         │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚙️ PROPIEDADES MODIFICABLES

| Propiedad | Tipo | Rango | Efecto en Rutina |
|-----------|------|-------|------------------|
| `peso_kg` | number | 30-200 | Carga en ejercicios |
| `altura_cm` | number | 130-230 | Cálculo IMC |
| `edad` | number | 15-100 | Estimación |
| `experiencia_anios` | float | 0-50 | **Nivel NICROSS** |
| `dias_entrenamiento` | number | 2-6 | **Split semanal** |
| `tiempo_por_sesion_min` | number | 30-180 | Volumen |
| `objetivo` | string | — | **Tipo de bloques** |
| `equipamiento` | string | — | Selección ejercicios |
| `limitaciones` | array | — | Exclusiones |
| `fuerzaMaxima.*` | number | 20+ | **Carga en kg** |

**En negrita:** Cambios que más afectan la rutina

---

## 🐛 TROUBLESHOOTING

### "No veo cambios en la rutina"
1. ✓ ¿Guardaste en `datos.html`?
2. ✓ ¿Ves el mensaje "✅ CAMBIOS APLICADOS" en consola?
3. ✓ ¿Ejecutaste `app1.js` DESPUÉS de guardar?
4. ✓ Limpia cache (Ctrl+Shift+Del) si es necesario

### "Datos no se guardan"
1. Abre consola (F12)
2. Busca errores en rojo
3. Verifica que localStorage esté habilitado

### "Cambios incorrectos"
1. Revisa los rangos permitidos (tabla arriba)
2. Recarga la página: Ctrl+R
3. Borra localStorage: `localStorage.clear()`

---

## 📝 VALIDACIONES AUTOMÁTICAS

El sistema valida:

```javascript
❌ Peso: "peso_kg debe estar entre 30 y 200 kg"
❌ Altura: "altura_cm debe estar entre 130 y 230 cm"
❌ Edad: "edad debe estar entre 15 y 100 años"
❌ Experiencia: "experiencia_anios no puede ser negativa"
❌ Días: "días_entrenamiento deben estar entre 2 y 6"
```

Si hay error, aparece en consola y **no se guardan los datos**.

---

## 🔐 SEGURIDAD

- ✅ Solo modifica propiedades existentes de `user_001`
- ✅ No crea nuevos usuarios
- ✅ No alterar estructura de datos
- ✅ Datos guardados localmente (no enviados a servidor)
- ✅ Validación de rangos antes de aplicar

---

## 🎯 CASOS DE USO

1. **Probar diferentes experiencias**
   - Cambiar `experiencia_anios` de 2 a 0  → Ver rutina para principiante
   - Ver cómo cambia el nivel NICROSS

2. **Probar diferentes split**
   - Cambiar `dias_entrenamiento` de 5 a 3  → Ver splits comprimidos
   - O de 3 a 6  → Ver más volumen

3. **Probar progresión de fuerza**
   - Cambiar 1RMs (empuje horizontal de 100 a 130)  → Ver cargas más altas
   - Comproba cómo escala la rutina

4. **Simular lesión**
   - Agregar "Lesión de Hombro"  → Ver modificaciones recomendadas

5. **Cambiar objetivo**
   - De "hipertrofia" a "fuerza"  → Ver cambio de bloques y reps

---

## 💾 DATOS EN NAVEGADOR

Los datos se guardan en **localStorage**:

```javascript
// Ver datos guardados en consola:
console.log(localStorage.getItem('usuario_modificado'))

// Limpiar datos:
localStorage.clear()

// Ver en DevTools:
F12 → Storage → Local Storage → http://localhost:5500
```

---

**¿Preguntas?** Revisa `ERRORES_COMUNES.md` para más info sobre el proyecto.
