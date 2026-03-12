# PROJECT_CONTEXT.md

Este proyecto es un motor simple de generación de recomendaciones de entrenamiento.

El sistema procesa perfiles de usuarios y genera sugerencias de entrenamiento basadas en sus características.

## Datos del usuario

Cada usuario tiene información como:

* id
* nombre
* edad
* sexo
* peso_kg
* altura_cm
* objetivo
* nivel
* dias_entrenamiento
* equipamiento
* experiencia_anios
* limitaciones
* tiempo_por_sesion_min

## Flujo del sistema

1. Se carga el usuario
2. Se calcula el IMC
3. Se determina la categoría de IMC
4. Se analiza el perfil del usuario
5. Se sugiere un tipo de entrenamiento
6. (futuro) se generará una rutina completa

## Ejemplo de usuario procesado

{
id: "user_002",
nombre: "Martin Gomez",
edad: 27,
sexo: "masculino",
peso_kg: 82,
altura_cm: 180,
objetivo: "hipertrofia",
nivel: "intermedio",
dias_entrenamiento: 5,
equipamiento: "gimnasio_completo",

imc: {
imc: 25.31,
categoria_imc: "sobrepeso"
},

tipo_entrenamiento_sugerido: "push_pull_legs"
}

## Objetivo final del sistema

Construir un generador automático de rutinas de entrenamiento basado en reglas.
