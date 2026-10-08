// ============================================================================
// CloudPulse - View: Overview Dashboard
// ============================================================================

import { store } from '../state/store.js';
import { renderMetricCard } from '../components/MetricCard.js';
import { createTelemetryChartSvg } from '../components/Sparkline.js';

let serviceModalSelected = null;

export function renderOverviewView() {
  const state = store.getState();
  const { kpis, latencyHistory, services } = state;

  return `
    <div id="overview-view-container" class="space-y-6">
      <!-- 1. Grid de Métricas Principales (KPIs) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        ${renderMetricCard({
          id: 'kpi-uptime',
          title: 'Uptime Global',
          value: kpis.uptimeDuration,
          badge: kpis.uptimePercent,
          badgeType: 'positive',
          description: `
            <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Sin caídas no programadas
          `
        })}

        ${renderMetricCard({
          id: 'kpi-cpu',
          title: 'Consumo CPU',
          value: `${kpis.cpuPercent}%`,
          badge: kpis.cpuCores,
          badgeType: kpis.cpuPercent > 80 ? 'negative' : 'neutral',
          progressPercent: kpis.cpuPercent,
          progressColor: kpis.cpuPercent > 80 ? 'bg-red-400' : 'bg-emerald-400',
          description: `${kpis.cpuCores} activos`
        })}

        ${renderMetricCard({
          id: 'kpi-ram',
          title: 'Memoria RAM',
          value: `${kpis.ramPercent}%`,
          badge: kpis.ramUsage,
          badgeType: 'neutral',
          progressPercent: kpis.ramPercent,
          progressColor: 'bg-cyan-400',
          description: `${kpis.ramUsage} asignados`
        })}

        ${renderMetricCard({
          id: 'kpi-throughput',
          title: 'Throughput',
          value: `${kpis.throughput.toLocaleString()} req/s`,
          badge: '+12.4%',
          badgeType: 'positive',
          description: `Latencia media: ${kpis.latencyP50}ms`
        })}
      </div>

      <!-- 2. Gráfica de Telemetría en Tiempo Real (SVG Nativo Dinámico) -->
      <div class="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              Telemetría de Latencia en Vivo (Últimos 24 intervalos)
            </h2>
            <p class="text-xs text-zinc-400 mt-0.5">Percentiles de latencia y saturación calculados en tiempo real</p>
          </div>
          <div class="flex items-center gap-2">
            <span id="chart-p50" class="text-xs font-mono px-2.5 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-zinc-300">p50: ${kpis.latencyP50}ms</span>
            <span id="chart-p95" class="text-xs font-mono px-2.5 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-zinc-300">p95: ${kpis.latencyP95}ms</span>
            <span id="chart-p99" class="text-xs font-mono px-2.5 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-zinc-300">p99: ${kpis.latencyP99}ms</span>
          </div>
        </div>

        <div id="chart-container" class="h-44 sm:h-52 w-full relative">
          ${createTelemetryChartSvg(latencyHistory, {
            width: 800,
            height: 160,
            strokeColor: state.isStressTestActive ? '#ef4444' : '#10b981',
            gradientId: 'latencyGrad'
          })}
        </div>
      </div>

      <!-- 3. Topología de Microservicios -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-xs font-bold text-white uppercase tracking-wider">Topología de Microservicios y Clúster</h2>
            <span class="text-xs text-zinc-500">Haz clic en un servicio para inspeccionar endpoints y telemetría</span>
          </div>
          <a href="#/services" class="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors">Ver todos los nodos →</a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4" id="overview-services-grid">
          ${renderServicesCards(services)}
        </div>
      </div>

      <!-- Modal de Detalle de Microservicio -->
      <div id="service-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 hidden">
        <div class="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
          <div id="service-modal-content"></div>
        </div>
      </div>
    </div>
  `;
}

function renderServicesCards(services) {
  return services.map(srv => {
    const isDegraded = srv.status === 'degraded';
    const isDown = srv.status === 'down';
    const borderCls = isDegraded ? 'border-red-500/50 bg-red-950/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : isDown ? 'border-zinc-700/60 bg-zinc-900/60 opacity-60' : 'border-zinc-800/80 hover:border-zinc-700/80';
    const badgeCls = isDegraded ? 'bg-red-500/10 border-red-500/30 text-red-400' : isDown ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';

    return `
      <div class="service-card cursor-pointer bg-gradient-to-b from-zinc-900/60 to-zinc-900/30 border ${borderCls} rounded-2xl p-4 sm:p-5 transition-all hover:scale-[1.01]" data-service-id="${srv.id}">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-white flex items-center gap-2">
            <span class="w-2 h-2 rounded-full ${isDegraded ? 'bg-red-400 animate-ping' : isDown ? 'bg-zinc-600' : 'bg-emerald-400'}"></span>
            ${srv.name}
          </span>
          <span class="text-[10px] px-2.5 py-0.5 rounded-full border ${badgeCls} font-medium uppercase font-mono">
            ${srv.status}
          </span>
        </div>
        <p class="text-[11px] text-zinc-500 font-mono">${srv.stack}</p>

        <div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-zinc-800/60 text-[11px] font-mono">
          <div>
            <span class="text-zinc-500 block">Latencia</span>
            <span class="${isDegraded ? 'text-red-400 font-bold' : 'text-zinc-200'}">${srv.latency} ms</span>
          </div>
          <div class="text-right">
            <span class="text-zinc-500 block">RPS</span>
            <span class="text-zinc-200">${srv.rps} req/s</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

export function updateOverviewView(state) {
  const { kpis, latencyHistory, services } = state;

  // 1. Actualizar KPIs de texto
  const cpuVal = document.getElementById('kpi-cpu-val');
  const cpuBar = document.getElementById('kpi-cpu-bar');
  if (cpuVal) cpuVal.textContent = `${kpis.cpuPercent}%`;
  if (cpuBar) {
    cpuBar.style.width = `${kpis.cpuPercent}%`;
    cpuBar.className = `${kpis.cpuPercent > 80 ? 'bg-red-400' : 'bg-emerald-400'} h-full rounded-full transition-all duration-500 ease-out`;
  }

  const throughputVal = document.getElementById('kpi-throughput-val');
  if (throughputVal) throughputVal.textContent = `${kpis.throughput.toLocaleString()} req/s`;

  // 2. Actualizar Percentiles
  const p50 = document.getElementById('chart-p50');
  const p95 = document.getElementById('chart-p95');
  const p99 = document.getElementById('chart-p99');
  if (p50) p50.textContent = `p50: ${kpis.latencyP50}ms`;
  if (p95) p95.textContent = `p95: ${kpis.latencyP95}ms`;
  if (p99) p99.textContent = `p99: ${kpis.latencyP99}ms`;

  // 3. Actualizar Gráfica SVG
  const chartContainer = document.getElementById('chart-container');
  if (chartContainer) {
    chartContainer.innerHTML = createTelemetryChartSvg(latencyHistory, {
      width: 800,
      height: 160,
      strokeColor: state.isStressTestActive ? '#ef4444' : '#10b981',
      gradientId: 'latencyGrad'
    });
  }

  // 4. Actualizar Grid de Servicios
  const grid = document.getElementById('overview-services-grid');
  if (grid) {
    grid.innerHTML = renderServicesCards(services);
    attachCardEvents();
  }
}

export function setupOverviewInteractions() {
  attachCardEvents();

  const modal = document.getElementById('service-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  }
}

function attachCardEvents() {
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
      const serviceId = card.getAttribute('data-service-id');
      openServiceModal(serviceId);
    });
  });
}

function openServiceModal(serviceId) {
  const srv = store.getState().services.find(s => s.id === serviceId);
  const modal = document.getElementById('service-modal');
  const modalContent = document.getElementById('service-modal-content');
  if (!srv || !modal || !modalContent) return;

  modalContent.innerHTML = `
    <div class="flex items-center justify-between border-b border-zinc-800 pb-4">
      <div>
        <h3 class="text-base font-bold text-white flex items-center gap-2">
          ${srv.name}
          <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${srv.status === 'operational' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}">
            ${srv.status}
          </span>
        </h3>
        <p class="text-xs text-zinc-400 font-mono mt-0.5">${srv.stack} · ${srv.region}</p>
      </div>
      <button id="btn-close-modal" class="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Estadísticas Detalladas -->
    <div class="grid grid-cols-3 gap-3 text-center">
      <div class="bg-zinc-800/50 p-2.5 rounded-xl border border-zinc-700/50">
        <span class="text-[10px] text-zinc-400 block font-mono">Latencia</span>
        <span class="text-sm font-bold text-white font-mono">${srv.latency} ms</span>
      </div>
      <div class="bg-zinc-800/50 p-2.5 rounded-xl border border-zinc-700/50">
        <span class="text-[10px] text-zinc-400 block font-mono">Error Rate</span>
        <span class="text-sm font-bold ${srv.errorRate === '0.00%' ? 'text-emerald-400' : 'text-red-400'} font-mono">${srv.errorRate}</span>
      </div>
      <div class="bg-zinc-800/50 p-2.5 rounded-xl border border-zinc-700/50">
        <span class="text-[10px] text-zinc-400 block font-mono">Memoria</span>
        <span class="text-sm font-bold text-white font-mono">${srv.memoryUsage}</span>
      </div>
    </div>

    <!-- Endpoints más consultados -->
    <div>
      <h4 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Endpoints de Alto Tráfico</h4>
      <div class="space-y-1.5 font-mono text-xs">
        ${srv.endpoints.map(ep => `
          <div class="flex items-center justify-between bg-zinc-950/80 p-2 rounded-lg border border-zinc-800">
            <span class="text-zinc-300 font-semibold truncate pr-2"><span class="text-emerald-400">${ep.method}</span> ${ep.path}</span>
            <div class="flex items-center gap-3 shrink-0">
              <span class="text-zinc-500 text-[11px]">${ep.calls}</span>
              <span class="text-zinc-400 font-medium">${ep.latency}ms</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Acciones de control -->
    <div class="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
      <button id="btn-toggle-service" class="px-3.5 py-2 text-xs font-medium rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all">
        Cambiar Estado (Degradar/Restaurar)
      </button>
      <button id="btn-restart-service" class="px-3.5 py-2 text-xs font-medium rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 transition-all">
        Reiniciar Nodo
      </button>
    </div>
  `;

  modal.classList.remove('hidden');

  document.getElementById('btn-close-modal')?.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  document.getElementById('btn-toggle-service')?.addEventListener('click', () => {
    store.toggleServiceStatus(srv.id);
    modal.classList.add('hidden');
  });

  document.getElementById('btn-restart-service')?.addEventListener('click', () => {
    store.restartService(srv.id);
    modal.classList.add('hidden');
  });
}
