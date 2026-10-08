// ============================================================================
// CloudPulse - View: Services & Nodes Registry
// ============================================================================

import { store } from '../state/store.js';

let activeFilter = 'ALL';

export function renderServicesView() {
  const state = store.getState();
  const services = state.services;

  const totalServices = services.length;
  const operationalCount = services.filter(s => s.status === 'operational').length;
  const degradedCount = services.filter(s => s.status !== 'operational').length;

  return `
    <div id="services-view-container" class="space-y-6">
      <!-- Resumen de Estado de Nodos -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div class="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
          <div>
            <span class="text-xs text-zinc-500 font-semibold uppercase tracking-wider block">Nodos Totales</span>
            <span class="text-2xl font-bold text-white font-mono mt-1 block">${totalServices}</span>
          </div>
          <span class="text-xs font-mono text-zinc-400 bg-zinc-800/80 border border-zinc-700/50 px-2.5 py-1 rounded-lg">Multi-AZ</span>
        </div>

        <div class="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
          <div>
            <span class="text-xs text-zinc-500 font-semibold uppercase tracking-wider block">Operacionales</span>
            <span class="text-2xl font-bold text-emerald-400 font-mono mt-1 block">${operationalCount} / ${totalServices}</span>
          </div>
          <span class="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/30 px-2.5 py-1 rounded-lg">100% SLA</span>
        </div>

        <div class="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
          <div>
            <span class="text-xs text-zinc-500 font-semibold uppercase tracking-wider block">Degradados / Alertas</span>
            <span class="text-2xl font-bold ${degradedCount > 0 ? 'text-red-400' : 'text-zinc-400'} font-mono mt-1 block">${degradedCount}</span>
          </div>
          <span class="text-xs font-mono ${degradedCount > 0 ? 'text-red-400 bg-red-950/40 border-red-800/30' : 'text-zinc-500 bg-zinc-800/40 border-zinc-800'} border px-2.5 py-1 rounded-lg">
            ${degradedCount > 0 ? 'Requiere Atención' : 'Saludable'}
          </span>
        </div>
      </div>

      <!-- Barra de Filtros y Búsqueda -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-1.5 bg-zinc-900/60 p-1 rounded-xl border border-zinc-800/80">
          <button data-filter="ALL" class="service-filter-btn text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${activeFilter === 'ALL' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}">
            Todos (${totalServices})
          </button>
          <button data-filter="operational" class="service-filter-btn text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${activeFilter === 'operational' ? 'bg-emerald-500/20 text-emerald-300' : 'text-zinc-400 hover:text-white'}">
            Operacionales (${operationalCount})
          </button>
          <button data-filter="degraded" class="service-filter-btn text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${activeFilter === 'degraded' ? 'bg-red-500/20 text-red-300' : 'text-zinc-400 hover:text-white'}">
            Degradados (${degradedCount})
          </button>
        </div>

        <div class="text-xs text-zinc-500 font-mono">
          Región principal: <span class="text-zinc-300">us-east-1 (N. Virginia)</span>
        </div>
      </div>

      <!-- Lista Detallada de Microservicios -->
      <div class="space-y-4" id="services-detailed-list">
        ${renderServicesList(services, activeFilter)}
      </div>
    </div>
  `;
}

function renderServicesList(services, filter) {
  const filtered = services.filter(s => {
    if (filter === 'ALL') return true;
    return s.status === filter;
  });

  if (filtered.length === 0) {
    return `
      <div class="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-500 text-xs font-mono">
        No se encontraron servicios bajo el filtro seleccionado.
      </div>
    `;
  }

  return filtered.map(srv => {
    const isDegraded = srv.status === 'degraded';
    const isDown = srv.status === 'down';

    return `
      <div class="bg-zinc-900/40 border ${isDegraded ? 'border-red-500/40 bg-red-950/10' : 'border-zinc-800/80'} rounded-2xl p-5 sm:p-6 transition-all space-y-4 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isDegraded ? 'bg-red-950 text-red-400 border border-red-800/50' : 'bg-zinc-800/80 text-emerald-400 border border-zinc-700/50'}">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-bold text-white">${srv.name}</h3>
                <span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border ${isDegraded ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}">
                  ${srv.status}
                </span>
              </div>
              <p class="text-xs text-zinc-400 font-mono mt-0.5">${srv.stack} · ${srv.type} · <span class="text-zinc-500">${srv.region}</span></p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button data-restart-id="${srv.id}" class="btn-srv-restart text-xs px-3 py-1.5 rounded-xl border border-zinc-700 hover:border-zinc-500 bg-zinc-800/80 text-zinc-300 hover:text-white transition-all font-medium">
              Reiniciar
            </button>
            <button data-toggle-id="${srv.id}" class="btn-srv-toggle text-xs px-3 py-1.5 rounded-xl border ${isDegraded ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-red-500/30 bg-red-500/10 text-red-400'} hover:opacity-80 transition-all font-medium">
              ${isDegraded ? 'Restaurar' : 'Degradar'}
            </button>
          </div>
        </div>

        <!-- Telemetría clave del nodo -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/70 font-mono text-xs">
          <div>
            <span class="text-[10px] text-zinc-500 block uppercase">Latencia</span>
            <span class="${isDegraded ? 'text-red-400 font-bold' : 'text-zinc-200'}">${srv.latency} ms</span>
          </div>
          <div>
            <span class="text-[10px] text-zinc-500 block uppercase">Throughput</span>
            <span class="text-zinc-200">${srv.rps} req/s</span>
          </div>
          <div>
            <span class="text-[10px] text-zinc-500 block uppercase">Error Rate</span>
            <span class="${srv.errorRate === '0.00%' ? 'text-zinc-200' : 'text-red-400 font-bold'}">${srv.errorRate}</span>
          </div>
          <div>
            <span class="text-[10px] text-zinc-500 block uppercase">Uptime</span>
            <span class="text-emerald-400">${srv.uptime}</span>
          </div>
        </div>

        <!-- Endpoints activos -->
        <div>
          <span class="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2">Rutas y Métodos Principales</span>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
            ${srv.endpoints.map(ep => `
              <div class="flex items-center justify-between bg-zinc-900/60 px-3 py-2 rounded-lg border border-zinc-800/60">
                <span class="text-zinc-300 truncate pr-2"><span class="text-emerald-400 font-semibold">${ep.method}</span> ${ep.path}</span>
                <span class="text-zinc-400 shrink-0">${ep.latency}ms</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

export function updateServicesView(state) {
  const listContainer = document.getElementById('services-detailed-list');
  if (listContainer) {
    listContainer.innerHTML = renderServicesList(state.services, activeFilter);
    attachServiceButtons();
  }
}

export function setupServicesInteractions() {
  // Filtros
  document.querySelectorAll('.service-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.getAttribute('data-filter');
      const state = store.getState();
      const container = document.getElementById('services-view-container');
      if (container) {
        container.outerHTML = renderServicesView();
        setupServicesInteractions();
      }
    });
  });

  attachServiceButtons();
}

function attachServiceButtons() {
  document.querySelectorAll('.btn-srv-restart').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-restart-id');
      store.restartService(id);
    });
  });

  document.querySelectorAll('.btn-srv-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-toggle-id');
      store.toggleServiceStatus(id);
    });
  });
}
