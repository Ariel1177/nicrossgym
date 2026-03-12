# AI_RULES.md

Reglas para asistentes de IA (Copilot, GPT, Cursor).

Este proyecto usa JavaScript simple y busca mantener el código claro y fácil de mantener.

## Estilo de programación

* Usar JavaScript moderno
* Usar ES Modules (import / export)
* Preferir funciones simples
* NO usar clases a menos que se pida explícitamente
* Evitar abstracciones innecesarias
* Escribir código legible y directo
* Mantener funciones pequeñas

## Reglas para modificar código existente

Cuando refactorices o agregues código:

* NO cambiar la lógica existente si ya funciona
* NO renombrar funciones existentes
* NO mover archivos sin que se pida
* NO introducir frameworks
* NO reestructurar todo el proyecto
* Realizar siempre el cambio mínimo necesario

## Cómo se procesan los usuarios

Los usuarios son objetos JavaScript simples.

Las funciones del sistema agregan nuevas propiedades al objeto usuario.

Ejemplo:

usuario → usuario procesado

Propiedades agregadas actualmente:

* imc
* categoria_imc
* tipo_entrenamiento_sugerido

Ejemplo:

{
id: "user_002",
nombre: "Martin Gomez",
peso_kg: 82,
altura_cm: 180,
imc: {
imc: 25.31,
categoria_imc: "sobrepeso"
}
}

## Objetivo del proyecto

Construir un motor que:

1. procese perfiles de usuario
2. calcule métricas físicas
3. determine nivel del usuario
4. sugiera tipo de entrenamiento
5. genere rutinas automáticamente
