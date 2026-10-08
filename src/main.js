// ============================================================================
// CloudPulse - Application Bootstrap & Root Layout
// ============================================================================

import './style.css';
import { renderSidebar, setupSidebarInteractions } from './components/Sidebar.js';
import { renderHeader, setupHeaderInteractions } from './components/Header.js';
import { router } from './router/index.js';

function bootstrapApp() {
  const appContainer = document.querySelector('#app');
  if (!appContainer) return;

  // Montar el cascarón de la aplicación (Sidebar + Área de Trabajo)
  appContainer.innerHTML = `
    <!-- Barra Lateral de Navegación -->
    ${renderSidebar()}

    <!-- Espacio Principal de Trabajo -->
    <div class="flex-1 flex flex-col overflow-hidden bg-zinc-950 min-w-0">
      <!-- Encabezado Superior -->
      ${renderHeader()}

      <!-- Contenedor de Vistas Dinámicas (SPA Viewport) -->
      <main id="main-viewport" class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-zinc-950 focus:outline-none" tabindex="-1">
        <!-- Las vistas se montan aquí dinámicamente mediante el router -->
      </main>
    </div>
  `;

  // Activar controladores de interacción del cascarón
  setupSidebarInteractions();
  setupHeaderInteractions();

  // Iniciar enrutador SPA del lado del cliente
  router.init('#main-viewport');
}

// Inicializar al cargar el DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapApp);
} else {
  bootstrapApp();
}
