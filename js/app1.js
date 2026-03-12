// ===============================
// IMPORTS
// ===============================

import { usuario } from "../data/usuario.js";
import { generarSemanaCompleta } from "../training/generadorSemanaReal.js";
import { parametrosPorBloque } from "../training/parametrosPorBloque.js";
import { splitsSemanales } from "../data/splitSemanales.js";
import {
    cargarDatosDelLocalStorage,
    aplicarDatosAlUsuario,
    recalcularPropiedadesUsuario
} from "../carga_de_datos.js";

// ===============================
// EJECUCION
// ===============================

console.clear();

// ═══════════════════════════════════════════════════════════════════════════
// CARGAR DATOS MODIFICADOS DEL FORMULARIO (si existen)
// ═══════════════════════════════════════════════════════════════════════════

let usuarioActual = usuario[0];
const datosModificados = cargarDatosDelLocalStorage();

if (datosModificados) {
    console.log("%c\n╔════════════════════════════════════════════════════════════════════════╗", "color: #ffaa00;");
    console.log("%c║  ⚡ DATOS MODIFICADOS DETECTADOS — Aplicando cambios a user_001       ║", "color: #ffaa00;");
    console.log("%c╚════════════════════════════════════════════════════════════════════════╝", "color: #ffaa00;");

    // Aplicar datos modificados
    usuarioActual = aplicarDatosAlUsuario(usuarioActual, datosModificados);

    // Recalcular propiedades derivadas (IMC, nivel NICROSS, etc)
    usuarioActual = recalcularPropiedadesUsuario(usuarioActual);

    console.log("%c✅ CAMBIOS APLICADOS CORRECTAMENTE", "color: #00ff88; font-weight: bold;");
    console.log(`%c  • Peso: ${datosModificados.peso_kg} kg`, "color: #00ff88;");
    console.log(`%c  • Altura: ${datosModificados.altura_cm} cm`, "color: #00ff88;");
    console.log(`%c  • Edad: ${datosModificados.edad} años`, "color: #00ff88;");
    console.log(`%c  • Experiencia: ${datosModificados.experiencia_anios} años`, "color: #00ff88;");
    console.log(`%c  • Días/semana: ${datosModificados.dias_entrenamiento}`, "color: #00ff88;");
    console.log(`%c  • Objetivo: ${datosModificados.objetivo}`, "color: #00ff88;");
    console.log(`%c  • Equipamiento: ${datosModificados.equipamiento}`, "color: #00ff88;");
    console.log("%c💡 TIP: Verás una rutina diferente abajo basada en estos nuevos datos", "color: #ffff88; font-style: italic;");
}

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

// ╔════════════════════════════════════════════════════════════════════════╗
// ║                      📋 DATOS PERSONALES                               ║
// ╚════════════════════════════════════════════════════════════════════════╝

console.log("%c\n╔════════════════════════════════════════════════════════════════════════╗", "color: #00ffff;");
console.log("%c║                      👤 DATOS PERSONALES                               ║", "color: #00ffff;");
console.log("%c╚════════════════════════════════════════════════════════════════════════╝", "color: #00ffff;");

console.log(`%c  ID: %c${usuarioActual.id}`, "color: #999;", "color: #00ff88; font-weight: bold;");
console.log(`%c  Nombre: %c${usuarioActual.nombre}`, "color: #999;", "color: #ffff00; font-weight: bold;");
console.log(`%c  Sexo: %c${usuarioActual.sexo.charAt(0).toUpperCase() + usuarioActual.sexo.slice(1)}`, "color: #999;", "color: #00ff88;");
console.log(`%c  Edad: %c${usuarioActual.edad} años`, "color: #999;", "color: #00ff88;");
console.log(`%c  Nacimiento: %c${usuarioActual.fecha_nacimiento}`, "color: #999;", "color: #00ff88;");
console.log(`%c  Próximo cumpleaños: %c${usuarioActual.dias_hasta_cumpleaños.dias} días (%c${usuarioActual.dias_hasta_cumpleaños.proxima_fecha}%c)`, "color: #999;", "color: #ff9900; font-weight: bold;", "color: #ffff00;", "color: #ff9900; font-weight: bold;");

// ╔════════════════════════════════════════════════════════════════════════╗
// ║                    📏 DATOS ANTROPOMÉTRICOS                            ║
// ╚════════════════════════════════════════════════════════════════════════╝

console.log(`%c\n╔════════════════════════════════════════════════════════════════════════╗`, "color: #00ffff;");
console.log(`%c║                    📏 DATOS ANTROPOMÉTRICOS                            ║`, "color: #00ffff;");
console.log(`%c╚════════════════════════════════════════════════════════════════════════╝`, "color: #00ffff;");

console.log(`%c  Altura: %c${usuarioActual.altura_cm} cm`, "color: #999;", "color: #00ff88;");
console.log(`%c  Peso: %c${usuarioActual.peso_kg} kg`, "color: #999;", "color: #00ff88;");
console.log(`%c  IMC: %c${usuarioActual.imc.imc}`, "color: #999;", "color: #00ff88;");
console.log(`%c  Categoría: %c${usuarioActual.imc.categoria_imc.toUpperCase()}`, "color: #999;", "color: #00ff88;");

// ╔════════════════════════════════════════════════════════════════════════╗
// ║                    💪 PERFIL DE ENTRENAMIENTO                          ║
// ╚════════════════════════════════════════════════════════════════════════╝

console.log(`%c\n╔════════════════════════════════════════════════════════════════════════╗`, "color: #00ffff;");
console.log(`%c║                    💪 PERFIL DE ENTRENAMIENTO                          ║`, "color: #00ffff;");
console.log(`%c╚════════════════════════════════════════════════════════════════════════╝`, "color: #00ffff;");

console.log(`%c  Nivel: %c${usuarioActual.nivel_nicross.toUpperCase()}`, "color: #999;", "color: #ff4444; font-weight: bold;");
console.log(`%c  Objetivo: %c${usuarioActual.objetivo.replace(/_/g, " ").toUpperCase()}`, "color: #999;", "color: #00ff88;");
console.log(`%c  Experiencia: %c${usuarioActual.experiencia_anios} años`, "color: #999;", "color: #00ff88;");
console.log(`%c  Días/semana: %c${usuarioActual.dias_entrenamiento}`, "color: #999;", "color: #00ff88;");
console.log(`%c  Tiempo/sesión: %c${usuarioActual.tiempo_por_sesion_min} minutos`, "color: #999;", "color: #00ff88;");
console.log(`%c  Equipamiento: %c${usuarioActual.equipamiento.replace(/_/g, " ").toUpperCase()}`, "color: #999;", "color: #00ff88;");

if (usuarioActual.limitaciones && usuarioActual.limitaciones.length > 0) {
    console.log(`%c  Limitaciones: %c${usuarioActual.limitaciones.join(", ").toUpperCase()}`, "color: #999;", "color: #ff6666;");
}

// ╔════════════════════════════════════════════════════════════════════════╗
// ║                  📅 HISTORIAL EN EL PROGRAMA                           ║
// ╚════════════════════════════════════════════════════════════════════════╝

console.log(`%c\n╔════════════════════════════════════════════════════════════════════════╗`, "color: #00ffff;");
console.log(`%c║                  📅 HISTORIAL EN EL PROGRAMA                           ║`, "color: #00ffff;");
console.log(`%c╚════════════════════════════════════════════════════════════════════════╝`, "color: #00ffff;");

console.log(`%c  Ingreso: %c${usuarioActual.fecha_ingreso}`, "color: #999;", "color: #00ff88;");
console.log(`%c  Tiempo: %c${usuarioActual.dias_en_programa.dias} días (%c${usuarioActual.dias_en_programa.semanas} semanas / ${usuarioActual.dias_en_programa.meses} meses%c)`, "color: #999;", "color: #00ff88; font-weight: bold;", "color: #ffff88;", "color: #00ff88; font-weight: bold;");

// ╔════════════════════════════════════════════════════════════════════════╗
// ║                    💪 FUERZAS MÁXIMAS (1RM)                            ║
// ╚════════════════════════════════════════════════════════════════════════╝

console.log(`%c\n╔════════════════════════════════════════════════════════════════════════╗`, "color: #00ffff;");
console.log(`%c║                    💪 FUERZAS MÁXIMAS (1RM)                            ║`, "color: #00ffff;");
console.log(`%c╚════════════════════════════════════════════════════════════════════════╝`, "color: #00ffff;");

const fm = usuarioActual.fuerzaMaxima;
console.log(`%c  Tren Superior:`, "color: #ffff00; font-weight: bold;");
console.log(`%c    • Empuje Horizontal: %c${fm.empuje_horizontal}kg`, "color: #999;", "color: #00ff88;");
console.log(`%c    • Tracción Horizontal: %c${fm.traccion_horizontal}kg`, "color: #999;", "color: #00ff88;");
console.log(`%c    • Empuje Vertical: %c${fm.empuje_vertical}kg`, "color: #999;", "color: #00ff88;");
console.log(`%c    • Tracción Vertical: %c${fm.traccion_vertical}kg`, "color: #999;", "color: #00ff88;");
console.log(`%c  Tren Inferior:`, "color: #ffff00; font-weight: bold;");
console.log(`%c    • Cuádriceps: %c${fm.cuadriceps}kg`, "color: #999;", "color: #00ff88;");
console.log(`%c    • Cadena Posterior: %c${fm.cadena_posterior}kg`, "color: #999;", "color: #00ff88;");
console.log(`%c    • Glúteos: %c${fm.gluteos}kg`, "color: #999;", "color: #00ff88;");

// ╔════════════════════════════════════════════════════════════════════════╗
// ║                  📅 SEMANA DE ENTRENAMIENTO                            ║
// ╚════════════════════════════════════════════════════════════════════════╝

console.log(`%c\n╔════════════════════════════════════════════════════════════════════════╗`, "color: #ff9900;");
console.log(`%c║                  📅 SEMANA DE ENTRENAMIENTO                            ║`, "color: #ff9900;");
console.log(`%c╚════════════════════════════════════════════════════════════════════════╝`, "color: #ff9900;");

// Generar semana para el usuario activo (usuario[0]) — para el display
const nivelNicross = usuarioActual.nivel_nicross;
const objetoSplit = splitsSemanales[usuarioActual.dias_entrenamiento];
const semanaGenerada = generarSemanaCompleta(
    usuarioActual,
    nivelNicross,
    objetoSplit,
    parametrosPorBloque
);

// Mapear días de entrenamiento a días de la semana real
// Distribuir días de lunes a sábado
const diasEntrenamiento = semanaGenerada.dias;
const distribucionDias = [];

// Calcular la distribución: si entrena 3 días, distribuir en lunes, miércoles, viernes
// Si entrena 5 días, hacer lunes a viernes
const numeroDias = diasEntrenamiento.length;
const diasDisponibles = [0, 1, 2, 3, 4, 5]; // Lunes a Sábado (índices)

let distribucion = [];
if (numeroDias <= 6) {
    // Espaciar equitativamente
    const espacio = Math.floor(6 / numeroDias);
    for (let i = 0; i < numeroDias; i++) {
        distribucion.push(i * espacio);
    }
}

// Mostrar cada día de entrenamiento
diasEntrenamiento.forEach((dia, indice) => {
    const diaDelaSemana = diasSemana[distribucion[indice] || indice];

    console.log(`%c\n┌─ ${diaDelaSemana.toUpperCase()} (Día #${indice + 1}) ───────────────────────────────────`, "color: #88ff88; font-weight: bold;");
    console.log(`%c│ Foco: %c${dia.foco ? dia.foco.replace(/_/g, " ").toUpperCase() : "N/A"}`, "color: #999;", "color: #ffff00; font-weight: bold;");
    console.log(`%c│ Series Totales: %c${dia.total_series || 0}`, "color: #999;", "color: #00ff88;");

    // Mostrar bloques y ejercicios
    if (dia.bloques && Array.isArray(dia.bloques) && dia.bloques.length > 0) {
        dia.bloques.forEach((bloque, bloqueIdx) => {
            const tipoBloque = bloque.tipo || "sin_tipo";
            console.log(`%c│ \n│ 🔵 BLOQUE ${bloqueIdx + 1}: %c${tipoBloque.toUpperCase().replace(/_/g, " ")}`, "color: #999;", "color: #00ff88; font-weight: bold;");

            if (bloque.ejercicios && Array.isArray(bloque.ejercicios) && bloque.ejercicios.length > 0) {
                bloque.ejercicios.forEach((ej, ejIdx) => {
                    const esUltimo = ejIdx === bloque.ejercicios.length - 1;
                    const prefix = esUltimo ? "│   └─" : "│   ├─";

                    console.log(`%c${prefix} %c${ej.nombre || "Ejercicio"}`, "color: #999;", "color: #ffffff; font-weight: bold;");

                    if (ej.series) console.log(`%c│   ${esUltimo ? "   " : "│  "}  📊 Series: %c${ej.series}`, "color: #999;", "color: #88ccff;");
                    if (ej.repeticiones_min || ej.repeticiones_max) {
                        const reps = `${ej.repeticiones_min || "?"}-${ej.repeticiones_max || "?"}`;
                        console.log(`%c│   ${esUltimo ? "   " : "│  "}  🔢 Reps: %c${reps}`, "color: #999;", "color: #88ccff;");
                    }
                    if (ej.carga_kg) console.log(`%c│   ${esUltimo ? "   " : "│  "}  ⚖️  Carga: %c${ej.carga_kg}kg`, "color: #999;", "color: #ffff88; font-weight: bold;");
                    if (ej.descanso_seg) {
                        const descanso = ej.descanso_seg.min ? `${ej.descanso_seg.min}-${ej.descanso_seg.max}s` : ej.descanso_seg;
                        console.log(`%c│   ${esUltimo ? "   " : "│  "}  ⏱️  Descanso: %c${descanso}`, "color: #999;", "color: #888888;");
                    }
                    if (ej.tempo) {
                        const tempo = ej.tempo.excentric ? `${ej.tempo.excentric}-${ej.tempo.pause}-${ej.tempo.concentric}` : ej.tempo;
                        console.log(`%c│   ${esUltimo ? "   " : "│  "}  ⏸️  Tempo: %c${tempo}`, "color: #999;", "color: #888888;");
                    }
                });
            }
        });
    }

    console.log(`%c└──────────────────────────────────────────────────────────────┘`, "color: #88ff88;");
});

console.log(`%c\n╔════════════════════════════════════════════════════════════════════════╗`, "color: #00ffff;");
console.log(`%c║                      📦 OBJETO USUARIO NICROSS FINAL                   ║`, "color: #00ffff;");
console.log(`%c╚════════════════════════════════════════════════════════════════════════╝`, "color: #00ffff;");

// ============================================================
// ARRAY COMPLETO: todos los usuarios enriquecidos con semana
// Accedé a cualquier usuario con usuario_nicross[index]
// ============================================================
const usuario_nicross = usuario.map((u) => {
    const splitU = splitsSemanales[u.dias_entrenamiento];
    const semanaU = generarSemanaCompleta(
        u,
        u.nivel_nicross,
        splitU,
        parametrosPorBloque
    );

    return {
        // --- Datos de usuarios.js ---
        id: u.id,
        nombre: u.nombre,
        fecha_nacimiento: u.fecha_nacimiento,
        fecha_ingreso: u.fecha_ingreso,
        sexo: u.sexo,
        altura_cm: u.altura_cm,
        peso_kg: u.peso_kg,
        nivel: u.nivel,
        objetivo: u.objetivo,
        experiencia_anios: u.experiencia_anios,
        dias_entrenamiento: u.dias_entrenamiento,
        equipamiento: u.equipamiento,
        limitaciones: u.limitaciones,
        tiempo_por_sesion_min: u.tiempo_por_sesion_min,

        // --- Propiedades calculadas por usuario.js ---
        edad: u.edad,
        dias_hasta_cumpleaños: u.dias_hasta_cumpleaños,
        dias_en_programa: u.dias_en_programa,
        imc: u.imc,
        nivel_usuario: u.nivel_usuario,
        nivel_nicross: u.nivel_nicross,
        fuerzaMaxima: u.fuerzaMaxima,
        split_semanal_recomendado: u.split_semanal_recomendado,
        rutinaSemanalCompleta: u.rutinaSemanalCompleta,

        // --- Semana generada con cargas reales ---
        semana_entrenamiento: semanaU
    };
});

console.log("%c\n═ JSON COMPLETO ═\n", "color: #ffff00; font-weight: bold;");
console.log(JSON.stringify(usuario_nicross[0], null, 2));

console.log(usuario_nicross[0].semana_entrenamiento);

console.log(usuario_nicross[2].semana_entrenamiento);

// ╔════════════════════════════════════════════════════════════════════════╗
// ║           📊 COMPARATIVA: PROGRESIÓN DE RUTINAS SEMANALES             ║
// ║         (Cómo cambian los ejercicios de semana a semana)              ║
// ╚════════════════════════════════════════════════════════════════════════╝

console.log(`%c\n╔════════════════════════════════════════════════════════════════════════╗`, "color: #ff00ff;");
console.log(`%c║           📊 COMPARATIVA: PROGRESIÓN DE RUTINAS SEMANALES             ║`, "color: #ff00ff;");
console.log(`%c║         (Cómo cambian los ejercicios de semana a semana)              ║`, "color: #ff00ff;");
console.log(`%c╚════════════════════════════════════════════════════════════════════════╝`, "color: #ff00ff;");

/**
 * Función para generar varias semanas de entrenamiento con progresión
 * Simula un mesociclo de 4 semanas
 */
function generarMesocicloUsuario(usuarioData, numSemanas = 4) {
    const semanas = [];

    for (let sem = 0; sem < numSemanas; sem++) {
        // Generar semana (misma semana, pero en contexto de progresión)
        const semanaGen = generarSemanaCompleta(
            usuarioData,
            usuarioData.nivel_nicross,
            splitsSemanales[usuarioData.dias_entrenamiento],
            parametrosPorBloque
        );

        // Agregar información de la semana
        semanaGen.numero_semana = sem + 1;
        semanaGen.mes = "Marzo";
        semanaGen.año = 2026;

        semanas.push(semanaGen);
    }

    return semanas;
}

/**
 * Función para extraer un ejercicio específico de una semana
 */
function obtenerEjercicioDeSemana(semana, nombreEjercicio) {
    for (const dia of semana.dias) {
        for (const bloque of dia.bloques) {
            for (const ej of bloque.ejercicios) {
                if (ej.nombre.toLowerCase().includes(nombreEjercicio.toLowerCase())) {
                    return {
                        dia_semana: semana.dias.indexOf(dia) + 1,
                        foco: dia.foco,
                        bloque: bloque.tipo,
                        ejercicio: ej
                    };
                }
            }
        }
    }
    return null;
}

/**
 * Función para comparar un ejercicio entre semanas
 */
function compararEjercicioEntreSemanas(semanas, nombreEjercicio) {
    const resultados = [];

    for (const semana of semanas) {
        const encontrado = obtenerEjercicioDeSemana(semana, nombreEjercicio);
        if (encontrado) {
            resultados.push({
                semana: semana.numero_semana,
                ...encontrado.ejercicio
            });
        }
    }

    return resultados;
}

// ═════════════════════════════════════════════════════════════════════════════
// GENERAR 4 SEMANAS DEL USUARIO ACTUAL
// ═════════════════════════════════════════════════════════════════════════════

const mesocicloUsuario = generarMesocicloUsuario(usuarioActual, 4);

console.log(`%c\n✅ MESOCICLO GENERADO: 4 semanas para ${usuarioActual.nombre}`, "color: #00ff88; font-weight: bold;");

// ═════════════════════════════════════════════════════════════════════════════
// VISTA 1: TODOS LOS EJERCICIOS POR DÍA EN CADA SEMANA
// ═════════════════════════════════════════════════════════════════════════════

console.log(`%c\n┌─ VISTA 1: TODOS LOS EJERCICIOS POR SEMANA ─────────────────────┐`, "color: #ffff00;");

mesocicloUsuario.forEach((semana) => {
    console.log(`%c\n📅 SEMANA ${semana.numero_semana} (${semana.mes} 2026)`, "color: #00ffff; font-weight: bold;");

    semana.dias.forEach((dia, diaIdx) => {
        const diaName = diasSemana[diaIdx] || `Día ${diaIdx + 1}`;
        console.log(`%c  ${diaName.toUpperCase()} — Foco: ${dia.foco.replace(/_/g, " ").toUpperCase()}`, "color: #88ff88;");

        dia.bloques.forEach((bloque) => {
            console.log(`%c    🔹 ${bloque.tipo.toUpperCase()}:`, "color: #ffaa00;");

            bloque.ejercicios.forEach((ej) => {
                console.log(`%c       • ${ej.nombre}  │  ${ej.series}×${ej.repeticiones_min} reps  │  ${ej.carga_kg || "sin carga"} kg`, "color: #cccccc;");
            });
        });
    });
});

console.log(`%c└────────────────────────────────────────────────────────────────┘`, "color: #ffff00;");

// ═════════════════════════════════════════════════════════════════════════════
// VISTA 2: SEGUIMIENTO DE UN EJERCICIO ESPECÍFICO A TRAVÉS DE LAS SEMANAS
// ═════════════════════════════════════════════════════════════════════════════

console.log(`%c\n┌─ VISTA 2: PROGRESIÓN DE UN EJERCICIO CLAVE ────────────────────┐`, "color: #ffff00;");

// Obtener el primer ejercicio compuesto del usuario para trackear
let ejercicioParaTrackear = null;
for (const dia of mesocicloUsuario[0].dias) {
    for (const bloque of dia.bloques) {
        if (bloque.tipo.includes("fuerza") && bloque.ejercicios.length > 0) {
            ejercicioParaTrackear = bloque.ejercicios[0].nombre;
            break;
        }
    }
    if (ejercicioParaTrackear) break;
}

if (ejercicioParaTrackear) {
    console.log(`%c\n🎯 Ejercicio analizado: ${ejercicioParaTrackear}`, "color: #00ffff; font-weight: bold;");

    const progresion = compararEjercicioEntreSemanas(mesocicloUsuario, ejercicioParaTrackear);

    console.log(`%c\n{"Semana"} │ {"Series"} │ {"Reps"} │ {"Carga (kg)"} │ {"Cambio"}`, "color: #ffff00; font-weight: bold;");
    console.log(`%c────────────┼──────────┼──────────┼──────────────┼─────────────`, "color: #666;");

    progresion.forEach((ej, idx) => {
        const cambioSeries = idx > 0 ? (ej.series > progresion[idx - 1].series ? "↑ +1 serie" : "") : "—";
        const cambioReps = idx > 0 ? (ej.repeticiones_min > progresion[idx - 1].repeticiones_min ? "↑ +reps" : ej.repeticiones_min < progresion[idx - 1].repeticiones_min ? "↓ -reps" : "") : "—";
        const cambioKg = idx > 0 ? (ej.carga_kg > progresion[idx - 1].carga_kg ? `↑ +${ej.carga_kg - progresion[idx - 1].carga_kg}kg` : "") : "—";

        const cambioTotal = [cambioSeries, cambioReps, cambioKg].filter(c => c !== "—").join(" | ") || "—";

        console.log(`%c  Sem ${ej.semana}    │    ${ej.series}     │    ${ej.repeticiones_min}    │      ${ej.carga_kg || "—"}      │  ${cambioTotal}`, "color: #cccccc;");
    });

    // Resumen de progresión
    const primeraSemana = progresion[0];
    const ultimaSemana = progresion[progresion.length - 1];

    const incrementoSeries = ultimaSemana.series - primeraSemana.series;
    const incrementoKg = ultimaSemana.carga_kg - primeraSemana.carga_kg;

    console.log(`%c\n📈 RESUMEN DE PROGRESIÓN:`, "color: #00ff88; font-weight: bold;");
    console.log(`%c   Series: ${primeraSemana.series} → ${ultimaSemana.series} (${incrementoSeries > 0 ? "+" + incrementoSeries : incrementoSeries})`, "color: #00ff88;");
    console.log(`%c   Carga: ${primeraSemana.carga_kg}kg → ${ultimaSemana.carga_kg}kg (${incrementoKg > 0 ? "+" + incrementoKg : incrementoKg}kg)`, "color: #00ff88;");
} else {
    console.log(`%c No se encontró ejercicio de fuerza para trackear`, "color: #ff6666;");
}

console.log(`%c└────────────────────────────────────────────────────────────────┘`, "color: #ffff00;");

// ═════════════════════════════════════════════════════════════════════════════
// VISTA 3: CAMBIOS DE EJERCICIOS POR DÍA (QUÉ CAMBIA CADA SEMANA)
// ═════════════════════════════════════════════════════════════════════════════

console.log(`%c\n┌─ VISTA 3: CAMBIOS DE EJERCICIOS POR DÍA ──────────────────────┐`, "color: #ffff00;");

for (let diaIdx = 0; diaIdx < Math.min(3, mesocicloUsuario[0].dias.length); diaIdx++) {
    const diaName = diasSemana[diaIdx];
    console.log(`%c\n📅 ${diaName.toUpperCase()} (${mesocicloUsuario[0].dias[diaIdx].foco})`, "color: #ffff00; font-weight: bold;");

    // Obtener ejercicios de cada semana para este día
    const ejerciciosPorSemana = mesocicloUsuario.map((sem, semIdx) => ({
        semana: semIdx + 1,
        ejercicios: sem.dias[diaIdx].bloques.flatMap(b => b.ejercicios.map(e => e.nombre))
    }));

    // Comparar cambios
    for (let i = 0; i < ejerciciosPorSemana.length; i++) {
        const actual = ejerciciosPorSemana[i];
        const anterior = i > 0 ? ejerciciosPorSemana[i - 1] : null;

        console.log(`%c  Semana ${actual.semana}:`, "color: #00ffff;");

        actual.ejercicios.forEach((ej, ejIdx) => {
            let cambio = "—";

            if (anterior && anterior.ejercicios[ejIdx]) {
                if (ej !== anterior.ejercicios[ejIdx]) {
                    cambio = `✦ Cambio: ${anterior.ejercicios[ejIdx]} → ${ej}`;
                } else {
                    cambio = "✓ Igual";
                }
            }

            console.log(`%c    ${ejIdx + 1}. ${ej}  ${cambio}`, "color: #cccccc;");
        });
    }
}

console.log(`%c└────────────────────────────────────────────────────────────────┘`, "color: #ffff00;");

// ═════════════════════════════════════════════════════════════════════════════
// VISTA 4: TABLA COMPARATIVA RÁPIDA POR PATRÓN DE MOVIMIENTO
// ═════════════════════════════════════════════════════════════════════════════

console.log(`%c\n┌─ VISTA 4: CAMBIOS POR PATRÓN DE MOVIMIENTO ────────────────────┐`, "color: #ffff00;");

const patronesEncontrados = new Set();
mesocicloUsuario[0].dias.forEach(dia => {
    dia.bloques.forEach(bloque => {
        bloque.ejercicios.forEach(ej => {
            patronesEncontrados.add(ej.patron);
        });
    });
});

patronesEncontrados.forEach(patron => {
    console.log(`%c\n${patron.toUpperCase().replace(/_/g, " ")}:`, "color: #00ffff; font-weight: bold;");

    mesocicloUsuario.forEach((semana, idx) => {
        let ejercicioDelPatron = null;

        for (const dia of semana.dias) {
            for (const bloque of dia.bloques) {
                for (const ej of bloque.ejercicios) {
                    if (ej.patron === patron) {
                        ejercicioDelPatron = ej;
                        break;
                    }
                }
                if (ejercicioDelPatron) break;
            }
            if (ejercicioDelPatron) break;
        }

        if (ejercicioDelPatron) {
            console.log(`%c  Sem${idx + 1}: ${ejercicioDelPatron.nombre}  (${ejercicioDelPatron.series}×${ejercicioDelPatron.repeticiones_min} | ${ejercicioDelPatron.carga_kg}kg)`, "color: #cccccc;");
        }
    });
});

console.log(`%c└────────────────────────────────────────────────────────────────┘`, "color: #ffff00;");

console.log(`%c\n✅ ANÁLISIS COMPLETADO\n`, "color: #00ff88; font-weight: bold;");