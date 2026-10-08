# CloudPulse — Dashboard de Observabilidad y Telemetría Cloud

> **Single Page Application (SPA) de alto rendimiento construida en Vanilla JavaScript puro, HTML5 y Tailwind CSS v4, sin frameworks ni dependencias de UI.**

---

## Descripción General

**CloudPulse** es una plataforma de visualización técnica diseñada para operaciones de infraestructura en la nube y DevOps. Proporciona telemetría continua en tiempo real, catálogo de microservicios, explorador de logs en streaming y un simulador de contingencias (*Chaos Engineering*) para evaluar la resiliencia del sistema ante fallos.

Forma parte del portafolio profesional de ingeniería de **Karlo Aldair (Brewall)**, demostrando comprensión profunda de los fundamentos de la plataforma web, arquitectura modular sin librerías externas y principios de ingeniería de software.

---

## Características Principales

* **Client-Side Router Nativo:** Enrutamiento SPA basado en hash (`#/overview`, `#/services`, `#/logs`, `#/incidents`, `#/settings`) con carga dinámica y preservación de estado sin recargar la página.
* **Gráficas de Telemetría en SVG Puro:** Algoritmo matemático para interpolar puntos numéricos en curvas Bézier cúbicas suaves (Catmull-Rom a Bézier), gradientes dinámicos y cuadrículas responsivas sin recurrir a bibliotecas pesadas de gráficos.
* **Explorador de Streaming de Logs:** Consola de terminal con scroll automático inteligente (se suspende automáticamente al hacer scroll hacia arriba), filtros en vivo por severidad (`ALL`, `INFO`, `WARN`, `ERROR`), buscador por texto/código HTTP y exportación a archivos `.json` o `.txt`.
* **Manejo Eficiente de Memoria:** Búfer circular que restringe el almacenamiento en memoria a los últimos 200 eventos, previniendo fugas de memoria y degradación del navegador.
* **Topología de Nodos y Endpoints:** Inspección interactiva de servicios simulados (Java / Spring Boot, Node.js / Express, PostgreSQL HA, Redis Sentinel) con latencias percentiles (p50, p95, p99) y llamadas por minuto.
* **Inyección de Fallos (Chaos Testing):** Herramientas para simular caídas de nodos primarios de base de datos, picos masivos de tráfico (>5,000 req/s) y auto-recuperación (*Auto-Healing*).
* **Gestión de Incidentes y Timelines:** Clasificación de alertas por severidad (`P1`, `P2`, `P3`) con desglose paso a paso del ciclo de vida del incidente.

---

## Arquitectura del Proyecto

```
cloudpulse/
├── .github/workflows/
│   └── deploy.yml            # Pipeline automatizado de CI/CD para GitHub Pages
├── index.html                # Punto de entrada HTML con meta-tags y shell
├── vite.config.js            # Configuración de Vite con Tailwind CSS v4
├── package.json              # Dependencias y scripts de construcción
├── src/
│   ├── main.js               # Bootstrap de la aplicación y montaje del layout
│   ├── style.css             # Tailwind CSS v4, animaciones neón y temas oscuros
│   ├── router/
│   │   └── index.js          # Enrutador SPA con actualizaciones reactivas
│   ├── state/
│   │   └── store.js          # Gestor de estado reactivo y motor de telemetría
│   ├── components/
│   │   ├── Sidebar.js        # Menú lateral responsivo con badges dinámicos
│   │   ├── Header.js         # Encabezado con estado global y botón de caos
│   │   ├── MetricCard.js     # Tarjetas reutilizables de métricas KPI
│   │   ├── Sparkline.js      # Generador matemático de trazados SVG
│   │   └── LogConsole.js     # Consola reutilizable de logs en streaming
│   └── views/
│       ├── OverviewView.js   # Vista general de métricas y topología de servicios
│       ├── ServicesView.js   # Catálogo detallado de nodos y microservicios
│       ├── LogsView.js       # Explorador de logs en pantalla completa
│       ├── IncidentsView.js  # Centro de alertas y ciclo de vida de incidencias
│       └── SettingsView.js   # Umbrales de alerta y panel de Chaos Testing
```

---

## Stack Tecnológico

* **Lenguaje:** JavaScript ES2022+ (ES Modules, Vanilla JS nativo)
* **Estilos:** Tailwind CSS v4 con `@tailwindcss/vite`
* **Herramienta de Construcción:** Vite 8
* **Iconografía y Gráficos:** SVG nativo generado por código
* **CI/CD:** GitHub Actions (`deploy.yml`) hacia GitHub Pages

---

## Ejecución Local

1. **Clonar o ingresar al repositorio:**
   ```bash
   cd cloudpulse
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Acceder a `http://localhost:3000/cloudpulse/` en el navegador.

4. **Compilar para producción:**
   ```bash
   npm run build
   ```

---

## Estándares de Ingeniería

* **Conventional Commits en español:** Historial de Git atómico y ordenado (`feat(...)`, `fix(...)`, `chore(...)`, `ci(...)`).
* **Accesibilidad (a11y):** Contraste semántico optimizado para temas oscuros, soporte de navegación por teclado y etiquetas ARIA en controles modales y paneles laterales.
* **Rendimiento:** Tiempos de carga instantáneos gracias a la ausencia de capas de virtual DOM y empaquetado ultra ligero (<80 KB gzip total).
