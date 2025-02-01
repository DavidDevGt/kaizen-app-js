const styles = `
                :host {
                    --modal-background: #ffffff;
                    --modal-border-radius: 8px;
                    --modal-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    --primary-color: #333333;
                    --secondary-color: #888888;
                    --error-color: #e74c3c;
                    --button-primary: #4CAF50;
                    --button-primary-hover: #45a049;
                    --button-secondary: #f44336;
                    --button-secondary-hover: #da190b;
                    --font-family: 'Inter', sans-serif;

                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.3);
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    font-family: var(--font-family);
                }
                .modal {
                    background: var(--modal-background);
                    padding: 2.5rem;
                    border-radius: var(--modal-border-radius);
                    max-width: 500px;
                    width: 90%;
                    box-shadow: var(--modal-shadow);
                    animation: fadeIn 0.3s ease;
                    position: relative;
                }
                #task-priority {
                    width: 100%;
                    padding: 0.85rem;
                    border: 2px solid var(--primary-color);
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    box-sizing: border-box;
                    color: var(--primary-color);
                    font-weight: 600;
                    background-color: #f8f9fa;
                    appearance: none;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    position: relative;
                    cursor: pointer;
                }

                #task-priority {
                    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="%23666666"><path d="M7 10l5 5 5-5z"/></svg>');
                    background-repeat: no-repeat;
                    background-position: right 10px center;
                    background-size: 16px;
                }

                #task-priority:hover,
                #task-priority:focus {
                    border-color: var(--primary-dark);
                    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                    outline: none;
                }

                #task-priority option {
                    color: var(--primary-color);
                    font-weight: 500;
                    background: #fff;
                    padding: 10px;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #e0e0e0;
                    padding-bottom: 0.75rem;
                }
                .modal-title {
                    font-size: 1.5rem;
                    color: var(--primary-color);
                    margin: 0;
                }
                .btn-close {
                    background: transparent;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: var(--secondary-color);
                    transition: color 0.2s ease;
                }
                .btn-close:hover {
                    color: #ff4d4d;
                }
                .modal-body {
                    margin-top: 1.5rem;
                }
                .form-group {
                    margin-bottom: 1.5rem;
                }
                label {
                    font-weight: 600;
                    display: block;
                    color: var(--primary-color);
                    margin-bottom: 0.5rem;
                }
                input, textarea {
                    width: 100%;
                    padding: 0.85rem;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 1rem;
                    transition: border-color 0.2s ease;
                    box-sizing: border-box;

                    color: var(--primary-color);
                    
                }
                input:focus, textarea:focus {
                    border-color: var(--button-primary);
                    outline: none;
                    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
                }
                textarea {
                    resize: vertical;
                    min-height: 120px;
                }
                .error-message {
                    color: var(--error-color);
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                    display: none;
                }
                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.75rem;
                    margin-top: 2rem;
                }
                button {
                    padding: 0.65rem 1.5rem;
                    border: none;
                    cursor: pointer;
                    border-radius: 4px;
                    font-size: 1rem;
                    transition: background-color 0.2s ease, transform 0.2s ease;
                }
                .btn-primary {
                    background: var(--button-primary);
                    color: white;
                }
                .btn-secondary {
                    background: var(--button-secondary);
                    color: #FFFFFF;
                }
                .btn-primary:hover {
                    background: var(--button-primary-hover);
                    transform: translateY(-1px);
                }
                .btn-secondary:hover {
                    background: var(--button-secondary-hover);
                    transform: translateY(-1px);
                }
                @media (max-width: 480px) {
                    .modal {
                        padding: 2rem;
                    }
                    .modal-title {
                        font-size: 1.25rem;
                    }
                }
`;
class TaskModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._render();
        this._handleKeyDown = this._handleKeyDown.bind(this);
    }

    _render() {
        this.shadowRoot.innerHTML = `
            <style>
                ${styles}
            </style>

            <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <div class="modal-header">
                    <h2 class="modal-title" id="modal-title">Agregar Tarea</h2>
                    <button class="btn-close" aria-label="Cerrar Modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="task-form" novalidate>
                        <div class="form-group">
                            <label for="task-title">Título:</label>
                            <input type="text" id="task-title" name="title" placeholder="Ej. Comprar pan" required>
                            <span class="error-message" id="title-error">El título es obligatorio.</span>
                        </div>
                            
                        <div class="form-group">
                            <label for="task-priority">Prioridad:</label>
                            <select id="task-priority" name="priority" required>
                                <option value="low">Baja</option>
                                <option value="medium" selected>Media</option>
                                <option value="high">Alta</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="task-description">Descripción:</label>
                            <textarea id="task-description" name="description" placeholder="Detalles de la tarea"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary" id="cancel">Cancelar</button>
                    <button type="button" class="btn-primary" id="save">Guardar</button>
                </div>
            </div>
        `;

        this._setupEventListeners();
    }

    _setupEventListeners() {
        const closeBtn = this.shadowRoot.querySelector(".btn-close");
        const cancelBtn = this.shadowRoot.querySelector("#cancel");
        const saveBtn = this.shadowRoot.querySelector("#save");
        const modal = this.shadowRoot.querySelector(".modal");
        const backdrop = this; // Host element

        closeBtn.addEventListener("click", () => this.close());
        cancelBtn.addEventListener("click", () => this.close());
        saveBtn.addEventListener("click", () => this._saveTask());

        // Cerrar al hacer clic fuera del modal
        backdrop.addEventListener("click", (e) => {
            const path = e.composedPath();
            if (!path.includes(modal)) {
                this.close();
            }
        });

        // Cerrar con la tecla Esc
        this.shadowRoot.addEventListener("keydown", this._handleKeyDown);

        modal.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    }

    _handleKeyDown(e) {
        if (e.key === "Escape" && this.isOpen) {
            this.close();
        }
    }

    open() {
        this.style.display = "flex";
        requestAnimationFrame(() => {
            this.style.opacity = "1";
        });
        this.isOpen = true;
        this._trapFocus();
    }

    openWithTask(task) {
        // Implementar si se necesita editar una tarea
        // Puedes rellenar los campos del formulario con los datos de la tarea
        const form = this.shadowRoot.querySelector("#task-form");
        this.shadowRoot.querySelector("#task-priority").value = task.priority || "medium";

        form.title.value = task.title;
        form.description.value = task.description;
        this.taskIdToEdit = task.id; // Guarda el ID de la tarea para actualizarla
        this.open();
    }

    close() {
        this.style.opacity = "0";
        setTimeout(() => {
            this.style.display = "none";
            this.isOpen = false;
        }, 300);
        this._removeFocusTrap();
    }

    _saveTask() {
        const form = this.shadowRoot.querySelector("#task-form");
        const titleInput = this.shadowRoot.querySelector("#task-title");
        const titleError = this.shadowRoot.querySelector("#title-error");
        const priority = this.shadowRoot.querySelector("#task-priority").value;

        const title = titleInput.value.trim();
        const description = this.shadowRoot.querySelector("#task-description").value.trim();

        // Validación
        if (!title) {
            titleError.style.display = "block";
            titleInput.focus();
            return;
        } else {
            titleError.style.display = "none";
        }

        if (this.taskIdToEdit) {
            // Actualizar tarea existente
            const updatedTask = {
                id: this.taskIdToEdit,
                title,
                description,
                priority,
            };

            this.dispatchEvent(new CustomEvent("task-updated", {
                detail: updatedTask,
                bubbles: true,
                composed: true,
            }));
        } else {
            // Crear nueva tarea
            const newTask = {
                id: Date.now(),
                title,
                description,
                completed: false,
                timestamp: Date.now(),
                priority,
                tags: [],
            };

            this.dispatchEvent(new CustomEvent("task-added", {
                detail: newTask,
                bubbles: true,
                composed: true,
            }));
        }

        this.close();
        form.reset();
        this.taskIdToEdit = null;
    }

    _trapFocus() {
        const focusableElements = this.shadowRoot.querySelectorAll(
            'button, [href], input, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        this._handleTab = (e) => {
            if (e.key === "Tab") {
                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };

        this.shadowRoot.addEventListener("keydown", this._handleTab);
        firstElement.focus();
    }

    _removeFocusTrap() {
        this.shadowRoot.removeEventListener("keydown", this._handleTab);
    }
}

customElements.define("task-modal", TaskModal);
export default TaskModal;
