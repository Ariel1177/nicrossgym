// ================================================================
// NICROSS DASHBOARD — main.js
// Reutiliza el pipeline existente SIN MODIFICARLO
// ================================================================

import { usuario } from '../data/usuario.js';
import { splitsSemanales } from '../data/splitSemanales.js';
import { generarSemanaCompleta } from '../training/generadorSemanaReal.js';
import { parametrosPorBloque } from '../training/parametrosPorBloque.js';

// ────────────────────────────────────────────────────────────────
// 1. CONSTRUIR ARRAY COMPLETO (igual que app1.js)
// ────────────────────────────────────────────────────────────────
const usuario_nicross = usuario.map((u) => {
    const splitU = splitsSemanales[u.dias_entrenamiento];
    const semanaU = generarSemanaCompleta(u, u.nivel_nicross, splitU, parametrosPorBloque);
    return {
        ...u,
        semana_entrenamiento: semanaU
    };
});

// ────────────────────────────────────────────────────────────────
// 2. ESTADO GLOBAL
// ────────────────────────────────────────────────────────────────
let currentIndex = 0;

// ────────────────────────────────────────────────────────────────
// 3. HELPERS
// ────────────────────────────────────────────────────────────────
const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const NIVEL_DESC = {
    N1_sedentario: 'Sedentario',
    N2_inicial_activo: 'Inicial Activo',
    N3_intermedio: 'Intermedio',
    N4_avanzado: 'Avanzado'
};
const OBJ_BADGE = {
    hipertrofia: 'badge-green',
    fuerza: 'badge-orange',
    perder_grasa: 'badge-yellow',
    tonificacion: 'badge-cyan',
    recomposicion_corporal: 'badge-purple',
    gluteos_hipertrofia: 'badge-purple',
};
const RM_LABELS = {
    empuje_horizontal: 'Press Banca',
    traccion_horizontal: 'Remo',
    empuje_vertical: 'Press Hombro',
    traccion_vertical: 'Dominadas',
    cuadriceps: 'Sentadilla',
    cadena_posterior: 'Peso Muerto',
    gluteos: 'Hip Thrust',
    pantorrillas: 'Pantorrillas',
};
const IMC_LABELS = {
    bajo_peso: { label: 'Bajo Peso', cls: 'accent', pct: 8 },
    normopeso: { label: 'Normopeso', cls: 'green', pct: 35 },
    sobrepeso: { label: 'Sobrepeso', cls: 'yellow', pct: 55 },
    obesidad_grado_1: { label: 'Obesidad I', cls: 'orange', pct: 70 },
    obesidad_grado_2: { label: 'Obesidad II', cls: 'red', pct: 85 },
    obesidad_grado_3: { label: 'Obesidad III', cls: 'red', pct: 95 },
};

function esc(s) {
    if (s == null) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function fmt(s) {
    if (!s) return '—';
    return String(s).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
function calcImcPct(imcVal) {
    // Mapeo lineal: 15→0%, 16→5%, 18.5→25%, 25→48%, 30→65%, 35→80%, 40→95%
    const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
    const pct = clamp(((imcVal - 15) / (40 - 15)) * 100, 2, 96);
    return pct.toFixed(1);
}
function maxRM(fm) {
    return Math.max(...Object.values(RM_LABELS).map((_, i) => {
        const key = Object.keys(RM_LABELS)[i];
        return fm[key] || 0;
    }), 1);
}

// ────────────────────────────────────────────────────────────────
// 4. RENDER PANEL IZQUIERDO
// ────────────────────────────────────────────────────────────────
function renderLeft(u) {
    const isMale = u.sexo === 'masculino';
    const avatarEmoji = isMale ? '👨‍💪' : '👩‍💪';
    const avatarCls = isMale ? 'masc' : 'fem';
    const limitHtml = u.limitaciones && u.limitaciones.length
        ? u.limitaciones.map(l => `<span class="limit-tag">⚠️ ${fmt(l)}</span>`).join('')
        : '<span class="data-value green">Ninguna</span>';

    const objBadgeCls = OBJ_BADGE[u.objetivo] || 'badge-cyan';

    return `
    <!-- NAV -->
    <div class="user-nav">
        <button class="nav-btn" id="btn-prev">◀</button>
        <div class="nav-info">
            <div class="nav-index">${currentIndex + 1} / ${usuario_nicross.length}</div>
            <div class="nav-name">${esc(u.id)}</div>
        </div>
        <button class="nav-btn" id="btn-next">▶</button>
    </div>

    <!-- AVATAR -->
    <div class="user-header">
        <div class="user-avatar ${avatarCls}">${avatarEmoji}</div>
        <div>
            <div class="user-id">${esc(u.id)}</div>
            <div class="user-full-name">${esc(u.nombre)}</div>
            <div class="user-sub">${esc(u.sexo.charAt(0).toUpperCase() + u.sexo.slice(1))} · ${u.edad} años</div>
        </div>
    </div>

    <!-- DATOS PERSONALES -->
    <div class="data-block">
        <div class="data-block-title">📋 Datos Personales</div>
        <div class="data-row"><span class="data-label">Nombre</span><span class="data-value">${esc(u.nombre)}</span></div>
        <div class="data-row"><span class="data-label">Nacimiento</span><span class="data-value">${esc(u.fecha_nacimiento)}</span></div>
        <div class="data-row"><span class="data-label">Edad</span><span class="data-value accent">${u.edad} años</span></div>
        <div class="data-row"><span class="data-label">Sexo</span><span class="data-value">${fmt(u.sexo)}</span></div>
        <div class="data-row"><span class="data-label">Ingreso al programa</span><span class="data-value">${esc(u.fecha_ingreso)}</span></div>
        <div class="data-row"><span class="data-label">En programa</span><span class="data-value green">${u.dias_en_programa?.dias} días</span></div>
    </div>

    <!-- DATOS FÍSICOS -->
    <div class="data-block">
        <div class="data-block-title">📏 Datos Antropométricos</div>
        <div class="data-row"><span class="data-label">Altura</span><span class="data-value">${u.altura_cm} cm</span></div>
        <div class="data-row"><span class="data-label">Peso</span><span class="data-value">${u.peso_kg} kg</span></div>
        <div class="data-row"><span class="data-label">IMC</span><span class="data-value ${IMC_LABELS[u.imc?.categoria_imc]?.cls || 'green'}">${u.imc?.imc}</span></div>
        <div class="data-row"><span class="data-label">Categoría</span><span class="data-value ${IMC_LABELS[u.imc?.categoria_imc]?.cls || 'green'}">${IMC_LABELS[u.imc?.categoria_imc]?.label || '—'}</span></div>
    </div>

    <!-- PERFIL ENTRENAMIENTO -->
    <div class="data-block">
        <div class="data-block-title">💪 Perfil de Entrenamiento</div>
        <div class="data-row"><span class="data-label">Nivel declarado</span><span class="data-value">${fmt(u.nivel)}</span></div>
        <div class="data-row"><span class="data-label">Experiencia</span><span class="data-value">${u.experiencia_anios} años</span></div>
        <div class="data-row">
            <span class="data-label">Objetivo</span>
            <span><span class="badge ${objBadgeCls}">${fmt(u.objetivo)}</span></span>
        </div>
        <div class="data-row"><span class="data-label">Días/semana</span><span class="data-value accent">${u.dias_entrenamiento}</span></div>
        <div class="data-row"><span class="data-label">Tiempo/sesión</span><span class="data-value">${u.tiempo_por_sesion_min} min</span></div>
        <div class="data-row"><span class="data-label">Equipamiento</span><span class="data-value">${fmt(u.equipamiento)}</span></div>
    </div>

    <!-- LIMITACIONES -->
    <div class="data-block">
        <div class="data-block-title">⚠️ Limitaciones</div>
        <div class="data-row" style="flex-wrap:wrap;gap:4px">${limitHtml}</div>
    </div>
    `;
}

// ────────────────────────────────────────────────────────────────
// 5. RENDER PANEL CENTRAL (RUTINAS)
// ────────────────────────────────────────────────────────────────
function renderCenter(u) {
    const semana = u.semana_entrenamiento;
    if (!semana || !semana.dias || semana.dias.length === 0) {
        return `<p style="color:var(--muted);padding:16px">No se generó semana de entrenamiento.</p>`;
    }

    const headerHtml = `
    <div class="section-title">📅 Semana de Entrenamiento — ${esc(semana.resumen?.total_dias || semana.dias.length)} días</div>
    `;

    const diasHtml = semana.dias.map((dia, idx) => {
        const diaNombre = DIAS_SEMANA[idx] || `Día ${idx + 1}`;
        const focoFmt = fmt(dia.foco);
        const seriesTotal = dia.total_series || 0;

        const bloquesHtml = (dia.bloques || []).map((blq, bi) => {
            const ejerciciosHtml = (blq.ejercicios || []).map(ej => {
                const kgTxt = ej.carga_kg != null ? `${ej.carga_kg} kg` : '—';
                // VALOR EXACTO: mostrar repeticiones como número único, no rango
                const repsTxt = (ej.repeticiones_min != null)
                    ? `${ej.repeticiones_min}`  // Valor exacto (repeticiones_min === repeticiones_max)
                    : '—';
                const descanso = ej.descanso_seg
                    ? (ej.descanso_seg.min ? `${ej.descanso_seg.min}-${ej.descanso_seg.max}s` : `${ej.descanso_seg}s`)
                    : '—';
                const tempo = ej.tempo
                    ? (ej.tempo.excentric != null ? `${ej.tempo.excentric}-${ej.tempo.pause}-${ej.tempo.concentric}` : '—')
                    : '—';

                return `
                <div class="ejercicio-row">
                    <div>
                        <div class="ej-nombre">${esc(ej.nombre || 'Ejercicio')}</div>
                        <div class="ej-patron">${fmt(ej.patron || '')}</div>
                    </div>
                    <div class="ej-pill pill-series">
                        <span class="ej-pill-label">Series</span>
                        <span class="ej-pill-value">${ej.series || '—'}</span>
                    </div>
                    <div class="ej-pill pill-reps">
                        <span class="ej-pill-label">Reps</span>
                        <span class="ej-pill-value">${repsTxt}</span>
                    </div>
                    <div class="ej-pill pill-kg">
                        <span class="ej-pill-label">Carga</span>
                        <span class="ej-pill-value">${kgTxt}</span>
                    </div>
                    <div class="ej-pill pill-rest">
                        <span class="ej-pill-label">Desc.</span>
                        <span class="ej-pill-value" style="font-size:10px">${descanso}</span>
                    </div>
                </div>
                ${tempo !== '—' ? `<div class="tempo-row"><span>Tempo:</span> ${tempo}</div>` : ''}
                `;
            }).join('');

            return `
            <div class="bloque-card">
                <div class="bloque-header">
                    <div class="bloque-num">${bi + 1}</div>
                    <div class="bloque-tipo">${fmt(blq.tipo || blq.nombre || 'Bloque')}</div>
                </div>
                ${ejerciciosHtml || '<div style="padding:10px 12px;color:var(--muted);font-size:11px">Sin ejercicios asignados</div>'}
            </div>
            `;
        }).join('');

        return `
        <div class="day-card${idx === 0 ? ' open' : ''}" data-idx="${idx}">
            <div class="day-header">
                <div class="day-left">
                    <div class="day-badge">${idx + 1}</div>
                    <div>
                        <div class="day-name">${diaNombre}</div>
                        <div class="day-foco">${focoFmt}</div>
                    </div>
                </div>
                <div class="day-meta">
                    ${seriesTotal > 0 ? `<div class="day-series-pill">${seriesTotal} series</div>` : ''}
                    <span class="day-chevron">▼</span>
                </div>
            </div>
            <div class="day-body">
                ${bloquesHtml || '<div style="color:var(--muted);font-size:11px">Sin bloques para este día.</div>'}
            </div>
        </div>
        `;
    }).join('');

    return `${headerHtml}<div class="days-grid">${diasHtml}</div>`;
}

// ────────────────────────────────────────────────────────────────
// 6. RENDER PANEL DERECHO
// ────────────────────────────────────────────────────────────────
function renderRight(u) {
    const nivelDesc = NIVEL_DESC[u.nivel_nicross] || u.nivel_nicross || '—';
    const imc = u.imc || {};
    const imcPct = imc.imc ? calcImcPct(imc.imc) : 35;
    const fm = u.fuerzaMaxima || {};
    const maxRm = Math.max(...Object.keys(RM_LABELS).map(k => fm[k] || 0), 1);

    // Barras 1RM
    const rmBars = Object.entries(RM_LABELS).map(([key, label]) => {
        const kg = fm[key] || 0;
        const pct = Math.round((kg / maxRm) * 100);
        return `
        <div class="rm-item">
            <div class="rm-top"><span class="rm-name">${label}</span><span class="rm-kg">${kg} kg</span></div>
            <div class="rm-bar-bg"><div class="rm-bar-fill" style="width:${pct}%"></div></div>
        </div>
        `;
    }).join('');

    // Split table
    const splitDias = u.split_semanal_recomendado?.dias || [];
    const splitTable = splitDias.map((d, i) => `
        <tr>
            <td class="td-day">${DIAS_SEMANA[i]?.slice(0, 3) || `D${i + 1}`}</td>
            <td class="td-foco">${fmt(d.foco)}</td>
            <td class="td-enf">${fmt(d.enfasis)}</td>
        </tr>
    `).join('');

    // Semanas en programa (para el ring)
    const semanas = u.dias_en_programa?.semanas || 0;
    const ringPct = Math.min((semanas / 52) * 100, 100);
    const ringCirc = 2 * Math.PI * 28;
    const ringDash = ((100 - ringPct) / 100) * ringCirc;

    // Próx cumple
    const cumple = u.dias_hasta_cumpleaños || {};
    const cumpleHtml = cumple.cumple_hoy
        ? `<span class="cumple-days">🎂 ¡HOY!</span>`
        : `<span class="cumple-days">${cumple.dias}</span><span class="cumple-msg">días para su cumpleaños<br><small>${cumple.proxima_fecha || ''}</small></span>`;

    return `
    <!-- NIVEL NICROSS -->
    <div class="section-title">⚡ Sistema NICROSS</div>
    <div class="level-card">
        <div class="level-label">Clasificación NICROSS</div>
        <div class="level-value">${esc(u.nivel_nicross || '—')}</div>
        <div class="level-desc">${nivelDesc}</div>
    </div>

    <!-- IMC GAUGE -->
    <div class="data-block" style="margin-bottom:10px">
        <div class="data-block-title">📊 Índice de Masa Corporal</div>
        <div style="padding:10px 12px">
            <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                <span style="font-size:22px;font-weight:800;color:var(--${IMC_LABELS[imc.categoria_imc]?.cls || 'green'})">${imc.imc || '—'}</span>
                <span class="badge badge-${IMC_LABELS[imc.categoria_imc]?.cls === 'green' ? 'green' : IMC_LABELS[imc.categoria_imc]?.cls === 'yellow' ? 'yellow' : 'orange'}">${IMC_LABELS[imc.categoria_imc]?.label || '—'}</span>
            </div>
            <div class="imc-bar-wrap">
                <div class="imc-bar-bg">
                    <div class="imc-cursor" style="left:${imcPct}%"></div>
                </div>
            </div>
            <div style="display:flex;justify-content:space-between;margin-top:4px;font-size:9px;color:var(--muted)">
                <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40+</span>
            </div>
        </div>
    </div>

    <!-- EN PROGRAMA -->
    <div class="progress-ring">
        <svg class="ring-svg" width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="var(--border)" stroke-width="5"/>
            <circle cx="32" cy="32" r="28" fill="none"
                stroke="url(#grad)" stroke-width="5"
                stroke-dasharray="${ringCirc.toFixed(1)}"
                stroke-dashoffset="${ringDash.toFixed(1)}"
                stroke-linecap="round"
                transform="rotate(-90 32 32)"/>
            <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#7c3aed"/>
                    <stop offset="100%" stop-color="#00e5ff"/>
                </linearGradient>
            </defs>
        </svg>
        <div class="ring-info">
            <div class="ring-title">En el programa</div>
            <div class="ring-value">${u.dias_en_programa?.semanas || 0} <span style="font-size:14px;font-weight:400">semanas</span></div>
            <div class="ring-sub">${u.dias_en_programa?.dias || 0} días · ${u.dias_en_programa?.meses || 0} meses</div>
        </div>
    </div>

    <!-- CUMPLEAÑOS -->
    <div class="cumple-card">
        <div class="cumple-icon">🎂</div>
        <div>${cumpleHtml}</div>
    </div>

    <!-- 1RM ESTIMADOS -->
    <div class="section-title">⚖️ Fuerzas Máx. (1RM estimado)</div>
    <div class="data-block" style="margin-bottom:10px">
        <div style="padding:12px">${rmBars}</div>
    </div>

    <!-- SPLIT SEMANAL -->
    <div class="section-title">📅 Split Semanal</div>
    <div class="data-block" style="margin-bottom:10px">
        <div class="data-block-title">${esc(u.split_semanal_recomendado?.nombre || '—')}</div>
        <div style="padding:4px 0">
            <table class="split-table">
                <tbody>${splitTable}</tbody>
            </table>
        </div>
    </div>
    `;
}

// ────────────────────────────────────────────────────────────────
// 7. RENDER COMPLETO
// ────────────────────────────────────────────────────────────────
function render() {
    const u = usuario_nicross[currentIndex];

    document.getElementById('panel-left').innerHTML = renderLeft(u);
    document.getElementById('panel-center').innerHTML = renderCenter(u);
    document.getElementById('panel-right').innerHTML = renderRight(u);

    // Header global
    document.getElementById('total-users').textContent = usuario_nicross.length;
    document.getElementById('header-split').textContent = u.split_semanal_recomendado?.nombre?.replace(/_/g, ' ') || '—';
    document.getElementById('header-nivel').textContent = u.nivel_nicross || '—';

    // Botones nav
    document.getElementById('btn-prev').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + usuario_nicross.length) % usuario_nicross.length;
        render();
    });
    document.getElementById('btn-next').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % usuario_nicross.length;
        render();
    });

    // Acordeón días
    document.querySelectorAll('.day-header').forEach(h => {
        h.addEventListener('click', () => {
            const card = h.parentElement;
            card.classList.toggle('open');
        });
    });
}

// ────────────────────────────────────────────────────────────────
// 8. INIT
// ────────────────────────────────────────────────────────────────
render();
