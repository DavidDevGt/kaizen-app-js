class Router {
    constructor() {
        this.routes = {};
        window.addEventListener("popstate", () => this.loadRoute(location.pathname));
    }

    /**
     * Registra una nueva ruta en el router.
     * @param {string} path - Ruta (ej: "/tasks")
     * @param {Function} pageFunction - Función que devuelve un Web Component
     */
    addRoute(path, pageFunction) {
        this.routes[path] = pageFunction;
    }

    /**
     * Carga una ruta específica.
     * @param {string} path - Ruta a cargar (ej: "/tasks")
     */
    loadRoute(path) {
        const content = document.querySelector("app-layout").shadowRoot.querySelector(".content");

        if (this.routes[path]) {
            content.innerHTML = "";
            content.appendChild(this.routes[path]());
            history.pushState({}, "", path);
        } else {
            console.warn(`Ruta no encontrada: ${path}`);
        }
    }

    /**
     * Inicia el router y carga la ruta actual.
     */
    init() {
        this.loadRoute(location.pathname);
    }
}

export const router = new Router();