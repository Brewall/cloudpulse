// ============================================================================
// CloudPulse - View: Settings & Chaos Engineering
// ============================================================================

import { store } from '../state/store.js';

export function renderSettingsView() {
  const state = store.getState();
  const { settings, isStressTestActive, isTrafficSpikeActive } = state;

  return `
    <div id="settings-view-container" class="space-y-6">
      <!-- 1. Chaos Engineering & Simulador de Resiliencia -->
      <div class="bg-gradient-to-b from-zinc-900/60 to-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 space-y-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-red-950/60 border border-red-800/50 flex items-center justify-center text-red-400">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h2 class="text-sm font-bold text-white uppercase tracking-wider">Inyección de Fallos en Tiempo Real (Chaos Testing)</h2>
            <p class="text-xs text-zinc-400 mt-0.5">Comprueba la capacidad de auto-detección y failover de la plataforma ante contingencias.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <!-- Botón 1: Caída de Base de Datos -->
          <div class="bg-zinc-950/70 border ${isStressTestActive ? 'border-red-500/60 bg-red-950/20' : 'border-zinc-800'} rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-white">Caída de PostgreSQL Master</span>
                <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${isStressTestActive ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-zinc-800 text-zinc-400'}">
                  ${isStressTestActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <p class="text-[11px] text-zinc-400 mt-1">Inyecta fallos de timeout de 5000ms en el pool de conexiones SQL e inicia failover.</p>
            </div>
            <button id="btn-chaos-db" class="w-full text-xs font-semibold py-2 px-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all">
              ${isStressTestActive ? 'Restaurar Base de Datos' : 'Simular Caída de Base de Datos'}
            </button>
          </div>

          <!-- Botón 2: Pico de Tráfico -->
          <div class="bg-zinc-950/70 border ${isTrafficSpikeActive ? 'border-amber-500/60 bg-amber-950/20' : 'border-zinc-800'} rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-white">Pico Masivo de RPS</span>
                <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${isTrafficSpikeActive ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-zinc-800 text-zinc-400'}">
                  ${isTrafficSpikeActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <p class="text-[11px] text-zinc-400 mt-1">Genera sobrecarga artificial (>5,000 req/s), saturando CPU y disparando alertas P2.</p>
            </div>
            <button id="btn-chaos-traffic" class="w-full text-xs font-semibold py-2 px-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all">
              ${isTrafficSpikeActive ? 'Normalizar Tráfico' : 'Simular Sobrecarga de Tráfico'}
            </button>
          </div>

          <!-- Botón 3: Restauración Completa -->
          <div class="bg-zinc-950/70 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <span class="text-xs font-bold text-white">Auto-Healing / Reset</span>
              <p class="text-[11px] text-zinc-400 mt-1">Normaliza todas las métricas, resuelve incidentes activos y restaura la topología.</p>
            </div>
            <button id="btn-chaos-restore" class="w-full text-xs font-semibold py-2 px-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all">
              Restaurar Todo el Clúster
            </button>
          </div>
        </div>
      </div>

      <!-- 2. Configuración de Umbrales de Telemetría -->
      <div class="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 space-y-5">
        <h3 class="text-sm font-bold text-white uppercase tracking-wider">Umbrales de Alertas y Telemetría</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Umbral CPU -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <label for="threshold-cpu" class="text-zinc-300 font-medium">Umbral Crítico de CPU (%)</label>
              <span id="label-threshold-cpu" class="font-mono text-emerald-400 font-bold">${settings.cpuAlertThreshold}%</span>
            </div>
            <input type="range" id="threshold-cpu" min="50" max="95" value="${settings.cpuAlertThreshold}" 
                   class="w-full accent-emerald-500 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer">
            <p class="text-[11px] text-zinc-500">Dispara advertencias visuales en el dashboard cuando el consumo global supere este valor.</p>
          </div>

          <!-- Umbral Memoria -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <label for="threshold-ram" class="text-zinc-300 font-medium">Umbral Crítico de Memoria (%)</label>
              <span id="label-threshold-ram" class="font-mono text-cyan-400 font-bold">${settings.ramAlertThreshold}%</span>
            </div>
            <input type="range" id="threshold-ram" min="50" max="95" value="${settings.ramAlertThreshold}" 
                   class="w-full accent-cyan-500 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer">
            <p class="text-[11px] text-zinc-500">Nivel a partir del cual el monitor clasifica el nodo en estado de riesgo de saturación.</p>
          </div>

          <!-- Frecuencia de Telemetría -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <label for="interval-telemetry" class="text-zinc-300 font-medium">Frecuencia de Actualización</label>
              <span id="label-interval-telemetry" class="font-mono text-zinc-200 font-bold">${settings.telemetryInterval / 1000}s</span>
            </div>
            <select id="interval-telemetry" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 font-mono focus:outline-none focus:border-emerald-500">
              <option value="1000" ${settings.telemetryInterval === 1000 ? 'selected' : ''}>1.0s (Streaming de Alta Frecuencia)</option>
              <option value="2000" ${settings.telemetryInterval === 2000 ? 'selected' : ''}>2.0s (Recomendado / Normal)</option>
              <option value="4000" ${settings.telemetryInterval === 4000 ? 'selected' : ''}>4.0s (Modo de Ahorro de Rendimiento)</option>
            </select>
          </div>

          <!-- Info Técnica de la Arquitectura -->
          <div class="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-4 text-xs font-mono space-y-1 text-zinc-400">
            <span class="text-zinc-200 font-semibold block mb-1">Especificación de Arquitectura:</span>
            <p>• Router: Hash-based Client-Side Router (Vanilla JS)</p>
            <p>• Rendering: DOM Nativo con Template Literals</p>
            <p>• Estilos: Tailwind CSS v4 Engine</p>
            <p>• Despliegue: CI/CD GitHub Pages via Actions</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function setupSettingsInteractions() {
  const btnDb = document.getElementById('btn-chaos-db');
  const btnTraffic = document.getElementById('btn-chaos-traffic');
  const btnRestore = document.getElementById('btn-chaos-restore');

  if (btnDb) {
    btnDb.addEventListener('click', () => {
      const state = store.getState();
      if (state.isStressTestActive) {
        store.restoreCluster();
      } else {
        store.triggerStressTest();
      }
      refreshSettingsView();
    });
  }

  if (btnTraffic) {
    btnTraffic.addEventListener('click', () => {
      const state = store.getState();
      if (state.isTrafficSpikeActive) {
        store.restoreCluster();
      } else {
        store.triggerTrafficSpike();
      }
      refreshSettingsView();
    });
  }

  if (btnRestore) {
    btnRestore.addEventListener('click', () => {
      store.restoreCluster();
      refreshSettingsView();
    });
  }

  // Sliders
  const cpuSlider = document.getElementById('threshold-cpu');
  const cpuLabel = document.getElementById('label-threshold-cpu');
  if (cpuSlider && cpuLabel) {
    cpuSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      cpuLabel.textContent = `${val}%`;
      store.updateSettings('cpuAlertThreshold', val);
    });
  }

  const ramSlider = document.getElementById('threshold-ram');
  const ramLabel = document.getElementById('label-threshold-ram');
  if (ramSlider && ramLabel) {
    ramSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      ramLabel.textContent = `${val}%`;
      store.updateSettings('ramAlertThreshold', val);
    });
  }

  const intervalSelect = document.getElementById('interval-telemetry');
  if (intervalSelect) {
    intervalSelect.addEventListener('change', (e) => {
      const val = parseInt(e.target.value, 10);
      store.updateSettings('telemetryInterval', val);
    });
  }
}

function refreshSettingsView() {
  const container = document.getElementById('settings-view-container');
  if (container) {
    container.outerHTML = renderSettingsView();
    setupSettingsInteractions();
  }
}
