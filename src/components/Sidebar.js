// ============================================================================
// CloudPulse - Navigation Sidebar Component (Responsive & Dynamic Badges)
// ============================================================================

export function renderSidebar(currentRoute = '#/overview') {
  return `
    <!-- Backdrop para dispositivos móviles -->
    <div id="sidebar-backdrop" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 hidden lg:hidden transition-opacity"></div>

    <aside id="sidebar" class="fixed lg:static inset-y-0 left-0 z-50 w-72 lg:w-64 border-r border-zinc-800/60 bg-zinc-950/95 lg:bg-zinc-900/40 backdrop-blur-xl flex flex-col justify-between shrink-0 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out">
      <div>
        <!-- Brand Header con Halo Neón -->
        <div class="h-20 flex items-center px-6 border-b border-zinc-800/60 justify-between">
          <a href="#/overview" class="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-xl">
            <div class="relative flex items-center justify-center">
              <div class="absolute inset-0 rounded-xl bg-emerald-500/20 blur-md group-hover:bg-emerald-500/30 transition-all neon-pulse"></div>
              <div class="relative w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-emerald-500/30 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                <!-- Ondas de Telemetría SVG -->
                <svg class="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12h3l2.5-6 3.5 12 2.5-6h3.5l1.5-2.5" />
                  <circle cx="19.5" cy="9.5" r="1.5" fill="#10b981" />
                </svg>
              </div>
            </div>

            <div>
              <div class="flex items-baseline gap-1.5">
                <span class="font-extrabold text-sm tracking-wider text-white font-mono">CLOUD</span>
                <span class="text-emerald-400 font-sans font-semibold text-sm tracking-normal">PULSE</span>
              </div>
              <span class="text-[10px] text-zinc-500 uppercase tracking-widest font-mono block mt-0.5">Observability Suite</span>
            </div>
          </a>

          <!-- Botón de cierre para móvil -->
          <button id="btn-close-sidebar" aria-label="Cerrar menú lateral" class="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Enlaces de Navegación SPA -->
        <nav class="p-4 space-y-1.5" aria-label="Navegación principal">
          <a href="#/overview" data-route="#/overview" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50">
            <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Overview</span>
          </a>

          <a href="#/services" data-route="#/services" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50">
            <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
            <span>Services & Nodes</span>
            <span id="badge-services-count" class="ml-auto text-[10px] bg-zinc-800/80 px-2 py-0.5 rounded-full text-zinc-400 font-mono">5</span>
          </a>

          <a href="#/logs" data-route="#/logs" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50">
            <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Streaming Logs</span>
            <span class="ml-auto flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Live
            </span>
          </a>

          <a href="#/incidents" data-route="#/incidents" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50">
            <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Incidents & Alerts</span>
            <span id="badge-incident-count" class="ml-auto text-[10px] bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full text-emerald-400 font-mono">0 Activos</span>
          </a>

          <a href="#/settings" data-route="#/settings" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50">
            <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Chaos & Settings</span>
          </a>
        </nav>
      </div>

      <!-- Pod de Estado del Clúster -->
      <div class="p-4 border-t border-zinc-800/60">
        <div class="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3 flex items-center justify-between shadow-inner">
          <div class="flex items-center gap-2.5">
            <div class="relative flex items-center justify-center">
              <span id="cluster-pod-dot" class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span id="cluster-pod-ping" class="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute animate-ping opacity-75"></span>
            </div>
            <div>
              <span class="text-xs text-zinc-200 font-semibold block leading-tight">us-east-1 (Prod)</span>
              <span id="cluster-pod-status" class="text-[10px] text-zinc-500 font-mono">Cluster Sync: OK</span>
            </div>
          </div>
          <span id="cluster-pod-latency" class="text-[11px] text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-800/30 px-2 py-0.5 rounded-md">18ms</span>
        </div>
      </div>
    </aside>
  `;
}

/**
 * Actualiza visualmente el estado del sidebar según la ruta activa y el estado global.
 */
export function updateSidebarState(route, state) {
  // 1. Resaltar enlace activo
  document.querySelectorAll('.nav-item').forEach(item => {
    const itemRoute = item.getAttribute('data-route');
    if (itemRoute === route) {
      item.className = 'nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]';
    } else {
      item.className = 'nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50';
    }
  });

  // 2. Contador de servicios
  const servicesCount = document.getElementById('badge-services-count');
  if (servicesCount && state.services) {
    servicesCount.textContent = state.services.length;
  }

  // 3. Badge de incidentes
  const incidentBadge = document.getElementById('badge-incident-count');
  if (incidentBadge && state.incidents) {
    const activeCount = state.incidents.filter(i => i.status === 'ACTIVE').length;
    if (activeCount > 0) {
      incidentBadge.textContent = `${activeCount} ${activeCount === 1 ? 'Activo' : 'Activos'}`;
      incidentBadge.className = 'ml-auto text-[10px] bg-red-950/80 border border-red-800/50 px-2 py-0.5 rounded-full text-red-400 font-mono font-semibold animate-pulse';
    } else {
      incidentBadge.textContent = '0 Activos';
      incidentBadge.className = 'ml-auto text-[10px] bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full text-emerald-400 font-mono';
    }
  }

  // 4. Pod inferior de salud
  const podDot = document.getElementById('cluster-pod-dot');
  const podPing = document.getElementById('cluster-pod-ping');
  const podStatus = document.getElementById('cluster-pod-status');
  const podLat = document.getElementById('cluster-pod-latency');

  if (podDot && podPing && podStatus && podLat && state.kpis) {
    const hasDegraded = state.services.some(s => s.status !== 'operational');
    if (hasDegraded) {
      podDot.className = 'w-2.5 h-2.5 rounded-full bg-red-400';
      podPing.className = 'w-2.5 h-2.5 rounded-full bg-red-400 absolute animate-ping opacity-75';
      podStatus.textContent = 'Degraded Node';
      podStatus.className = 'text-[10px] text-red-400 font-mono font-medium';
      podLat.className = 'text-[11px] text-red-400 font-mono bg-red-950/40 border border-red-800/30 px-2 py-0.5 rounded-md';
      podLat.textContent = `${state.kpis.latencyP50}ms`;
    } else {
      podDot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-400';
      podPing.className = 'w-2.5 h-2.5 rounded-full bg-emerald-400 absolute animate-ping opacity-75';
      podStatus.textContent = 'Cluster Sync: OK';
      podStatus.className = 'text-[10px] text-zinc-500 font-mono';
      podLat.className = 'text-[11px] text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-800/30 px-2 py-0.5 rounded-md';
      podLat.textContent = `${state.kpis.latencyP50}ms`;
    }
  }
}

/**
 * Inicializa controladores de eventos para el menú móvil
 */
export function setupSidebarInteractions() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  const closeBtn = document.getElementById('btn-close-sidebar');

  function closeMobileSidebar() {
    if (!sidebar || !backdrop) return;
    sidebar.classList.add('-translate-x-full');
    backdrop.classList.add('hidden');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeMobileSidebar);
  if (backdrop) backdrop.addEventListener('click', closeMobileSidebar);

  // Cerrar al hacer clic en un enlace de navegación en móvil
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth < 1024) closeMobileSidebar();
    });
  });
}
