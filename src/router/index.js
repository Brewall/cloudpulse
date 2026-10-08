// ============================================================================
// CloudPulse - Client-Side Hash Router (Zero-Dependency SPA Router)
// ============================================================================

import { store } from '../state/store.js';
import { updateSidebarState } from '../components/Sidebar.js';
import { updateHeaderState } from '../components/Header.js';

import {
  renderOverviewView,
  updateOverviewView,
  setupOverviewInteractions
} from '../views/OverviewView.js';

import {
  renderServicesView,
  updateServicesView,
  setupServicesInteractions
} from '../views/ServicesView.js';

import {
  renderLogsView,
  updateLogsView,
  setupLogsInteractions
} from '../views/LogsView.js';

import {
  renderIncidentsView,
  updateIncidentsView,
  setupIncidentsInteractions
} from '../views/IncidentsView.js';

import {
  renderSettingsView,
  setupSettingsInteractions
} from '../views/SettingsView.js';

const ROUTES = {
  '#/overview': {
    title: 'Overview Dashboard',
    subtitle: 'Telemetría de clúster y salud de servicios en tiempo real',
    render: renderOverviewView,
    update: updateOverviewView,
    setup: setupOverviewInteractions
  },
  '#/services': {
    title: 'Services & Nodes Registry',
    subtitle: 'Catálogo de microservicios, bases de datos y nodos activos',
    render: renderServicesView,
    update: updateServicesView,
    setup: setupServicesInteractions
  },
  '#/logs': {
    title: 'Realtime Streaming Logs',
    subtitle: 'Consola continua de eventos, métricas y excepciones',
    render: renderLogsView,
    update: updateLogsView,
    setup: setupLogsInteractions
  },
  '#/incidents': {
    title: 'Incidents & Alert Hub',
    subtitle: 'Registro de incidencias, severidades y líneas de tiempo',
    render: renderIncidentsView,
    update: updateIncidentsView,
    setup: setupIncidentsInteractions
  },
  '#/settings': {
    title: 'Settings & Chaos Testing',
    subtitle: 'Umbrales de observabilidad y simulador de inyección de fallos',
    render: renderSettingsView,
    update: null,
    setup: setupSettingsInteractions
  }
};

class Router {
  constructor() {
    this.currentRoute = '#/overview';
    this.viewportElement = null;
    this.pageTitleElement = null;
    this.pageSubtitleElement = null;
  }

  init(viewportSelector = '#main-viewport') {
    this.viewportElement = document.querySelector(viewportSelector);
    this.pageTitleElement = document.querySelector('#page-title');
    this.pageSubtitleElement = document.querySelector('#page-subtitle');

    // Escuchar cambios de hash
    window.addEventListener('hashchange', () => this.handleRoute());

    // Carga inicial
    if (!window.location.hash || !ROUTES[window.location.hash]) {
      window.location.hash = '#/overview';
    } else {
      this.handleRoute();
    }

    // Suscribirse a cambios reactivos del estado
    store.subscribe((state) => {
      this.handleStateUpdate(state);
    });
  }

  handleRoute() {
    let hash = window.location.hash;
    if (!hash || !ROUTES[hash]) {
      hash = '#/overview';
      window.location.hash = hash;
      return;
    }

    this.currentRoute = hash;
    const routeConfig = ROUTES[hash];

    // Actualizar títulos
    if (this.pageTitleElement) this.pageTitleElement.textContent = routeConfig.title;
    if (this.pageSubtitleElement) this.pageSubtitleElement.textContent = routeConfig.subtitle;
    document.title = `${routeConfig.title} — CloudPulse`;

    // Renderizar vista
    if (this.viewportElement) {
      this.viewportElement.innerHTML = routeConfig.render();
      if (routeConfig.setup) {
        routeConfig.setup();
      }
      this.viewportElement.scrollTop = 0;
    }

    // Actualizar sidebar y header
    const state = store.getState();
    updateSidebarState(this.currentRoute, state);
    updateHeaderState(state);
  }

  handleStateUpdate(state) {
    const routeConfig = ROUTES[this.currentRoute];

    // Actualizaciones quirúrgicas sin destruir el DOM
    if (routeConfig && routeConfig.update) {
      routeConfig.update(state);
    }

    // Actualizar sidebar y header
    updateSidebarState(this.currentRoute, state);
    updateHeaderState(state);
  }

  navigate(route) {
    window.location.hash = route;
  }
}

export const router = new Router();
