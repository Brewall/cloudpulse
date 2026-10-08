// ============================================================================
// CloudPulse - View: Streaming Logs Explorer
// ============================================================================

import { store } from '../state/store.js';

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

      <!-- Consola de Streaming de Terminal -->
      <div class="relative bg-zinc-950 border border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden">
        <!-- Barra de título de la terminal -->
        <div class="bg-zinc-900/60 border-b border-zinc-800/80 px-4 py-2.5 flex items-center justify-between text-xs font-mono text-zinc-400">
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-red-500/60"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-amber-500/60"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/60"></span>
            </div>
            <span class="text-zinc-500 ml-2">stdout/stderr streaming daemon</span>
          </div>
          <div class="flex items-center gap-3 text-[11px]">
            <span id="log-count-indicator" class="text-zinc-400">${logs.length} líneas en buffer</span>
            <span class="text-zinc-600">|</span>
            <span class="text-emerald-400 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 ${isLogPaused ? '' : 'animate-ping'}"></span>
              ${isLogPaused ? 'PAUSADO' : 'EN VIVO'}
            </span>
          </div>
        </div>

        <!-- Cuerpo del terminal de logs -->
        <div id="terminal-body" class="p-4 font-mono text-xs h-[520px] overflow-y-auto space-y-1 selection:bg-emerald-500/30">
          ${renderLogEntries(logs, logFilter)}
        </div>

        <!-- Indicador flotante si el usuario hizo scroll hacia arriba -->
        <div id="scroll-bottom-pill" class="absolute bottom-4 right-4 bg-emerald-500/90 text-black text-[11px] font-mono font-bold px-3 py-1.5 rounded-full shadow-lg cursor-pointer hover:bg-emerald-400 transition-all hidden items-center gap-1.5">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          Nuevos logs abajo (Ir al final)
        </div>
      </div>
    </div>
  `;
}

function renderLogEntries(logs, filter) {
  const { severity, search } = filter;
  const searchLower = (search || '').toLowerCase().trim();

  const filteredLogs = logs.filter(log => {
    if (severity !== 'ALL' && log.level !== severity) return false;
    if (searchLower) {
      const matchMsg = log.msg.toLowerCase().includes(searchLower);
      const matchSrv = log.service.toLowerCase().includes(searchLower);
      const matchStatus = log.status.toString().includes(searchLower);
      if (!matchMsg && !matchSrv && !matchStatus) return false;
    }
    return true;
  });

  if (filteredLogs.length === 0) {
    return `<div class="text-zinc-600 py-8 text-center">No hay líneas de log que coincidan con los criterios.</div>`;
  }

  return filteredLogs.map(log => {
    const isError = log.level === 'ERROR';
    const isWarn = log.level === 'WARN';
    const textColor = isError ? 'text-red-400' : isWarn ? 'text-amber-300' : 'text-zinc-300';
    const badgeColor = isError ? 'bg-red-950/80 text-red-400 border-red-800/60' : isWarn ? 'bg-amber-950/80 text-amber-300 border-amber-800/60' : 'bg-zinc-800/80 text-zinc-400 border-zinc-700/50';

    return `
      <div class="log-row flex items-start gap-2 hover:bg-zinc-900/70 px-2 py-1 rounded transition-colors group">
        <span class="text-zinc-600 shrink-0 select-none">[${log.time}]</span>
        <span class="border px-1.5 py-0.2 rounded text-[10px] font-semibold shrink-0 ${badgeColor}">${log.level}</span>
        <span class="text-zinc-500 shrink-0 font-medium">[${log.service}]</span>
        <span class="${textColor} break-all flex-1">${escapeHtml(log.msg)}</span>
        <span class="text-zinc-600 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">#${log.id}</span>
      </div>
    `;
  }).join('');
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function updateLogsView(state) {
  const terminal = document.getElementById('terminal-body');
  const countIndicator = document.getElementById('log-count-indicator');
  if (!terminal) return;

  if (countIndicator) {
    countIndicator.textContent = `${state.logs.length} líneas en buffer`;
  }

  // Renderizar registros con filtros aplicados
  terminal.innerHTML = renderLogEntries(state.logs, state.logFilter);

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
        if (scrollPill) scrollPill.classList.remove('hidden');
        if (scrollPill) scrollPill.classList.add('flex');
      } else {
        isUserScrolledUp = false;
        if (scrollPill) scrollPill.classList.add('hidden');
        if (scrollPill) scrollPill.classList.remove('flex');
      }
    });

    // Auto-scroll inicial al montar la vista
    terminal.scrollTop = terminal.scrollHeight;
  }

  if (scrollPill && terminal) {
    scrollPill.addEventListener('click', () => {
      isUserScrolledUp = false;
      terminal.scrollTop = terminal.scrollHeight;
      scrollPill.classList.add('hidden');
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
