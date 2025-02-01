const styles = `
  :host {
    display: block;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    margin: 12px 0;
  }

  :host(:hover) {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }

  .card-container {
    padding: 16px;
  }

  /* Cabecera y título de la tarea */
  .task-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .task-title {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: 600;
    color: #222222;
    gap: 10px;
  }

  .task-title input[type="checkbox"] {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid #007aff;
    border-radius: 4px;
    margin: 0;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }

  .task-title input[type="checkbox"]:checked {
    background-color: #007aff;
    border-color: #007aff;
  }

  .task-title input[type="checkbox"]:checked::after {
    content: "✓";
    display: block;
    color: #fff;
    text-align: center;
    line-height: 20px;
    font-size: 14px;
  }

  .priority-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #FBBF24; /* valor por defecto, se puede sobrescribir inline */
  }

  /* Etiquetas de la tarea */
  .task-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 12px 0;
  }

  .tag {
    background-color: #f2f2f7;
    color: #8e8e93;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }

  /* Descripción e imagen */
  .task-description {
    font-size: 15px;
    color: #555555;
    line-height: 1.5;
    margin: 12px 0;
  }

  .task-image {
    width: 100%;
    border-radius: 12px;
    object-fit: cover;
    margin: 12px 0;
    transition: opacity 0.2s ease;
  }

  .task-image:hover {
    opacity: 0.95;
  }

  /* Subtareas */
  .subtasks {
    margin: 16px 0;
  }

  .subtasks h4 {
    font-size: 16px;
    font-weight: 600;
    color: #222222;
    margin-bottom: 8px;
  }

  .subtasks ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  /* Pie de tarjeta */
  .task-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #f2f2f7;
    padding-top: 12px;
    margin-top: 12px;
  }

  .timestamp {
    font-size: 12px;
    color: #8e8e93;
  }

  .actions {
    display: flex;
    gap: 12px;
  }

  .action-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    transition: color 0.2s ease;
    padding: 4px;
    border-radius: 6px;
  }

  .action-button.edit-button {
    color: #007aff;
  }

  .action-button.delete-button {
    color: #ff3b30;
  }

  .action-button:hover {
    background-color: #f2f2f7;
  }
`;

import './subtask-item.js';

class TaskCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.task = {
            id: null,
            title: '',
            description: '',
            subtasks: [],
            completed: false,
            timestamp: Date.now(),
            priority: 'medium',
            tags: [],
            image: null,
        };

        this._render();
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

    connectedCallback() {
        this._setupEventListeners();
    }

    disconnectedCallback() {
        this._cleanup();
    }

    setTask(task) {
        this.task = { ...this.task, ...task };
        this._render();

        const priorityIndicator = this.shadowRoot.querySelector('.priority-indicator');
        if (priorityIndicator) {
            priorityIndicator.style.backgroundColor = this._getPriorityColor(this.task.priority);
        }
    }


    _getPriorityColor(priority) {
        const priorityColors = {
            low: '#6EE7B7',
            medium: '#FBBF24',
            high: '#F87171',
        };
        return priorityColors[priority] || '#FBBF24';
    }

    _render() {
        this.shadowRoot.innerHTML = `
          <style>
            ${styles}
          </style>
          <div class="card-container">
            <div class="task-header">
              <label class="task-title">
                <input type="checkbox" id="task-completed" ${this.task.completed ? 'checked' : ''} />
                ${this.task.title}
              </label>
              <div class="priority-indicator" style="background-color: ${this._getPriorityColor(this.task.priority)};"></div>
            </div>
      
            ${this.task.tags.length > 0 ? `
              <div class="task-tags">
                ${this.task.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
              </div>
            ` : ''}
      
            ${this.task.description ? `<div class="task-description">${this.task.description}</div>` : ''}
      
            ${this.task.image ? `<img src="${this.task.image}" alt="Imagen de la tarea" class="task-image"/>` : ''}
      
            ${this.task.subtasks.length > 0 ? `
              <div class="subtasks">
                <h4>Subtareas</h4>
                <ul>
                  ${this.task.subtasks.map(subtask => `
                    <li>
                      <subtask-item 
                        id="${subtask.id}" 
                        title="${subtask.title}" 
                        completed="${subtask.completed}"
                      ></subtask-item>
                    </li>
                  `).join('')}
                </ul>
              </div>
            ` : ''}
      
            <div class="task-footer">
              <span class="timestamp">${new Date(this.task.timestamp).toLocaleString()}</span>
              <div class="actions">
                <button class="action-button edit-button" aria-label="Editar tarea">✏️</button>
                <button class="action-button delete-button" aria-label="Eliminar tarea">🗑️</button>
              </div>
            </div>
          </div>
        `;
        this._setupEventListeners();
    }

    _setupEventListeners() {
        const completedCheckbox = this.shadowRoot.querySelector('#task-completed');
        const editButton = this.shadowRoot.querySelector('.edit-button');
        const deleteButton = this.shadowRoot.querySelector('.delete-button');
        const subtaskItems = this.shadowRoot.querySelectorAll('subtask-item');

        if (completedCheckbox) {
            this._onCompletedChange = (e) => {
                this.task.completed = e.target.checked;
                this.dispatchEvent(new CustomEvent('task-completed', {
                    detail: { id: this.task.id, completed: this.task.completed },
                    bubbles: true,
                    composed: true,
                }));
            };
            completedCheckbox.addEventListener('change', this._onCompletedChange);
        }

        if (editButton) {
            this._onEditClick = () => {
                this.dispatchEvent(new CustomEvent('edit-task', {
                    detail: { id: this.task.id },
                    bubbles: true,
                    composed: true,
                }));
            };
            editButton.addEventListener('click', this._onEditClick);
        }

        if (deleteButton) {
            this._onDeleteClick = () => {
                this.dispatchEvent(new CustomEvent('delete-task', {
                    detail: { id: this.task.id },
                    bubbles: true,
                    composed: true,
                }));
            };
            deleteButton.addEventListener('click', this._onDeleteClick);
        }

        subtaskItems.forEach(subtaskItem => {
            subtaskItem.addEventListener('subtask-changed', this._handleSubtaskChanged.bind(this));
        });
    }

    _handleSubtaskChanged(event) {
        const { id, completed } = event.detail;
        const subtask = this.task.subtasks.find(st => st.id === id);
        if (subtask) {
            subtask.completed = completed;
            this.dispatchEvent(new CustomEvent('subtask-updated', {
                detail: { taskId: this.task.id, subtaskId: id, completed },
                bubbles: true,
                composed: true,
            }));
        }
    }

    _cleanup() {
        const completedCheckbox = this.shadowRoot.querySelector('#task-completed');
        const editButton = this.shadowRoot.querySelector('.edit-button');
        const deleteButton = this.shadowRoot.querySelector('.delete-button');
        const subtaskItems = this.shadowRoot.querySelectorAll('subtask-item');

        if (completedCheckbox && this._onCompletedChange) {
            completedCheckbox.removeEventListener('change', this._onCompletedChange);
        }
        if (editButton && this._onEditClick) {
            editButton.removeEventListener('click', this._onEditClick);
        }
        if (deleteButton && this._onDeleteClick) {
            deleteButton.removeEventListener('click', this._onDeleteClick);
        }

        subtaskItems.forEach(subtaskItem => {
            subtaskItem.removeEventListener('subtask-changed', this._handleSubtaskChanged.bind(this));
        });
    }
}

customElements.define('task-card', TaskCard);
export default TaskCard;
