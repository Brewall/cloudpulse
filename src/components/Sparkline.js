// ============================================================================
// CloudPulse - Native Mathematical SVG Sparkline & Chart Generator
// ============================================================================

/**
 * Genera coordenadas de curva Bézier suave a partir de un arreglo de puntos numéricos.
 * Algoritmo Catmull-Rom a Bézier cúbica.
 */
function getSmoothSvgPath(points) {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;

    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  return path;
}

/**
 * Genera un SVG de gráfico de área para la sección principal de telemetría.
 * @param {number[]} data Arreglo de métricas numéricas (ej. latencia o RPS)
 * @param {object} options Opciones de renderizado (ancho, alto, colores, gradientes)
 */
export function createTelemetryChartSvg(data, options = {}) {
  const {
    width = 800,
    height = 160,
    strokeColor = '#10b981',
    gradientId = 'chartGrad',
    paddingY = 20,
    gridLines = 3
  } = options;

  if (!data || data.length === 0) {
    return `<div class="h-full flex items-center justify-center text-xs text-zinc-600 font-mono">Sin datos de telemetría</div>`;
  }

  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = (maxVal - minVal) === 0 ? 1 : (maxVal - minVal);
  const usableHeight = height - paddingY * 2;

  // Mapear números a coordenadas en el lienzo SVG
  const stepX = width / Math.max(1, data.length - 1);
  const points = data.map((val, index) => {
    const x = index * stepX;
    // Invertir Y porque en SVG el 0 está arriba
    const normalizedY = (val - minVal) / range;
    const y = height - paddingY - (normalizedY * usableHeight);
    return { x, y, val };
  });

  const smoothLinePath = getSmoothSvgPath(points);
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const areaPath = `${smoothLinePath} L ${lastPoint.x} ${height} L ${firstPoint.x} ${height} Z`;

  // Crear líneas horizontales de cuadrícula
  let gridMarkup = '';
  for (let i = 1; i <= gridLines; i++) {
    const gridY = Math.round((height / (gridLines + 1)) * i);
    gridMarkup += `
      <line x1="0" y1="${gridY}" x2="${width}" y2="${gridY}" 
            stroke="#27272a" stroke-dasharray="4 4" stroke-width="1" />
    `;
  }

  // Puntos interactivos destacados en el último valor
  const currentVal = data[data.length - 1];

  return `
    <svg class="w-full h-full overflow-visible" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-label="Gráfica de telemetría en tiempo real">
      <defs>
        <linearGradient id="${gradientId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${strokeColor}" stop-opacity="0.32" />
          <stop offset="100%" stop-color="${strokeColor}" stop-opacity="0.0" />
        </linearGradient>
      </defs>

      <!-- Cuadrícula -->
      ${gridMarkup}

      <!-- Relleno de área translúcida con gradiente -->
      <path d="${areaPath}" fill="url(#${gradientId})" />

      <!-- Línea trazada continua con curva suave -->
      <path d="${smoothLinePath}" fill="none" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Indicador luminoso del punto actual -->
      <circle cx="${lastPoint.x.toFixed(1)}" cy="${lastPoint.y.toFixed(1)}" r="4.5" fill="${strokeColor}" />
      <circle cx="${lastPoint.x.toFixed(1)}" cy="${lastPoint.y.toFixed(1)}" r="9" fill="${strokeColor}" opacity="0.35" class="animate-ping" />
    </svg>
  `;
}

/**
 * Genera un mini-sparkline compacto para tarjetas o filas de tablas.
 */
export function createMiniSparklineSvg(data, { width = 90, height = 28, strokeColor = '#10b981' } = {}) {
  if (!data || data.length < 2) return '';

  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = (maxVal - minVal) === 0 ? 1 : (maxVal - minVal);
  const pad = 4;
  const usableHeight = height - pad * 2;
  const stepX = width / (data.length - 1);

  const points = data.map((val, idx) => {
    const x = idx * stepX;
    const y = height - pad - (((val - minVal) / range) * usableHeight);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="overflow-visible" aria-hidden="true">
      <polyline fill="none" stroke="${strokeColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" points="${points}" />
    </svg>
  `;
}
