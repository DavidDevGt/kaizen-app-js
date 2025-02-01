const styles = `
                :host {
                    --ios-blue: #007AFF;
                    --ios-gray: #8E8E93;
                    --ios-background: #FFFFFF;
                    --ios-light-gray: #F2F2F7;
                    --ios-text: #000000;
                    --ios-secondary-text: #8E8E93;
                    --ios-red: #FF3B30;
                    --ios-green: #34C759;
                    --ios-orange: #FF9500;
                    --ios-border-radius: 13px;
                    --ios-transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

                    display: block;
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
                    background-color: var(--ios-background);
                    border-radius: var(--ios-border-radius);
                    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
                    padding: 24px;
                    margin: 16px 0;
                    transition: var(--ios-transition);
                    position: relative;
                    transform: translateY(0);
                    opacity: 1;
                }

                :host(:hover) {
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
                    transform: translateY(-1px);
                }

                .task-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .task-title {
                    display: flex;
                    align-items: center;
                    font-size: 17px;
                    font-weight: 600;
                    color: var(--ios-text);
                    gap: 8px;
                }

                .task-title input[type="checkbox"] {
                    appearance: none;
                    width: 22px;
                    height: 22px;
                    border: 2px solid var(--ios-blue);
                    border-radius: 50%;
                    margin: 0;
                    transition: var(--ios-transition);
                    position: relative;
                }

                .task-title input[type="checkbox"]:checked {
                    background-color: var(--ios-blue);
                }

                .task-title input[type="checkbox"]:checked::after {
                    content: "✓";
                    position: absolute;
                    color: white;
                    font-size: 14px;
                    left: 4px;
                    top: 1px;
                }

                .priority-indicator {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    margin-left: 8px;
                }

                .task-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 16px;
                    padding: 0 4px;
                }

                .tag {
                    background-color: var(--ios-light-gray);
                    color: var(--ios-secondary-text);
                    padding: 4px 12px;
                    border-radius: 16px;
                    font-size: 13px;
                    font-weight: 500;
                }

                .task-description {
                    margin-top: 24px;
                    font-size: 15px;
                    color: var(--ios-secondary-text);
                    line-height: 1.5;
                    padding: 0 4px;
                }

                .task-image {
                    margin-top: 24px;
                    width: 100%;
                    height: auto;
                    border-radius: 12px;
                    object-fit: cover;
                    transition: var(--ios-transition);
                }

                .task-image:hover {
                    opacity: 0.95;
                }

                .subtasks {
                    margin-top: 28px;
                    padding: 0 4px;
                }

                .subtasks h4 {
                    font-size: 15px;
                    font-weight: 600;
                    color: var(--ios-text);
                    margin-bottom: 8px;
                }

                .subtasks ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: grid;
                    gap: 12px;
                }

                .task-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 28px;
                    padding-top: 16px;
                    border-top: 1px solid var(--ios-light-gray);
                    padding: 16px 4px 0;
                }

                .timestamp {
                    font-size: 13px;
                    color: var(--ios-secondary-text);
                }

                .actions {
                    display: flex;
                    gap: 16px;
                }

                .action-button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--ios-blue);
                    font-size: 17px;
                    padding: 4px;
                    transition: var(--ios-transition);
                    border-radius: 6px;
                }

                .action-button:hover {
                    background-color: var(--ios-light-gray);
                }

                .action-button.delete-button {
                    color: var(--ios-red);
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
