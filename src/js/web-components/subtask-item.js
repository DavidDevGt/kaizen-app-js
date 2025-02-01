class SubtaskItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.subtask = {
            id: null,
            title: '',
            completed: false,
        };
    }

    static get observedAttributes() {
        return ['title', 'completed'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.subtask[name] = name === 'completed' ? newValue === 'true' : newValue;
            this._render();
        }
    }

    connectedCallback() {
        this._render();
    }

    disconnectedCallback() {
        // aqui se limpian los recursos pero aun no lo implemento xd
    }

    _render() {
        this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: flex;
            align-items: center;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            background-color: var(--background-secondary, #f9f9f9);
            transition: background-color 0.3s;
          }
  
          :host(:hover) {
            background-color: var(--background-hover, #f1f1f1);
          }
  
          input[type="checkbox"] {
            margin-right: 0.75rem;
            width: 16px;
            height: 16px;
            cursor: pointer;
          }
  
          span {
            flex: 1;
            font-size: 1rem;
            color: var(--text-primary, #333);
            text-decoration: ${this.subtask.completed ? 'line-through' : 'none'};
            transition: color 0.3s, text-decoration 0.3s;
          }
  
          @media (prefers-color-scheme: dark) {
            /* Eliminado para mantener el diseño minimalista con fondo blanco */
          }
        </style>
        <input type="checkbox" ${this.subtask.completed ? 'checked' : ''} />
        <span>${this.subtask.title}</span>
      `;

        this._setupEventListeners();
    }

    _setupEventListeners() {
        const checkbox = this.shadowRoot.querySelector('input[type="checkbox"]');
        if (checkbox) {
            checkbox.removeEventListener('change', this._onCheckboxChange);

            this._onCheckboxChange = (e) => {
                this.subtask.completed = e.target.checked;
                this.dispatchEvent(new CustomEvent('subtask-changed', {
                    detail: { id: this.subtask.id, completed: this.subtask.completed },
                    bubbles: true,
                    composed: true,
                }));
            };

            checkbox.addEventListener('change', this._onCheckboxChange);
        }
    }

    setSubtask(subtask) {
        this.subtask = subtask;
        this.setAttribute('title', subtask.title);
        this.setAttribute('completed', subtask.completed);
    }
}

customElements.define('subtask-item', SubtaskItem);
export default SubtaskItem;
