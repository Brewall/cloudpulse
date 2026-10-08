// ============================================================================
// CloudPulse - Reusable Metric KPI Card Component
// ============================================================================

export function renderMetricCard({
  id = '',
  title,
  value,
  subvalue = '',
  badge = '',
  badgeType = 'neutral', // 'positive' | 'negative' | 'neutral' | 'warning'
  progressPercent = null,
  progressColor = 'bg-emerald-400',
  description = '',
  iconSvg = ''
}) {
  const badgeClasses = {
    positive: 'text-emerald-400 bg-emerald-950/50 border-emerald-800/40',
    negative: 'text-red-400 bg-red-950/50 border-red-800/40',
    warning: 'text-amber-400 bg-amber-950/50 border-amber-800/40',
    neutral: 'text-zinc-300 bg-zinc-800/80 border-zinc-700/50'
  }[badgeType] || 'text-zinc-300 bg-zinc-800/80 border-zinc-700/50';

  const progressSection = progressPercent !== null ? `
    <div class="w-full bg-zinc-800/80 h-1.5 rounded-full mt-3 overflow-hidden">
      <div id="${id ? id + '-bar' : ''}" 
           class="${progressColor} h-full rounded-full transition-all duration-500 ease-out" 
           style="width: ${Math.min(100, Math.max(0, progressPercent))}%;"></div>
    </div>
  ` : '';

  return `
    <div class="bg-gradient-to-b from-zinc-900/60 to-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700/80 rounded-2xl p-4 sm:p-5 transition-all shadow-sm">
      <div class="flex items-center justify-between text-zinc-400 mb-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
          ${iconSvg}
          ${title}
        </span>
        ${badge ? `
          <span class="text-xs font-mono font-medium px-2 py-0.5 rounded-full border ${badgeClasses}">
            ${badge}
          </span>
        ` : ''}
      </div>

      <div class="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono" id="${id ? id + '-val' : ''}">
        ${value}
      </div>

      ${progressSection}

      ${description ? `
        <p class="text-[11px] text-zinc-500 mt-2 flex items-center gap-1.5 font-medium">
          ${description}
        </p>
      ` : ''}

      ${subvalue && !description ? `
        <p class="text-[11px] text-zinc-400 mt-1.5 font-mono">
          ${subvalue}
        </p>
      ` : ''}
    </div>
  `;
}
