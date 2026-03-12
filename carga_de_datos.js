/**
 * MÓDULO: Carga de Datos Dinámicos
 * 
 * Permite modificar las propiedades del usuario_001 desde un formulario
 * sin alterar la estructura del sistema, solo cambiando valores.
 * 
 * Los datos se guardan en localStorage y se aplican en app1.js
 */

/**
 * Obtener datos del formulario HTML
 */
export function obtenerDatosDelFormulario() {
    return {
        // Datos antropométricos
        peso_kg: parseFloat(document.getElementById("peso_kg")?.value) || 85,
        altura_cm: parseFloat(document.getElementById("altura_cm")?.value) || 180,
        edad: parseInt(document.getElementById("edad")?.value) || 28,

        // Datos de entrenamiento
        experiencia_anios: parseFloat(document.getElementById("experiencia_anios")?.value) || 2,
        dias_entrenamiento: parseInt(document.getElementById("dias_entrenamiento")?.value) || 5,
        tiempo_por_sesion_min: parseInt(document.getElementById("tiempo_por_sesion_min")?.value) || 60,

        // Objetivo y nivel
        objetivo: document.getElementById("objetivo")?.value || "hipertrofia",
        nivel: document.getElementById("nivel")?.value || "intermedio",
        equipamiento: document.getElementById("equipamiento")?.value || "gimnasio_completo",

        // Limitaciones (múltiples)
        limitaciones: Array.from(
            document.querySelectorAll('input[name="limitaciones"]:checked')
        ).map(el => el.value),

        // Fuerzas máximas (1RM)
        empuje_horizontal: parseFloat(document.getElementById("empuje_horizontal")?.value) || 100,
        traccion_horizontal: parseFloat(document.getElementById("traccion_horizontal")?.value) || 120,
        empuje_vertical: parseFloat(document.getElementById("empuje_vertical")?.value) || 70,
        traccion_vertical: parseFloat(document.getElementById("traccion_vertical")?.value) || 90,
        cuadriceps: parseFloat(document.getElementById("cuadriceps")?.value) || 150,
        cadena_posterior: parseFloat(document.getElementById("cadena_posterior")?.value) || 180,
        gluteos: parseFloat(document.getElementById("gluteos")?.value) || 140,
    };
}

/**
 * Guardar datos en localStorage
 */
export function guardarDatosEnLocalStorage(datos) {
    localStorage.setItem('usuario_modificado', JSON.stringify(datos));
    console.log("✅ Datos guardados en localStorage:", datos);
}

/**
 * Cargar datos desde localStorage
 */
export function cargarDatosDelLocalStorage() {
    const datos = localStorage.getItem('usuario_modificado');
    if (datos) {
        return JSON.parse(datos);
    }
    return null;
}

/**
 * Aplicar datos modificados a un usuario
 */
export function aplicarDatosAlUsuario(usuario, datosModificados) {
    if (!datosModificados) return usuario;

    const usuarioModificado = { ...usuario };

    // Datos antropométricos
    if (datosModificados.peso_kg) usuarioModificado.peso_kg = datosModificados.peso_kg;
    if (datosModificados.altura_cm) usuarioModificado.altura_cm = datosModificados.altura_cm;
    if (datosModificados.edad) usuarioModificado.edad = datosModificados.edad;

    // Datos de entrenamiento
    if (datosModificados.experiencia_anios) usuarioModificado.experiencia_anios = datosModificados.experiencia_anios;
    if (datosModificados.dias_entrenamiento) usuarioModificado.dias_entrenamiento = datosModificados.dias_entrenamiento;
    if (datosModificados.tiempo_por_sesion_min) usuarioModificado.tiempo_por_sesion_min = datosModificados.tiempo_por_sesion_min;

    // Objetivo y equipamiento
    if (datosModificados.objetivo) usuarioModificado.objetivo = datosModificados.objetivo;
    if (datosModificados.nivel) usuarioModificado.nivel = datosModificados.nivel;
    if (datosModificados.equipamiento) usuarioModificado.equipamiento = datosModificados.equipamiento;

    // Limitaciones
    if (datosModificados.limitaciones && datosModificados.limitaciones.length > 0) {
        usuarioModificado.limitaciones = datosModificados.limitaciones;
    }

    // Fuerzas máximas (1RM)
    if (!usuarioModificado.fuerzaMaxima) usuarioModificado.fuerzaMaxima = {};

    if (datosModificados.empuje_horizontal) usuarioModificado.fuerzaMaxima.empuje_horizontal = datosModificados.empuje_horizontal;
    if (datosModificados.traccion_horizontal) usuarioModificado.fuerzaMaxima.traccion_horizontal = datosModificados.traccion_horizontal;
    if (datosModificados.empuje_vertical) usuarioModificado.fuerzaMaxima.empuje_vertical = datosModificados.empuje_vertical;
    if (datosModificados.traccion_vertical) usuarioModificado.fuerzaMaxima.traccion_vertical = datosModificados.traccion_vertical;
    if (datosModificados.cuadriceps) usuarioModificado.fuerzaMaxima.cuadriceps = datosModificados.cuadriceps;
    if (datosModificados.cadena_posterior) usuarioModificado.fuerzaMaxima.cadena_posterior = datosModificados.cadena_posterior;
    if (datosModificados.gluteos) usuarioModificado.fuerzaMaxima.gluteos = datosModificados.gluteos;

    return usuarioModificado;
}

/**
 * Recalcular propiedades derivadas del usuario
 * IMC, nivel NICROSS, etc
 */
export function recalcularPropiedadesUsuario(usuario) {
    // Calcular IMC
    const alturaMetros = usuario.altura_cm / 100;
    const imc = usuario.peso_kg / (alturaMetros ** 2);

    const categoriaIMC = imc < 18.5 ? "bajo_peso" :
        imc < 25 ? "normopeso" :
            imc < 30 ? "sobrepeso" :
                imc < 35 ? "obesidad_grado_1" :
                    imc < 40 ? "obesidad_grado_2" : "obesidad_grado_3";

    usuario.imc = {
        imc: Math.round(imc * 100) / 100,
        categoria_imc: categoriaIMC
    };

    // Recalcular nivel NICROSS
    const exp = usuario.experiencia_anios;
    const dias = usuario.dias_entrenamiento;

    let nivelNicross = "N1_sedentario";
    if (exp === 0 || dias <= 1) nivelNicross = "N1_sedentario";
    else if (exp < 1) nivelNicross = "N2_inicial_activo";
    else if (exp >= 1 && exp <= 3) nivelNicross = "N3_intermedio";
    else nivelNicross = "N4_avanzado";

    usuario.nivel_nicross = nivelNicross;

    return usuario;
}

/**
 * Validar que los datos sean correctos
 */
export function validarDatos(datos) {
    const errores = [];

    if (!datos.peso_kg || datos.peso_kg < 30 || datos.peso_kg > 200) {
        errores.push("❌ Peso debe estar entre 30 y 200 kg");
    }

    if (!datos.altura_cm || datos.altura_cm < 130 || datos.altura_cm > 230) {
        errores.push("❌ Altura debe estar entre 130 y 230 cm");
    }

    if (!datos.edad || datos.edad < 15 || datos.edad > 100) {
        errores.push("❌ Edad debe estar entre 15 y 100 años");
    }

    if (!datos.experiencia_anios || datos.experiencia_anios < 0) {
        errores.push("❌ Experiencia no puede ser negativa");
    }

    if (!datos.dias_entrenamiento || datos.dias_entrenamiento < 2 || datos.dias_entrenamiento > 6) {
        errores.push("❌ Días de entrenamiento deben estar entre 2 y 6");
    }

    if (errores.length > 0) {
        console.error("%c⚠️ ERRORES DE VALIDACIÓN:", "color: #ff4444; font-weight: bold;");
        errores.forEach(err => console.error(`%c${err}`, "color: #ff6666;"));
        return false;
    }

    return true;
}

/**
 * Mostrar resumen de cambios
 */
export function mostrarResumenDatos(datosOriginales, datosModificados) {
    console.log("%c╔════════════════════════════════════════════════════════════╗", "color: #00ffff;");
    console.log("%c║         📊 RESUMEN DE DATOS CARGADOS                       ║", "color: #00ffff;");
    console.log("%c╚════════════════════════════════════════════════════════════╝", "color: #00ffff;");

    const cambios = [];

    // Comparar datos
    const propiedades = ["peso_kg", "altura_cm", "edad", "experiencia_anios", "dias_entrenamiento",
        "objetivo", "equipamiento"];

    propiedades.forEach(prop => {
        const original = datosOriginales[prop];
        const modificado = datosModificados[prop];

        if (original !== modificado && modificado !== undefined) {
            cambios.push({ prop, original, modificado });
        }
    });

    if (cambios.length === 0) {
        console.log("%c✓ Sin cambios detectados", "color: #88ff88;");
    } else {
        console.log("%c CAMBIOS DETECTADOS:", "color: #ffff00; font-weight: bold;");
        cambios.forEach(({ prop, original, modificado }) => {
            console.log(`%c  ${prop.toUpperCase()}: ${original} → ${modificado}`, "color: #ffaa00;");
        });
    }

    console.log(`%c\n📋 DATOS COMPLETOS:`, "color: #00ff88; font-weight: bold;");
    console.log(`%c  Peso: ${datosModificados.peso_kg} kg`, "color: #cccccc;");
    console.log(`%c  Altura: ${datosModificados.altura_cm} cm`, "color: #cccccc;");
    console.log(`%c  Edad: ${datosModificados.edad} años`, "color: #cccccc;");
    console.log(`%c  Experiencia: ${datosModificados.experiencia_anios} años`, "color: #cccccc;");
    console.log(`%c  Días/semana: ${datosModificados.dias_entrenamiento}`, "color: #cccccc;");
    console.log(`%c  Objetivo: ${datosModificados.objetivo}`, "color: #cccccc;");
    console.log(`%c  Equipamiento: ${datosModificados.equipamiento}`, "color: #cccccc;");
    console.log(`%c  Tiempo/sesión: ${datosModificados.tiempo_por_sesion_min} min`, "color: #cccccc;");

    console.log(`%c\n💪 FUERZAS MÁXIMAS (1RM):`, "color: #00ff88; font-weight: bold;");
    console.log(`%c  Empuje Horizontal: ${datosModificados.empuje_horizontal} kg`, "color: #cccccc;");
    console.log(`%c  Tracción Horizontal: ${datosModificados.traccion_horizontal} kg`, "color: #cccccc;");
    console.log(`%c  Empuje Vertical: ${datosModificados.empuje_vertical} kg`, "color: #cccccc;");
    console.log(`%c  Tracción Vertical: ${datosModificados.traccion_vertical} kg`, "color: #cccccc;");
    console.log(`%c  Cuádriceps: ${datosModificados.cuadriceps} kg`, "color: #cccccc;");
    console.log(`%c  Cadena Posterior: ${datosModificados.cadena_posterior} kg`, "color: #cccccc;");
    console.log(`%c  Glúteos: ${datosModificados.gluteos} kg`, "color: #cccccc;");
}
