import TaskCard from "../web-components/task-card.js";
import TaskModal from "../web-components/task-modal.js";
import PreferencesService from "../services/preferencesService.js";

class TasksPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.CONFIG = {
            defaultTitle: 'TaskManager',
            defaultSubtitle: 'Organiza tus tareas de manera eficiente y simple',
            emptyStateMessage: 'No hay tareas pendientes. ¡Comienza agregando una!',

            addTaskButtonLabel: 'Agregar tarea',
            storageKey: 'tasks_data',
            tags: ['Personal', 'Work', 'Health', 'Study', 'Home', 'Other'],
        };

        // Inicializar tareas como un arreglo vacío
        this.tasks = [];
        this._render();
    }

    async connectedCallback() {
        console.log('TasksPage component montado');
        await this._loadTasks();
        this._renderTasks();
    }
    

    static get observedAttributes() {
        return ['title', 'description', 'completed', 'priority', 'tags', 'image'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if (name === 'tags') {
                this.task[name] = newValue.split(',').map(tag => tag.trim());
            } else if (name === 'completed') {
                this.task[name] = newValue === 'true';
            } else {
                this.task[name] = newValue;
            }
            this._render();
        }
    }

    /**
     * Carga las tareas desde PreferencesService
     */
    async _loadTasks() {
        try {
            const savedTasks = await PreferencesService.getPreference(this.CONFIG.storageKey);
            this.tasks = savedTasks ? savedTasks : [];
        } catch (error) {
            console.error('Error al cargar las tareas:', error);
            this.tasks = [];
        }
    }

    /**
     * Guarda las tareas en PreferencesService
     */
    async _saveTasks() {
        try {
            await PreferencesService.setPreference(this.CONFIG.storageKey, this.tasks);
        } catch (error) {
            console.error('Error al guardar las tareas:', error);
        }
    }

    _render() {
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap'); 
                :host { 
                    --primary-color: #2563eb; 
                    --primary-light: #3b82f6; 
                    --primary-dark: #1d4ed8; 
                    --success-color: #10b981; 
                    --error-color: #ef4444; 
                    --warning-color: #f59e0b; 
                    --text-primary: #1f2937; 
                    --text-secondary: #4b5563; 
                    --background-primary: #ffffff; 
                    --background-secondary: #f3f4f6; 
                    --spacing-xs: 0.5rem; 
                    --spacing-sm: 0.75rem; 
                    --spacing-md: 1rem; 
                    --spacing-lg: 1.5rem; 
                    --spacing-xl: 2rem; 
                    --border-radius-sm: 0.375rem; 
                    --border-radius-md: 0.5rem; 
                    --border-radius-lg: 0.75rem; 
                    --shadow-sm: 0 1px 2px rgba(0,0,0,0.05); 
                    --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1); 
                    --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1); 
                    --transition-fast: 150ms; 
                    --transition-normal: 300ms; 
                    
                    display: block; 
                    font-family: 'Inter', sans-serif; 
                    color: var(--text-primary); 
                    background: var(--background-primary); 
                    min-height: 100vh; 
                } 
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; } 
                .tasks-container { 
                    max-width: 1200px; 
                    margin: 0 auto; 
                    padding: var(--spacing-xl); 
                    animation: fadeIn var(--transition-normal) ease-out; 
                } 
                @keyframes fadeIn { 
                    from { opacity: 0; transform: translateY(10px); } 
                    to { opacity: 1; transform: translateY(0); } 
                } 
                .tasks-header { 
                    margin-bottom: var(--spacing-xl); 
                    text-align: center; 
                } 
                .tasks-title { 
                    font-size: clamp(1.875rem, 5vw, 3rem); 
                    color: var(--primary-color); 
                    margin-bottom: var(--spacing-sm); 
                    font-weight: 600; 
                    letter-spacing: -0.025em; 
                } 
                .tasks-subtitle { 
                    font-size: 1.125rem; 
                    color: var(--text-secondary); 
                    font-weight: 300; 
                    max-width: 600px; 
                    margin: 0 auto; 
                } 
                .tasks-content { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
                    gap: var(--spacing-lg); 
                    margin: var(--spacing-xl) 0; 
                    transition: all var(--transition-normal) ease-in-out;
                } 
                .tasks-content.fade-in {
                    opacity: 0;
                    transform: scale(0.95);
                    transition: opacity var(--transition-normal) ease-out, transform var(--transition-normal) ease-out;
                }
                .tasks-content.fade-in.show {
                    opacity: 1;
                    transform: scale(1);
                }
                .empty-state { 
                    text-align: center; 
                    padding: var(--spacing-xl); 
                    background: var(--background-secondary); 
                    border-radius: var(--border-radius-lg); 
                    color: var(--text-secondary); 
                    box-shadow: var(--shadow-sm);
                    transition: all var(--transition-normal) ease-in-out;
                } 
                .tasks-nav { 
                    display: flex; 
                    justify-content: center; 
                    gap: var(--spacing-md); 
                    margin-top: var(--spacing-xl); 
                } 
                .button { 
                    background-color: var(--primary-color); 
                    color: white; 
                    border: none; 
                    border-radius: var(--border-radius-md); 
                    padding: var(--spacing-sm) var(--spacing-lg); 
                    font-size: 1rem; 
                    font-weight: 500; 
                    cursor: pointer; 
                    transition: all var(--transition-fast) ease-in-out; 
                    display: inline-flex; 
                    align-items: center; 
                    gap: var(--spacing-xs); 
                    position: relative; 
                    overflow: hidden; 
                } 
                .button:hover { 
                    background-color: var(--primary-light); 
                    transform: translateY(-2px); 
                    box-shadow: var(--shadow-md); 
                } 
                .button:active { 
                    transform: translateY(0); 
                } 
                .button:focus-visible { 
                    outline: 3px solid var(--primary-light); 
                    outline-offset: 2px; 
                } 
                .button::after { 
                    content: ''; 
                    position: absolute; 
                    inset: 0; 
                    background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent); 
                    transform: translateX(-100%); 
                    transition: transform var(--transition-normal); 
                } 
                .button:hover::after { 
                    transform: translateX(100%); 
                } 
                @media (prefers-reduced-motion: reduce) { 
                    :host *, .button, .tasks-container { 
                        animation: none; 
                        transition: none; 
                    } 
                    .button::after { 
                        display: none; 
                    } 
                } 
            </style>

            <main class="tasks-container">
                <header class="tasks-header">
                    <h1 class="tasks-title">
                        <span aria-hidden="true">📝</span>
                        <span>${this.CONFIG.defaultTitle}</span>
                    </h1>
                    <p class="tasks-subtitle">${this.CONFIG.defaultSubtitle}</p>
                </header>

                <section class="tasks-content fade-in" aria-live="polite">
                    <div class="empty-state">
                        <p>${this.CONFIG.emptyStateMessage}</p>
                    </div>
                </section>

                <nav class="tasks-nav">
                    <button class="button" id="add-task" aria-label="Agregar nueva tarea">
                        <span aria-hidden="true">➕</span>
                        <span>${this.CONFIG.addTaskButtonLabel}</span>
                    </button>
                    <button class="button" id="go-home" aria-label="Volver a la página principal">
                        <span aria-hidden="true">🏠</span>
                        <span>Volver al Inicio</span>
                    </button>
                </nav>

                <task-modal id="task-modal"></task-modal>
            </main>
        `;
        this.tasksContainer = this.shadowRoot.querySelector(".tasks-content");
        this._renderTasks();
        this._setupEventListeners();
    }

    /**
     * Renderiza las tareas en la interfaz
     */
    _renderTasks() {
        this.tasksContainer.innerHTML = '';

        if (this.tasks.length === 0) {
            this.tasksContainer.innerHTML = `
                <div class="empty-state">
                    <p>${this.CONFIG.emptyStateMessage}</p>
                </div>
            `;

        
        } else {
            // Añadir clase para animación
            this.tasksContainer.classList.add('show');
            this.tasks.forEach(task => {
                const taskCard = document.createElement('task-card');
                taskCard.setTask(task);

                taskCard.addEventListener('task-completed', (e) => this._toggleTaskCompletion(e.detail.id, e.detail.completed));
                taskCard.addEventListener('edit-task', (e) => this._editTask(e.detail.id));
                taskCard.addEventListener('delete-task', (e) => this._deleteTask(e.detail.id));

                this.tasksContainer.appendChild(taskCard);
            });
        }
    }

    /**
     * Alterna el estado de completado de una tarea
     * @param {number} taskId 
     * @param {boolean} completed 
     */
    _toggleTaskCompletion(taskId, completed) {
        this.tasks = this.tasks.map(task => task.id === taskId ? { ...task, completed } : task);
        this._saveTasks();
        this._renderTasks();
    }

    /**
     * Edita una tarea específica
     * @param {number} taskId 
     */
    _editTask(taskId) {
        console.log(`Editar tarea con ID: ${taskId}`);
        const taskToEdit = this.tasks.find(task => task.id === taskId);
        if (taskToEdit) {
            const taskModal = this.shadowRoot.querySelector("#task-modal");
            taskModal.openWithTask(taskToEdit); // Asegúrate de implementar este método en TaskModal
        }
    }

    /**
     * Elimina una tarea específica
     * @param {number} taskId 
     */
    _deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this._saveTasks();
        this._renderTasks();
    }

    /**
     * Configura los listeners de eventos
     */
    _setupEventListeners() {
        const homeButton = this.shadowRoot.querySelector("#go-home");
        homeButton.addEventListener("click", () => window.router.loadRoute("/"));

        const addTaskButton = this.shadowRoot.querySelector("#add-task");
        const taskModal = this.shadowRoot.querySelector("#task-modal");

        addTaskButton.addEventListener("click", () => {
            taskModal.open();
        });

        taskModal.addEventListener("task-added", (e) => {
            this.tasks.push(e.detail);
            this._saveTasks();
            this._renderTasks();
        });

        taskModal.addEventListener("task-updated", (e) => {
            const updatedTask = e.detail;
            this.tasks = this.tasks.map(task => 
                task.id === updatedTask.id ? { ...task, ...updatedTask } : task
            );
            this._saveTasks();
            this._renderTasks();
        });
        
    }
}

customElements.define("tasks-page", TasksPage);

export default TasksPage;
