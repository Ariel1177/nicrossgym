# ⚡ NICROSS — Generador de Rutinas de Entrenamiento

**Versión:** 1.0.2  
**Estado:** ✅ Operativo – En mejora continua  
**Última actualización:** Marzo 2026

---

## 🎯 ¿QUÉ ES NICROSS?

**NICROSS** es un sistema inteligente que convierte datos de usuarios (edad, peso, experiencia, objetivos) en **planes de entrenamiento personalizados y exactos**.

```
Usuario Base  →  Análisis  →  Rutina Semanal Detallada
 (185cm, 85kg)  (Nivel 3)    (Ejercicios, series, carga)
```

### ✨ Características principales

- ✅ **Generación automática** de semanas de entrenamiento
- ✅ **Valores exactos** en series, repeticiones y cargas
- ✅ **Clasificación NICROSS** (N1 sedentario → N4 avanzado)
- ✅ **Dashboard interactivo** con 3 paneles informativos
- ✅ **Cálculo de 1RM** estimado automáticamente
- ✅ **150+ usuarios** procesados simultáneamente
- ✅ **API interna** modular y extensible

---

## 🚀 INICIO RÁPIDO

### 1. Abre el proyecto

```bash
cd c:\Users\ariel\Downloads\nicrossgym-main
```

### 2. Ejecuta index.html

Abre en navegador:
```
file:///c:/Users/ariel/Downloads/nicrossgym-main/index.html
```

O con Live Server en VS Code:
```
Botón derecho en index.html → Open with Live Server
```

### 3. Navega entre usuarios

- ◀ ▶ Botones para cambiar usuario
- Click en día para expandir rutina
- Panel derecha muestra métricas

---

## 📁 ESTRUCTURA DEL PROYECTO

```
nicrossgym-main/
├── index.html                     ← Punto de entrada
├── package.json                   ← Metadata ES6
│
├── data/                          ← Capa de datos
│   ├── usuarios.js                (BD raw)
│   ├── usuario.js                 (Procesador)
│   ├── ejercicios.js              (Catálogo 70+ ejercicios)
│   ├── splitSemanales.js          (Splits 2-6 días)
│   └── usuarioConCargas.js        (Sistema de cargas)
│
├── training/                      ← Capa de lógica
│   ├── bloques.js                 (Matriz bloques/nivel)
│   ├── parametrosPorBloque.js     (Series, reps, tempo)
│   ├── generadorSemanaReal.js     (Generador semanas)
│   ├── calculadoraCarga.js        (Cálculo de cargas)
│   ├── selectorEjercicios.js      (Selector inteligente)
│   ├── generadorSesiones.js       (Sesiones completas)
│   └── ... (4 módulos más)
│
├── js/                            ← Capa de presentación
│   └── main.js                    (Dashboard oficial)
│
└── docs/                          ← Documentación
    ├── ARCHITECTURE.md            (Arquitectura técnica)
    ├── CONTEXTO_NICROSS.md        (Principios NICROSS)
    ├── ERRORES_COMUNES.md         (Lecciones)
    ├── estado_actual.md           (Estado del proyecto)
    └── ... (más docs)
```

---

## 📖 DOCUMENTACIÓN

### Para Entender el Proyecto

| Documento | Propósito |
|-----------|-----------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Cómo está construido |
| [estado_actual.md](estado_actual.md) | Estado actual verificado |
| [CONTEXTO_NICROSS.md](CONTEXTO_NICROSS.md) | Principios NICROSS |
| [ERRORES_COMUNES.md](ERRORES_COMUNES.md) | Lecciones aprendidas |
| [AI_RULES.md](AI_RULES.md) | Guía de desarrollo |

### Para Desarrollar

```javascript
// Modificar dashboard
// → Editar js/main.js (función render*)

// Agregar ejercicio
// → Editar data/ejercicios.js

// Cambiar parámetros de bloque
// → Editar training/parametrosPorBloque.js

// Agregar usuario
// → Editar data/usuarios.js
// → Será procesado automáticamente
```

---

## 🔄 CÓMO FUNCIONA

### 1. Carga de Usuarios

```javascript
// data/usuarios.js tiene la BD raw
const users = [
  { id: 'user_001', nombre: 'Juan', edad: 28, peso_kg: 85, ... },
  { id: 'user_002', nombre: 'María', edad: 35, peso_kg: 62, ... },
  // ... 150+ usuarios
]
```

### 2. Procesamiento

```javascript
// data/usuario.js los enriquece
usuario → usuario procesado {
  ...usuario_original,
  imc: { imc: 25.3, categoria: "sobrepeso" },
  nivel_nicross: "N3_intermedio",
  split_semanal: "push_pull_legs",
  bloques_dia: { ... }
}
```

### 3. Generación de Semana

```javascript
// training/generadorSemanaReal.js genera plan
usuario → semana_entrenamiento {
  dias: [
    {
      foco: "empuje_horizontal",
      bloques: [
        {
          ejercicios: [
            {
              nombre: "Press Banca",
              series: 4,              // ← EXACTO
              repeticiones_min: 5,    // ← EXACTO
              repeticiones_max: 5,    // ← EXACTO (no rango)
              carga_kg: 100,
              descanso_seg: 180
            }
          ]
        }
      ]
    },
    // ... 5 días
  ]
}
```

### 4. Renderizado

```javascript
// js/main.js dibuja el dashboard
Panel Izquierda:  Datos usuario (edad, peso, objetivo, etc)
Panel Centro:     Rutina semanal (dias, ejercicios, cargas)
Panel Derecha:    Indicadores (IMC, 1RM estimados, progreso)
```

---

## 🎯 OBJETIVOS PRINCIPALES

Cada usuario recibe rutinas personalizadas según:

✅ **Nivel de experiencia** (N1 principiante → N4 avanzado)  
✅ **Días disponibles** (2-6 días/semana)  
✅ **Objetivo** (fuerza, hipertrofia, pérdida de grasa)  
✅ **Equipamiento** (gimnasio completo, mancuernas, etc)  
✅ **Limitaciones** (lesiones, movilidad, etc)

---

## 🔧 DESARROLLO

### Stack Técnico

- **Lenguaje:** JavaScript ES6+ (módulos nativos)
- **Frontend:** HTML5, CSS (custom, sin frameworks)
- **Datos:** Objetos JavaScript (sin BD externa)
- **Arquitectura:** Funcional, modular, sin clases

### Node Versión

```bash
node --version  # Requiere Node 14+
npm --version   # Requiere npm 6+
```

### Para Modificar Código

```javascript
// ✅ REGLAS IMPORTANTES
1. Usar funciones puras (sin efectos secundarios)
2. Valores EXACTOS (no rangos)
3. Importar/exportar explícitamente
4. Documentar cambios en estado_actual.md
5. Validar entrada siempre
6. Lanzar errores ruidosos, no silenciosos
```

---

## 🐛 PROBLEMAS COMUNES

### "Dashboard no carga"
→ Revisa consola (F12) para errores de import  
→ Verifica que index.html está en la raíz  

### "Las reps muestran rango (6-8)"
→ Se está usando versión vieja  
→ Limpia caché: Ctrl+Shift+Del  

### "Usuario no aparece"
→ ¿Está en data/usuarios.js?  
→ ¿Tiene todos los campos obligatorios?  

---

## 📊 ESTADÍSTICAS

```
Líneas de código:      ~8,500
Usuarios procesados:   150+
Ejercicios:            70+
Módulos:               15
Documentación:         8 archivos
Cobertura tests:       0% (⚠️ en desarrollo)
```

---

## 🗺️ ROADMAP

### Completado ✅
- [x] Dashboard 3 paneles
- [x] Procesamiento usuarios
- [x] Generación semanas
- [x] Cálculo cargas
- [x] Valores exactos (en progreso)

### En desarrollo 🔨
- [ ] Tests automáticos
- [ ] Validación exhaustiva
- [ ] Mejor logging
- [ ] Archivar código legacy

### Futuro 📅
- [ ] Backend/API
- [ ] BD persistente
- [ ] Autenticación
- [ ] Exportar PDF
- [ ] Progresión automática

---

## 📞 REFERENCIAS IMPORTANTES

Ver documentación técnica:
- [Cómo está construido](ARCHITECTURE.md)
- [Estado actual del proyecto](estado_actual.md)
- [Principios NICROSS](CONTEXTO_NICROSS.md)
- [Errores y lecciones](ERRORES_COMUNES.md)

---

## 📝 LICENCIA

Proyecto NICROSS — Generador de Rutinas  
Marzo 2026

**¿Preguntas?** Ver documentación en carpeta raíz