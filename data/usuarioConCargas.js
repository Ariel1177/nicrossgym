/**
 * EXTENSIÓN DE MODELO DE USUARIO CON CARGAS (1RM)
 * 
 * Este módulo extiende el modelo de usuario base para incluir
 * datos de fuerza máxima (1RM) por patrón de movimiento.
 * 
 * Estas cargas son necesarias para calcular todas las cargas
 * de trabajo en cada bloque de entrenamiento.
 */

/**
 * EJEMPLO DE USUARIO CON 1RM COMPLETO
 * Basado en usuario_001 (Ariel Diaz)
 */
export const usuarioConCargas_ejemplo = {
    id: "user_001",
    nombre: "Ariel Diaz",
    edad: 48,
    sexo: "masculino",
    altura_cm: 175,
    peso_kg: 75,
    nivel: "principiante",
    objetivo: "hipertrofia",
    experiencia_anios: 4,
    dias_entrenamiento: 5,
    equipamiento: "gimnasio_completo",
    limitaciones: [],
    tiempo_por_sesion_min: 60,

    // NUEVO: Datos de fuerza máxima (1RM) por patrón de movimiento
    fuerzaMaxima: {
        // PATRONES DE TREN SUPERIOR
        empuje_horizontal: 70,      // Press banca 1RM = 70 kg
        traccion_horizontal: 80,    // Remo barra 1RM = 80 kg
        empuje_vertical: 45,        // Press de hombro 1RM = 45 kg
        traccion_vertical: 55,      // Dominada asistida 1RM = 55 kg

        // PATRONES DE TREN INFERIOR
        cuadriceps: 100,            // Sentadilla 1RM = 100 kg (back squat)
        cadena_posterior: 140,      // Peso muerto 1RM = 140 kg
        gluteos: 95,                // Hip thrust 1RM = 95 kg
        pantorrillas: 120,          // Levantamiento de talones 1RM = 120 kg

        // PATRONES DE CORE
        flexion_trunk: 60,          // Crunch 1RM = 60 kg
        extension_trunk: 80,        // Hiperextensión 1RM = 80 kg
        rotacion_trunk: 50,         // Woodchop 1RM = 50 kg

        // REFERENCIA GENERAL
        cuerpo_completo: 100        // Referencia general (mejor usar específico)
    },

    // INFORMACIÓN ADICIONAL DE CAPACIDADES FÍSICAS
    capacidadesFisicas: {
        // Flexibilidad (ROM - Range of Motion)
        flexibilidad: {
            hombros: "buena",
            cadera: "limitada",
            espalda: "media"
        },

        // Estabilidad
        estabilidad: {
            core: "media",
            propioceptiva: "buena"
        },

        // Deficiencias o limitaciones específicas
        deficiencias: {
            "hombro_derecho": "pequeña impingement, evitar overhead agresivo",
            "espalda_baja": "antecedente de dolor, core débil"
        }
    },

    // HISTORIAL DE PRUEBAS DE FUERZA
    historialPruebas: [
        {
            fecha: "2025-01-15",
            descripcion: "Prueba inicial",
            fuerzaMaxima: {
                empuje_horizontal: 70,
                traccion_horizontal: 80,
                cuadriceps: 100,
                cadena_posterior: 140
            }
        },
        {
            fecha: "2025-03-08",
            descripcion: "Reevaluación después de 8 semanas",
            fuerzaMaxima: {
                empuje_horizontal: 75,
                traccion_horizontal: 85,
                cuadriceps: 105,
                cadena_posterior: 150
            }
        }
    ]
};

/**
 * FUNCIÓN: Crear usuario base con 1RM genéricos estimados
 * Útil para usuarios nuevos sin mediciones de 1RM reales
 * 
 * Usa estimadores conservadores basados en peso corporal
 */
export function crearUsuarioConCargas1RMEstimado(usuario, peso_kg) {

    // Estimadores conservadores según peso corporal
    // Estos son aproximados y deben ser reemplazados con pruebas reales

    return {
        ...usuario,
        fuerzaMaxima: {
            // ESTIMACIONES TREN SUPERIOR (típicamente 30-40% del peso corporal)
            empuje_horizontal: Math.round(peso_kg * 0.7),      // ~52 kg para 75kg
            traccion_horizontal: Math.round(peso_kg * 0.85),   // ~64 kg para 75kg
            empuje_vertical: Math.round(peso_kg * 0.45),       // ~34 kg para 75kg
            traccion_vertical: Math.round(peso_kg * 0.55),     // ~41 kg para 75kg

            // ESTIMACIONES TREN INFERIOR (típicamente 100-200% del peso corporal)
            cuadriceps: Math.round(peso_kg * 1.3),             // ~98 kg para 75kg
            cadena_posterior: Math.round(peso_kg * 1.8),       // ~135 kg para 75kg
            gluteos: Math.round(peso_kg * 1.2),                // ~90 kg para 75kg
            pantorrillas: Math.round(peso_kg * 1.6),           // ~120 kg para 75kg

            // ESTIMACIONES CORE (variable)
            flexion_trunk: Math.round(peso_kg * 0.6),          // ~45 kg para 75kg
            extension_trunk: Math.round(peso_kg * 0.8),        // ~60 kg para 75kg
            rotacion_trunk: Math.round(peso_kg * 0.5),         // ~38 kg para 75kg

            cuerpo_completo: peso_kg
        }
    };
}

/**
 * FUNCIÓN: Actualizar 1RM de un usuario tras prueba de fuerza
 * Registra el cambio en historial
 */
export function actualizarFuerzaMaxima(usuario, patron, nuevo1RM) {

    const usuarioActualizado = { ...usuario };

    // Actualizar valor actual
    if (!usuarioActualizado.fuerzaMaxima) {
        usuarioActualizado.fuerzaMaxima = {};
    }

    const antigu01RM = usuarioActualizado.fuerzaMaxima[patron];
    usuarioActualizado.fuerzaMaxima[patron] = nuevo1RM;

    // Registrar en historial
    if (!usuarioActualizado.historialPruebas) {
        usuarioActualizado.historialPruebas = [];
    }

    usuarioActualizado.historialPruebas.push({
        fecha: new Date().toISOString().split('T')[0],
        descripcion: `Actualización de 1RM para ${patron}`,
        patron: patron,
        anterior: antigu01RM,
        nuevo: nuevo1RM,
        cambio_kg: nuevo1RM - (antigu01RM || 0),
        cambio_porcentaje: ((nuevo1RM - (antigu01RM || 0)) / (antigu01RM || nuevo1RM)) * 100
    });

    return usuarioActualizado;
}

/**
 * FUNCIÓN: Validar que usuario tiene todos los 1RMs necesarios
 */
export function validar1RMs(usuario, patronesRequeridos = []) {

    if (!usuario.fuerzaMaxima) {
        return {
            valido: false,
            faltantes: patronesRequeridos,
            mensaje: "Usuario sin datos de 1RM"
        };
    }

    const faltantes = patronesRequeridos.filter(
        patron => !usuario.fuerzaMaxima[patron] || usuario.fuerzaMaxima[patron] === 0
    );

    return {
        valido: faltantes.length === 0,
        faltantes: faltantes,
        mensaje: faltantes.length === 0
            ? "✅ Usuario tiene todos los 1RMs"
            : `⚠️ Faltan 1RMs para: ${faltantes.join(", ")}`
    };
}

/**
 * FUNCIÓN: Generar reporte de capacidades de fuerza
 */
export function generarReporteFuerza(usuario) {

    if (!usuario.fuerzaMaxima) {
        return "❌ Usuario sin datos de 1RM";
    }

    let reporte = `\n${'='.repeat(60)}\n`;
    reporte += `REPORTE DE CAPACIDADES DE FUERZA - ${usuario.nombre}\n`;
    reporte += `${'='.repeat(60)}\n\n`;

    reporte += `Peso Corporal: ${usuario.peso_kg} kg\n`;
    reporte += `IMC: ${Math.round((usuario.peso_kg / ((usuario.altura_cm / 100) ** 2)) * 100) / 100}\n\n`;

    reporte += `FUERZAS MÁXIMAS (1RM):\n`;
    reporte += `${'-'.repeat(60)}\n`;

    // Tren Superior
    reporte += `\nTren Superior:\n`;
    reporte += `  • Empuje Horizontal (Press Banca): ${usuario.fuerzaMaxima.empuje_horizontal || 'N/A'} kg\n`;
    reporte += `  • Tracción Horizontal (Remo): ${usuario.fuerzaMaxima.traccion_horizontal || 'N/A'} kg\n`;
    reporte += `  • Empuje Vertical (Press Hombro): ${usuario.fuerzaMaxima.empuje_vertical || 'N/A'} kg\n`;
    reporte += `  • Tracción Vertical (Dominadas): ${usuario.fuerzaMaxima.traccion_vertical || 'N/A'} kg\n`;

    // Tren Inferior
    reporte += `\nTren Inferior:\n`;
    reporte += `  • Cuádriceps (Sentadilla): ${usuario.fuerzaMaxima.cuadriceps || 'N/A'} kg\n`;
    reporte += `  • Cadena Posterior (Peso Muerto): ${usuario.fuerzaMaxima.cadena_posterior || 'N/A'} kg\n`;
    reporte += `  • Glúteos (Hip Thrust): ${usuario.fuerzaMaxima.gluteos || 'N/A'} kg\n`;

    // Core
    reporte += `\nCore:\n`;
    reporte += `  • Flexión: ${usuario.fuerzaMaxima.flexion_trunk || 'N/A'} kg\n`;
    reporte += `  • Extensión: ${usuario.fuerzaMaxima.extension_trunk || 'N/A'} kg\n`;
    reporte += `  • Rotación: ${usuario.fuerzaMaxima.rotacion_trunk || 'N/A'} kg\n`;

    // Ratios
    reporte += `\n${'-'.repeat(60)}\n`;
    reporte += `RATIOS DE FUERZA:\n`;

    if (usuario.fuerzaMaxima.cadena_posterior && usuario.fuerzaMaxima.cuadriceps) {
        const ratioPD = (usuario.fuerzaMaxima.cadena_posterior / usuario.fuerzaMaxima.cuadriceps * 100).toFixed(1);
        reporte += `  • Peso Muerto / Sentadilla: ${ratioPD}% ${ratioPD > 100 ? "(Normal)" : "(Equilibrio hacia cuádriceps)"}\n`;
    }

    if (usuario.fuerzaMaxima.traccion_horizontal && usuario.fuerzaMaxima.empuje_horizontal) {
        const ratioRow = (usuario.fuerzaMaxima.traccion_horizontal / usuario.fuerzaMaxima.empuje_horizontal * 100).toFixed(1);
        reporte += `  • Remo / Press Banca: ${ratioRow}% ${ratioRow > 100 ? "(Dorsal fuerte)" : "(Balance hacia pecho)"}\n`;
    }

    reporte += `\n${'='.repeat(60)}\n`;

    return reporte;
}

/**
 * MAPEO DE PATRONES A EJERCICIOS COMUNES
 * Útil para saber qué ejercicio corresponde a cada patrón
 */
export const ejerciciosPorPatron = {
    empuje_horizontal: [
        "Press banca (barbell)",
        "Press dumbbell",
        "Push-ups",
        "Press máquina"
    ],

    traccion_horizontal: [
        "Remo barra",
        "Remo dumbbell",
        "Remo máquina",
        "Remando polea"
    ],

    empuje_vertical: [
        "Press de hombro (barbell)",
        "Press dumbbell hombro",
        "Press máquina",
        "Push press"
    ],

    traccion_vertical: [
        "Dominadas",
        "Lat pulldown",
        "Pull-ups",
        "Assisted pull-ups"
    ],

    cuadriceps: [
        "Sentadilla back squat",
        "Front squat",
        "Leg press",
        "Hack squat",
        "Sissy squat"
    ],

    cadena_posterior: [
        "Peso muerto convencional",
        "Sumo deadlift",
        "Romanian deadlift",
        "Trap bar deadlift"
    ],

    gluteos: [
        "Hip thrust",
        "Glute bridge barbell",
        "Bulgarian split squat",
        "Step-ups"
    ],

    pantorrillas: [
        "Levantamiento de talones (standing)",
        "Seated calf raise",
        "Sled push (calf)",
        "Pogo jumps"
    ]
};
