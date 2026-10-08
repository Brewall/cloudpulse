// ============================================================================
// CloudPulse - Top Application Header Component
// ============================================================================

import { store } from '../state/store.js';

export function renderHeader(title = 'Overview Dashboard', subtitle = 'Telemetría en tiempo real') {
  return `
    <header class="h-20 border-b border-zinc-800/60 px-4 sm:px-8 flex items-center justify-between shrink-0 bg-zinc-900/20 backdrop-blur-md sticky top-0 z-30">
      <div class="flex items-center gap-3 sm:gap-4">
        <!-- Botón de apertura de menú en móvil -->
        <button id="btn-open-sidebar" aria-label="Abrir menú de navegación" class="lg:hidden p-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <h1 id="page-title" class="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
            ${title}
          </h1>
          <span id="page-subtitle" class="hidden sm:inline-block text-[11px] text-zinc-500 font-mono">${subtitle}</span>
        </div>
      </div>

      <!-- Acciones rápidas y estado general -->
      <div class="flex items-center gap-2.5 sm:gap-3">
        <!-- Badge de Salud Global -->
        <div id="header-status-badge" class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium shadow-sm transition-all">
          <span id="header-pulse" class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span id="header-status-text" class="hidden sm:inline">All systems operational</span>
          <span class="sm:hidden text-[11px]">Normal</span>
        </div>

        <!-- Botón de Inyección Rápida de Fallos / Restauración -->
        <button id="btn-header-chaos" class="text-xs px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-1.5 font-medium shadow-sm active:scale-95">
          <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span id="header-chaos-label" class="hidden sm:inline">Simular Caída</span>
          <span class="sm:hidden">Chaos</span>
        </button>
      </div>
    </header>
  `;
}

export function updateHeaderState(state) {
  const badge = document.getElementById('header-status-badge');
  const pulse = document.getElementById('header-pulse');
  const text = document.getElementById('header-status-text');
  const chaosBtn = document.getElementById('btn-header-chaos');
  const chaosLabel = document.getElementById('header-chaos-label');

  if (!badge || !pulse || !text || !chaosBtn) return;

  const isDegraded = state.isStressTestActive || state.services.some(s => s.status !== 'operational');

  if (isDegraded) {
    badge.className = 'flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium shadow-sm transition-all';
    pulse.className = 'w-1.5 h-1.5 rounded-full bg-red-400 animate-ping';
    text.textContent = 'Degraded Performance';

    chaosBtn.className = 'text-xs px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center gap-1.5 font-medium shadow-sm active:scale-95';
    chaosLabel.textContent = 'Restaurar Salud';
  } else {
    badge.className = 'flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium shadow-sm transition-all';
    pulse.className = 'w-1.5 h-1.5 rounded-full bg-emerald-400';
    text.textContent = 'All systems operational';

    chaosBtn.className = 'text-xs px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-1.5 font-medium shadow-sm active:scale-95';
    chaosLabel.textContent = 'Simular Caída';
  }
}

export function setupHeaderInteractions() {
  const openBtn = document.getElementById('btn-open-sidebar');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  const chaosBtn = document.getElementById('btn-header-chaos');

  if (openBtn && sidebar && backdrop) {
    openBtn.addEventListener('click', () => {
      sidebar.classList.remove('-translate-x-full');
      backdrop.classList.remove('hidden');
    });
  }

  if (chaosBtn) {
    chaosBtn.addEventListener('click', () => {
      const state = store.getState();
      const isDegraded = state.isStressTestActive || state.services.some(s => s.status !== 'operational');
      if (isDegraded) {
        store.restoreCluster();
      } else {
        store.triggerStressTest();
      }
    });
  }
}
