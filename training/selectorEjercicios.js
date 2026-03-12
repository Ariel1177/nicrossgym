import { ejercicios } from "../data/ejercicios.js";


// patrones disponibles en tu sistema
export const patrones = [
    "bisagra",
    "empuje_horizontal",
    "empuje_vertical",
    "traccion_horizontal",
    "sentadilla",
    "traccion_vertical",
    "zancada",
    "anti_extension",
    "anti_rotacion",
    "aislamiento",
    "locomocion",
    "rotacion",
    "core_flexion"
];


// relación bloque → patrones
export const patronesPorBloque = {
    // N1 sedentario
    activacion_general: [
        "locomocion",
        "rotacion"
    ],
    fuerza_basica: [
        "sentadilla",
        "empuje_horizontal"
    ],
    accesorios_ligeros: [
        "aislamiento"
    ],
    cardio_suave: [],

    // N2 principiante
    activacion: [
        "locomocion"
    ],
    fuerza: [
        "sentadilla",
        "bisagra",
        "empuje_horizontal",
        "traccion_horizontal"
    ],
    hipertrofia: [
        "aislamiento"
    ],

    // N3 intermedio
    activacion: [
        "locomocion"
    ],
    fuerza_compuesto: [
        "sentadilla",
        "bisagra",
        "empuje_horizontal",
        "empuje_vertical",
        "traccion_horizontal",
        "traccion_vertical"
    ],
    hipertrofia_volumen: [
        "aislamiento"
    ],
    accesorios: [
        "aislamiento"
    ],
    core: [
        "anti_extension",
        "anti_rotacion",
        "core_flexion"
    ],

    // N4 avanzado
    activacion_especifica: [
        "locomocion"
    ],
    fuerza_principal: [
        "sentadilla",
        "bisagra",
        "empuje_horizontal",
        "traccion_horizontal"
    ],
    fuerza_secundaria: [
        "empuje_vertical",
        "traccion_vertical",
        "zancada"
    ],
    hipertrofia_alta: [
        "aislamiento"
    ],
    accesorios_especificos: [
        "aislamiento"
    ],
    accesorios_posterior: [
        "aislamiento"
    ],
    core_avanzado: [
        "anti_extension",
        "anti_rotacion"
    ],

    // Variantes tren
    fuerza_tren_inferior: [
        "sentadilla",
        "bisagra",
        "zancada"
    ],
    fuerza_tren_superior: [
        "empuje_horizontal",
        "traccion_horizontal",
        "empuje_vertical",
        "traccion_vertical"
    ],

    // Alternativas
    activacion_cadera: [
        "sentadilla"
    ],
    activacion_cadera_rodilla: [
        "sentadilla",
        "bisagra"
    ]
};



// filtra ejercicios válidos
export function ejerciciosValidos(patron, usuario) {

    const nivelUsuario = parseInt(usuario.nivel_nicross.split('_')[0].substring(1));

    return ejercicios.filter(e =>

        e.patron === patron &&

        e.nivelMinimo <= nivelUsuario
        // TODO: equipamiento check - currently assuming gym_completo has all
        // && e.equipamiento.some(eq => usuario.equipamiento.includes(eq))

    );

}



// obtiene ejercicios para un bloque
export function seleccionarEjerciciosBloque(bloque, usuario) {

    const patronesBloque = patronesPorBloque[bloque] || []

    let seleccion = []

    patronesBloque.forEach(p => {

        const candidatos = ejerciciosValidos(p, usuario)

        if (candidatos.length > 0) {

            seleccion.push(candidatos[0])

        }

    })

    return seleccion

}
