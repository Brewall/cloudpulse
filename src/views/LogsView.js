// ============================================================================
// CloudPulse - View: Streaming Logs Explorer
// ============================================================================

import { store } from '../state/store.js';
import { renderLogConsole, renderLogRows } from '../components/LogConsole.js';

let isUserScrolledUp = false;

export function renderLogsView() {
  const state = store.getState();
  const { logs, isLogPaused, logFilter } = state;

  return `
    <div id="logs-view-container" class="space-y-4">
      <!-- Barra de Filtros y Controles -->
      <div class="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-2">
          <!-- Botones de Severidad -->
          <div class="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <button data-severity="ALL" class="log-filter-btn text-xs px-2.5 py-1 rounded-lg font-mono font-medium transition-all ${logFilter.severity === 'ALL' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}">
              ALL
            </button>
            <button data-severity="INFO" class="log-filter-btn text-xs px-2.5 py-1 rounded-lg font-mono font-medium transition-all ${logFilter.severity === 'INFO' ? 'bg-zinc-700/80 text-zinc-200' : 'text-zinc-400 hover:text-white'}">
              INFO
            </button>
            <button data-severity="WARN" class="log-filter-btn text-xs px-2.5 py-1 rounded-lg font-mono font-medium transition-all ${logFilter.severity === 'WARN' ? 'bg-amber-950/80 text-amber-300 border border-amber-800/50' : 'text-zinc-400 hover:text-white'}">
              WARN
            </button>
            <button data-severity="ERROR" class="log-filter-btn text-xs px-2.5 py-1 rounded-lg font-mono font-medium transition-all ${logFilter.severity === 'ERROR' ? 'bg-red-950/80 text-red-300 border border-red-800/50' : 'text-zinc-400 hover:text-white'}">
              ERROR
            </button>
          </div>

          <!-- Buscador en tiempo real -->
          <div class="relative">
            <input type="text" id="log-search-input" value="${logFilter.search}" placeholder="Filtrar por texto, servicio o HTTP code..." 
                   class="bg-zinc-900/90 border border-zinc-800 rounded-xl px-3 py-1.5 pl-8 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 w-64 sm:w-80 font-mono">
            <svg class="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Controles de Streaming -->
        <div class="flex items-center gap-2">
          <button id="btn-toggle-log-pause" class="text-xs px-3 py-1.5 rounded-xl border ${isLogPaused ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 'border-zinc-700 bg-zinc-800 text-zinc-300'} hover:opacity-80 transition-all font-medium flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full ${isLogPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'}"></span>
            ${isLogPaused ? 'Reanudar Streaming' : 'Pausar'}
          </button>

          <button id="btn-clear-logs" class="text-xs px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all font-medium">
            Limpiar
          </button>

          <div class="flex items-center gap-1">
            <button id="btn-export-json" class="text-xs px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all font-medium">
              Exportar JSON
            </button>
            <button id="btn-export-txt" class="text-xs px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all font-medium">
              .TXT
            </button>
          </div>
        </div>
      </div>

      <!-- Consola de Streaming Reutilizable -->
      ${renderLogConsole({ logs, isLogPaused, logFilter, height: 'h-[520px]' })}
    </div>
  `;
}

export function updateLogsView(state) {
  const terminal = document.getElementById('terminal-body');
  const countIndicator = document.getElementById('log-count-indicator');
  if (!terminal) return;

  if (countIndicator) {
    countIndicator.textContent = `${state.logs.length} líneas en buffer`;
  }

  // Renderizar registros mediante el componente
  terminal.innerHTML = renderLogRows(state.logs, state.logFilter);

  // Auto-scroll inteligente: solo scrollear si el usuario NO ha scrolleado hacia arriba
  if (!isUserScrolledUp) {
    terminal.scrollTop = terminal.scrollHeight;
  }
}

export function setupLogsInteractions() {
  const terminal = document.getElementById('terminal-body');
  const scrollPill = document.getElementById('scroll-bottom-pill');

  // Detección de scroll del usuario
  if (terminal) {
    terminal.addEventListener('scroll', () => {
      const distanceFromBottom = terminal.scrollHeight - terminal.scrollTop - terminal.clientHeight;
      if (distanceFromBottom > 60) {
        isUserScrolledUp = true;
        if (scrollPill) {
          scrollPill.classList.remove('hidden');
          scrollPill.classList.add('flex');
        }
      } else {
        isUserScrolledUp = false;
        if (scrollPill) {
          scrollPill.classList.add('hidden');
          scrollPill.classList.remove('flex');
        }
      }
    });

    terminal.scrollTop = terminal.scrollHeight;
  }

  if (scrollPill && terminal) {
    scrollPill.addEventListener('click', () => {
      isUserScrolledUp = false;
      terminal.scrollTop = terminal.scrollHeight;
      scrollPill.classList.add('hidden');
      scrollPill.classList.remove('flex');
    });
  }

  // Filtros de severidad
  document.querySelectorAll('.log-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const severity = btn.getAttribute('data-severity');
      store.setLogFilter({ severity });
      document.querySelectorAll('.log-filter-btn').forEach(b => {
        b.className = 'log-filter-btn text-xs px-2.5 py-1 rounded-lg font-mono font-medium transition-all text-zinc-400 hover:text-white';
      });
      btn.className = 'log-filter-btn text-xs px-2.5 py-1 rounded-lg font-mono font-medium transition-all bg-zinc-800 text-white';
    });
  });

  // Buscador de logs
  const searchInput = document.getElementById('log-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      store.setLogFilter({ search: e.target.value });
    });
  }

  // Pausar / Reanudar
  const togglePauseBtn = document.getElementById('btn-toggle-log-pause');
  if (togglePauseBtn) {
    togglePauseBtn.addEventListener('click', () => {
      store.toggleLogPause();
      const isPaused = store.getState().isLogPaused;
      togglePauseBtn.innerHTML = `
        <span class="w-2 h-2 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'}"></span>
        ${isPaused ? 'Reanudar Streaming' : 'Pausar'}
      `;
    });
  }

  // Limpiar
  document.getElementById('btn-clear-logs')?.addEventListener('click', () => {
    store.clearLogs();
  });

  // Exportar JSON
  document.getElementById('btn-export-json')?.addEventListener('click', () => {
    store.exportLogs('json');
  });

  // Exportar TXT
  document.getElementById('btn-export-txt')?.addEventListener('click', () => {
    store.exportLogs('txt');
  });
}
