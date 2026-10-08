// ============================================================================
// CloudPulse - Reusable LogConsole Terminal Component
// ============================================================================

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Renderiza las líneas de logs filtradas dentro de la consola
 */
export function renderLogRows(logs, filter = { severity: 'ALL', search: '' }) {
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

/**
 * Renderiza el contenedor completo de la terminal de streaming con barra de herramientas
 */
export function renderLogConsole({ logs, isLogPaused, logFilter, height = 'h-[520px]' }) {
  return `
    <div class="relative bg-zinc-950 border border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden">
      <!-- Barra de título de la terminal con estilo Unix -->
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

      <!-- Cuerpo del terminal de logs con scroll inteligente -->
      <div id="terminal-body" class="p-4 font-mono text-xs ${height} overflow-y-auto space-y-1 selection:bg-emerald-500/30">
        ${renderLogRows(logs, logFilter)}
      </div>

      <!-- Indicador flotante si el usuario hizo scroll hacia arriba -->
      <div id="scroll-bottom-pill" class="absolute bottom-4 right-4 bg-emerald-500/90 text-black text-[11px] font-mono font-bold px-3 py-1.5 rounded-full shadow-lg cursor-pointer hover:bg-emerald-400 transition-all hidden items-center gap-1.5">
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
        Nuevos logs abajo (Ir al final)
      </div>
    </div>
  `;
}
