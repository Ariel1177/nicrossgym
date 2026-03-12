/**
 * CALCULADORA DE CARGAS
 * Convierte 1RM (fuerza máxima) en cargas específicas para cada bloque
 * Incluye funciones para estimar 1RM y calcular cargas de trabajo
 */

/**
 * Estima 1RM usando fórmula de Brzycki
 * Recomendado cuando no se conoce el 1RM real
 * Fórmula: 1RM = peso / (1.0278 - 0.0278 × repeticiones)
 * Precisión: ±2-5% (depende del rango de reps usado)
 */
export function estimarUnRM(peso_kg, repeticiones_realizadas) {
    if (repeticiones_realizadas < 1 || repeticiones_realizadas > 10) {
        console.warn("Brzycki es más preciso entre 1-10 repeticiones");
    }

    const unRM = peso_kg / (1.0278 - (0.0278 * repeticiones_realizadas));
    return Math.round(unRM * 100) / 100; // Redondear a 2 decimales
}

/**
 * Calcula carga de trabajo basada en porcentaje de 1RM
 * @param {number} unRM - Fuerza máxima en kg
 * @param {number} porcentaje - Porcentaje deseado (40-95)
 * @param {number} incremento - Incremento en kg (default: 2.5 para presición)
 * @returns {number} Carga redondeada
 */
export function calcularCargaDesde1RM(unRM, porcentaje, incremento = 2.5) {
    if (porcentaje < 40 || porcentaje > 100) {
        console.warn(`Porcentaje fuera de rango recomendado: ${porcentaje}%`);
    }

    const cargaExacta = (unRM * porcentaje) / 100;

    // Redondear al incremento más cercano
    const cargaRedondeada = Math.round(cargaExacta / incremento) * incremento;

    return cargaRedondeada;
}

/**
 * Calcula rango de cargas para un bloque
 * @param {number} unRM - Fuerza máxima
 * @param {object} rangoPorcentaje - {min, max}
 * @returns {object} {minimo_kg, maximo_kg, recomendado_kg}
 */
export function calcularRangoCarga(unRM, rangoPorcentaje, incremento = 2.5) {
    const minimo = calcularCargaDesde1RM(unRM, rangoPorcentaje.min, incremento);
    const maximo = calcularCargaDesde1RM(unRM, rangoPorcentaje.max, incremento);
    const recomendado = calcularCargaDesde1RM(
        unRM,
        (rangoPorcentaje.min + rangoPorcentaje.max) / 2,
        incremento
    );

    return {
        minimo_kg: minimo,
        maximo_kg: maximo,
        recomendado_kg: recomendado,
        rango: `${minimo} - ${maximo} kg`
    };
}

/**
 * Calcula RPE (Rate of Perceived Exertion) para validación
 * Escala 1-10: cuántas repeticiones podría hacer más
 * RPE 10 = fallo muscular
 * RPE 8 = podría hacer 2 más
 * RPE 6 = podría hacer 4 más
 */
export function calcularRPE(seriesRealizadas, repeticionesRealizado, repeticionesPrevistas) {
    const repRestantes = repeticionesPrevistas - repeticionesRealizado;

    // Conversión aproximada: cada 2 reps que faltan = 1 punto RPE (del 10)
    const rpe = 10 - (repRestantes * 0.5);

    return Math.max(1, Math.min(10, Math.round(rpe * 10) / 10)); // Limitar 1-10
}

/**
 * Progresión de carga semanal dentro de un mesociclo
 * Semana 1: intensidad base (semana de familiarización)
 * Semana 2-4: progresión
 * Semana 5: descarga (si aplica)
 */
export function calcularProgresionMesociclo(
    cargaBase_kg,
    numeroSemana,
    tipo_mesociclo = "lineal", // "lineal", "onda", "exponencial"
    totalSemanas = 4
) {
    let multiplicador = 1;

    switch (tipo_mesociclo) {
        case "lineal":
            // Aumenta 5% cada semana (excepto semana 5 = descarga)
            if (numeroSemana === totalSemanas) {
                multiplicador = 0.8; // Descarga: -20%
            } else {
                multiplicador = 1 + (numeroSemana - 1) * 0.05;
            }
            break;

        case "onda":
            // Ciclo: baja, media, alta, media (patrón de onda)
            const ondaBaja = [0.9, 1.0, 1.1, 1.0];
            multiplicador = ondaBaja[(numeroSemana - 1) % 4];
            break;

        case "exponencial":
            // Aumenta progresivamente más cada semana
            if (numeroSemana === totalSemanas) {
                multiplicador = 0.8; // Descarga
            } else {
                multiplicador = Math.pow(1.08, numeroSemana - 1); // 8% exponencial
            }
            break;

        default:
            multiplicador = 1;
    }

    const cargaSemanal = cargaBase_kg * multiplicador;
    return Math.round(cargaSemanal / 2.5) * 2.5; // Redondear a 2.5kg
}

/**
 * Calcula RPM (Repeticiones Por Minuto) esperadas
 * Útil para validar que la sesión cabe en tiempo disponible
 */
export function calcularRPMprevistas(
    totalEjercicios,
    seriesPorEjercicio,
    repsPorSerie,
    tiempoPromPorRep = 3 // segundos
) {
    const totalReps = totalEjercicios * seriesPorEjercicio * repsPorSerie;
    const tiempoMovimiento = totalReps * tiempoPromPorRep;

    return {
        total_reps: totalReps,
        tiempo_movimiento_minutos: Math.round(tiempoMovimiento / 60),
        rpm_por_minuto: Math.round((totalReps / (tiempoMovimiento / 60)) * 100) / 100
    };
}

/**
 * FUNCIÓN PRINCIPAL: Calcular cargas completas para un usuario en un bloque
 * Integra datos del usuario y parámetros del bloque
 */
export function calcularCargasBloque(usuario, nivelNicross, tipoBloque, parametrosBloque, numeroSemana = 1) {
    // Validar que el usuario tenga 1RM
    if (!usuario.fuerzaMaxima || !usuario.fuerzaMaxima[tipoBloque]) {
        console.warn(`Usuario ${usuario.id} sin 1RM definido para ${tipoBloque}`);
        return null;
    }

    const unRM = usuario.fuerzaMaxima[tipoBloque];
    const rangoPorcentaje = parametrosBloque.porcentaje1RM;

    // Calcular cargas base
    let cargaRecomendada = calcularCargaDesde1RM(
        unRM,
        (rangoPorcentaje.min + rangoPorcentaje.max) / 2
    );

    // Aplicar progresión si estamos en una semana específica
    if (numeroSemana > 1) {
        cargaRecomendada = calcularProgresionMesociclo(cargaRecomendada, numeroSemana);
    }

    return {
        unRM: unRM,
        rangoPorcentaje: rangoPorcentaje,
        cargaMinima_kg: calcularCargaDesde1RM(unRM, rangoPorcentaje.min),
        cargaMaxima_kg: calcularCargaDesde1RM(unRM, rangoPorcentaje.max),
        cargaRecomendada_kg: cargaRecomendada,
        repeticiones: parametrosBloque.repeticiones,
        series: parametrosBloque.series,
        descanso_segundos: parametrosBloque.descanso_segundos,
        tempo: parametrosBloque.tempo,
        numeroSemana: numeroSemana
    };
}

/**
 * Genera tabla de cargas para todos los ejercicios de una sesión
 */
export function generarTablaCargas(ejercicios, usuario, nivelNicross, parametrosPorTipo) {
    return ejercicios.map(ejercicio => {
        const parametros = parametrosPorTipo[ejercicio.tipoBloque];

        if (!parametros) {
            console.warn(`No hay parámetros para bloque: ${ejercicio.tipoBloque}`);
            return null;
        }

        const cargas = calcularCargasBloque(
            usuario,
            nivelNicross,
            ejercicio.patron,
            parametros
        );

        return {
            ejercicio: ejercicio.nombre,
            patron: ejercicio.patron,
            tipoBloque: ejercicio.tipoBloque,
            ...cargas
        };
    }).filter(e => e !== null);
}
