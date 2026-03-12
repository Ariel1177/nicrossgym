/**
 * GENERADOR DE SESIONES CON CARGAS COMPLETAS
 * Integra:
 * - Bloques de entrenamiento
 * - Ejercicios seleccionados
 * - Cargas calculadas
 * - Series y repeticiones
 * - Tempo y descansos
 * 
 * Respeta CONTEXTO_NICROSS.md en su estructura
 */

import { obtenerParametrosBloque } from './parametrosPorBloque.js';
import { calcularCargasBloque } from './calculadoraCarga.js';

/**
 * ESTRUCTURA OBLIGATORIA DE SESIÓN NICROSS
 * Basada en CONTEXTO_NICROSS.md
 */
const estructuraSesionNICROSS = {
    activacion_especifica: {
        duracion_minutos: { min: 8, max: 10 },
        proposito: "Preparación técnica sin fatiga",
        incluye: [
            "movilidad_articular",
            "activacion_muscular_especifica",
            "activacion_core",
            "preparacion_tecnica_patron"
        ]
    },

    bloque_principal: {
        duracion_minutos: { min: 30, max: 35 },
        proposito: "Estímulo principal del día",
        caracteristicas: ["mayor_intensidad", "mayor_demanda_neuromuscular"]
    },

    bloque_complementario: {
        duracion_minutos: { min: 15, max: 20 },
        proposito: "Refuerzo del trabajo principal",
        incluye: ["accesorios", "ejercicios_unilaterales", "coestabilizadores"]
    },

    bloque_metabolico: {
        duracion_minutos: { min: 5, max: 10 },
        proposito: "Opcional - trabajo de capacidad",
        incluye: ["intervalos", "circuitos_cortos", "trabajo_intermitente"],
        opcional: true
    },

    trabajo_core: {
        duracion_minutos: { min: 5, max: 8 },
        proposito: "Estabilidad y control",
        opcional: true
    }
};

/**
 * GENERAR SESIÓN COMPLETA
 * Integra datos de usuario, bloques, ejercicios y calcula cargas
 */
export function generarSesionCompleta(
    usuario,
    numeroSesion,
    focoDia,
    bloquesPlanificados,
    ejerciciosPlanificados,
    nivelNicross,
    numeroSemana = 1
) {

    if (!usuario.fuerzaMaxima) {
        console.warn(`Usuario ${usuario.id} sin datos de 1RM. Se usarán cargas genéricas.`);
    }

    const sesion = {
        // METADATOS
        id: `sesion_${usuario.id}_semana${numeroSemana}_dia${numeroSesion}`,
        usuario_id: usuario.id,
        usuario_nombre: usuario.nombre,
        numero_sesion: numeroSesion,
        foco_dia: focoDia,
        numero_semana: numeroSemana,
        nivel_nicross: nivelNicross,
        objetivo_usuario: usuario.objetivo,

        // ESTRUCTURA SESIÓN
        bloques: [],

        // RESUMEN
        duracion_estimada_minutos: 0,
        total_series: 0,
        total_ejercicios: 0,
        notas_seguridad: [],

        // VALIDACIÓN
        validaciones: []
    };

    // PROCESAR CADA BLOQUE
    bloquesPlanificados.forEach((tipoBloque, indiceBloque) => {
        const parametrosBloque = obtenerParametrosBloque(nivelNicross, tipoBloque);

        if (!parametrosBloque) {
            console.warn(`No hay parámetros para bloque ${tipoBloque} en nivel ${nivelNicross}`);
            return;
        }

        // Obtener ejercicios para este bloque
        const ejerciciosBloque = ejerciciosPlanificados.filter(e => e.tipoBloque === tipoBloque);

        // CONSTRUIR BLOQUE
        const bloque = {
            tipo: tipoBloque,
            indice: indiceBloque + 1,
            indice_total: indiceBloque,
            orden: obtenerOrdenBloqueEnSesion(tipoBloque),
            duracion_estimada: calcularDuracionBloque(ejerciciosBloque, parametrosBloque),
            parametros: parametrosBloque,
            ejercicios: []
        };

        // PROCESAR EJERCICIOS DEL BLOQUE
        ejerciciosBloque.forEach((ejercicio, indiceEjercicio) => {
            const ejercicioConCargas = generarEjercicioConCargas(
                ejercicio,
                usuario,
                nivelNicross,
                parametrosBloque,
                numeroSemana,
                indiceEjercicio + 1
            );

            bloque.ejercicios.push(ejercicioConCargas);
        });

        sesion.bloques.push(bloque);
        sesion.total_series += bloque.ejercicios.reduce((sum, e) => sum + e.series, 0);
        sesion.total_ejercicios += bloque.ejercicios.length;
    });

    // CALCULAR DURACIONES Y VALIDAR
    sesion.duracion_estimada_minutos = calcularDuracionTotalSesion(sesion);
    sesion.validaciones = validarSesionNICROSS(sesion);

    return sesion;
}

/**
 * GENERAR EJERCICIO CON CARGAS COMPLETAS
 */
function generarEjercicioConCargas(
    ejercicio,
    usuario,
    nivelNicross,
    parametrosBloque,
    numeroSemana,
    nroEjercicioEnBloque
) {

    const parametrosPatron = parametrosBloque; // Ya está filtrado por tipo bloque

    // Calcular cargas (solo si usuario tiene 1RM)
    let cargas = {};
    if (usuario.fuerzaMaxima && usuario.fuerzaMaxima[ejercicio.patron]) {
        cargas = calcularCargasBloque(
            usuario,
            nivelNicross,
            ejercicio.patron,
            parametrosBloque,
            numeroSemana
        );
    }

    return {
        numero_ejercicio: nroEjercicioEnBloque,
        nombre: ejercicio.nombre,
        patron_movimiento: ejercicio.patron,
        tipo_bloque: ejercicio.tipoBloque,
        musculos_primarios: ejercicio.musculos_primarios || [],
        musculos_secundarios: ejercicio.musculos_secundarios || [],

        // PARÁMETROS DE TRABAJO
        series: parametrosPatron.series,
        repeticiones: {
            minimo: parametrosPatron.repeticiones.min,
            maximo: parametrosPatron.repeticiones.max,
            recomendado: Math.round((parametrosPatron.repeticiones.min + parametrosPatron.repeticiones.max) / 2)
        },

        // CARGAS
        carga_kg: {
            minima: cargas.cargaMinima_kg || "A determinar",
            recomendada: cargas.cargaRecomendada_kg || "A determinar",
            maxima: cargas.cargaMaxima_kg || "A determinar"
        },

        porcentaje_1RM: {
            minimo: parametrosPatron.porcentaje1RM.min,
            maximo: parametrosPatron.porcentaje1RM.max
        },

        // TEMPO (velocidad de movimiento)
        tempo: {
            excentric: parametrosPatron.tempo.excentric,
            pause: parametrosPatron.tempo.pause,
            concentric: parametrosPatron.tempo.concentric,
            tiempo_total_seg: (parametrosPatron.tempo.excentric + parametrosPatron.tempo.pause + parametrosPatron.tempo.concentric)
        },

        // DESCANSO
        descanso_entre_series_seg: {
            minimo: parametrosPatron.descanso_segundos.min,
            maximo: parametrosPatron.descanso_segundos.max,
            recomendado: Math.round((parametrosPatron.descanso_segundos.min + parametrosPatron.descanso_segundos.max) / 2)
        },

        // CÁLCULOS DERIVADOS
        tiempo_total_ejercicio: calcularTiempoEjercicio(
            parametrosPatron.series,
            parametrosPatron.repeticiones.max,
            parametrosPatron.tempo.excentric + parametrosPatron.tempo.pause + parametrosPatron.tempo.concentric,
            parametrosPatron.descanso_segundos.max
        ),

        // VALIDACIÓN
        rpe_esperado: parametrosPatron.rpe || "A evaluar",
        equipamiento_requerido: ejercicio.equipamiento || [],

        // NOTAS
        notas: parametrosPatron.notas || ""
    };
}

/**
 * CALCULAR DURACIÓN TOTAL DEL EJERCICIO
 */
function calcularTiempoEjercicio(series, reps, tempoTotal, descansoPromedio) {
    // Tiempo = (series × reps × tempo) + (descansos entre series)
    const tiempoMovimiento = series * reps * (tempoTotal / 60);
    const tiempoDescanso = (series - 1) * (descansoPromedio / 60);

    return Math.round(tiempoMovimiento + tiempoDescanso);
}

/**
 * CALCULAR DURACIÓN DEL BLOQUE
 */
function calcularDuracionBloque(ejercicios, parametrosBloque) {
    let duracion = 0;

    ejercicios.forEach(ejercicio => {
        const tiempoEjercicio = calcularTiempoEjercicio(
            parametrosBloque.series,
            parametrosBloque.repeticiones.max,
            parametrosBloque.tempo.excentric + parametrosBloque.tempo.pause + parametrosBloque.tempo.concentric,
            parametrosBloque.descanso_segundos.max
        );

        duracion += tiempoEjercicio;
    });

    return Math.round(duracion);
}

/**
 * CALCULAR DURACIÓN TOTAL DE LA SESIÓN
 */
function calcularDuracionTotalSesion(sesion) {
    let duracion = 0;

    sesion.bloques.forEach(bloque => {
        duracion += bloque.duracion_estimada;
    });

    // Agregar transiciones entre bloques (1 min por bloque)
    duracion += (sesion.bloques.length - 1);

    return duracion;
}

/**
 * OBTENER ORDEN DEL BLOQUE EN LA SESIÓN
 */
function obtenerOrdenBloqueEnSesion(tipoBloque) {
    const orden = {
        activacion_general: 1,
        activacion_especifica: 1,
        activacion_cadera: 1,
        fuerza_basica: 2,
        fuerza: 2,
        fuerza_compuesto: 2,
        fuerza_principal: 2,
        fuerza_secundaria: 3,
        hipertrofia: 3,
        hipertrofia_volumen: 3,
        hipertrofia_alta: 3,
        accesorios: 4,
        accesorios_ligeros: 4,
        accesorios_gluteos: 4,
        accesorios_especificos: 4,
        core: 5,
        core_avanzado: 5,
        cardio_suave: 6,
        metabolico: 6
    };

    return orden[tipoBloque] || 99;
}

/**
 * VALIDAR SESIÓN SEGÚN REGLAS NICROSS
 */
function validarSesionNICROSS(sesion) {
    const validaciones = {
        errors: [],
        warnings: [],
        success: []
    };

    // 1. VALIDAR: Siempre debe existir trabajo de fuerza
    const tieneTrabajoFuerza = sesion.bloques.some(b =>
        b.tipo.includes('fuerza') || b.tipo === 'fuerza_compuesto' || b.tipo === 'fuerza_principal'
    );

    if (!tieneTrabajoFuerza) {
        validaciones.errors.push("❌ FALTA: Debe existir trabajo de fuerza obligatoriamente");
    } else {
        validaciones.success.push("✅ VALIDADO: Sesión contiene trabajo de fuerza");
    }

    // 2. VALIDAR: No solo cardio o circuitos metabólicos
    const soloMetabolico = sesion.bloques.length === 1 && sesion.bloques[0].tipo === 'metabolico';
    if (soloMetabolico) {
        validaciones.errors.push("❌ FALTA: No puede ser una sesión solo de cardio/metabólico");
    }

    // 3. VALIDAR: Un solo foco principal (máximo 2 bloques de trabajo principal)
    const bloquesAltos = sesion.bloques.filter(b => ['fuerza_principal', 'fuerza', 'fuerza_compuesto'].includes(b.tipo));
    if (bloquesAltos.length > 1) {
        validaciones.warnings.push("⚠️ ADVERTENCIA: Más de un bloque de fuerza principal - validar densidad neural");
    }

    // 4. VALIDAR: Máximo 8 ejercicios por sesión
    if (sesion.total_ejercicios > 8) {
        validaciones.warnings.push(`⚠️ ADVERTENCIA: ${sesion.total_ejercicios} ejercicios (máximo recomendado: 8)`);
    } else {
        validaciones.success.push(`✅ VALIDADO: ${sesion.total_ejercicios} ejercicios (dentro de límite)`);
    }

    // 5. VALIDAR: Series máximo 20-22
    if (sesion.total_series > 22) {
        validaciones.warnings.push(`⚠️ ADVERTENCIA: ${sesion.total_series} series totales (máximo: 22)`);
    } else {
        validaciones.success.push(`✅ VALIDADO: ${sesion.total_series} series (dentro de límite)`);
    }

    // 6. VALIDAR: Duración 60-65 minutos
    if (sesion.duracion_estimada_minutos < 50 || sesion.duracion_estimada_minutos > 75) {
        validaciones.warnings.push(`⚠️ ADVERTENCIA: Duración ${sesion.duracion_estimada_minutos} min (recomendado: 60-65)`);
    } else {
        validaciones.success.push(`✅ VALIDADO: Duración ${sesion.duracion_estimada_minutos} min`);
    }

    return validaciones;
}

/**
 * FORMATEAR SESIÓN PARA PRESENTACIÓN
 */
export function formatearSesionParaPresentacion(sesion) {
    let salida = "";

    salida += `\n${'='.repeat(80)}\n`;
    salida += `SESIÓN DE ENTRENAMIENTO - ${sesion.usuario_nombre}\n`;
    salida += `${'='.repeat(80)}\n`;
    salida += `Semana ${sesion.numero_semana} • Sesión ${sesion.numero_sesion}\n`;
    salida += `Nivel: ${sesion.nivel_nicross} • Objetivo: ${sesion.objetivo_usuario}\n`;
    salida += `Duración: ~${sesion.duracion_estimada_minutos} minutos\n\n`;

    // MOSTRAR BLOQUES
    sesion.bloques.forEach(bloque => {
        salida += `\n📌 BLOQUE ${bloque.indice}: ${bloque.tipo.toUpperCase()}\n`;
        salida += `${'-'.repeat(80)}\n`;
        salida += `Duración: ~${bloque.duracion_estimada} minutos\n\n`;

        // MOSTRAR EJERCICIOS
        bloque.ejercicios.forEach(ej => {
            salida += `   ${ej.numero_ejercicio}. ${ej.nombre}\n`;
            salida += `      Patron: ${ej.patron_movimiento}\n`;
            salida += `      ${ej.series} × ${ej.repeticiones.minimo}-${ej.repeticiones.maximo} reps\n`;
            salida += `      Carga: ${ej.carga_kg.minima}-${ej.carga_kg.maxima} kg (recomendado: ${ej.carga_kg.recomendada} kg)\n`;
            salida += `      Tempo: ${ej.tempo.excentric}-${ej.tempo.pause}-${ej.tempo.concentric}\n`;
            salida += `      Descanso: ${ej.descanso_entre_series_seg.minimo}-${ej.descanso_entre_series_seg.maximo} seg\n`;
            salida += `      Músculos: ${(ej.musculos_primarios || []).join(", ")}\n\n`;
        });
    });

    // MOSTRAR VALIDACIONES
    salida += `\n${'-'.repeat(80)}\n`;
    salida += `VALIDACIÓN NICROSS:\n`;
    sesion.validaciones.success.forEach(v => salida += `${v}\n`);
    sesion.validaciones.warnings.forEach(v => salida += `${v}\n`);
    if (sesion.validaciones.errors.length > 0) {
        salida += `\nERRORES:\n`;
        sesion.validaciones.errors.forEach(v => salida += `${v}\n`);
    }

    salida += `\n${'='.repeat(80)}\n`;

    return salida;
}

/**
 * GENERAR SEMANA COMPLETA DE SESIONES
 */
export function generarSemanaCompleta(
    usuario,
    nivelNicross,
    splitSemanal,
    bloquesPorDia,
    ejerciciosPorDia,
    numeroSemana = 1
) {

    const semana = {
        numero_semana: numeroSemana,
        usuario_id: usuario.id,
        usuario_nombre: usuario.nombre,
        nivel_nicross: nivelNicross,
        dias_entrenamiento: splitSemanal.dias.length,
        sesiones: []
    };

    // GENERAR SESIÓN POR DÍA
    splitSemanal.dias.forEach((dia, indice) => {
        const sesion = generarSesionCompleta(
            usuario,
            indice + 1,
            dia.foco,
            bloquesPorDia[dia.foco] || [],
            ejerciciosPorDia[dia.foco] || [],
            nivelNicross,
            numeroSemana
        );

        semana.sesiones.push(sesion);
    });

    return semana;
}
