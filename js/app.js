// ===============================
// IMPORTS
// ===============================

import { usuario } from "../data/usuario.js";
import { bloques } from "../training/bloques.js";


// ===============================
// FUNCION: obtener bloques segun
// nivel NICROSS y foco del dia
// ===============================

function obtenerBloquesUsuario(usuario, foco) {

    const nivel = usuario.nivel_nicross;

    if (!bloques[nivel]) {
        console.log("Nivel NICROSS no encontrado");
        return [];
    }

    return bloques[nivel][foco] || [];

}


// ===============================
// FUNCION: mostrar informacion
// completa de un usuario
// ===============================

function mostrarUsuario(usuario) {

    return `
ID: ${usuario.id}
Nombre: ${usuario.nombre}
Edad: ${usuario.edad}
Sexo: ${usuario.sexo}

Peso: ${usuario.peso_kg} kg
Altura: ${usuario.altura_cm} cm

Objetivo: ${usuario.objetivo}
Nivel: ${usuario.nivel}
Experiencia: ${usuario.experiencia_anios} años
Días de entrenamiento: ${usuario.dias_entrenamiento}

Equipamiento: ${usuario.equipamiento}
Tiempo por sesión: ${usuario.tiempo_por_sesion_min} min

IMC: ${usuario.imc.imc}
Categoría IMC: ${usuario.imc.categoria_imc}

Split semanal recomendado:
${JSON.stringify(usuario.split_semanal_recomendado, null, 2)}
`;

}


// ===============================
// FUNCION: ver resumen usuarios
// + bloques de entrenamiento
// ===============================

function verResumenUsuarios(usuarios) {

    console.log("\n========== RESUMEN DE USUARIOS ==========\n");

    usuarios.forEach(u => {

        console.log(`
--------------------------------------------------
ID: ${u.id}
Nombre: ${u.nombre}

Experiencia: ${u.experiencia_anios} años
Días disponibles: ${u.dias_entrenamiento}

Nivel NICROSS: ${u.nivel_nicross}

Split recomendado: ${u.split_semanal_recomendado.nombre}
`);

        // recorrer dias del split
        u.split_semanal_recomendado.dias.forEach(d => {

            console.log(`   Día ${d.dia} → ${d.foco} (${d.enfasis})`);

            // obtener bloques según nivel
            const bloquesDia = obtenerBloquesUsuario(u, d.foco);

            bloquesDia.forEach(b => {
                console.log(`      ▸ Bloque: ${b}`);
            });

        });

        console.log("--------------------------------------------------");

    });

}


// EJECUCION

// ver primer usuario completo con bloques asignados
console.log(mostrarUsuario(usuario[1]));

// ver resumen del sistema
//verResumenUsuarios(usuario);