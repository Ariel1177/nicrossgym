/**
 * ESTRUCTURA DE MESOCICLOS
 * Define ciclos de 4-5 semanas con progresión planificada
 * Respeta principios NICROSS: progresión controlada, fatiga distribuida, descarga planificada
 */

import { parametrosPorBloque } from './parametrosPorBloque.js';

/**
 * MESOCICLO LINEAL (4 semanas)
 * Progresión: Familiarización → Base → Progresión → Pico
 * Ideal para principiantes e intermedios
 */
export const mesocicloLineal4Semanas = {
    nombre: "Mesociclo Lineal 4 Semanas",
    duracion_semanas: 4,
    tipo_progresion: "lineal",
    objetivo: "Progresión consistente de cargas",

    semanas: [
        {
            numero: 1,
            nombre: "Familiarización",
            objetivo: "Establecer técnica base y determinar cargas iniciales",
            multiplicador_carga: 0.85, // 85% de carga objetivo
            multiplicador_volumen: 0.9, // 90% de volumen objetivo
            descripcion: "Enfoque en calidad técnica",
            descanso_minimo_dias: 1,
            notas: ["Priorizar movimiento limpio", "Documentar capacidades reales"]
        },
        {
            numero: 2,
            nombre: "Base",
            objetivo: "Establecer línea base de rendimiento",
            multiplicador_carga: 0.95, // 95% de carga objetivo
            multiplicador_volumen: 0.95, // 95% de volumen objetivo
            descripcion: "Volumen e intensidad equilibrados",
            descanso_minimo_dias: 1,
            notas: ["Mantener técnica excelente", "Familiarización con cargas"]
        },
        {
            numero: 3,
            nombre: "Progresión",
            objetivo: "Aumentar estímulo progresivamente",
            multiplicador_carga: 1.0, // 100% de carga objetivo
            multiplicador_volumen: 1.0, // 100% de volumen objetivo
            descripcion: "Cargas y volumen máximos planificados",
            descanso_minimo_dias: 1,
            notas: ["Semana de mayor demanda", "Validar RPE"]
        },
        {
            numero: 4,
            nombre: "Descarga y Consolidación",
            objetivo: "Recuperación y asimilación",
            multiplicador_carga: 0.8, // 80% de carga (descarga)
            multiplicador_volumen: 0.7, // 70% de volumen (descarga)
            descripcion: "Semana de recuperación activa",
            descanso_minimo_dias: 0,
            notas: ["Mantener calidad técnica", "Permitir recuperación neural", "Preparar siguiente mesociclo"]
        }
    ]
};

/**
 * MESOCICLO LINEAL 5 SEMANAS
 * Progresión: Familiarización → Base → Progresión → Pico → Descarga
 * Ideal para usuarios más experimentados o con ciclos más largos
 */
export const mesocicloLineal5Semanas = {
    nombre: "Mesociclo Lineal 5 Semanas",
    duracion_semanas: 5,
    tipo_progresion: "lineal",
    objetivo: "Progresión consistente con microciclo de descarga",

    semanas: [
        {
            numero: 1,
            nombre: "Familiarización",
            objetivo: "Establecer técnica base",
            multiplicador_carga: 0.85,
            multiplicador_volumen: 0.9,
            descripcion: "Enfoque en calidad técnica",
            descanso_minimo_dias: 1,
            notas: ["Documentar capacidades reales", "Priorizar movimiento limpio"]
        },
        {
            numero: 2,
            nombre: "Base",
            objetivo: "Establecer línea base",
            multiplicador_carga: 0.92,
            multiplicador_volumen: 0.92,
            descripcion: "Volumen e intensidad equilibrados",
            descanso_minimo_dias: 1,
            notas: ["Mantener técnica excelente"]
        },
        {
            numero: 3,
            nombre: "Progresión 1",
            objetivo: "Primer aumento de estímulo",
            multiplicador_carga: 0.97,
            multiplicador_volumen: 0.97,
            descripcion: "Aumentar progresivamente",
            descanso_minimo_dias: 1,
            notas: ["Validar RPE cada sesión"]
        },
        {
            numero: 4,
            nombre: "Progresión 2 - Pico",
            objetivo: "Máxima demanda planificada",
            multiplicador_carga: 1.0,
            multiplicador_volumen: 1.0,
            descripcion: "Cargas y volumen máximos",
            descanso_minimo_dias: 1,
            notas: ["Semana de mayor demanda", "Máximo estímulo"]
        },
        {
            numero: 5,
            nombre: "Descarga y Consolidación",
            objetivo: "Recuperación y asimilación",
            multiplicador_carga: 0.8,
            multiplicador_volumen: 0.7,
            descripcion: "Semana de recuperación activa",
            descanso_minimo_dias: 0,
            notas: ["Permitir recuperación neural", "Preparar siguiente ciclo"]
        }
    ]
};

/**
 * MESOCICLO ONDULANTE (4 semanas)
 * Progresión: Baja → Media → Alta → Media (patrón de onda)
 * Ideal para niveles intermedios-avanzados, evita adaptación
 */
export const mesocicloOndulante4Semanas = {
    nombre: "Mesociclo Ondulante 4 Semanas",
    duracion_semanas: 4,
    tipo_progresion: "onda",
    objetivo: "Variar estímulo sin permitir adaptación",

    semanas: [
        {
            numero: 1,
            nombre: "Onda Baja",
            objetivo: "Preparación y técnica",
            multiplicador_carga: 0.9,
            multiplicador_volumen: 1.0,
            descripcion: "Menor intensidad, mayor volumen",
            descanso_minimo_dias: 1,
            notas: ["Técnica y base", "Mayor cantidad de series"]
        },
        {
            numero: 2,
            nombre: "Onda Media",
            objetivo: "Balance fuerza-volumen",
            multiplicador_carga: 0.95,
            multiplicador_volumen: 0.95,
            descripcion: "Balance de intensidad y volumen",
            descanso_minimo_dias: 1,
            notas: ["Estímulo mixto", "Recuperación moderada"]
        },
        {
            numero: 3,
            nombre: "Onda Alta",
            objetivo: "Máxima intensidad",
            multiplicador_carga: 1.0,
            multiplicador_volumen: 0.9,
            descripcion: "Mayor intensidad, menor volumen",
            descanso_minimo_dias: 1,
            notas: ["Enfoque en fuerza", "Menor cantidad de reps"]
        },
        {
            numero: 4,
            nombre: "Onda Media (Descarga)",
            objetivo: "Recuperación y transición",
            multiplicador_carga: 0.85,
            multiplicador_volumen: 0.8,
            descripcion: "Semana de recuperación activa",
            descanso_minimo_dias: 0,
            notas: ["Descarga activa", "Preparar siguiente ciclo"]
        }
    ]
};

/**
 * MESOCICLO PIRAMIDAL INVERTIDO (4 semanas)
 * Progresión: Alta → Media → Baja → Descarga
 * Ideal para fuerza seguida de hipertrofia
 */
export const mesociclosPiramidales = {
    nombre: "Mesociclo Piramidal (Fuerza → Volumen → Descarga)",
    duracion_semanas: 4,
    tipo_progresion: "piramidal",
    objetivo: "Transición de fuerza a volumen con descarga",

    semanas: [
        {
            numero: 1,
            nombre: "Enfoque Fuerza",
            objetivo: "Máxima fuerza relativa",
            multiplicador_carga: 1.0,
            multiplicador_volumen: 0.8,
            descripcion: "Alta intensidad, bajo volumen",
            descanso_minimo_dias: 1,
            notas: ["Enfoque en 1RM relativo", "Descansos largos"]
        },
        {
            numero: 2,
            nombre: "Transición",
            objetivo: "Graduar hacia volumen",
            multiplicador_carga: 0.95,
            multiplicador_volumen: 0.9,
            descripcion: "Intensidad media, volumen aumentando",
            descanso_minimo_dias: 1,
            notas: ["Transición controlada"]
        },
        {
            numero: 3,
            nombre: "Enfoque Volumen",
            objetivo: "Máximo volumen",
            multiplicador_carga: 0.85,
            multiplicador_volumen: 1.0,
            descripcion: "Menor intensidad, máximo volumen",
            descanso_minimo_dias: 1,
            notas: ["Mayor cantidad de series", "Descansos moderados"]
        },
        {
            numero: 4,
            nombre: "Descarga",
            objetivo: "Recuperación",
            multiplicador_carga: 0.75,
            multiplicador_volumen: 0.7,
            descripcion: "Semana de recuperación",
            descanso_minimo_dias: 0,
            notas: ["Recuperación completa", "Preparar siguiente ciclo"]
        }
    ]
};

/**
 * FUNCIÓN: Obtener mesociclo según criterios
 */
export function obtenerMesociclo(tipo = "lineal", semanas = 4) {
    if (tipo === "lineal" && semanas === 4) return mesocicloLineal4Semanas;
    if (tipo === "lineal" && semanas === 5) return mesocicloLineal5Semanas;
    if (tipo === "ondulante" && semanas === 4) return mesocicloOndulante4Semanas;
    if (tipo === "piramidal" && semanas === 4) return mesociclosPiramidales;

    // Default
    return mesocicloLineal4Semanas;
}

/**
 * FUNCIÓN: Obtener detalles de una semana específica
 */
export function obtenerInfoSemana(mesociclo, numeroSemana) {
    const semana = mesociclo.semanas.find(s => s.numero === numeroSemana);

    if (!semana) {
        console.warn(`Semana ${numeroSemana} no encontrada en mesociclo`);
        return null;
    }

    return {
        ...semana,
        mesociclo: mesociclo.nombre,
        progress_porcentaje: Math.round((numeroSemana / mesociclo.duracion_semanas) * 100)
    };
}

/**
 * RECOMENDACIÓN DE MESOCICLO SEGÚN NIVEL Y OBJETIVO
 */
export function recomendarMesociclo(nivelNicross, objetivo) {
    const recomendaciones = {
        N1_sedentario: {
            default: mesocicloLineal4Semanas,
            hipertrofia: mesocicloLineal4Semanas,
            fuerza: mesocicloLineal4Semanas,
            notas: "Usar mesociclos cortos y simples"
        },

        N2_principiante: {
            default: mesocicloLineal4Semanas,
            hipertrofia: mesocicloLineal4Semanas,
            fuerza: mesocicloLineal4Semanas,
            notas: "Énfasis en consistencia sobre complejidad"
        },

        N3_intermedio: {
            default: mesocicloLineal5Semanas,
            hipertrofia: mesocicloLineal5Semanas,
            fuerza: mesociclosPiramidales,
            potencia: mesocicloOndulante4Semanas,
            notas: "Pueden tolerar ciclos más complejos"
        },

        N4_avanzado: {
            default: mesocicloOndulante4Semanas,
            hipertrofia: mesociclosPiramidales,
            fuerza: mesociclosPiramidales,
            potencia: mesocicloOndulante4Semanas,
            notas: "Usar ondulaciones para evitar adaptación"
        }
    };

    const recomendacion = recomendaciones[nivelNicross] || recomendaciones.N2_principiante;
    const mesociclo = recomendacion[objetivo] || recomendacion.default;

    return {
        mesociclo,
        razon: recomendacion.notas,
        nivelRecomendado: nivelNicross,
        objetivoAlineado: objetivo
    };
}
