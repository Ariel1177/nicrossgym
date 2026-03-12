/**
 * ================================================================
 * MÓDULO: generadorRutina.js
 * SISTEMA: Generador de Rutinas NICROSS
 * ================================================================
 * 
 * Responsabilidades:
 * 1️⃣ Generar rutinas semanales completas para usuarios
 * 2️⃣ Seleccionar ejercicios respetando patrones y restricciones
 * 3️⃣ Aplicar inteligencia en randomización y fatiga
 * 4️⃣ Evitar repetición de ejercicios en la semana
 * 5️⃣ Respetar prioridad y patrones de movimiento
 * 
 * ================================================================
 */

import { bloques } from "./bloques.js";
import { patronesPorBloque, ejerciciosValidos } from "./selectorEjercicios.js";
import { ejercicios } from "../data/ejercicios.js";


/**
 * ================================================================
 * FUNCIÓN: obtenerBloquesDelDia(usuario, foco)
 * ================================================================
 * 
 * Obtiene los bloques de entrenamiento para un día específico
 * según el nivel NICROSS y el foco del día.
 * 
 * @param {Object} usuario - Usuario con nivel_nicross
 * @param {String} foco - El foco del día (ej: "cuerpo_completo", "tren_superior")
 * @returns {Array} Array de nombres de bloques
 * 
 * ================================================================
 */
function obtenerBloquesDelDia(usuario, foco) {
    const nivel = usuario.nivel_nicross;

    if (!bloques[nivel] || !bloques[nivel][foco]) {
        console.warn(`Bloques no encontrados para ${nivel} - ${foco}`);
        return [];
    }

    return bloques[nivel][foco];
}


/**
 * ================================================================
 * FUNCIÓN: obtenerPatronesDelBloque(nombreBloque)
 * ================================================================
 * 
 * Obtiene los patrones de movimiento asociados a un bloque.
 * 
 * @param {String} nombreBloque - Nombre del bloque
 * @returns {Array} Array de patrones disponibles
 * 
 * ================================================================
 */
function obtenerPatronesDelBloque(nombreBloque) {
    return patronesPorBloque[nombreBloque] || [];
}


/**
 * ================================================================
 * FUNCIÓN: filtrarEjercicios(patron, usuario, ejerciciosUsados, equipamiento)
 * ================================================================
 * 
 * Filtra ejercicios candidatos para un patrón específico aplicando:
 * - Patrón correcto
 * - Nivel mínimo del usuario
 * - Equipamiento compatible
 * - Ejercicios no usados en la semana
 * 
 * @param {String} patron - Patrón de movimiento
 * @param {Object} usuario - Usuario actual
 * @param {Set} ejerciciosUsados - Set de IDs de ejercicios ya usados
 * @param {Array} equipamiento - Array de equipamiento disponible
 * @returns {Array} Array de ejercicios filtrados
 * 
 * ================================================================
 */
function filtrarEjercicios(patron, usuario, ejerciciosUsados, equipamiento) {
    const nivelUsuario = parseInt(usuario.nivel_nicross.split("_")[0].substring(1));

    const candidatos = ejercicios.filter(e => {
        // Coincidir patrón
        if (e.patron !== patron) return false;

        // Filtrar por nivel mínimo
        if (e.nivelMinimo > nivelUsuario) return false;

        // Filtrar por equipamiento
        const tieneEquipamiento = e.equipamiento.some(eq =>
            equipamiento.includes(eq) || equipamiento.includes("gimnasio_completo")
        );
        if (!tieneEquipamiento) return false;

        // Filtrar ejercicios ya usados
        if (ejerciciosUsados.has(e.id)) return false;

        return true;
    });

    return candidatos;
}


/**
 * ================================================================
 * FUNCIÓN: ordenarPorPrioridad(ejercicos)
 * ================================================================
 * 
 * Ordena ejercicios por prioridad (1 = mayor, 3 = menor).
 * Primero compuestos principales, luego secundarios, luego accesorios.
 * 
 * @param {Array} ejercicios - Array de ejercicios
 * @returns {Array} Array ordenado por prioridad
 * 
 * ================================================================
 */
function ordenarPorPrioridad(ejerciciosArray) {
    return [...ejerciciosArray].sort((a, b) => {
        return (a.prioridad || 3) - (b.prioridad || 3);
    });
}


/**
 * ================================================================
 * FUNCIÓN: randomizarSeleccion(candidatos, cantidad)
 * ================================================================
 * 
 * Selecciona aleatoriamente N ejercicios de los candidatos.
 * 
 * @param {Array} candidatos - Array de ejercicios candidatos
 * @param {Number} cantidad - Cantidad de ejercicios a seleccionar
 * @returns {Array} Array con ejercicios seleccionados
 * 
 * ================================================================
 */
function randomizarSeleccion(candidatos, cantidad = 1) {
    if (candidatos.length === 0) return [];
    if (candidatos.length <= cantidad) return candidatos;

    const resultado = [];
    const disponibles = [...candidatos];

    for (let i = 0; i < cantidad && disponibles.length > 0; i++) {
        const indiceRandom = Math.floor(Math.random() * disponibles.length);
        resultado.push(disponibles[indiceRandom]);
        disponibles.splice(indiceRandom, 1);
    }

    return resultado;
}


/**
 * ================================================================
 * FUNCIÓN: seleccionarEjerciciosParaBloque(bloque, usuario, ejerciciosUsados, 
 *                                           fatigaDisponible, equipamiento)
 * ================================================================
 * 
 * Selecciona ejercicios para un bloque específico respetando:
 * - Patrones del bloque
 * - Prioridad de ejercicios
 * - Aleatorización
 * - Fatiga disponible en la sesión
 * - Balance de movimiento (máx 2 del mismo patrón)
 * - Ejercicios no repetidos en la semana
 * 
 * @param {String} bloque - Nombre del bloque
 * @param {Object} usuario - Usuario actual
 * @param {Set} ejerciciosUsados - Set de IDs ya usados
 * @param {Number} fatigaDisponible - Fatiga que se puede usar en el día
 * @param {Array} equipamiento - Array de equipamiento
 * @returns {Object} { ejercicios: [], fatigaUsada, patronesUsados }
 * 
 * ================================================================
 */
function seleccionarEjerciciosParaBloque(bloque, usuario, ejerciciosUsados, fatigaDisponible, equipamiento) {
    const patrones = obtenerPatronesDelBloque(bloque);
    const ejerciciosSeleccionados = [];
    let fatigaUsada = 0;
    const patronesUsados = {};

    for (const patron of patrones) {
        // Obtener candidatos filtrados
        let candidatos = filtrarEjercicios(patron, usuario, ejerciciosUsados, equipamiento);

        if (candidatos.length === 0) {
            continue;
        }

        // Ordenar por prioridad
        candidatos = ordenarPorPrioridad(candidatos);

        // Filtrar por fatiga disponible
        candidatos = candidatos.filter(e =>
            (e.fatiga || 1) <= fatigaDisponible - fatigaUsada
        );

        if (candidatos.length === 0) {
            continue;
        }

        // Limitar cantidad de ejercicios del mismo patrón (máx 2)
        const patronCount = patronesUsados[patron] || 0;
        if (patronCount >= 2) {
            continue;
        }

        // Randomizar selección
        const [ejercicioSeleccionado] = randomizarSeleccion(candidatos, 1);

        if (ejercicioSeleccionado) {
            ejerciciosSeleccionados.push({
                id: ejercicioSeleccionado.id,
                nombre: ejercicioSeleccionado.nombre,
                patron: ejercicioSeleccionado.patron,
                prioridad: ejercicioSeleccionado.prioridad,
                fatiga: ejercicioSeleccionado.fatiga || 1,
                musculosPrimarios: ejercicioSeleccionado.musculosPrimarios,
                musculosSecundarios: ejercicioSeleccionado.musculosSecundarios
            });

            // Actualizar tracking
            ejerciciosUsados.add(ejercicioSeleccionado.id);
            fatigaUsada += ejercicioSeleccionado.fatiga || 1;
            patronesUsados[patron] = (patronesUsados[patron] || 0) + 1;
        }
    }

    return {
        ejercicios: ejerciciosSeleccionados,
        fatigaUsada,
        patronesUsados
    };
}


/**
 * ================================================================
 * FUNCIÓN: generarRutinaDia(dia, usuario, ejerciciosUsados)
 * ================================================================
 * 
 * Genera la rutina completa para un día específico.
 * 
 * @param {Object} dia - Objeto del día con: dia, foco, enfasis
 * @param {Object} usuario - Usuario actual
 * @param {Set} ejerciciosUsados - Set de IDs ya usados en la semana
 * @returns {Object} Rutina del día con bloques y ejercicios
 * 
 * ================================================================
 */
function generarRutinaDia(dia, usuario, ejerciciosUsados) {
    const bloquesDelDia = obtenerBloquesDelDia(usuario, dia.foco);
    const bloquesDia = [];

    let fatigaDisponibleDia = 20; // Límite de fatiga por sesión
    const equipamiento = usuario.equipamiento ?
        (Array.isArray(usuario.equipamiento) ? usuario.equipamiento : [usuario.equipamiento])
        : ["gimnasio_completo"];

    for (const nombreBloque of bloquesDelDia) {
        const seleccion = seleccionarEjerciciosParaBloque(
            nombreBloque,
            usuario,
            ejerciciosUsados,
            fatigaDisponibleDia,
            equipamiento
        );

        if (seleccion.ejercicios.length > 0) {
            bloquesDia.push({
                nombre: nombreBloque,
                ejercicios: seleccion.ejercicios,
                fatigaTotalBloque: seleccion.fatigaUsada
            });

            fatigaDisponibleDia -= seleccion.fatigaUsada;
        }
    }

    return {
        dia: dia.dia,
        foco: dia.foco,
        enfasis: dia.enfasis,
        bloques: bloquesDia,
        fatigaTotalDia: 20 - fatigaDisponibleDia
    };
}


/**
 * ================================================================
 * FUNCIÓN: generarRutinaSemanal(usuario)
 * ================================================================
 * 
 * Genera la rutina completa semanal para un usuario.
 * 
 * Respeta:
 * - Estructura del split semanal del usuario
 * - Bloques según nivel NICROSS
 * - Ejercicios sin repetir en la semana
 * - Fatiga máxima de 20 por sesión
 * - Prioridad y patrones de movimiento
 * 
 * @param {Object} usuario - Usuario con split_semanal_recomendado
 * @returns {Object} { semana: [...] }
 * 
 * ================================================================
 */
function generarRutinaSemanal(usuario) {
    // Validar estructura básica
    if (!usuario.split_semanal_recomendado || !usuario.split_semanal_recomendado.dias) {
        console.error("Usuario sin split semanal recomendado");
        return { semana: [] };
    }

    const dias = usuario.split_semanal_recomendado.dias;
    const ejerciciosUsados = new Set();
    const semana = [];

    // Generar rutina para cada día
    for (const dia of dias) {
        const rutinaDia = generarRutinaDia(dia, usuario, ejerciciosUsados);
        semana.push(rutinaDia);
    }

    return {
        nombreSplit: usuario.split_semanal_recomendado.nombre,
        semana: semana
    };
}


/**
 * ================================================================
 * FUNCIÓN: generarRutinaUsuario(usuario)
 * ================================================================
 * 
 * Genera la rutina semanal y la agrega al objeto usuario.
 * Retorna el usuario enriquecido con su rutina.
 * 
 * @param {Object} usuario - Usuario a enriquecer
 * @returns {Object} Usuario con rutina_semana_1
 * 
 * ================================================================
 */
function generarRutinaUsuario(usuario) {
    // Crear copia del usuario para no mutar el original
    const usuarioEnriquecido = { ...usuario };

    // Generar rutina semanal
    const rutinaSemanal = generarRutinaSemanal(usuario);

    // Agregar rutina al usuario
    usuarioEnriquecido.rutina_semana_1 = rutinaSemanal;

    return usuarioEnriquecido;
}


// ================================================================
// EXPORTAR FUNCIONES
// ================================================================

export {
    generarRutinaSemanal,
    generarRutinaUsuario,
    generarRutinaDia,
    seleccionarEjerciciosParaBloque,
    filtrarEjercicios,
    ordenarPorPrioridad,
    randomizarSeleccion,
    obtenerBloquesDelDia,
    obtenerPatronesDelBloque
};

