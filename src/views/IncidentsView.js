// ============================================================================
// CloudPulse - View: Incidents & Alerts Center
// ============================================================================

import { store } from '../state/store.js';

let selectedIncidentTab = 'ALL'; // 'ALL' | 'ACTIVE' | 'RESOLVED'

export function renderIncidentsView() {
  const state = store.getState();
  const { incidents } = state;

  const activeIncidents = incidents.filter(i => i.status === 'ACTIVE');
  const resolvedIncidents = incidents.filter(i => i.status === 'RESOLVED');

  return `
    <div id="incidents-view-container" class="space-y-6">
      <!-- Resumen de Alertas y Severidades -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div class="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
          <div>
            <span class="text-xs text-zinc-500 font-semibold uppercase tracking-wider block">Incidentes Activos</span>
            <span class="text-2xl font-bold ${activeIncidents.length > 0 ? 'text-red-400' : 'text-emerald-400'} font-mono mt-1 block">
              ${activeIncidents.length}
            </span>
          </div>
          <span class="text-xs font-mono ${activeIncidents.length > 0 ? 'text-red-400 bg-red-950/40 border-red-800/30' : 'text-emerald-400 bg-emerald-950/40 border-emerald-800/30'} border px-2.5 py-1 rounded-lg">
            ${activeIncidents.length > 0 ? 'Acción Requerida' : 'Normal'}
          </span>
        </div>

        <div class="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
          <div>
            <span class="text-xs text-zinc-500 font-semibold uppercase tracking-wider block">Resueltos en este ciclo</span>
            <span class="text-2xl font-bold text-zinc-200 font-mono mt-1 block">${resolvedIncidents.length}</span>
          </div>
          <span class="text-xs font-mono text-zinc-400 bg-zinc-800/80 border border-zinc-700/50 px-2.5 py-1 rounded-lg">MTTR: 4.2 min</span>
        </div>

        <div class="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
          <div>
            <span class="text-xs text-zinc-500 font-semibold uppercase tracking-wider block">Disponibilidad SLA</span>
            <span class="text-2xl font-bold text-white font-mono mt-1 block">99.98%</span>
          </div>
          <span class="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/30 px-2.5 py-1 rounded-lg">Cumpliendo</span>
        </div>
      </div>

      <!-- Barra de Filtros -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-1.5 bg-zinc-900/60 p-1 rounded-xl border border-zinc-800/80">
          <button data-tab="ALL" class="incident-tab-btn text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${selectedIncidentTab === 'ALL' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}">
            Todos (${incidents.length})
          </button>
          <button data-tab="ACTIVE" class="incident-tab-btn text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${selectedIncidentTab === 'ACTIVE' ? 'bg-red-500/20 text-red-300' : 'text-zinc-400 hover:text-white'}">
            Activos (${activeIncidents.length})
          </button>
          <button data-tab="RESOLVED" class="incident-tab-btn text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${selectedIncidentTab === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-300' : 'text-zinc-400 hover:text-white'}">
            Resueltos (${resolvedIncidents.length})
          </button>
        </div>

        ${activeIncidents.length > 0 ? `
          <button id="btn-resolve-all-incidents" class="text-xs px-3.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all font-medium flex items-center gap-1.5 self-start sm:self-auto">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Resolver Todos los Incidentes
          </button>
        ` : ''}
      </div>

      <!-- Feed de Incidentes con Línea de Tiempo -->
      <div class="space-y-4" id="incidents-feed">
        ${renderIncidentCards(incidents, selectedIncidentTab)}
      </div>
    </div>
  `;
}

function renderIncidentCards(incidents, tab) {
  const filtered = incidents.filter(i => {
    if (tab === 'ALL') return true;
    return i.status === tab;
  });

  if (filtered.length === 0) {
    return `
      <div class="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-10 text-center space-y-2">
        <svg class="w-8 h-8 text-emerald-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-sm font-semibold text-white">No hay incidentes registrados</p>
        <p class="text-xs text-zinc-500 font-mono">Todos los microservicios y clústeres operan con normalidad.</p>
      </div>
    `;
  }

  return filtered.map(inc => {
    const isActive = inc.status === 'ACTIVE';
    const isP1 = inc.severity === 'P1';
    const isP2 = inc.severity === 'P2';

    const severityBadge = isP1
      ? 'bg-red-950/80 border-red-800 text-red-300'
      : isP2
      ? 'bg-amber-950/80 border-amber-800 text-amber-300'
      : 'bg-blue-950/80 border-blue-800 text-blue-300';

    const cardBorder = isActive
      ? 'border-red-500/40 bg-gradient-to-b from-red-950/20 to-zinc-900/50 shadow-[0_0_25px_rgba(239,68,68,0.08)]'
      : 'border-zinc-800/80 bg-zinc-900/40';

    return `
      <div class="border ${cardBorder} rounded-2xl p-5 sm:p-6 transition-all space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-xs font-mono font-bold text-zinc-400">${inc.id}</span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-full border ${severityBadge} font-bold">
                ${inc.severity} ${inc.severity === 'P1' ? 'Crítico' : inc.severity === 'P2' ? 'Advertencia' : 'Informativo'}
              </span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-full border ${isActive ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}">
                ${inc.status}
              </span>
            </div>
            <h3 class="text-sm font-bold text-white mt-1.5">${inc.title}</h3>
            <p class="text-xs text-zinc-400 mt-1">${inc.description}</p>
          </div>

          <div class="text-right shrink-0">
            <span class="text-[11px] text-zinc-500 font-mono block">Detectado: ${inc.detectedAt}</span>
            ${inc.resolvedAt ? `<span class="text-[11px] text-emerald-400 font-mono block mt-0.5">Resuelto: ${inc.resolvedAt}</span>` : ''}
          </div>
        </div>

        <!-- Timeline / Ciclo de Vida -->
        <div class="pt-3 border-t border-zinc-800/60">
          <span class="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider block mb-3 font-mono">Secuencia de Eventos (Timeline)</span>
          <div class="space-y-3 relative pl-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
            ${inc.timeline.map((event, idx) => `
              <div class="relative flex items-start gap-3 text-xs">
                <span class="absolute -left-4 top-1.5 w-2 h-2 rounded-full ${idx === inc.timeline.length - 1 && isActive ? 'bg-red-400 ring-4 ring-red-950' : 'bg-zinc-600'}"></span>
                <span class="font-mono text-zinc-500 shrink-0 text-[11px]">${event.time}</span>
                <span class="text-zinc-300 font-sans flex-1">${event.action}</span>
                <span class="text-[10px] font-mono text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded border border-zinc-700/50 shrink-0">${event.actor}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

export function updateIncidentsView(state) {
  const feed = document.getElementById('incidents-feed');
  if (feed) {
    feed.innerHTML = renderIncidentCards(state.incidents, selectedIncidentTab);
  }
}

export function setupIncidentsInteractions() {
  document.querySelectorAll('.incident-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedIncidentTab = btn.getAttribute('data-tab');
      const container = document.getElementById('incidents-view-container');
      if (container) {
        container.outerHTML = renderIncidentsView();
        setupIncidentsInteractions();
      }
    });
  });

  const resolveAllBtn = document.getElementById('btn-resolve-all-incidents');
  if (resolveAllBtn) {
    resolveAllBtn.addEventListener('click', () => {
      store.restoreCluster();
    });
  }
}
