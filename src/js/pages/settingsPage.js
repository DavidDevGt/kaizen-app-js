const styles = `
  :host {
    --primary-color: #4CAF50;
    --error-color: #FF4C4C;
    --background: #FFFFFF;
    --surface: #F8F9FA;
    --border-color: #DEE2E6;
    --border-radius: 0.5rem;
    --transition: all 0.3s ease-in-out;
    --spacing: 1rem;
    font-family: 'Segoe UI', system-ui, sans-serif;
    color: #333;
    display: block;
    padding: var(--spacing);
    background: var(--background);
  }
  
  .container {
    background: var(--surface);
    max-width: 600px;
    margin: auto;
    padding: 20px;
    border-radius: var(--border-radius);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    text-align: center;
    margin-bottom: 0.5rem;
    font-size: 1.75rem;
    transition: transform 0.3s;
  }
  
  h2:hover {
    transform: scale(1.05);
  }
  
  .description {
    text-align: center;
    color: #555;
    margin-bottom: 1.5rem;
  }
  
  /* Acordeón con animación y respuesta táctil */
  .accordion {
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    margin-bottom: var(--spacing);
    overflow: hidden;
    background: var(--background);
    transition: var(--transition);
  }
  
  .accordion-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: var(--surface);
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    transition: background 0.3s, transform 0.3s;
    /* Para mejorar la respuesta táctil */
    -webkit-tap-highlight-color: transparent;
  }
  
  .accordion-header:active {
    transform: scale(0.98);
  }
  
  .accordion-header:hover {
    background: #ECEFF1;
  }
  
  .arrow {
    transition: transform 0.3s ease;
  }
  
  .accordion-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-in-out, padding 0.3s ease-in-out;
    padding: 0 16px;
  }
  
  .accordion.active .accordion-content {
    max-height: 300px;
    padding: 12px 16px;
  }
  
  .accordion.active .arrow {
    transform: rotate(180deg);
  }
  
  .option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid var(--border-color);
  }
  
  .option:last-child {
    border-bottom: none;
  }
  
  .radio, .switch {
    margin-right: 10px;
  }
  
  .switch {
    position: relative;
    width: 40px;
    height: 22px;
  }
  
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    border-radius: 34px;
    transition: var(--transition);
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 3px;
    bottom: 3px;
    background: white;
    border-radius: 50%;
    transition: var(--transition);
  }
  
  input:checked + .slider {
    background-color: var(--primary-color);
  }
  
  input:checked + .slider:before {
    transform: translateX(18px);
  }
  
  .radio {
    display: inline-block;
    position: relative;
    cursor: pointer;
  }
  
  .radio input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .radio-checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    background-color: #ccc;
    border-radius: 50%;
    transition: var(--transition);
  }
  
  .radio input:checked + .radio-checkmark {
    background-color: var(--primary-color);
  }
  
  /* Botones */
  .buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  
  button {
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    color: white;
    transition: var(--transition);
    position: relative;
    overflow: hidden;
  }
  
  /* Efecto ripple (simulado) en botones al ser pulsados */
  button::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(255,255,255,0.3);
    top: 0;
    left: 0;
    pointer-events: none;
    transition: transform 0.3s, opacity 0.3s;
    transform: scale(0);
    border-radius: 5px;
  }
  
  button:active::after {
    transform: scale(2);
    opacity: 0;
  }
  
  .back-btn {
    background-color: var(--surface);
    color: #333;
  }
  
  .back-btn:hover {
    background-color: #ECEFF1;
  }
  
  .save-btn {
    background-color: var(--primary-color);
  }
  
  .save-btn:hover {
    background-color: #2D8B23;
  }
  
  .cancel-btn {
    background-color: var(--error-color);
  }
  
  .cancel-btn:hover {
    background-color: #DA3D3D;
  }
  
  .message {
    text-align: center;
    margin-top: 10px;
    font-weight: bold;
    display: none;
  }
  
  /* Para dispositivos sin hover (touch), se quitan los efectos hover */
  @media (hover: none) {
    .accordion-header:hover {
      background: var(--surface);
    }
    button:hover {
      transform: none;
    }
  }
`;

class SettingsPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.CONFIG = {
      buttons: {
        save: { text: "Guardar", color: "#4CAF50", action: "save" },
        cancel: { text: "Cancelar", color: "#FF4C4C", action: "cancel" }
      },
      pageTitle: "⚙️ Configuraciones",
      pageDescription: "Personaliza la aplicación según tus preferencias.",
      sections: {
        Security: {
          title: "🔒 Seguridad",
          type: "radio",
          options: [
            { name: "patron", label: "Patrón de seguridad" },
            { name: "pin", label: "PIN de seguridad" }
          ]
        },
        Notifications: {
          title: "🔔 Notificaciones",
          type: "checkbox",
          options: [{ name: "push-notif", label: "Activar Notificaciones" }]
        },
        Language: {
          title: "🌍 Idioma",
          type: "radio",
          options: [
            { name: "lang-es", label: "Español" },
            { name: "lang-en", label: "English" }
          ]
        },
        Theme: {
          title: "🎨 Tema",
          type: "radio",
          options: [
            { name: "theme-light", label: "Claro" },
            { name: "theme-dark", label: "Oscuro" },
            { name: "theme-system", label: "Sistema" }
          ]
        },
        FeatureFlag: {
          title: "🚀 Funcionalidades Experimentales",
          type: "checkbox",
          options: [
            { name: "beta-features", label: "Habilitar funciones beta" },
            { name: "experimental", label: "Modo experimental" }
          ]
        }
      },
      savedMessage: "✅ Configuraciones guardadas correctamente.",
      cancelMessage: "⚠️ Se cancelaron los cambios.",
      storageKey: 'settings_data'
    };
    this.state = { activeSection: null, settings: {} };
    this.initState();
    this.render();
    this.setupEventListeners();
  }

  initState() {
    Object.entries(this.CONFIG.sections).forEach(([sectionKey, { type, options }]) => {
      this.state.settings[sectionKey] = {};
      options.forEach((option, index) => {
        this.state.settings[sectionKey][option.name] = type === "radio" ? index === 0 : false;
      });
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        ${styles}
      </style>
      <div class="container">
        <button class="back-btn" id="go-home">🏠</button>
        <h2>${this.CONFIG.pageTitle}</h2>
        <p class="description">${this.CONFIG.pageDescription}</p>
        ${Object.entries(this.CONFIG.sections).map(([key, { title, type, options }]) => `
          <div class="accordion" data-section="${key}">
            <div class="accordion-header" aria-expanded="false" role="button" tabindex="0">
              <span>${title}</span>
              <span class="arrow">▼</span>
            </div>
            <div class="accordion-content">
              ${options.map(option => `
                <div class="option">
                  <span>${option.label}</span>
                  ${type === "radio" ? `
                    <label class="radio">
                      <input type="radio" name="${key}" class="toggle-option" data-option="${option.name}" aria-label="${option.label}">
                      <span class="radio-checkmark"></span>
                    </label>
                  ` : `
                    <label class="switch">
                      <input type="checkbox" class="toggle-option" data-option="${option.name}" aria-label="${option.label}">
                      <span class="slider"></span>
                    </label>
                  `}
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
        <div class="buttons">
          <button class="cancel-btn" aria-label="${this.CONFIG.buttons.cancel.text}">${this.CONFIG.buttons.cancel.text}</button>
          <button class="save-btn" aria-label="${this.CONFIG.buttons.save.text}">${this.CONFIG.buttons.save.text}</button>
        </div>
        <div class="message" id="message" aria-live="polite"></div>
      </div>
    `;
  }

  setupEventListeners() {
    this.shadowRoot.querySelectorAll(".accordion-header").forEach(header => {
      header.addEventListener("click", () => this.toggleAccordion(header.parentElement));
      header.addEventListener("keydown", e => (e.key === "Enter" || e.key === " ") && this.toggleAccordion(header.parentElement));
    });

    this.shadowRoot.querySelectorAll(".toggle-option").forEach(toggle => {
      toggle.addEventListener("change", e => {
        const { option } = e.target.dataset;
        const section = e.target.closest(".accordion").dataset.section;
        if (this.CONFIG.sections[section].type === "radio") {
          Object.keys(this.state.settings[section]).forEach(key => this.state.settings[section][key] = false);
          this.state.settings[section][option] = true;
        } else {
          this.state.settings[section][option] = e.target.checked;
        }
      });
    });

    this.shadowRoot.querySelector("#go-home").addEventListener("click", () => window.router.loadRoute("/"));
    this.shadowRoot.querySelector(".cancel-btn").addEventListener("click", () => this.handleCancel());
    this.shadowRoot.querySelector(".save-btn").addEventListener("click", () => this.handleSave());
  }

  toggleAccordion(section) {
    const isActive = section.classList.toggle("active");
    section.querySelector(".accordion-header").setAttribute("aria-expanded", isActive);
  }

  handleCancel() {
    this.showMessage(this.CONFIG.cancelMessage);
    this.resetState();
  }

  handleSave() {
    this.showMessage(this.CONFIG.savedMessage);
    console.log("Configuraciones guardadas:", this.state.settings);
  }

  showMessage(message) {
    const messageElement = this.shadowRoot.getElementById("message");
    messageElement.textContent = message;
    messageElement.style.display = "block";
    clearTimeout(this.messageTimeout);
    this.messageTimeout = setTimeout(() => {
      messageElement.style.display = "none";
    }, 1500);
  }

  resetState() {
    this.initState();
    this.shadowRoot.querySelectorAll(".toggle-option").forEach(toggle => {
      const { section } = toggle.closest(".accordion").dataset;
      const { option } = toggle.dataset;
      toggle.checked = this.state.settings[section][option];
    });
  }
}

customElements.define("settings-page", SettingsPage);
export default SettingsPage;
