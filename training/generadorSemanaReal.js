/**
 * GENERADOR DE SEMANA COMPLETA - REAL Y PRÁCTICA
 * 
 * Genera 1 semana de entrenamiento (5 días) con:
 * - Ejercicio específico
 * - Series exactas
 * - Repeticiones exactas
 * - Kilos a utilizar (% de 1RM calculado)
 * - Descansos
 * - Tempo
 * - Validación NICROSS
 * 
 * Basado en: usuario 1RM, nivel, objetivo, split, parámetros bloques
 */

import { parametrosPorBloque } from './parametrosPorBloque.js';
import { ejercicios } from '../data/ejercicios.js';
import { bloques } from './bloques.js';

/**
 * EJERCICIOS RECOMENDADOS POR PATRÓN DE MOVIMIENTO
 * Selección de ejercicios más efectivos según nivel y objetivo
 */
export const ejerciciosPorPatron = {
    // TREN SUPERIOR
    empuje_horizontal: {
        compuesto: [
            { nombre: "Press Banca", patron: "empuje_horizontal", seria: true, reps_ideales: [6, 12], nivelMin: 2 },
            { nombre: "Press Dumbbell", patron: "empuje_horizontal", seria: true, reps_ideales: [8, 12], nivelMin: 2 }
        ],
        accesorio: [
            { nombre: "Flexiones", patron: "empuje_horizontal", seria: false, reps_ideales: [8, 15], nivelMin: 1 }
        ]
    },

    traccion_horizontal: {
        compuesto: [
            { nombre: "Remo Barra", patron: "traccion_horizontal", seria: true, reps_ideales: [6, 12], nivelMin: 2 },
            { nombre: "Remo Dumbbell", patron: "traccion_horizontal", seria: true, reps_ideales: [8, 12], nivelMin: 2 }
        ],
        accesorio: [
            { nombre: "Remada Polea", patron: "traccion_horizontal", seria: false, reps_ideales: [10, 15], nivelMin: 1 }
        ]
    },

    empuje_vertical: {
        compuesto: [
            { nombre: "Press Hombro", patron: "empuje_vertical", seria: true, reps_ideales: [6, 12], nivelMin: 2 },
            { nombre: "Press Militar", patron: "empuje_vertical", seria: true, reps_ideales: [6, 10], nivelMin: 2 }
        ],
        accesorio: [
            { nombre: "Press Máquina Hombro", patron: "empuje_vertical", seria: false, reps_ideales: [10, 15], nivelMin: 1 }
        ]
    },

    traccion_vertical: {
        compuesto: [
            { nombre: "Dominadas", patron: "traccion_vertical", seria: true, reps_ideales: [5, 12], nivelMin: 2 },
            { nombre: "Lat Pulldown", patron: "traccion_vertical", seria: true, reps_ideales: [8, 12], nivelMin: 1 }
        ],
        accesorio: [
            { nombre: "Pull-over", patron: "traccion_vertical", seria: false, reps_ideales: [10, 15], nivelMin: 1 }
        ]
    },

    // TREN INFERIOR
    cuadriceps: {
        compuesto: [
            { nombre: "Sentadilla Back Squat", patron: "cuadriceps", seria: true, reps_ideales: [6, 12], nivelMin: 2 },
            { nombre: "Sentadilla Front Squat", patron: "cuadriceps", seria: true, reps_ideales: [6, 10], nivelMin: 2 }
        ],
        accesorio: [
            { nombre: "Leg Press", patron: "cuadriceps", seria: true, reps_ideales: [8, 15], nivelMin: 1 },
            { nombre: "Hack Squat", patron: "cuadriceps", seria: false, reps_ideales: [10, 15], nivelMin: 1 }
        ]
    },

    cadena_posterior: {
        compuesto: [
            { nombre: "Peso Muerto", patron: "cadena_posterior", seria: true, reps_ideales: [3, 8], nivelMin: 2 },
            { nombre: "Peso Muerto Rumano", patron: "cadena_posterior", seria: true, reps_ideales: [6, 10], nivelMin: 2 }
        ],
        accesorio: [
            { nombre: "Hiperextensión", patron: "cadena_posterior", seria: false, reps_ideales: [10, 15], nivelMin: 1 }
        ]
    },

    gluteos: {
        compuesto: [
            { nombre: "Hip Thrust", patron: "gluteos", seria: true, reps_ideales: [8, 15], nivelMin: 2 },
            { nombre: "Sentadilla Búlgara", patron: "gluteos", seria: true, reps_ideales: [8, 12], nivelMin: 2 }
        ],
        accesorio: [
            { nombre: "Elevación de Cadera", patron: "gluteos", seria: false, reps_ideales: [12, 20], nivelMin: 1 }
        ]
    },

    // CORE
    flexion_trunk: {
        accesorio: [
            { nombre: "Crunch", patron: "flexion_trunk", seria: false, reps_ideales: [12, 20], nivelMin: 1 },
            { nombre: "Cable Crunch", patron: "flexion_trunk", seria: false, reps_ideales: [10, 15], nivelMin: 1 }
        ]
    },

    extension_trunk: {
        accesorio: [
            { nombre: "Hiperextensión Banco", patron: "extension_trunk", seria: false, reps_ideales: [12, 15], nivelMin: 1 }
        ]
    },

    rotacion_trunk: {
        accesorio: [
            { nombre: "Rotación Cable", patron: "rotacion_trunk", seria: false, reps_ideales: [12, 15], nivelMin: 1 }
        ]
    }
};

/**
 * MAPEO: BLOQUE → PATRÓN DE MOVIMIENTO
 */
export const bloqueAPatron = {
    // Activación
    activacion: { patrones: ["movilidad"], tipo: "dinamica" },
    activacion_especifica: { patrones: ["movilidad"], tipo: "dinamica" },

    // Fuerza
    fuerza: { patrones: ["compuesto"], tipo: "fuerza" },
    fuerza_compuesto: { patrones: ["compuesto"], tipo: "fuerza" },
    fuerza_principal: { patrones: ["compuesto"], tipo: "fuerza" },
    fuerza_secundaria: { patrones: ["compuesto"], tipo: "fuerza" },

    // Hipertrofia
    hipertrofia: { patrones: ["compuesto", "accesorio"], tipo: "volumen" },
    hipertrofia_volumen: { patrones: ["compuesto", "accesorio"], tipo: "volumen" },
    hipertrofia_alta: { patrones: ["compuesto", "accesorio"], tipo: "volumen" },

    // Accesorios
    accesorios: { patrones: ["accesorio"], tipo: "accesorio" },
    accesorios_ligeros: { patrones: ["accesorio"], tipo: "accesorio" },
    accesorios_especificos: { patrones: ["accesorio"], tipo: "accesorio" },

    // Core
    core: { patrones: ["flexion_trunk", "extension_trunk", "rotacion_trunk"], tipo: "core" },
    core_avanzado: { patrones: ["flexion_trunk", "extension_trunk", "rotacion_trunk"], tipo: "core" }
};

/**
 * SELECCIONAR EJERCICIO ÓPTIMO POR BLOQUE
 * Mapea bloques y foco del día a ejercicios específicos
 */
function seleccionarEjercicio(bloque, focoDia, nivelNumerico, esCompuesto = true) {

    // Ejercicios disponibles por patrón de movimiento
    const ejerciciosDisponibles = {
        empuje_horizontal: {
            compuesto: [
                { nombre: "Press Banca", kit: true, reps: [6, 8], patron: "empuje_horizontal" },
                { nombre: "Press Dumbbell", kit: true, reps: [8, 12], patron: "empuje_horizontal" }
            ],
            accesorio: [
                { nombre: "Flexiones", kit: false, reps: [10, 15], patron: "empuje_horizontal" },
                { nombre: "Aperturas Pecho", kit: true, reps: [12, 15], patron: "empuje_horizontal" }
            ]
        },
        traccion_horizontal: {
            compuesto: [
                { nombre: "Remo Barra", kit: true, reps: [6, 8], patron: "traccion_horizontal" },
                { nombre: "Remo Dumbbell", kit: true, reps: [8, 12], patron: "traccion_horizontal" }
            ],
            accesorio: [
                { nombre: "Remada Polea", kit: false, reps: [10, 15], patron: "traccion_horizontal" },
                { nombre: "Remo Máquina", kit: true, reps: [12, 15], patron: "traccion_horizontal" }
            ]
        },
        empuje_vertical: {
            compuesto: [
                { nombre: "Press Hombro", kit: true, reps: [6, 8], patron: "empuje_vertical" },
                { nombre: "Press Militar", kit: true, reps: [6, 10], patron: "empuje_vertical" }
            ],
            accesorio: [
                { nombre: "Elevación Lateral", kit: true, reps: [12, 15], patron: "empuje_vertical" },
                { nombre: "Press Máquina", kit: true, reps: [10, 15], patron: "empuje_vertical" }
            ]
        },
        traccion_vertical: {
            compuesto: [
                { nombre: "Dominadas", kit: false, reps: [5, 12], patron: "traccion_vertical" },
                { nombre: "Lat Pulldown", kit: true, reps: [8, 12], patron: "traccion_vertical" }
            ],
            accesorio: [
                { nombre: "Pull-over", kit: true, reps: [10, 15], patron: "traccion_vertical" },
                { nombre: "Jalón Polea", kit: true, reps: [12, 15], patron: "traccion_vertical" }
            ]
        },
        cuadriceps: {
            compuesto: [
                { nombre: "Sentadilla Back Squat", kit: true, reps: [6, 10], patron: "cuadriceps" },
                { nombre: "Sentadilla Front Squat", kit: true, reps: [6, 10], patron: "cuadriceps" }
            ],
            accesorio: [
                { nombre: "Leg Press", kit: true, reps: [10, 15], patron: "cuadriceps" },
                { nombre: "Hack Squat", kit: true, reps: [10, 15], patron: "cuadriceps" }
            ]
        },
        cadena_posterior: {
            compuesto: [
                { nombre: "Peso Muerto", kit: true, reps: [5, 8], patron: "cadena_posterior" },
                { nombre: "Peso Muerto Rumano", kit: true, reps: [6, 10], patron: "cadena_posterior" }
            ],
            accesorio: [
                { nombre: "Hiperextensión", kit: false, reps: [10, 15], patron: "cadena_posterior" },
                { nombre: "Curl Pierna", kit: true, reps: [12, 15], patron: "cadena_posterior" }
            ]
        },
        gluteos: {
            compuesto: [
                { nombre: "Hip Thrust", kit: true, reps: [8, 15], patron: "gluteos" },
                { nombre: "Sentadilla Búlgara", kit: true, reps: [8, 12], patron: "gluteos" }
            ],
            accesorio: [
                { nombre: "Elevación Cadera", kit: false, reps: [12, 20], patron: "gluteos" },
                { nombre: "Abducción Cadera", kit: true, reps: [15, 20], patron: "gluteos" }
            ]
        },
        flexion_trunk: {
            accesorio: [
                { nombre: "Crunch Máquina", kit: true, reps: [12, 20], patron: "flexion_trunk" },
                { nombre: "Cable Crunch", kit: true, reps: [12, 15], patron: "flexion_trunk" }
            ]
        },
        extension_trunk: {
            accesorio: [
                { nombre: "Hiperextensión Banco", kit: false, reps: [12, 15], patron: "extension_trunk" },
                { nombre: "Back Extension Máquina", kit: true, reps: [12, 15], patron: "extension_trunk" }
            ]
        },
        rotacion_trunk: {
            accesorio: [
                { nombre: "Rotación Cable", kit: true, reps: [12, 15], patron: "rotacion_trunk" },
                { nombre: "Giro de Tronco", kit: false, reps: [15, 20], patron: "rotacion_trunk" }
            ]
        }
    };

    // Mapear foco del día a patrones de movimiento
    const patronesPorFoco = {
        "tren_superior": esCompuesto
            ? ["empuje_horizontal", "traccion_horizontal"]
            : ["empuje_vertical", "traccion_vertical"],
        "tren_inferior": esCompuesto
            ? ["cuadriceps", "cadena_posterior"]
            : ["gluteos"],
        "cuerpo_completo": ["empuje_horizontal", "cuadriceps", "cadena_posterior"],
        "pierna": ["cuadriceps", "cadena_posterior"],
        "empuje": ["empuje_horizontal", "empuje_vertical"],
        "tiron": ["traccion_horizontal", "traccion_vertical"],
    };

    // Core siempre va a core
    if (bloque && bloque.includes("core")) {
        const opciones = [
            ejerciciosDisponibles.flexion_trunk.accesorio,
            ejerciciosDisponibles.extension_trunk.accesorio,
            ejerciciosDisponibles.rotacion_trunk.accesorio
        ];
        const lista = opciones[Math.floor(Math.random() * opciones.length)];
        return lista[Math.floor(Math.random() * lista.length)];
    }

    // Activación
    if (bloque && bloque.includes("activacion")) {
        const patrones = patronesPorFoco[focoDia] || ["empuje_horizontal"];
        const patron = patrones[0];
        const lista = ejerciciosDisponibles[patron]?.accesorio || [];
        return lista.length > 0 ? lista[0] : { nombre: "Calentamiento", kit: false, reps: [15, 20], patron };
    }

    // Obtener patrones basados en el foco del día
    const patrones = patronesPorFoco[focoDia] || ["empuje_horizontal"];

    // Seleccionar patrón según si es compuesto o accesorio
    const patronSeleccionado = patrones[Math.floor(Math.random() * patrones.length)];

    // Obtener lista de ejercicios
    const tipo = esCompuesto ? "compuesto" : "accesorio";
    const listaEjercicios = ejerciciosDisponibles[patronSeleccionado]?.[tipo] || [];

    // Retornar ejercicio aleatorio o default
    if (listaEjercicios.length > 0) {
        return listaEjercicios[Math.floor(Math.random() * listaEjercicios.length)];
    }

    // Fallback por si no encuentra nada
    return {
        nombre: esCompuesto ? "Ejercicio Principal" : "Ejercicio Accesorio",
        kit: true,
        reps: [8, 12],
        patron: patronSeleccionado
    };
}

/**
 * GENERAR SESIÓN DIARIA COMPLETA
 */
function generarSesionDia(
    usuario,
    numeroDia,
    focoDia,
    bloquesDia,
    nivelNicross,
    parametrosPorBloqueData
) {

    const nivelNum = parseInt(nivelNicross.split('_')[0].substring(1));

    const sesion = {
        numero_dia: numeroDia,
        foco: focoDia,
        bloques: [],
        total_series: 0,
        duracion_estimada_min: 0,
        validaciones: []
    };

    // PROCESAR CADA BLOQUE DEL DÍA
    bloquesDia.forEach((tipoBloque, indice) => {
        const paramsBloque = parametrosPorBloqueData[nivelNicross]?.[tipoBloque];

        if (!paramsBloque) return;

        const bloque = {
            tipo: tipoBloque,
            indice: indice + 1,
            ejercicios: []
        };

        // Seleccionar ejercicios según tipo de bloque
        let ejerciciosBloque = [];

        if (tipoBloque.includes("fuerza")) {
            ejerciciosBloque = [seleccionarEjercicio(tipoBloque, focoDia, nivelNum, true)];
        } else if (tipoBloque.includes("hipertrofia")) {
            ejerciciosBloque = [
                seleccionarEjercicio(tipoBloque, focoDia, nivelNum, true),
                seleccionarEjercicio(tipoBloque, focoDia, nivelNum, false)
            ];
        } else if (tipoBloque.includes("accesorio") || tipoBloque.includes("core")) {
            ejerciciosBloque = [seleccionarEjercicio(tipoBloque, focoDia, nivelNum, false)];
        }

        // GENERAR EJERCICIO CON CARGAS
        ejerciciosBloque.forEach((ej, i) => {
            if (!ej) return;

            // Calcular carga si es con pesos
            let carga_kg = null;
            if (ej.kit && usuario.fuerzaMaxima) {
                const unRM = usuario.fuerzaMaxima[ej.patron] || 100; // Default fallback
                const porcentajeMin = paramsBloque.porcentaje1RM.min;
                const porcentajeMax = paramsBloque.porcentaje1RM.max;
                const porcentajePromedio = (porcentajeMin + porcentajeMax) / 2;

                carga_kg = Math.round((unRM * porcentajePromedio) / 100 / 2.5) * 2.5; // Redondear a 2.5kg
            }

            // VALOR EXACTO: calcular punto medio del rango de repeticiones
            const repExacta = Math.round((ej.reps[0] + ej.reps[1]) / 2);

            bloque.ejercicios.push({
                numero: i + 1,
                nombre: ej.nombre,
                patron: ej.patron,
                series: paramsBloque.series,
                repeticiones_min: repExacta,  // Valor exacto (no rango)
                repeticiones_max: repExacta,  // Igual a min para evitar ambigüedad
                carga_kg: carga_kg,
                rpe_estimado: 7 + Math.floor(nivelNum),
                descanso_seg: paramsBloque.descanso_segundos,
                tempo: paramsBloque.tempo,
                notas: paramsBloque.notas
            });
        });

        sesion.bloques.push(bloque);
        sesion.total_series += bloque.ejercicios.reduce((sum, e) => sum + e.series, 0);
    });

    return sesion;
}

/**
 * GENERAR SEMANA COMPLETA
 */
export function generarSemanaCompleta(usuario, nivelNicross, splitSemanal, parametrosPorBloqueData) {

    const semana = {
        usuario_id: usuario.id,
        usuario_nombre: usuario.nombre,
        nivel_nicross: nivelNicross,
        objetivo: usuario.objetivo,
        dias: [],
        validaciones: [],
        resumen: {}
    };

    // Generar cada día
    splitSemanal.dias.forEach((dia, i) => {
        const bloquesDia = bloques[nivelNicross]?.[dia.foco] || [];

        const sesion = generarSesionDia(
            usuario,
            dia.dia,
            dia.foco,
            bloquesDia,
            nivelNicross,
            parametrosPorBloqueData
        );

        semana.dias.push(sesion);
    });

    // Calcular resumen
    semana.resumen = {
        total_dias: semana.dias.length,
        total_series_semana: semana.dias.reduce((sum, d) => sum + d.total_series, 0),
        series_promedio_por_dia: Math.round(semana.dias.reduce((sum, d) => sum + d.total_series, 0) / semana.dias.length)
    };

    return semana;
}

/**
 * FORMATEAR Y MOSTRAR SEMANA EN CONSOLA
 */
export function mostrarSemanaEnConsola(semana) {

    console.log("%c╔════════════════════════════════════════════════════════════════════════╗", "color: #00ff00;");
    console.log(`%c║  📅 SEMANA DE ENTRENAMIENTO - ${semana.usuario_nombre.toUpperCase().padEnd(48)}  ║`, "color: #00ff00;");
    console.log("%c╚════════════════════════════════════════════════════════════════════════╝", "color: #00ff00;");

    console.log(`%c📊 Nivel: %c${semana.nivel_nicross} | Objetivo: %c${semana.objetivo}`, "color: #ffff00;", "color: #00ff88;", "color: #00ff88;");
    console.log(`%c📈 Series Totales: %c${semana.resumen.total_series_semana} | Promedio: %c${semana.resumen.series_promedio_por_dia} series/día\n`, "color: #ffff00;", "color: #00ff88;", "color: #00ff88;");

    // MOSTRAR CADA DÍA
    semana.dias.forEach(dia => {
        console.log(`%c━━━ DÍA ${dia.numero_dia}: ${dia.foco.toUpperCase().replace(/_/g, " ")} ━━━`, "color: #00ffff; font-weight: bold;");
        console.log(`%cTotal series: %c${dia.total_series}`, "color: #aaa;", "color: #00ff88;");

        dia.bloques.forEach(bloque => {
            console.log(`%c  📌 BLOQUE: %c${bloque.tipo.toUpperCase()}`, "color: #ffff00;", "color: #88ccff;");

            bloque.ejercicios.forEach(ej => {
                const cargaTexto = ej.carga_kg ? `%c@ ${ej.carga_kg}kg` : "%c(Sin carga)";
                const repTexto = `${ej.repeticiones_min}-${ej.repeticiones_max} reps`;

                console.log(`%c    ${ej.numero}. ${ej.nombre}`, "color: #ffffff;");
                console.log(`%c       Series: %c${ej.series} × %c${repTexto} %c${cargaTexto}`, "color: #aaa;", "color: #ff9900;", "color: #ff9900;", "color: #00ff88;");
                console.log(`%c       Descanso: %c${ej.descanso_seg.min}-${ej.descanso_seg.max}s | Tempo: %c${ej.tempo.excentric}-${ej.tempo.pause}-${ej.tempo.concentric}`, "color: #aaa;", "color: #88ccff;", "color: #88ccff;");
            });
        });

        console.log("");
    });

    console.log("%c╚════════════════════════════════════════════════════════════════════════╝\n", "color: #00ff00;");
}
