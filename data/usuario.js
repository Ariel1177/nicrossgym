/*
========================================================
MÓDULO: usuario.js
SISTEMA: Generador de Rutinas NICROSS
--------------------------------------------------------
Este módulo se encarga de:

1️⃣ Importar los usuarios desde la base de datos
2️⃣ Calcular el IMC (Índice de Masa Corporal)
3️⃣ Clasificar al usuario según los niveles NICROSS
4️⃣ Sugerir el split semanal recomendado basado en perfil
5️⃣ Enriquecer el split con bloques de entrenamiento
6️⃣ Generar rutinas semanales automáticas
7️⃣ Generar un objeto usuario enriquecido con:
      - imc
      - nivel_usuario (nivel original)
      - nivel_nicross (clasificación del sistema)
      - split_semanal_recomendado (con bloques asignados)
      - rutinaSemanalCompleta (rutina generada automáticamente)
8️⃣ Mostrar todos los usuarios clasificados en consola
========================================================
*/

import { users } from "../data/usuarios.js";
import { splitsSemanales } from "../data/splitSemanales.js";
import { bloques } from "../training/bloques.js";
import { generarRutinaSemanal } from "../training/generadorRutina.js";


/**
 * --------------------------------------------------------
 * FUNCIÓN: calcularIMC(usuario)
 * --------------------------------------------------------
 * Calcula el Índice de Masa Corporal (IMC) del usuario y
 * determina su categoría clínica según clasificación OMS.
 *
 * Fórmula:
 * IMC = peso / altura²
 *
 * Parámetros esperados en el objeto usuario:
 * - peso_kg
 * - altura_cm
 *
 * Retorna un objeto con:
 * - imc
 * - categoria_imc
 * --------------------------------------------------------
 */

function calcularIMC(usuario) {

    // convertir altura de cm a metros
    const alturaMetros = usuario.altura_cm / 100;

    // calcular IMC
    const imc = usuario.peso_kg / (alturaMetros * alturaMetros);

    // redondear a 2 decimales
    const imcRedondeado = Number(imc.toFixed(2));

    // determinar categoría clínica
    let categoriaIMC;

    if (imcRedondeado < 18.5) {
        categoriaIMC = "bajo_peso";
    }
    else if (imcRedondeado < 25) {
        categoriaIMC = "normopeso";
    }
    else if (imcRedondeado < 30) {
        categoriaIMC = "sobrepeso";
    }
    else if (imcRedondeado < 35) {
        categoriaIMC = "obesidad_grado_1";
    }
    else if (imcRedondeado < 40) {
        categoriaIMC = "obesidad_grado_2";
    }
    else {
        categoriaIMC = "obesidad_grado_3";
    }

    // devolver ambos datos
    return {
        imc: imcRedondeado,
        categoria_imc: categoriaIMC
    };

}


/**
 * --------------------------------------------------------
 * FUNCIÓN: calcularEdad(fechaNacimiento)
 * --------------------------------------------------------
 * Calcula la edad actual del usuario basada en su
 * fecha de nacimiento.
 *
 * Parámetros:
 * - fechaNacimiento: string en formato "YYYY-MM-DD"
 *
 * Retorna:
 * - edad: número en años
 * --------------------------------------------------------
 */
function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    // Ajustar si aún no ha cumplido años este año
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }

    return edad;
}


/**
 * --------------------------------------------------------
 * FUNCIÓN: calcularDiasHastaCumpleaños(fechaNacimiento)
 * --------------------------------------------------------
 * Calcula los días restantes hasta el próximo cumpleaños.
 *
 * Parámetros:
 * - fechaNacimiento: string en formato "YYYY-MM-DD"
 *
 * Retorna:
 * - {dias: número, proxima_fecha: string, cumple_hoy: boolean}
 * --------------------------------------------------------
 */
function calcularDiasHastaCumpleaños(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);

    // Crear fecha de cumpleaños del año actual
    let proximoCumple = new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate());

    // Si el cumpleaños ya pasó este año, usar el del próximo año
    if (proximoCumple < hoy) {
        proximoCumple = new Date(hoy.getFullYear() + 1, nacimiento.getMonth(), nacimiento.getDate());
    }

    // Verificar si el cumpleaños es hoy
    const cumpleHoy = hoy.getDate() === nacimiento.getDate() &&
        hoy.getMonth() === nacimiento.getMonth();

    // Calcular diferencia en milisegundos
    const diferencia = proximoCumple - hoy;
    const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));

    const fechaFormato = proximoCumple.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return {
        dias: cumpleHoy ? 0 : dias,
        proxima_fecha: fechaFormato,
        cumple_hoy: cumpleHoy
    };
}


/**
 * --------------------------------------------------------
 * FUNCIÓN: calcularDiasEnPrograma(fechaIngreso)
 * --------------------------------------------------------
 * Calcula cuántos días lleva el usuario en el programa.
 *
 * Parámetros:
 * - fechaIngreso: string en formato "YYYY-MM-DD"
 *
 * Retorna:
 * - {dias: número, semanas: número, meses: número}
 * --------------------------------------------------------
 */
function calcularDiasEnPrograma(fechaIngreso) {
    const hoy = new Date();
    const ingreso = new Date(fechaIngreso);

    const diferencia = hoy - ingreso;
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const semanas = Math.floor(dias / 7);
    const meses = Math.floor(dias / 30);

    return {
        dias: dias,
        semanas: semanas,
        meses: meses
    };
}


/**
 * --------------------------------------------------------
 * FUNCIÓN: agregarFuerzaMaximaEstimada(usuario)
 * --------------------------------------------------------
 * Estima 1RM para todos los patrones basado en peso corporal
 * Usa factores de conversión conservadores
 * --------------------------------------------------------
 */
function agregarFuerzaMaximaEstimada(usuario) {
    const peso = usuario.peso_kg;

    return {
        // TREN SUPERIOR (típicamente 40-80% del peso corporal)
        empuje_horizontal: Math.round(peso * 0.85),      // Press banca
        traccion_horizontal: Math.round(peso * 1.0),     // Remo
        empuje_vertical: Math.round(peso * 0.55),        // Press hombro
        traccion_vertical: Math.round(peso * 0.65),      // Dominadas

        // TREN INFERIOR (típicamente 120-200% del peso corporal)
        cuadriceps: Math.round(peso * 1.35),             // Sentadilla
        cadena_posterior: Math.round(peso * 1.85),       // Peso muerto
        gluteos: Math.round(peso * 1.25),                // Hip thrust
        pantorrillas: Math.round(peso * 1.6),            // Levantamiento talones

        // CORE
        flexion_trunk: Math.round(peso * 0.7),
        extension_trunk: Math.round(peso * 0.9),
        rotacion_trunk: Math.round(peso * 0.6)
    };
}


/*
========================================================
FUNCIÓN: clasificarNivelNicross(usuario)
--------------------------------------------------------
Clasifica al usuario según su experiencia de entrenamiento
y frecuencia semanal.

Niveles NICROSS:

N1 → sedentario
N2 → inicial activo
N3 → intermedio
N4 → avanzado
========================================================
*/

function clasificarNivelNicross(usuario) {

    const experiencia = usuario.experiencia_anios;
    const dias = usuario.dias_entrenamiento;

    if (experiencia === 0 || dias <= 1) {
        return "N1_sedentario";
    }

    if (experiencia < 1) {
        return "N2_inicial_activo";
    }

    if (experiencia >= 1 && experiencia <= 3) {
        return "N3_intermedio";
    }

    if (experiencia > 3) {
        return "N4_avanzado";
    }

}


/*
========================================================
FUNCIÓN: sugerirTipoEntrenamiento(usuario)
--------------------------------------------------------
Sugiere el split semanal recomendado basado en los días de entrenamiento
del usuario, utilizando los splits semanales disponibles.
 
Si los días coinciden con un split (2,3,4,5,6), devuelve el objeto completo del split.
De lo contrario, devuelve el split por defecto (2 días).
========================================================
*/

function sugerirTipoEntrenamiento(usuario) {

    const dias = usuario.dias_entrenamiento;

    if (splitsSemanales[dias]) {
        return splitsSemanales[dias];
    }

    // Valor por defecto si no hay split para esos días
    return splitsSemanales[2];

}


/*
========================================================
FUNCIÓN: agregarTipoEntrenamientoSugerido(usuario)
--------------------------------------------------------
Agrega la propiedad split_semanal_recomendado al objeto usuario
usando la función sugerirTipoEntrenamiento.
 
Retorna el usuario con la propiedad agregada.
========================================================
*/

function agregarTipoEntrenamientoSugerido(user) {

    const splitRecomendado = sugerirTipoEntrenamiento(user);

    return {
        ...user,
        split_semanal_recomendado: splitRecomendado
    };

}


/*
========================================================
FUNCIÓN: obtenerUsuarioClasificado(idUsuario)
--------------------------------------------------------
Busca un usuario por ID y devuelve un objeto enriquecido
con la clasificación NICROSS y split semanal recomendado.
 
Se agregan las propiedades:
 
- imc
- nivel_usuario (nivel original)
- nivel_nicross (nivel calculado por el sistema)
- split_semanal_recomendado
========================================================
*/

function obtenerUsuarioClasificado(idUsuario) {

    const user = users.find(u => u.id === idUsuario);

    if (!user) {
        throw new Error("Usuario no encontrado");
    }

    const imc = calcularIMC(user);
    const nivelNicross = clasificarNivelNicross(user);
    const splitRecomendado = sugerirTipoEntrenamiento(user);

    return {
        ...user,
        imc: imc,
        nivel_usuario: user.nivel,
        nivel_nicross: nivelNicross,
        split_semanal_recomendado: splitRecomendado
    };

}


/*
========================================================
FUNCIÓN: enriquecerSplitConBloques(usuario)
--------------------------------------------------------
Enriquece el split semanal recomendado agregando los
bloques de entrenamiento asignados para cada día.
 
Los bloques se obtienen según el nivel_nicross y el
foco de cada día.
 
Se agrega la propiedad "bloques_dia" a cada día del split.
========================================================
*/

function enriquecerSplitConBloques(user) {

    const splitEnriquecido = {
        ...user.split_semanal_recomendado,
        dias: user.split_semanal_recomendado.dias.map(dia => {

            const nivel = user.nivel_nicross;
            const foco = dia.foco;

            // obtener bloques según nivel NICROSS y foco
            let bloquesDia = [];
            if (bloques[nivel] && bloques[nivel][foco]) {
                bloquesDia = bloques[nivel][foco];
            }

            return {
                ...dia,
                bloques_dia: bloquesDia
            };

        })
    };

    return splitEnriquecido;

}


/*
========================================================
EJECUCIÓN PARA PRUEBAS
--------------------------------------------------------
Clasifica automáticamente TODOS los usuarios del sistema,
genera sus rutinas semanales, y los enriquece con toda
la información necesaria.
 
Uso:
Abrir la consola del navegador (F12)
========================================================
*/

const usuario = users.map((user, index) => {

    const imc = calcularIMC(user);
    const nivelNicross = clasificarNivelNicross(user);
    const splitRecomendado = sugerirTipoEntrenamiento(user);
    const edad = calcularEdad(user.fecha_nacimiento);
    const diasCumple = calcularDiasHastaCumpleaños(user.fecha_nacimiento);
    const diasEnPrograma = calcularDiasEnPrograma(user.fecha_ingreso);
    const fuerzaMaxima = agregarFuerzaMaximaEstimada(user);

    const usuarioEnriquecido = {
        ...user,
        edad: edad,
        dias_hasta_cumpleaños: diasCumple,
        dias_en_programa: diasEnPrograma,
        fuerzaMaxima: fuerzaMaxima,
        imc: imc,
        nivel_usuario: user.nivel,
        nivel_nicross: nivelNicross,
        split_semanal_recomendado: splitRecomendado
    };

    // enriquecer el split con bloques
    usuarioEnriquecido.split_semanal_recomendado = enriquecerSplitConBloques(usuarioEnriquecido);

    // generar rutina semanal completa
    usuarioEnriquecido.rutinaSemanalCompleta = generarRutinaSemanal(usuarioEnriquecido);

    return usuarioEnriquecido;

});

/**
 * ========================================================
 * MOSTRAR USUARIO COMPLETO EN CONSOLA
 * ========================================================
 * Muestra el objeto usuario[0] completo (JSON stringificado)
 * para ver toda la estructura y valores
 */
console.log("%c=== USUARIO COMPLETO: usuario[0] ===", "color: #00ff00; font-weight: bold; font-size: 14px;");
console.log(usuario[0]);

/**
 * ========================================================
 * MOSTRAR USUARIO FORMATEADO Y ORDENADO
 * ========================================================
 * Muestra los datos principales del usuario de forma clara
 * y organizada por secciones
 */
function mostrarUsuarioFormateado(usuarioData, indice = 0) {
    const u = usuarioData[indice];

    const separador = "%c" + "=".repeat(70);
    const titulo = (texto) => `%c${texto}`;
    const subtitulo = (texto) => `%c${texto}`;

    const estiloTitulo = "color: #00ffff; font-weight: bold; font-size: 14px;";
    const estiloSubtitulo = "color: #ffff00; font-weight: bold; font-size: 12px;";
    const estiloNormal = "color: #ffffff; font-size: 11px;";
    const estiloValor = "color: #00ff88; font-weight: bold;";

    console.log(separador, estiloTitulo);
    console.log(titulo("📋 DATOS PERSONALES"), estiloSubtitulo);
    console.log(separador, estiloTitulo);

    console.log(`%cID: %c${u.id}`, estiloNormal, estiloValor);
    console.log(`%cNombre: %c${u.nombre}`, estiloNormal, estiloValor);
    console.log(`%cSexo: %c${u.sexo.charAt(0).toUpperCase() + u.sexo.slice(1)}`, estiloNormal, estiloValor);
    console.log(`%cFecha de Nacimiento: %c${u.fecha_nacimiento}`, estiloNormal, estiloValor);
    console.log(`%cEdad: %c${u.edad} años`, estiloNormal, estiloValor);
    console.log(`%cCumpleaños: %c${u.dias_hasta_cumpleaños.proxima_fecha}${u.dias_hasta_cumpleaños.cumple_hoy ? " 🎂 ¡HOY!" : ""} (${u.dias_hasta_cumpleaños.dias} días)`, estiloNormal, estiloValor);
    console.log(`%cFecha de Ingreso: %c${u.fecha_ingreso}`, estiloNormal, estiloValor);
    console.log(`%cTiempo en Programa: %c${u.dias_en_programa.dias} días (${u.dias_en_programa.semanas} semanas / ${u.dias_en_programa.meses} meses)`, estiloNormal, estiloValor);

    console.log(separador, estiloTitulo);
    console.log(titulo("📏 DATOS ANTROPOMÉTRICOS"), estiloSubtitulo);
    console.log(separador, estiloTitulo);

    console.log(`%cAltura: %c${u.altura_cm} cm`, estiloNormal, estiloValor);
    console.log(`%cPeso: %c${u.peso_kg} kg`, estiloNormal, estiloValor);
    console.log(`%cIMC: %c${u.imc.imc} (${u.imc.categoria_imc.toUpperCase()})`, estiloNormal, estiloValor);

    console.log(separador, estiloTitulo);
    console.log(titulo("💪 PERFIL DE ENTRENAMIENTO"), estiloSubtitulo);
    console.log(separador, estiloTitulo);

    console.log(`%cNivel Ingresado: %c${u.nivel_usuario.toUpperCase()}`, estiloNormal, estiloValor);
    console.log(`%cClasificación NICROSS: %c${u.nivel_nicross.toUpperCase()}`, estiloNormal, estiloValor);
    console.log(`%cObjetivo: %c${u.objetivo.replace(/_/g, " ").toUpperCase()}`, estiloNormal, estiloValor);
    console.log(`%cExperiencia: %c${u.experiencia_anios} años`, estiloNormal, estiloValor);
    console.log(`%cDías de Entrenamiento: %c${u.dias_entrenamiento} días/semana`, estiloNormal, estiloValor);
    console.log(`%cEquipamiento: %c${u.equipamiento.replace(/_/g, " ").toUpperCase()}`, estiloNormal, estiloValor);
    console.log(`%cTiempo por Sesión: %c${u.tiempo_por_sesion_min} minutos`, estiloNormal, estiloValor);

    if (u.limitaciones && u.limitaciones.length > 0) {
        console.log(`%cLimitaciones: %c${u.limitaciones.join(", ").toUpperCase()}`, estiloNormal, "%ccolor: #ff6666; font-weight: bold;");
    } else {
        console.log(`%cLimitaciones: %cNinguna`, estiloNormal, estiloValor);
    }

    console.log(separador, estiloTitulo);
    console.log(titulo("📅 SPLIT SEMANAL RECOMENDADO"), estiloSubtitulo);
    console.log(separador, estiloTitulo);

    console.log(`%cNombre del Split: %c${u.split_semanal_recomendado.nombre}`, estiloNormal, estiloValor);
    console.log(`%cDías Planificados:`, estiloNormal);

    u.split_semanal_recomendado.dias.forEach((dia, i) => {
        const emoji = ["💃", "🤸", "🤾", "🏋️", "🧘", "🚴", "⛹️"][i] || "📅";
        console.log(`%c   ${emoji} Día ${dia.dia}: %c${dia.foco} (${dia.enfasis})`, estiloNormal, estiloValor);
        if (dia.bloques_dia && dia.bloques_dia.length > 0) {
            console.log(`%c      Bloques: %c${dia.bloques_dia.join(" → ")}`, "color: #aaaaaa; font-size: 10px;", "color: #88ff88; font-size: 10px;");
        }
    });

    console.log(separador, estiloTitulo);
}

/**
 * ========================================================
 * MOSTRAR TODOS LOS USUARIOS EN CONSOLA
 * ========================================================
 */

// Mostrar primer usuario (usuario[0]) formateado
console.log("\n");
mostrarUsuarioFormateado(usuario, 0);

// Mostrar tabla general de todos los usuarios
console.log("\n");
console.log("%c=== TABLA RESUMEN: TODOS LOS USUARIOS ===", "color: #00ff00; font-weight: bold; font-size: 14px;");
console.table(usuario.map(u => ({
    "ID": u.id,
    "Nombre": u.nombre,
    "Edad": u.edad,
    "Cumpleaños": `${u.dias_hasta_cumpleaños.dias} días`,
    "Nivel NICROSS": u.nivel_nicross,
    "Objetivo": u.objetivo,
    "Experiencia": `${u.experiencia_anios} años`,
    "Días/semana": u.dias_entrenamiento,
    "IMC": `${u.imc.imc} (${u.imc.categoria_imc})`,
    "En programa": `${u.dias_en_programa.dias} días`
})));


/*
Mostrar resultados en consola en formato tabla
Facilita la lectura y depuración
*/

//console.table(usuariosClasificados);



export { usuario };