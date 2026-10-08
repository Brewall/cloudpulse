// ============================================================================
// CloudPulse - Reactive State Management & Telemetry Engine
// ============================================================================

const MAX_LOGS_BUFFER = 200;

const INITIAL_SERVICES = [
  {
    id: 'auth',
    name: 'Auth Service',
    type: 'API Service',
    stack: 'Java 21 / Spring Boot 3.3',
    status: 'operational', // 'operational' | 'degraded' | 'down'
    latency: 14,
    baseLatency: 14,
    uptime: '99.98%',
    rps: 420,
    errorRate: '0.02%',
    memoryUsage: '450 MB',
    cpuUsage: '18%',
    region: 'us-east-1a',
    endpoints: [
      { method: 'POST', path: '/v1/auth/login', latency: 18, calls: '12.4k/m' },
      { method: 'GET', path: '/v1/auth/verify', latency: 8, calls: '48.2k/m' },
      { method: 'POST', path: '/v1/auth/refresh', latency: 12, calls: '6.1k/m' },
      { method: 'DELETE', path: '/v1/auth/session', latency: 10, calls: '1.8k/m' }
    ]
  },
  {
    id: 'payments',
    name: 'Payments Gateway',
    type: 'API Service',
    stack: 'Node.js 22 / Express',
    status: 'operational',
    latency: 34,
    baseLatency: 34,
    uptime: '99.95%',
    rps: 215,
    errorRate: '0.04%',
    memoryUsage: '380 MB',
    cpuUsage: '26%',
    region: 'us-east-1b',
    endpoints: [
      { method: 'POST', path: '/v1/checkout/intent', latency: 45, calls: '4.2k/m' },
      { method: 'POST', path: '/v1/webhooks/stripe', latency: 28, calls: '1.9k/m' },
      { method: 'GET', path: '/v1/invoices/:id', latency: 16, calls: '8.5k/m' }
    ]
  },
  {
    id: 'inventory',
    name: 'Inventory API',
    type: 'API Service',
    stack: 'Java 21 / Spring Boot 3.3',
    status: 'operational',
    latency: 18,
    baseLatency: 18,
    uptime: '99.99%',
    rps: 540,
    errorRate: '0.01%',
    memoryUsage: '520 MB',
    cpuUsage: '22%',
    region: 'us-east-1a',
    endpoints: [
      { method: 'GET', path: '/v1/catalog/items', latency: 15, calls: '32.1k/m' },
      { method: 'PUT', path: '/v1/stock/reserve', latency: 22, calls: '2.4k/m' },
      { method: 'GET', path: '/v1/stock/check', latency: 11, calls: '19.8k/m' }
    ]
  },
  {
    id: 'postgres',
    name: 'Database Primary Cluster',
    type: 'Storage / Relational',
    stack: 'PostgreSQL 16 (Patroni HA)',
    status: 'operational',
    latency: 4,
    baseLatency: 4,
    uptime: '100.00%',
    rps: 1250,
    errorRate: '0.00%',
    memoryUsage: '6.2 GB',
    cpuUsage: '38%',
    region: 'us-east-1a (Multi-AZ)',
    endpoints: [
      { method: 'SQL', path: 'Read Replica (us-east-1b)', latency: 2, calls: '84.2k/m' },
      { method: 'SQL', path: 'Primary Master (us-east-1a)', latency: 5, calls: '38.6k/m' }
    ]
  },
  {
    id: 'redis',
    name: 'Redis Cache Cluster',
    type: 'In-Memory Cache',
    stack: 'Redis 7.2 Sentinel',
    status: 'operational',
    latency: 1,
    baseLatency: 1,
    uptime: '100.00%',
    rps: 3100,
    errorRate: '0.00%',
    memoryUsage: '3.4 GB',
    cpuUsage: '12%',
    region: 'us-east-1a/b',
    endpoints: [
      { method: 'CACHE', path: 'GET session_tokens', latency: 0.8, calls: '142k/m' },
      { method: 'CACHE', path: 'SET rate_limits', latency: 1.2, calls: '48k/m' },
      { method: 'CACHE', path: 'GET product_cache', latency: 0.9, calls: '92k/m' }
    ]
  }
];

const INITIAL_INCIDENTS = [
  {
    id: 'INC-2041',
    title: 'Despliegue canary v2.14 completado sin anomalías',
    severity: 'P3', // P1: Critical, P2: Warning, P3: Info
    service: 'Inventory API',
    status: 'RESOLVED',
    detectedAt: 'Hace 45 min',
    resolvedAt: 'Hace 38 min',
    description: 'Actualización progresiva de imagen de contenedor finalizada con 100% de tests de humo en verde.',
    timeline: [
      { time: '19:45', action: 'Iniciada propagación de pods canary en us-east-1a.', actor: 'CI/CD Bot' },
      { time: '19:52', action: 'Verificación de tasa de errores en 0.01%. Sin degradación de latencia.', actor: 'CloudPulse Monitor' },
      { time: '19:55', action: 'Promoción al 100% del tráfico completada con éxito.', actor: 'ArgoCD' }
    ]
  }
];

const INITIAL_LOGS = [
  { id: 1, time: '20:48:10', level: 'INFO', service: 'Auth Service', msg: '200 GET /v1/auth/verify - 8ms (token: sha256..f4a1)', status: 200 },
  { id: 2, time: '20:48:12', level: 'INFO', service: 'Redis Cache', msg: 'HIT key:session:9813-acb (0.7ms)', status: 200 },
  { id: 3, time: '20:48:14', level: 'INFO', service: 'Inventory API', msg: 'Sync batch completed: 154 catalog entities synced', status: 200 },
  { id: 4, time: '20:48:16', level: 'INFO', service: 'Payments Gateway', msg: '200 POST /v1/checkout/intent - 34ms (order_id: #9842)', status: 200 },
  { id: 5, time: '20:48:18', level: 'INFO', service: 'Database Cluster', msg: 'Checkpoint completed: 428 buffers written in 1.4s', status: 200 },
  { id: 6, time: '20:48:21', level: 'WARN', service: 'Payments Gateway', msg: 'Retry attempt 1/3 on external gateway provider', status: 429 },
  { id: 7, time: '20:48:24', level: 'INFO', service: 'Auth Service', msg: '200 POST /v1/auth/login - 18ms (user_id: #4812)', status: 200 }
];

const LOG_TEMPLATES = [
  { level: 'INFO', service: 'Auth Service', msg: '200 GET /v1/auth/verify - 8ms (token valid)', status: 200 },
  { level: 'INFO', service: 'Auth Service', msg: '200 POST /v1/auth/refresh - 12ms', status: 200 },
  { level: 'INFO', service: 'Inventory API', msg: '200 GET /v1/catalog/items - 14ms (items: 24)', status: 200 },
  { level: 'INFO', service: 'Inventory API', msg: 'Stock reservation verified for SKU-7741', status: 200 },
  { level: 'INFO', service: 'Payments Gateway', msg: '200 POST /v1/checkout/intent - 32ms (usd: 120.00)', status: 200 },
  { level: 'INFO', service: 'Payments Gateway', msg: 'Webhook delivery acknowledged by partner', status: 200 },
  { level: 'INFO', service: 'Redis Cache', msg: 'Memory hit ratio stable at 96.4%', status: 200 },
  { level: 'INFO', service: 'Redis Cache', msg: 'Cache eviction cycle finished: 0 keys evicted', status: 200 },
  { level: 'INFO', service: 'Database Cluster', msg: 'Read replica replication lag: 0.4ms', status: 200 },
  { level: 'WARN', service: 'Payments Gateway', msg: 'Upstream payment gateway response latency > 200ms', status: 408 },
  { level: 'WARN', service: 'Database Cluster', msg: 'Connection pool usage reached 74% capacity', status: 429 }
];

class Store {
  constructor() {
    this.listeners = new Set();
    this.telemetryTimer = null;
    this.logCounter = INITIAL_LOGS.length + 1;

    // Generar historial inicial de latencia (20 puntos)
    const initialLatencyHistory = Array.from({ length: 20 }, (_, i) => {
      const base = 18;
      const variation = (Math.sin(i * 0.7) * 4) + (Math.random() * 3 - 1.5);
      return Math.max(10, Math.round(base + variation));
    });

    const initialRpsHistory = Array.from({ length: 20 }, (_, i) => {
      const base = 1840;
      const variation = (Math.cos(i * 0.5) * 150) + (Math.random() * 80 - 40);
      return Math.round(base + variation);
    });

    this.state = {
      services: JSON.parse(JSON.stringify(INITIAL_SERVICES)),
      incidents: JSON.parse(JSON.stringify(INITIAL_INCIDENTS)),
      logs: [...INITIAL_LOGS],
      isLogPaused: false,
      logFilter: { severity: 'ALL', search: '' },
      latencyHistory: initialLatencyHistory,
      rpsHistory: initialRpsHistory,
      kpis: {
        uptimePercent: '99.98%',
        uptimeDuration: '32d 14h 22m',
        cpuPercent: 28.4,
        cpuCores: '2.3 / 8 Cores',
        ramPercent: 61.2,
        ramUsage: '9.8 / 16 GB',
        throughput: 1842,
        latencyP50: 14,
        latencyP95: 32,
        latencyP99: 84
      },
      isStressTestActive: false,
      isTrafficSpikeActive: false,
      settings: {
        cpuAlertThreshold: 80,
        ramAlertThreshold: 85,
        latencyAlertThreshold: 100,
        telemetryInterval: 2000
      }
    };

    this.startTelemetry();
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  // ==========================================================================
  // Acciones de Telemetría y Simulación
  // ==========================================================================

  startTelemetry() {
    if (this.telemetryTimer) clearInterval(this.telemetryTimer);

    this.telemetryTimer = setInterval(() => {
      this.tickTelemetry();
    }, this.state.settings.telemetryInterval);
  }

  stopTelemetry() {
    if (this.telemetryTimer) {
      clearInterval(this.telemetryTimer);
      this.telemetryTimer = null;
    }
  }

  tickTelemetry() {
    const { isStressTestActive, isTrafficSpikeActive } = this.state;

    // 1. Modulación de KPIs
    let targetCpu = isTrafficSpikeActive ? 88.5 : isStressTestActive ? 68.2 : 28.4;
    let targetThroughput = isTrafficSpikeActive ? 4850 : isStressTestActive ? 920 : 1842;
    let targetLatency = isStressTestActive ? 460 : isTrafficSpikeActive ? 95 : 18;

    const jitterCpu = (Math.random() * 4 - 2);
    const jitterRps = Math.round(Math.random() * 60 - 30);
    const jitterLat = Math.round(Math.random() * 4 - 2);

    const currentCpu = Math.min(99, Math.max(5, +(targetCpu + jitterCpu).toFixed(1)));
    const currentRps = Math.max(100, targetThroughput + jitterRps);
    const currentLat = Math.max(8, targetLatency + jitterLat);

    this.state.kpis.cpuPercent = currentCpu;
    this.state.kpis.throughput = currentRps;
    this.state.kpis.latencyP50 = isStressTestActive ? 240 : 14;
    this.state.kpis.latencyP95 = isStressTestActive ? 780 : 32;
    this.state.kpis.latencyP99 = isStressTestActive ? 1420 : 84;

    // 2. Historial de Latencia y Throughput (mantener 24 puntos)
    this.state.latencyHistory.push(currentLat);
    if (this.state.latencyHistory.length > 24) this.state.latencyHistory.shift();

    this.state.rpsHistory.push(currentRps);
    if (this.state.rpsHistory.length > 24) this.state.rpsHistory.shift();

    // 3. Fluctuación de latencia de servicios individuales
    this.state.services.forEach(srv => {
      if (srv.status === 'down') {
        srv.latency = 0;
      } else if (srv.status === 'degraded') {
        srv.latency = Math.round(srv.baseLatency * 15 + (Math.random() * 200));
      } else {
        const delta = Math.round(Math.random() * 4 - 2);
        srv.latency = Math.max(1, srv.baseLatency + delta);
      }
    });

    // 4. Inyección periódica de logs automáticos
    if (!this.state.isLogPaused) {
      if (isStressTestActive) {
        this.addLog({
          level: 'ERROR',
          service: 'Database Cluster',
          msg: 'ConnectionPoolTimeout: [ERROR-084] master node connection timed out after 5000ms',
          status: 504
        });
      } else if (isTrafficSpikeActive) {
        this.addLog({
          level: 'WARN',
          service: 'Auth Service',
          msg: 'High load detected: thread pool saturation at 87% (RPS spike > 4500)',
          status: 429
        });
      } else {
        const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
        this.addLog(template);
      }
    }

    this.notify();
  }

  // ==========================================================================
  // Manejo de Logs
  // ==========================================================================

  addLog({ level, service, msg, status = 200 }) {
    const now = new Date();
    const time = now.toTimeString().split(' ')[0];

    const logEntry = {
      id: this.logCounter++,
      time,
      timestamp: now.toISOString(),
      level,
      service,
      msg,
      status
    };

    this.state.logs.push(logEntry);
    if (this.state.logs.length > MAX_LOGS_BUFFER) {
      this.state.logs.shift();
    }
  }

  clearLogs() {
    this.state.logs = [];
    this.notify();
  }

  toggleLogPause() {
    this.state.isLogPaused = !this.state.isLogPaused;
    this.notify();
    return this.state.isLogPaused;
  }

  setLogFilter({ severity, search }) {
    if (severity !== undefined) this.state.logFilter.severity = severity;
    if (search !== undefined) this.state.logFilter.search = search;
    this.notify();
  }

  exportLogs(format = 'json') {
    const logs = this.state.logs;
    let dataStr = '';
    let mimeType = 'text/plain';
    let extension = 'txt';

    if (format === 'json') {
      dataStr = JSON.stringify(logs, null, 2);
      mimeType = 'application/json';
      extension = 'json';
    } else {
      dataStr = logs.map(l => `[${l.time}] [${l.level}] [${l.service}] (${l.status}) ${l.msg}`).join('\n');
      mimeType = 'text/plain';
      extension = 'log';
    }

    const blob = new Blob([dataStr], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cloudpulse-logs-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // ==========================================================================
  // Chaos Engineering & Inyección de Fallos
  // ==========================================================================

  triggerStressTest() {
    this.state.isStressTestActive = true;
    const db = this.state.services.find(s => s.id === 'postgres');
    if (db) {
      db.status = 'degraded';
      db.latency = 940;
      db.errorRate = '14.8%';
    }

    const payments = this.state.services.find(s => s.id === 'payments');
    if (payments) {
      payments.status = 'degraded';
      payments.latency = 320;
    }

    // Agregar nuevo incidente P1 activo
    const newIncident = {
      id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      title: 'Degradación crítica: Timeout en PostgreSQL Primary Master',
      severity: 'P1',
      service: 'Database Cluster',
      status: 'ACTIVE',
      detectedAt: 'Justo ahora',
      resolvedAt: null,
      description: 'Pérdida de comunicación con el nodo principal de base de datos. Tráfico enrutado a réplica con latencia anómala.',
      timeline: [
        { time: new Date().toTimeString().split(' ')[0], action: 'Alerta de salud disparada por CloudPulse Watchdog.', actor: 'Watchdog Daemon' },
        { time: new Date().toTimeString().split(' ')[0], action: 'Fallo de ping TCP al puerto 5432 (5000ms timeout).', actor: 'Patroni HA' }
      ]
    };

    this.state.incidents.unshift(newIncident);

    this.addLog({
      level: 'ERROR',
      service: 'Database Cluster',
      msg: 'FATAL: PostgreSQL master primary failed health check. Automatic failover initiated.',
      status: 500
    });

    this.notify();
  }

  triggerTrafficSpike() {
    this.state.isTrafficSpikeActive = true;
    this.state.kpis.cpuPercent = 89.4;
    this.state.kpis.throughput = 5120;

    const newIncident = {
      id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      title: 'Sobrecarga de Tráfico: Umbral de CPU > 85% Excedido',
      severity: 'P2',
      service: 'Auth Service',
      status: 'ACTIVE',
      detectedAt: 'Justo ahora',
      resolvedAt: null,
      description: 'Pico repentino de solicitudes entrantes (>5000 req/s) satura el threadpool de autenticación.',
      timeline: [
        { time: new Date().toTimeString().split(' ')[0], action: 'RPS superior a 3x del límite basal normal.', actor: 'CloudPulse Telemetry' }
      ]
    };

    this.state.incidents.unshift(newIncident);
    this.notify();
  }

  restoreCluster() {
    this.state.isStressTestActive = false;
    this.state.isTrafficSpikeActive = false;

    // Restaurar servicios
    this.state.services = JSON.parse(JSON.stringify(INITIAL_SERVICES));

    // Resolver incidentes activos
    this.state.incidents.forEach(inc => {
      if (inc.status === 'ACTIVE') {
        inc.status = 'RESOLVED';
        inc.resolvedAt = 'Recién resuelto';
        inc.timeline.push({
          time: new Date().toTimeString().split(' ')[0],
          action: 'Servicios estabilizados y telemetría retornada a rangos normales.',
          actor: 'Operador / Auto-healing'
        });
      }
    });

    this.addLog({
      level: 'INFO',
      service: 'Cluster Watchdog',
      msg: 'Cluster auto-healing completado: Todos los nodos reportan estado 100% OPERATIONAL.',
      status: 200
    });

    this.notify();
  }

  restartService(serviceId) {
    const srv = this.state.services.find(s => s.id === serviceId);
    if (!srv) return;

    srv.status = 'degraded';
    srv.latency = 200;

    this.addLog({
      level: 'WARN',
      service: srv.name,
      msg: `Reinicio manual solicitado para el nodo ${srv.name}. Drenando conexiones...`,
      status: 202
    });

    this.notify();

    setTimeout(() => {
      srv.status = 'operational';
      srv.latency = srv.baseLatency;
      this.addLog({
        level: 'INFO',
        service: srv.name,
        msg: `Nodo ${srv.name} reiniciado exitosamente. Verificación de salud OK.`,
        status: 200
      });
      this.notify();
    }, 2500);
  }

  toggleServiceStatus(serviceId) {
    const srv = this.state.services.find(s => s.id === serviceId);
    if (!srv) return;

    if (srv.status === 'operational') {
      srv.status = 'degraded';
      srv.latency = Math.round(srv.baseLatency * 8);
    } else if (srv.status === 'degraded') {
      srv.status = 'down';
      srv.latency = 0;
    } else {
      srv.status = 'operational';
      srv.latency = srv.baseLatency;
    }

    this.notify();
  }

  updateSettings(key, value) {
    if (this.state.settings[key] !== undefined) {
      this.state.settings[key] = value;
      if (key === 'telemetryInterval') {
        this.startTelemetry();
      }
      this.notify();
    }
  }
}

export const store = new Store();
