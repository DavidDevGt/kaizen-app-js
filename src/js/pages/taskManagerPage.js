class TasksPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        const CONFIG = {
            limit: 10,
            defaultTitle: 'TaskManager',
            defaultSubtitle: 'Organiza tus tareas de manera eficiente y simple',
            emptyStateMessage: 'No hay tareas pendientes. ¡Comienza agregando una!',
            storageKey: 'tasks_data',
            taskStructure: {
                title: '',
                description: '',
                subtasks: [],
                completed: false,
                timestamp: Date.now(),
                priority: 'medium',
                tags: [],
            },
            priorityLevels: {
                low: { label: 'Baja', color: '#6291FF' },
                medium: { label: 'Media', color: '#3ED5A3' },
                high: { label: 'Alta', color: '#FF5E5E' },
            },
            tags: ['Personal', 'Work', 'Health', 'Study', 'Home', 'Other'],
        };

        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap'); 
                :host { --primary-color:#2563eb; --primary-light:#3b82f6; --primary-dark:#1d4ed8; --success-color:#10b981; --error-color:#ef4444; --warning-color:#f59e0b; --text-primary:#1f2937; --text-secondary:#4b5563; --background-primary:#ffffff; --background-secondary:#f3f4f6; --spacing-xs:0.5rem; --spacing-sm:0.75rem; --spacing-md:1rem; --spacing-lg:1.5rem; --spacing-xl:2rem; --border-radius-sm:0.375rem; --border-radius-md:0.5rem; --border-radius-lg:0.75rem; --shadow-sm:0 1px 2px rgba(0,0,0,0.05); --shadow-md:0 4px 6px -1px rgba(0,0,0,0.1); --shadow-lg:0 10px 15px -3px rgba(0,0,0,0.1); --transition-fast:150ms; --transition-normal:300ms; display:block; font-family:'Poppins',sans-serif; color:var(--text-primary); line-height:1.6; background:var(--background-primary); min-height:100vh; } 
                *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; } 
                .tasks-container { max-width:min(90%,1200px); margin:0 auto; padding:var(--spacing-xl); animation:fadeIn var(--transition-normal) ease-out; } 
                @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } } 
                .tasks-header { margin-bottom:var(--spacing-xl); text-align:center; position:relative; } 
                .tasks-title { font-size:clamp(1.875rem,5vw,3rem); color:var(--primary-color); margin-bottom:var(--spacing-sm); font-weight:600; letter-spacing:-0.025em; } 
                .tasks-subtitle { font-size:1.125rem; color:var(--text-secondary); font-weight:300; max-width:600px; margin:0 auto; } 
                .tasks-content { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr)); gap:var(--spacing-lg); margin:var(--spacing-xl) 0; min-height:200px; } 
                .empty-state { text-align:center; padding:var(--spacing-xl); background:var(--background-secondary); border-radius:var(--border-radius-lg); color:var(--text-secondary); } 
                .tasks-nav { display:flex; justify-content:center; gap:var(--spacing-md); margin-top:var(--spacing-xl); } 
                .button { background-color:var(--primary-color); color:white; border:none; border-radius:var(--border-radius-md); padding:var(--spacing-sm) var(--spacing-lg); font-size:1rem; font-weight:500; cursor:pointer; transition:all var(--transition-fast) ease-in-out; display:inline-flex; align-items:center; gap:var(--spacing-xs); position:relative; overflow:hidden; } 
                .button:hover { background-color:var(--primary-light); transform:translateY(-2px); box-shadow:var(--shadow-md); } 
                .button:active { transform:translateY(0); } 
                .button:focus-visible { outline:3px solid var(--primary-light); outline-offset:2px; } 
                .button::after { content:''; position:absolute; inset:0; background:linear-gradient(to right,transparent,rgba(255,255,255,0.1),transparent); transform:translateX(-100%); transition:transform var(--transition-normal); } 
                .button:hover::after { transform:translateX(100%); } 
                @media (prefers-reduced-motion:reduce) { :host *, .button, .tasks-container { animation:none; transition:none; } .button::after { display:none; } } 
                @media (prefers-color-scheme:dark) { :host { --primary-color:#3b82f6; --primary-light:#60a5fa; --primary-dark:#2563eb; --text-primary:#f3f4f6; --text-secondary:#9ca3af; --background-primary:#ffffff; --background-secondary:#f3f4f6; } }
            </style>

            <main class="tasks-container">
                <header class="tasks-header">
                    <h1 class="tasks-title">
                        <span aria-hidden="true">📝</span>
                        <span>${CONFIG.defaultTitle}</span>
                    </h1>
                    <p class="tasks-subtitle">${CONFIG.defaultSubtitle}</p>
                </header>

                <section class="tasks-content" aria-live="polite">
                    <div class="empty-state">
                        <p>${CONFIG.emptyStateMessage}</p>
                    </div>
                </section>

                <nav class="tasks-nav">
                    <button class="button" id="go-home" aria-label="Volver a la página principal">
                        <span aria-hidden="true">🏠</span>
                        <span>Volver al Inicio</span>
                    </button>
                </nav>
            </main>
        `;

        this._setupEventListeners();
    }

    _setupEventListeners() {
        const homeButton = this.shadowRoot.querySelector("#go-home");
        const handleClick = () => window.router.loadRoute("/");
        homeButton.addEventListener("click", handleClick);
        this._cleanup = () => homeButton.removeEventListener("click", handleClick);
    }

    connectedCallback() {
        console.log('TasksPage component mounted');
    }

    disconnectedCallback() {
        if (this._cleanup) this._cleanup();
    }
}

customElements.define("tasks-page", TasksPage);

export default TasksPage;