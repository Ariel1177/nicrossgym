/**
 * PARÁMETROS POR BLOQUE DE ENTRENAMIENTO
 * Define cargas, repeticiones, series y tempo para cada bloque según nivel NICROSS
 * Basado en metodología NICROSS y adaptado a cada nivel de entrenamiento
 */

export const parametrosPorBloque = {
    // ===== NIVEL N1 - SEDENTARIO =====
    N1_sedentario: {
        activacion_general: {
            porcentaje1RM: { min: 40, max: 50 },
            repeticiones: { min: 10, max: 15 },
            series: 2,
            descanso_segundos: { min: 30, max: 45 },
            tempo: { excentric: 2, pause: 0, concentric: 2 },
            notas: "Movilidad, activación muscular, sin fatiga"
        },

        activacion_cadera: {
            porcentaje1RM: { min: 40, max: 50 },
            repeticiones: { min: 10, max: 15 },
            series: 2,
            descanso_segundos: { min: 30, max: 45 },
            tempo: { excentric: 2, pause: 0, concentric: 2 },
            notas: "Enfoque en movilidad de cadera y glúteos"
        },

        fuerza_basica: {
            porcentaje1RM: { min: 50, max: 65 },
            repeticiones: { min: 8, max: 12 },
            series: 3,
            descanso_segundos: { min: 60, max: 90 },
            tempo: { excentric: 2, pause: 1, concentric: 2 },
            notas: "Construcción de base técnica y neural"
        },

        accesorios_ligeros: {
            porcentaje1RM: { min: 40, max: 60 },
            repeticiones: { min: 10, max: 15 },
            series: 2,
            descanso_segundos: { min: 45, max: 60 },
            tempo: { excentric: 2, pause: 0, concentric: 2 },
            notas: "Trabajo complementario sin alta demanda"
        },

        accesorios_gluteos: {
            porcentaje1RM: { min: 40, max: 60 },
            repeticiones: { min: 12, max: 15 },
            series: 2,
            descanso_segundos: { min: 45, max: 60 },
            tempo: { excentric: 2, pause: 0, concentric: 2 },
            notas: "Énfasis en glúteos con movimientos seguros"
        },

        cardio_suave: {
            porcentaje1RM: null,
            repeticiones: { min: null, max: null },
            series: 1,
            duracion_minutos: { min: 5, max: 10 },
            intensidad: "zona_baja",
            descanso_segundos: 0,
            notas: "Recuperación activa, 50-60% FC máxima"
        }
    },

    // ===== NIVEL N2 - INICIAL ACTIVO / PRINCIPIANTE =====
    N2_principiante: {
        activacion: {
            porcentaje1RM: { min: 45, max: 55 },
            repeticiones: { min: 10, max: 15 },
            series: 2,
            descanso_segundos: { min: 30, max: 45 },
            tempo: { excentric: 2, pause: 0, concentric: 2 },
            notas: "Preparación específica del patrón del día"
        },

        fuerza: {
            porcentaje1RM: { min: 65, max: 75 },
            repeticiones: { min: 6, max: 10 },
            series: 3,
            descanso_segundos: { min: 75, max: 120 },
            tempo: { excentric: 2, pause: 1, concentric: 2 },
            notas: "Construcción de fuerza base con técnica controlada"
        },

        hipertrofia: {
            porcentaje1RM: { min: 60, max: 75 },
            repeticiones: { min: 8, max: 12 },
            series: 3,
            descanso_segundos: { min: 60, max: 90 },
            tempo: { excentric: 2, pause: 0, concentric: 2 },
            notas: "Estímulo de crecimiento muscular"
        },

        core: {
            porcentaje1RM: { min: 40, max: 60 },
            repeticiones: { min: 12, max: 20 },
            series: 2,
            descanso_segundos: { min: 30, max: 45 },
            tempo: { excentric: 2, pause: 1, concentric: 2 },
            notas: "Estabilidad y control del tronco"
        }
    },

    // ===== NIVEL N3 - INTERMEDIO =====
    N3_intermedio: {
        activacion: {
            porcentaje1RM: { min: 50, max: 60 },
            repeticiones: { min: 10, max: 15 },
            series: 2,
            descanso_segundos: { min: 30, max: 45 },
            tempo: { excentric: 2, pause: 0, concentric: 2 },
            notas: "Preparación específica sin fatiga acumulada"
        },

        fuerza_compuesto: {
            porcentaje1RM: { min: 75, max: 85 },
            repeticiones: { min: 5, max: 8 },
            series: 4,
            descanso_segundos: { min: 90, max: 180 },
            tempo: { excentric: 2, pause: 1, concentric: 2 },
            notas: "Fuerza máxima con ejercicios complejos"
        },

        hipertrofia_volumen: {
            porcentaje1RM: { min: 65, max: 80 },
            repeticiones: { min: 8, max: 12 },
            series: 4,
            descanso_segundos: { min: 60, max: 90 },
            tempo: { excentric: 2, pause: 0, concentric: 2 },
            notas: "Alto volumen de trabajo para crecimiento"
        },

        accesorios: {
            porcentaje1RM: { min: 50, max: 70 },
            repeticiones: { min: 10, max: 15 },
            series: 3,
            descanso_segundos: { min: 45, max: 75 },
            tempo: { excentric: 2, pause: 0, concentric: 2 },
            notas: "Trabajo complementario específico"
        },

        core: {
            porcentaje1RM: { min: 40, max: 60 },
            repeticiones: { min: 12, max: 20 },
            series: 3,
            descanso_segundos: { min: 30, max: 60 },
            tempo: { excentric: 2, pause: 1, concentric: 2 },
            notas: "Estabilidad avanzada"
        }
    },

    // ===== NIVEL N4 - AVANZADO =====
    N4_avanzado: {
        activacion_especifica: {
            porcentaje1RM: { min: 50, max: 65 },
            repeticiones: { min: 10, max: 15 },
            series: 2,
            descanso_segundos: { min: 30, max: 45 },
            tempo: { excentric: 2, pause: 0, concentric: 2 },
            notas: "Activación altamente específica al trabajo del día"
        },

        fuerza_principal: {
            porcentaje1RM: { min: 85, max: 95 },
            repeticiones: { min: 3, max: 6 },
            series: 5,
            descanso_segundos: { min: 180, max: 300 },
            tempo: { excentric: 2, pause: 2, concentric: 1 },
            notas: "Fuerza máxima con descansos largos"
        },

        fuerza_secundaria: {
            porcentaje1RM: { min: 75, max: 85 },
            repeticiones: { min: 5, max: 8 },
            series: 4,
            descanso_segundos: { min: 120, max: 180 },
            tempo: { excentric: 2, pause: 1, concentric: 2 },
            notas: "Fuerza complementaria, ejercicios accesorio"
        },

        hipertrofia_alta: {
            porcentaje1RM: { min: 70, max: 85 },
            repeticiones: { min: 6, max: 12 },
            series: 4,
            descanso_segundos: { min: 60, max: 90 },
            tempo: { excentric: 3, pause: 1, concentric: 1 },
            notas: "Máximo volumen de crecimiento muscular"
        },

        accesorios_especificos: {
            porcentaje1RM: { min: 50, max: 70 },
            repeticiones: { min: 10, max: 15 },
            series: 3,
            descanso_segundos: { min: 45, max: 75 },
            tempo: { excentric: 2, pause: 0, concentric: 2 },
            notas: "Trabajo muy específico para debilidades"
        },

        core_avanzado: {
            porcentaje1RM: { min: 40, max: 70 },
            repeticiones: { min: 12, max: 20 },
            series: 3,
            descanso_segundos: { min: 30, max: 60 },
            tempo: { excentric: 2, pause: 1, concentric: 2 },
            notas: "Estabilidad con ejercicios avanzados"
        }
    }
};

/**
 * FUNCIÓN AUXILIAR: Obtener parámetros de un bloque
 */
export function obtenerParametrosBloque(nivelNicross, tipoBloque) {
    const parametros = parametrosPorBloque[nivelNicross];

    if (!parametros) {
        console.warn(`Nivel NICROSS no encontrado: ${nivelNicross}`);
        return null;
    }

    const tipoParams = parametros[tipoBloque];

    if (!tipoParams) {
        console.warn(`Tipo de bloque no encontrado para ${nivelNicross}: ${tipoBloque}`);
        return null;
    }

    return tipoParams;
}

/**
 * FUNCIÓN AUXILIAR: Obtener rango de repeticiones para un bloque
 */
export function obtenerRepeticiones(nivelNicross, tipoBloque) {
    const params = obtenerParametrosBloque(nivelNicross, tipoBloque);
    return params ? params.repeticiones : null;
}

/**
 * FUNCIÓN AUXILIAR: Obtener porcentaje de 1RM para un bloque
 */
export function obtenerPorcentaje1RM(nivelNicross, tipoBloque) {
    const params = obtenerParametrosBloque(nivelNicross, tipoBloque);
    return params ? params.porcentaje1RM : null;
}
