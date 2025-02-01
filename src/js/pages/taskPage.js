import TaskCard from "../web-components/task-card.js";
import TaskModal from "../web-components/task-modal.js";
import PreferencesService from "../services/preferencesService.js";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

  :host {
    --primary-color: #2563eb;
    --primary-light: #3b82f6;
    --text-primary: #1f2937;
    --background-primary: #ffffff;
    --background-secondary: #f3f4f6;
    --spacing-xs: 0.5rem;
    --spacing-sm: 0.75rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --border-radius-md: 0.5rem;
    --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
    --transition-fast: 150ms;
    --transition-normal: 300ms;

    display: block;
    font-family: 'Inter', sans-serif;
    color: var(--text-primary);
    background: var(--background-primary);
    min-height: 100vh;
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* Encabezado con botón de regresar */
  .header {
    display: flex;
    align-items: center;
    padding: var(--spacing-md);
    background: var(--background-secondary);
    border-bottom: 1px solid #e5e7eb;
  }

  .back-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.75rem;
    margin-right: var(--spacing-md);
    color: var(--primary-color);
    transition: transform var(--transition-fast);
  }
  
  .back-button:hover {
    transform: scale(1.1);
  }

  .header-content {
    flex: 1;
    text-align: center;
  }

  .title {
    font-size: clamp(1.75rem, 5vw, 2.5rem);
    font-weight: 600;
    color: var(--primary-color);
  }

  .subtitle {
    font-size: 1rem;
    color: var(--text-primary);
    opacity: 0.8;
    margin-top: var(--spacing-xs);
  }

  /* Contenedor principal de tareas */
  .tasks-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-lg);
  }

  .tasks-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-lg);
    margin-top: var(--spacing-lg);
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
    padding: var(--spacing-lg);
    background: var(--background-secondary);
    border-radius: var(--border-radius-md);
    color: var(--text-primary);
    box-shadow: var(--shadow-md);
    transition: all var(--transition-normal) ease-in-out;
  }

.fab-button {
  position: fixed;
  right: var(--spacing-lg);
  bottom: var(--spacing-lg);
  background-color: var(--primary-color);
  color: #FFFFFF;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  transition: background var(--transition-fast), transform var(--transition-fast);
  animation: fab-appear 0.5s ease-out;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

@keyframes fab-appear {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (hover: hover) {
  .fab-button:hover {
    background-color: var(--primary-light);
    transform: scale(1.1);
  }
}

.fab-button:active {
  transform: scale(0.95);
}

.fab-button .icon {
  transition: transform var(--transition-normal);
}

.fab-button:active .icon {
  transform: rotate(360deg);
}

  @media (prefers-reduced-motion: reduce) {
    :host *, .fab-button, .tasks-container {
      animation: none;
      transition: none;
    }
  }
`;

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
        ${styles}
      </style>

      <main class="tasks-container">
        <header class="header">
          <button class="back-button" id="go-home" aria-label="Volver a la página principal">🏠</button>
          <div class="header-content">
            <div class="title">${this.CONFIG.defaultTitle}</div>
            <div class="subtitle">${this.CONFIG.defaultSubtitle}</div>
          </div>
        </header>

        <!-- Área de tareas -->
        <section class="tasks-content fade-in" aria-live="polite">
          <div class="empty-state">
            <p>${this.CONFIG.emptyStateMessage}</p>
          </div>
        </section>

        <task-modal id="task-modal"></task-modal>

        <button class="fab-button" id="add-task" aria-label="Agregar nueva tarea"><span class="icon">+</span></button>
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
        // Botón de regresar
        const homeButton = this.shadowRoot.querySelector("#go-home");
        homeButton.addEventListener("click", () => window.router.loadRoute("/"));

        // Botón para agregar tarea (FAB)
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
